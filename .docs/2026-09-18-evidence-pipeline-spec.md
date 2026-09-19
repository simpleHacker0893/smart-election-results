# Spec — S1 Evidence Pipeline (capture → seal → sync → ingest → anchor → verify)

Date: 2026-09-18
Owner: Njuguna Njenga
Design doc: `.docs/2026-09-18-results-capture-design.md`
Tracker status: **not published** — no issue tracker configured for this repo. Run `/setup-matt-pocock-skills`, then publish with the `ready-for-agent` label.

---

## Problem Statement

A candidate in a Kenyan general election has no independent record of what
happened at the polling stations they contested. The statutory result form —
Form 34A for the presidential race — is filled in and signed at the station,
then travels through a chain the candidate does not control. If the number that
arrives at the national tally differs from the number on the form the agent
watched being signed, the candidate has no way to prove it.

Party agents are legally entitled to be present and to receive a copy of the
form, so the raw material exists. What does not exist is a way to capture it
that survives challenge. A photograph on an agent's phone, forwarded over
WhatsApp, proves nothing: it has no provable time, no provable origin, no
protection against alteration, and no answer to the obvious cross-examination
question — how do we know this image is what the presiding officer actually
signed, and how do we know nobody changed it afterwards, including the company
that stored it?

The problem is worse than it looks, because the parties who might want to alter
the record include people with real power. Servers can be seized. Staff can be
pressured. The company holding the evidence is itself a target. Any system where
the candidate must simply trust the platform has moved the problem rather than
solved it.

Meanwhile the physical conditions are hostile. Counting happens at night in
badly lit rooms. Agents use their own cheap Android phones. Networks are
congested or absent for hours. Whatever is built has to work there, not in a
demo.

## Solution

An agent photographs the form at the station. Before anything else happens, the
app checks on-device that the image is actually legible — sharp enough, not
glared out, the whole form in frame — and makes the agent retake it if not,
while they are still standing in front of the form.

The moment a capture is accepted, it is sealed: the original image and its
metadata are canonicalised, hashed, and signed by a key that was generated
inside that phone's hardware keystore and has never left it. Smart Elections
never holds that private key and therefore cannot forge a capture, even if
entirely compromised. The seal also commits to a recent external beacon value,
which proves the capture happened *after* that beacon existed — so an agent who
winds their clock back cannot manufacture an earlier capture.

Sealed envelopes are stored encrypted on the phone and uploaded opportunistically
whenever a signal appears, resuming across dropouts. The agent keeps their own
permanent copy, exportable, so the evidence survives the company disappearing.

On arrival, the server verifies the seal, stores the original image byte for
byte without ever re-encoding it, and appends its hash to an append-only Merkle
log. The log's roots are published to several independent witnesses outside the
company's control, so Smart Elections cannot quietly rewrite history — any
alteration breaks the published roots that third parties already hold.

Finally, all of this is checkable by a **standalone verifier** that needs no
access to Smart Elections at all. Given an envelope, an inclusion proof and the
witness signatures, it answers valid or invalid and says why. That is what makes
the evidence worth having: the candidate's lawyer, or the opposing side's
expert, can verify it without trusting us.

## User Stories

### Agent — capture

1. As an agent, I want to photograph a Form 34A at my polling station, so that the result is recorded before the form leaves my sight.
2. As an agent, I want the app to reject a photo that is too blurry, too dark, or glared, so that I find out while I can still retake it rather than hours later.
3. As an agent, I want the app to check the whole form is in frame, so that I don't submit a crop missing the signatures.
4. As an agent, I want to capture several images for one form, so that a multi-page or partly illegible form is fully covered.
5. As an agent, I want to retake a shot without losing the earlier attempt, so that nothing is silently discarded.
6. As an agent, I want to identify my polling station without typing a long code, so that I make fewer mistakes late at night.
7. As an agent, I want to type the vote counts I read off the form, so that a number exists before anyone runs OCR.
8. As an agent, I want to be warned when my typed counts don't add up, so that I catch my own transcription errors.
9. As an agent, I want capture to work with no network at all, so that a dead signal does not stop me recording the result.
10. As an agent, I want the app to run acceptably on the cheap Android phone I already own, so that I don't need to be issued hardware.
11. As an agent working by torchlight, I want capture to be usable one-handed and in the dark, so that field conditions don't defeat it.

