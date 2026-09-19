# Smart Elections S1 — Results Capture & Verification

**Design document (in progress)**
Date: 2026-09-18
Owner: Njuguna Njenga

> Status: live working document. Sections 0–7 below record decisions already
> made and approved during brainstorming. Sections marked **OPEN** have not been
> designed yet. This is not yet a finished spec.

---

## 0. Scope

The source PRD (Smart Elections v1.0, March 2026) describes roughly five
independent products. It was decomposed into:

| Slice | Description |
|---|---|
| **S1** | Results capture & verification — polling-station registry, agent form capture, validation, tamper-evident storage, candidate view |
| S2 | Identity, orgs & agents — users, candidates, parties, invites, RBAC |
| S3 | Billing — Stripe + M-Pesa, plans, proration, dunning |
| S4 | Aggregation & analytics — rollups, anomaly detection, exports, observer access |
| S5 | Party nomination e-voting — delegate registration, binding ballots |

**This document covers S1 only.** A thin slice of S2 — enough to enroll and
authenticate agents — is in scope; the rest is not.

S5 is explicitly excluded and requires its own design and security review. It is
a materially different product: S1 *observes* an election run by someone else,
whereas S5 *is* the election.

---

## 1. Decision: primary artifact of value

**Evidence first, tally derived.**

Every capture is intended to be court-defensible: device-signed at the moment of
capture, original image never altered, full chain of custody. The live tally is
computed on top of that evidence and is a secondary read.

Rationale: Kenya's 2017 presidential petition turned on Form 34A irregularities.
A customer in a contested race needs material that survives hostile
cross-examination, not just a fast number.

Consequence: OCR output is an *index over* the evidence, not the evidence. No
court cares what an OCR engine read; it cares what the presiding officer signed.

---

## 2. Decision: threat model

**All three levels, cumulative:**

1. **Dishonest agent** — bribed or careless; fabricates, substitutes, or edits a
   form after the fact.
2. **Dishonest insider at Smart Elections** — compromised admin, hostile DBA, or
   an opposing lawyer alleging the company was paid off. The system must let
   Smart Elections prove it did *not* alter the data.
3. **State-level adversary** — servers seized, staff compelled, company
   pressured, network interfered with on counting night, agents intimidated. The
   evidence must survive the company ceasing to exist.

Rationale: in 2017 the IEBC's ICT manager was murdered days before the vote.
Seizure and coercion are part of the operating environment, not a hypothetical.

### Forced consequences

- **Signing keys are generated inside the phone's hardware keystore and never
  leave it.** Smart Elections never holds an agent private key and therefore
  cannot forge a capture even if fully compromised.
- **The agent's device retains its own copy** of every form it captured, with
  signatures, as a first-class exportable artifact — not a cache.
- **Append-only Merkle transparency log, with roots published to independent
  external witnesses.** A hash column the company controls proves nothing,
  because the company can recompute it. External anchoring is what makes
  retroactive rewriting detectable.
- **Time is bounded from both sides without trusting the device clock.** The
  agent signs over a recent external beacon value, proving capture occurred
  *after* that beacon existed; an RFC 3161 timestamp obtained on sync proves it
  occurred *before* that. A bribed agent who rolls their clock back cannot
  manufacture a beacon that did not yet exist.
- **Jurisdictional separation** — anchoring and at least one replica outside
  Kenyan legal reach.

### Considered and rejected for v1

**Blind escrow** — images encrypted on-device to the candidate's key, so Smart
Elections stores only ciphertext. Rejected because it deletes OCR, image
analytics and the analytics pricing tier, and because candidate key custody at
national scale is a catastrophe surface: a campaign that loses its private key
permanently destroys the readability of its own evidence.

---

## 3. Decision: agent devices

**Whatever agents already own — predominantly cheap Android.**

Assume Android Go and sub-$80 handsets, old OS versions, constrained storage.

- A TEE-backed keystore is *usually* available — ARM TrustZone is present on
  effectively all current Snapdragon, MediaTek and Unisoc parts — so key
  generation is fine.
- **Key attestation is the unreliable part.** Cheap OEM devices frequently ship
  broken, missing or software-only attestation chains. Uniform hardware-backed
  guarantees across the fleet cannot be promised.

