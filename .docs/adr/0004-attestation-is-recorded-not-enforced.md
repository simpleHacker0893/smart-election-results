# Attestation is recorded, not enforced

Enrollment attempts hardware key generation with an attestation challenge and
stores the outcome as permanent metadata on every Envelope that key signs. A
device that cannot produce a hardware-backed attestation is **not** rejected. The
evidence tier becomes a provable property of each individual Envelope rather than
a claim about the fleet.

## Why this is not a bug

Party Agents use their own cheap Android handsets. Google documents two failure
cases that make uniform guarantees impossible: pre-Android 7.0 devices fall back
to software attestation "signed with a key hardcoded in Android source code…
Because this signing key isn't a secret, the attestation might have been created
by an attacker pretending to provide secure hardware"; and on a non-Play device
"the device maker is free to create their own root certificate and to define the
meaning of their attestation data."

Rejecting unattested devices would exclude real agents at real polling stations
and lose the Evidence entirely — which is strictly worse than holding Evidence
with an honestly-labelled weaker guarantee.

## Consequences

The Verifier must pin **Google's** attestation root specifically. A chain that
validates against an OEM root proves only what that OEM decided it means, so
treat it as unattested.

A future reader who "fixes" this by enforcing attestation at enrollment should
read ADR-0002 first, then measure what fraction of the real fleet would be
excluded.