### Agent — custody and sync

12. As an agent, I want my captures stored encrypted on my phone, so that losing the device does not leak results.
13. As an agent, I want captures to upload automatically as soon as any signal appears, so that I don't have to remember to sync.
14. As an agent, I want an interrupted upload to resume rather than restart, so that a dropout on 2G doesn't cost me the whole file.
15. As an agent, I want to see clearly which captures have reached the server and which have not, so that I know what is still at risk on my phone.
16. As an agent, I want the app to use as little data as possible, so that I can afford to sync.
17. As an agent, I want to keep my own permanent copy of everything I captured, so that I hold evidence independently of the company.
18. As an agent, I want to export my own copy to hand to a lawyer directly, so that I am not dependent on the platform to make my case.
19. As an agent, I want a capture made at a station that never got signal to remain valid when it finally syncs days later, so that remote stations are not lost.
20. As an agent under intimidation, I want a way to protect what is on my phone, so that pressure on me does not compromise the evidence.
21. As an agent, I want nearby agents to witness my capture, so that my record is harder to dispute later.
22. As an agent, I want witnessing to be optional, so that being alone at a station does not invalidate my work.

### Candidate and campaign

23. As a candidate, I want to see captures arriving in near real time, so that I know my coverage as the night progresses.
24. As a candidate, I want to see which of my stations have *not* reported, so that I can chase the gaps rather than admire the fill.
25. As a campaign operations lead, I want to see which agents are active and which have gone silent, so that I can redeploy people.
26. As a candidate, I want to open the original form image at full resolution, so that I can read it myself rather than trust a transcription.
27. As a candidate, I want to know which captures carry verified hardware-backed attestation, so that I know which of my evidence is strongest.
28. As a candidate, I want to export all evidence for a county in one package, so that my lawyers can work offline with it.
29. As a candidate, I want the export to include everything needed for independent verification, so that handing it over is sufficient.

### Verification and legal

30. As an election lawyer, I want to verify a capture's signature, time bounds and log inclusion without trusting Smart Elections, so that I can rely on it in a petition.
31. As an expert witness, I want a standalone verification tool I can run myself, so that I can demonstrate integrity in court from first principles.
32. As an election lawyer, I want to prove a record was not altered after submission, so that I can rebut a tampering allegation.
33. As an election lawyer, I want provable upper and lower bounds on when a capture occurred, so that I can establish it predates any disputed transmission.
34. As opposing counsel, I want to be able to detect whether Smart Elections rewrote its own history, so that the platform is accountable rather than merely trusted.
35. As an auditor, I want to confirm that published log roots match what independent witnesses hold, so that the anchoring claim is real.
36. As a candidate, I want a capture whose attestation was weak to be labelled as such rather than overstated, so that I am never surprised in cross-examination.

### Platform operations

37. As a platform operator, I want ingest to keep accepting captures while every analytics service is down, so that the one night that matters is not lost to a dashboard bug.
38. As a platform operator, I want malformed or unsigned envelopes rejected at the edge, so that garbage never reaches storage.
39. As a platform operator, I want to absorb roughly 300–400GB arriving within about five hours, so that the national spike does not degrade capture.
40. As a platform operator, I want log roots published to independent external witnesses continuously, so that anchoring is not a post-hoc batch job.
41. As a platform operator, I want witness publication failures to never block ingest, so that an external dependency cannot take down capture.
42. As a platform operator, I want duplicate submissions for the same station surfaced rather than silently deduplicated, so that a genuine discrepancy is visible.
43. As a platform operator, I want submissions from a station the agent is not assigned to flagged, so that misassignment and fabrication are both caught.
44. As a platform operator, I want originals stored byte-for-byte and never re-encoded, so that no pipeline step can be accused of altering evidence.