**Resolution: do not gate on attestation — record it.** Attempt hardware key
generation with an attestation challenge at enrollment, and store the
attestation result as permanent metadata on every capture that key signs. The
evidence tier becomes a provable property of each individual form rather than a
claim about the fleet. In a petition this reads as "this capture came from a
device with a verified hardware-backed key, here is the chain" — more defensible
than a uniform guarantee that cannot be substantiated.

### Consequences

- **A PWA is ruled out for the capture app.** Web crypto cannot reach Android
  Keystore, so there is no hardware-backed signing and no attestation from a
  browser. Capture must be native Android, or React Native with a native signing
  module. The candidate's read-only dashboard may still be a PWA, as it holds no
  key material.
- **Low-light camera quality is a first-order risk.** Counting happens at night,
  polling stations are badly lit, and cheap sensors perform poorly. An illegible
  Form 34A is worthless regardless of how well it is signed. On-device legibility
  checking at capture time — blur, glare, exposure, form-edge detection — must
  reject a bad shot while the agent is still standing at the station. No amount
  of cryptography recovers evidence lost here.

---

## 4. Decision: connectivity

**Assume the worst — hours fully offline.**

Capture, sealing, signing and local storage all work with no connectivity. Sync
is opportunistic and resumable.

### Consequences

- **The time bound is only as tight as the cached beacon is fresh.** An agent who
  last synced at 06:00 and captures at 22:00 can only prove "after 06:00" —
  sixteen hours of slack. Mitigations: pre-fetch beacons aggressively on every
  scrap of connectivity, and have nearby agents **cross-sign each other's
  captures over BLE or local wifi**. Forging a capture then requires colluding
  with every device that witnessed it, which is substantially harder than
  resetting one's own clock. Cross-signing is optional and never required for a
  capture to be valid.
- **Unsynced local storage is an exposure.** Forms sit on a personal phone for
  hours. If the phone is seized, lost, or the agent is intimidated, evidence is
  lost or leaked. The local queue requires at-rest encryption with the key bound
  to the device keystore, plus a duress story.

---

## 5. Decision: first deployment target

**National presidential — 46,000+ polling stations.**

### Recorded concern

Going straight to national means ~46,000 agents enrolled and key-bound before
first real use, within a single ~5-hour counting window with no second chance.
**The code is not the long pole; enrollment is.** Binding 46,000 real identities
to hardware keys under a state-level threat model is a logistics operation
comparable to a small census.

**Working assumption:** design for national from day one, but deliver through
pilot → single county → national. Network behaviour and enrollment throughput can
only be learned in the field, and learning them in August 2027 is too late. This
staging goes into the implementation plan.

### Sizing

~46,000 stations × 1 Form 34A × ~3MB per legible image × 2–3 images with retakes
≈ **300–400GB arriving in a ~5-hour spike**. Raw bandwidth is unremarkable; the
difficulty is 46,000 simultaneous unreliable mobile clients performing resumable
uploads, many on 2G.

---

## 6. Decision: architecture

**Custodian, with the seams for federation designed in from day one.**

Smart Elections receives, stores and serves the data and runs the tally, but:

- the transparency log is **multi-witness from day one** — publishing roots to
  several independent witnesses is just HTTP, trivial now and expensive to
  retrofit; and
- the **agent-held device copy is a first-class exportable artifact**, not a
  cache.

These two decisions make a later move to a federated model — co-equal replicas
held by an observer NGO such as ELOG and an offshore archive — a partnership and
operations change rather than a rewrite.

Rejected for v1: full federation from day one, because engineering would be gated
on partnerships that do not yet exist, and it weakens the exclusive control of
data that the subscription model is sold against.

---

## 7. Component boundaries

### Governing principle

> **Evidence and claims are separate stores with separate lifecycles.** Evidence
> is immutable, signed, anchored, never edited. A *claim* is an assertion about
> what a form says — OCR output, an agent's typed counts, a later correction.
> Claims are mutable and versioned, and every claim cites the evidence it derives
> from. The tally is computed from claims and is never itself a source of truth.

This is what makes "evidence first, tally derived" real in code. It also means an
OCR error is a cheap, correctable claim rather than a corruption of the record,
and a dispute becomes "these two claims cite the same evidence and disagree" —
which is what a dispute actually is.

### On-device (Android)

