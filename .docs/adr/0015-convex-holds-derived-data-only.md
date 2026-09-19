# Convex holds derived data only, and its region is chosen once

Convex holds the mutable, derived side of the product: users, organizations,
Station Assignments, contests, Claims and their versions, confirmations, flags,
Tally snapshots and audit records.

Evidence does not live in Convex. Envelopes, Originals, Masked Renditions and
the Transparency Log live in the write-once blob store and the log, and the
console reads them through the ReadAPI.

## Why the split

Evidence and Claims are already separate concepts (ADR-0001), and the storage
follows the concept rather than cutting across it. Convex is a reactive
database built for data that changes; Evidence is defined by not changing.
Putting an Original in a system with update and delete operations would mean
the guarantee in Constitution II.4 rested on nobody calling them.

The split also bounds the blast radius. A fully compromised Convex deployment
costs us Claims, which are versioned, attributable and re-derivable from the
Evidence — it does not cost us the Evidence, and it cannot forge a Capture,
because signing keys never leave the capturing device (Constitution II.6).

## The region is open, and it is permanent

**Unverified:** which region the deployment is created in.

A Convex deployment's region cannot be changed after creation, so this is
decided deliberately against ADR-0002 before the first deployment exists rather
than accepted as a default during a setup command. Holding only derived data
lowers the stakes but does not remove them: Claims and users' phone numbers are
in Convex, and a phone number list of Party Agents is sensitive on its own.

## Consequences

- The console cannot join Evidence to Claims in a single query. Every Claim
  cites the Evidence it reads by reference, and the console resolves those
  references through the ReadAPI.
- Tally snapshots in Convex are the input to the Public Tally build, not the
  published artefact. What `tally.` serves is generated from a snapshot and
  served from a CDN, so a Convex outage cannot take the Public Tally down.
- Counting-night ingest does not pass through Convex, per Constitution VII.24.
