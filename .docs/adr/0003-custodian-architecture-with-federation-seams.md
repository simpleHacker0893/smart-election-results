# Custodian architecture, with federation seams built in

Smart Elections receives, stores and serves the Evidence and computes the Tally,
but two seams are built from day one: the Transparency Log is multi-witness
immediately, and the agent-held Vault copy is a first-class exportable artifact
rather than a sync cache. A later move to co-equal replicas held by an observer
NGO and an offshore archive then becomes a partnership and operations change
rather than a rewrite.

## Considered Options

**Blind escrow** — form images encrypted on-device to the Candidate's key, so
only ciphertext is stored. Rejected because it deletes OCR, image analytics and
the analytics pricing tier, and because Candidate key custody at national scale
is a catastrophe surface: a campaign that loses its private key permanently
destroys the readability of its own Evidence.

**Full federation from day one** — rejected because engineering would be gated on
partnerships that do not yet exist, and it weakens the exclusive control of data
that the subscription model is sold against.

## Consequences

Smart Elections remains a single point of coercion in the interim. That is an
accepted, temporary exposure, and the reason the two seams above are not
negotiable.