| Module | Responsibility | Interface | Notes |
|---|---|---|---|
| `Identity` | Generates and holds the signing key; produces attestation | `sign(bytes)`, `attestation()` | The only module touching Keystore |
| `Capture` | Camera plus legibility gate (blur, glare, exposure, form-edge) | `capture(formType, station)` returns Candidate or Rejection | Where the low-light problem is solved or lost |
| `Envelope` | Canonicalize, hash and sign image and metadata into a sealed unit | `seal(candidate)` returns Envelope | Pure function, no I/O, trivially testable |
| `Vault` | Encrypted local store; the agent's permanent copy | `put`, `list`, `export`, `markSynced` | Key bound to Keystore; survives app reinstall |
| `Witness` | Cross-signs with nearby agents over BLE or local wifi | `request()`, `offer()` | Optional; tightens time bounds, never required |
| `Beacon` | Caches recent external beacon values | `latest()`, `refresh()` | Refreshes on any connectivity |
| `Sync` | Resumable, opportunistic, bandwidth-aware upload | `enqueue`, `drain` | Must survive 2G and mid-upload termination |

### Server

| Service | Responsibility | Notes |
|---|---|---|
| `Ingest` | Verify signature, attestation and beacon validity; accept or reject | Counting-night hot path; stateless, horizontally scalable, deliberately boring |
| `TransparencyLog` | Append-only Merkle tree; roots and inclusion proofs | Independent of everything else |
| `WitnessPublisher` | Push roots to N external witnesses; collect counter-signatures | Failure here must never block ingest |
| `BlobStore` | Write-once original images, content-addressed | Never re-encoded |
| `StationRegistry` | 46k stations, geography, registered-voter counts | Read-mostly; also identifies what is *missing* |
| `Extraction` | OCR plus human-in-loop correction, producing claims | Produces claims, never evidence |
| `Tally` | Derives counts at every geographic level | Fully recomputable from scratch at any time |
| `Anomaly` | Turnout vs roll, arithmetic checks, duplicate stations, outliers | Reads claims and registry |
| `Enrollment` | Identity binding, key registration, station assignment | The hardest component at national scale |
| `ReadAPI` | Candidate dashboard and exports | May be a PWA; holds no key material |

Two deliberate consequences: `Ingest` depends only on `TransparencyLog` and
`BlobStore`, so counting night survives every analytics service being down. And
`Tally` being fully recomputable means a discovered OCR error never requires
touching stored results — the claim is corrected and the tally recomputed.

---

## 8. Capture-to-anchor data flow — **OPEN**

## 9. Enrollment and identity binding at scale — **OPEN**

## 10. Tally derivation and the read side — **OPEN**

## 11. Failure modes and counting-night operations — **OPEN**

## 12. Testing strategy — **OPEN**

---

## Corrections carried over from the source PRD

Recorded during brainstorming; these need folding back into the PRD.

1. `nomination_votes` has no ballot secrecy — the row links `delegate_id` to
   `candidate_id`, so any party admin with database read access can see how every
   delegate voted. The "My Vote" dashboard feature additionally makes vote-buying
   verifiable. (S5 concern.)
2. Biometrics do not work as assumed. Face ID and fingerprint are device-local;
   they unlock a key on the phone and never prove identity to a server. A stored
   `biometric_hash` column is not viable — biometric templates are fuzzy and do
   not hash-match — and holding them creates significant exposure under the Data
   Protection Act 2019.
3. Hash-only immutability is not immutability. Whoever controls the database and
   the hash column can change both.
4. AWS has no Kenya region; `af-south-1` is Cape Town. "All data stored in Kenya"
   is not currently deliverable on AWS and should be verified against AWS's
   present footprint. Citing GDPR is also the wrong framework — Kenya's Data
   Protection Act 2019 applies.
5. The stack contradicts itself: section 6 specifies native Swift and native
   Kotlin, while the stack table specifies React Native with Expo. The document
   also lists PostgreSQL, MongoDB, Elasticsearch, RabbitMQ, Redis and Hyperledger
   for an MVP.
6. "Sign digitally on behalf of IEBC" (section 4, Polling Station Officer)
   asserts statutory authority the company does not hold. Parallel vote
   tabulation by party agents is lawful and routine in Kenya; claiming IEBC
   authority is a different matter entirely.
7. The roadmap is stale. Phase 1 (Q2 2026) and Phase 1.5 have already passed. The
   fixed deadline is the August 2027 general election, with party primaries
   several months earlier.
8. Pricing for County Election Commissions is quoted in Nigerian Naira
   (₦500K–2M).