## Implementation Decisions

**Evidence and claims are separate stores with separate lifecycles.** Evidence
is immutable, signed, anchored, never edited. A claim is an assertion about what
a form says — an agent's typed counts, later OCR output, a correction. Claims
are mutable and versioned, and every claim cites the evidence it derives from.
Nothing computed from claims is ever a source of truth. This is the governing
decision; most of the others follow from it.

**Signing keys are generated inside the device hardware keystore and never
leave.** Smart Elections holds no agent private key and cannot forge a capture
under any level of compromise.

**Attestation is recorded, not enforced.** Cheap Android OEM devices ship
broken, missing or software-only attestation chains, so uniform hardware-backed
guarantees cannot be promised across the fleet. Enrollment attempts hardware key
generation with an attestation challenge and stores the outcome as permanent
metadata on every capture that key signs. The evidence tier becomes a provable
property of each individual capture rather than a claim about the fleet.

**Capture is native Android.** Web crypto cannot reach Android Keystore, so a
PWA cannot do hardware-backed signing or attestation. Either native Android or
React Native with a native signing module. The candidate read surface may be a
PWA, as it holds no key material.

**The legibility gate runs on-device, before sealing.** Blur, glare, exposure
and form-edge detection. A rejected capture is never sealed. This is a
correctness requirement, not a nicety: an illegible form is worthless however
well it is signed, and the only moment it can be fixed is while the agent is
still at the station.

**`Envelope.seal()` is a pure function.** No I/O, no clock, no camera —
everything it needs is passed in. The module that defines what sealed evidence
*means* must be exhaustively testable against adversarial input without a device
in the loop, and the envelope format must be specifiable independently of
Android.

**Time is bounded from both sides without trusting the device clock.** The seal
commits to the most recent cached external beacon value, establishing a
not-before bound. An RFC 3161 timestamp obtained at sync establishes not-after.
An agent who rolls their clock back cannot manufacture a beacon that did not yet
exist. The bound is only as tight as the cached beacon is fresh, so beacons are
pre-fetched aggressively on any connectivity.

**Cross-witnessing over BLE or local wifi is optional and additive.** Nearby
agents may counter-sign each other's envelope hashes, which narrows the
not-before bound and raises forgery cost to colluding with every witnessing
device. A capture with zero witnesses is fully valid.

**The local vault is encrypted at rest with a keystore-bound key, and is the
agent's permanent copy** — a first-class exportable artifact, not a sync cache.
It survives app reinstall and outlives the company.

**Ingest depends only on the transparency log and the blob store.** No
dependency on extraction, tally, anomaly detection or dashboards. Counting night
survives all of them being down.

**The transparency log is an append-only Merkle tree whose roots are published
continuously to several independent external witnesses.** A hash column the
company controls proves nothing, because the company can recompute it.
Multi-witness publication is built from day one — it is HTTP now and a migration
later. Witness publication failure never blocks ingest.

**Original images are content-addressed, write-once, and never re-encoded.** No
resizing, no recompression, no format normalisation, at any stage.

**Federation seams are designed in, not built.** Multi-witness logging and
portable agent-held evidence mean a later move to co-equal replicas held by an
observer NGO and an offshore archive is a partnership and operations change
rather than a rewrite.

**A standalone verifier is a deliverable, not just test infrastructure.** It
takes an envelope, an inclusion proof and witness signatures, and returns valid
or invalid with a reason, with no dependency on Smart Elections infrastructure.

## Testing Decisions

**What makes a good test here.** Tests assert external, observable behaviour: a
capture either verifies or it does not, and the verifier says why. No test
should reach into how sealing is implemented, how the Merkle tree is stored, or
how sync schedules retries — those must be free to change. A test that breaks
when the envelope's internal field ordering changes is testing the wrong thing;
a test that breaks when a tampered envelope starts verifying is testing exactly
the right thing.

**The verifier is the single seam.** This is the primary testing decision. The
same verification function is the oracle on both sides:

