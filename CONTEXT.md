# Smart Elections

Independent capture and verification of Kenyan statutory election result forms,
such that a candidate holds evidence of what was recorded at a polling station
that survives challenge without requiring anyone to trust this platform.

## Language

### Election domain

**Polling Station**:
The location where votes are cast and counted, and the unit at which results are
first recorded on paper.
_Avoid_: precinct, poll, booth, centre, station (unqualified)

**Statutory Form**:
The official IEBC paper form on which a Presiding Officer records a Polling
Station's count.
_Avoid_: result sheet, tally sheet, document, form (unqualified)

**Form Type**:
The IEBC designation identifying which election and which level a Statutory Form
covers, such as 34A or 35B.
_Avoid_: form number, template, form code

**Presiding Officer**:
The IEBC official responsible for a Polling Station, who completes and signs the
Statutory Form.
_Avoid_: official, returning officer (a different statutory role), PO in prose

**Party Agent**:
A person nominated by a Candidate or political party, entitled to observe at a
Polling Station and to capture Statutory Forms. Always written in full — this
repo also uses "agent" for AI coding agents, so the bare word is ambiguous.
_Avoid_: agent, observer, scrutineer, field officer

**Candidate**:
A person standing for an elective position. The account owner, and the party
whose evidence this is.
_Avoid_: client, customer, user, account

**Station Result**:
The vote counts recorded on a Statutory Form for one Polling Station.
_Avoid_: result, count, returns

**Declared Result**:
The official result published by IEBC. This system never produces one.
_Avoid_: official result, final result, certified result

**Tally**:
A figure computed by this system by aggregating Claims. Always derived, never
authoritative, and never presented as a Declared Result.
_Avoid_: result, count, total, official count

### Evidence

**Capture**:
The act of photographing a Statutory Form, and the resulting images and metadata
before they are sealed.
_Avoid_: scan, upload, photo, submission

**Envelope**:
A Capture that has been canonicalised, hashed and sealed. The atomic unit of
Evidence.
_Avoid_: record, submission, payload, packet, entry

**Evidence**:
The immutable, sealed, anchored body of Envelopes. Never edited, never
re-encoded, never deleted.
_Avoid_: data, records, submissions

**Claim**:
A versioned assertion about what a Statutory Form says — a Party Agent's typed
counts, OCR output, or a later correction. Every Claim cites the Evidence it
derives from.
_Avoid_: entry, reading, extraction, data, result

**Original**:
The image bytes exactly as captured, byte for byte.
_Avoid_: image, file, scan, photo

**Vault**:
The encrypted on-device store holding a Party Agent's own permanent copy of
their Envelopes. Not a transient staging area.
_Avoid_: cache, queue, local storage, outbox

### Trust and verification

**Seal**:
The signature binding an Envelope's contents, produced by a key held in the
capturing device's hardware keystore.
_Avoid_: signature, hash, stamp, sign-off

**Attestation**:
The device-produced certificate chain evidencing that a signing key is
hardware-backed. Recorded on every Envelope rather than enforced at enrollment.
_Avoid_: verification, certification, proof

**Beacon**:
An externally published, unpredictable value that an Envelope commits to,
establishing that the Capture occurred after the Beacon existed.
_Avoid_: nonce, timestamp, seed, salt

**Co-signer**:
A nearby Party Agent's device that counter-signs an Envelope, narrowing its time
bound. Always optional.
_Avoid_: witness, peer, validator, notary

**Transparency Log**:
The append-only Merkle log to which every Envelope's hash is appended.
_Avoid_: ledger, blockchain, audit log, chain

**Log Witness**:
An independent external party that counter-signs and retains Transparency Log
roots, making retroactive rewriting detectable. Distinct from a Co-signer.
_Avoid_: witness, notary, validator, observer

**Inclusion Proof**:
The Merkle path demonstrating that an Envelope is present in the Transparency
Log under a given root.
_Avoid_: proof, receipt, certificate

**Verifier**:
The standalone function that decides whether an Envelope is intact and provable,
with no dependency on this platform's infrastructure.
_Avoid_: validator, checker, auditor

**Legibility Check**:
The on-device test that a Capture is readable enough to be worth sealing.
_Avoid_: validation, quality check, verification

### People and access

**Enrollment**:
Binding a real person to a device-held signing key and a set of Station
Assignments.
_Avoid_: registration, onboarding, signup, invitation

**Station Assignment**:
The set of Polling Stations a Party Agent is authorised to capture.
_Avoid_: allocation, posting, coverage

### Publication

**Public Tally**:
The publicly readable presentation of Tally figures and published Statutory
Form images, served on its own origin. Never a Declared Result.
_Avoid_: results site, live results, official tally, election results

**Portal Copy**:
IEBC's own published image of a Statutory Form, retrieved from its public
portal. A third-party rendition — neither Evidence nor a Claim.
_Avoid_: official image, IEBC scan, source image, reference image

**Reconciliation**:
A comparison between two or more records of the same Station Result, reporting
where they agree and where they differ. It compares; it does not adjudicate.
_Avoid_: verification, audit, validation, cross-check

**Masked Rendition**:
A derived copy of an Original with personal identifiers obscured for
publication. Carries its own hash, is stored beside the Original, and never
replaces it.
_Avoid_: redacted image, public image, sanitised copy, scrubbed form
