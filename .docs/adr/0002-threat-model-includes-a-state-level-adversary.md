# The threat model includes a state-level adversary

The system must remain trustworthy against three cumulative adversaries: a
dishonest Party Agent, a dishonest insider at Smart Elections, and a state-level
adversary able to seize servers, compel staff, pressure the company, interfere
with the network on counting night, and intimidate agents. The Evidence must
survive Smart Elections ceasing to exist.

In 2017 the IEBC's ICT manager was murdered days before the vote. Seizure and
coercion are part of the operating environment here, not a hypothetical.

## Consequences

Almost every expensive decision downstream follows from this one: signing keys
that never leave the device, an agent-held copy of all Evidence, an append-only
log anchored to independent external witnesses, time bounded without trusting the
device clock, and jurisdictional separation for anchoring.

A future reader tempted to simplify any of those should change this ADR first.