- Device side: `seal(...)` then `verify(...)`. No server, no network.
- Server side: `POST /ingest`, fetch the stored artifact back, then `verify(...)`.

Using one oracle for both means the property under test — *this evidence is
intact and provably so* — is expressed once. It also means the test suite and
the courtroom artifact are the same code, so a verifier bug cannot hide in
testing and surface under cross-examination.

**Adversarial tests are the core suite, not an afterthought.** For every field
in the envelope: mutate it and assert verification fails with the correct
reason. Swap a signature. Replay an envelope under a different station. Present
a beacon that postdates the claimed capture. Truncate an image by one byte.
Forge an inclusion proof. Present a log root no witness ever signed. Each of
these is a specific attack from the threat model and each gets a named test.

**Second seam, only where the verifier cannot reach: the `Ingest` HTTP
boundary.** Rejection behaviour for malformed input, backpressure and resumable
upload semantics, and spike load are behaviours of the endpoint, not of an
envelope. Load testing targets the national profile — roughly 46,000 clients on
poor links inside a five-hour window.

**The legibility gate is tested against a real corpus, not synthetic images.**
Photographs of real forms under real polling-station lighting, labelled legible
or not by a human. The gate is scored on false-accept rate first — wrongly
accepting an unreadable form loses evidence irrecoverably, whereas wrongly
rejecting a good one costs the agent ten seconds.

**`Envelope.seal()` is property-tested.** Being pure, it admits generative
testing: for any valid input, the result verifies; for any single-byte mutation
of the output, it does not.

**Prior art: none.** This is a greenfield repo, so these seams establish the
convention rather than follow one. That is itself a reason to keep the count at
one or two.

## Out of Scope

- **Enrollment and identity binding at scale** — how ~46,000 agents are bound to
  hardware keys is Section 9 of the design and is not yet designed. This spec
  assumes an enrolled agent with a registered key exists. Enrollment is the
  project's hardest problem and needs its own spec.
- **OCR and extraction** — producing claims from images. Deferred.
- **Tally derivation and aggregation** — Section 10. Agent-typed counts are
  captured and stored as claims here, but nothing computes a tally from them.
- **Anomaly detection** — turnout ratios, statistical outliers, cross-checks.
- **Candidate dashboard beyond the minimum** — this spec covers listing what has
  arrived, showing what is missing, and opening an original image. Analytics,
  maps, trend charts and exports beyond a raw verifiable bundle are deferred.
- **Counting-night operational runbook** — Section 11.
- **Forms other than 34A.** The envelope format is form-agnostic, but only the
  presidential form is supported in this spec.
- **iOS.** The fleet is Android.
- **S2 beyond thin enrollment, and S3, S4, S5 entirely.** In particular the party
  nomination e-voting module is a separate product with a different threat model
  and must not be built alongside this.

## Further Notes

**The delivery staging is not optional.** The target is national, but delivery
runs pilot → single county → national. Network behaviour under a real counting
spike and enrollment throughput can only be learned in the field, and learning
them in August 2027 is learning them too late.

**Enrollment, not code, is the critical path.** Binding 46,000 real identities to
hardware keys under this threat model is a logistics operation comparable to a
small census. It should be started and staffed well before the software is
finished.

**Claims about IEBC authority must not appear anywhere in the product.**
Parallel vote tabulation by party agents is lawful and routine in Kenya.
Asserting that the platform signs on behalf of IEBC, or that it carries
statutory certification, is a different and much more dangerous claim. The
source PRD contains such language and it needs removing.

**The data residency claim in the PRD is currently false.** AWS has no Kenya
region; `af-south-1` is Cape Town. Either change the claim or change the
infrastructure. Note also that jurisdictional separation for anchoring is a
requirement of the threat model, which cuts against in-country residency — these
two goals are in genuine tension and the resolution should be deliberate.

**Where this spec is weakest.** The duress story (story 20) is named but not
designed, and it is genuinely hard — anything that lets an agent destroy
evidence under pressure also lets a bribed agent destroy inconvenient evidence.
It may belong in its own spec rather than being resolved in passing.
