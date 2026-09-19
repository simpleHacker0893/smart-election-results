# Tessera for the Transparency Log

The Transparency Log is built on Tessera rather than Trillian, Rekor, or a
hand-rolled Merkle tree. Trillian is in maintenance mode and its own maintainers
direct new log operators to Tessera; Tessera is a Go library rather than a
microservice, ships AWS, GCP and POSIX storage drivers, and has been production
ready since v0.2.0.

The decisive factor is that Tessera integrates witnesses via the C2SP Witness
Protocol, with policies specifying which Log Witnesses must cosign a checkpoint
*before* publication.

## Why witnessing is structural, not optional

RFC 9162 states that its auditing mechanisms "can be circumvented by a misbehaving
log that shows different, inconsistent views of itself to different clients.
Therefore, it is necessary to treat each log as a trusted third party," and puts
the remedy explicitly out of scope.

A split view is precisely the attack a coerced log operator mounts. Under
ADR-0002 that adversary is in scope, so a transparency log without witness
cosigning would buy nothing against the threats that matter most here.

## Consequences

Rekor remains useful as prior art for verification UX, but it is shaped around
software supply-chain artifacts rather than general evidence.
