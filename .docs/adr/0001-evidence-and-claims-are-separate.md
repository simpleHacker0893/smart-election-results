# Evidence and Claims are separate stores

Evidence — sealed, anchored Envelopes — is immutable and has no lifecycle: an
Envelope exists and is either intact or it is not. A Claim is a versioned
assertion about what a Statutory Form says, and every Claim cites the Evidence it
derives from. The Tally is computed from Claims and is never itself a source of
truth.

## Consequences

An OCR error becomes a cheap, correctable Claim rather than a corruption of the
record, and a dispute becomes "two Claims cite the same Evidence and disagree" —
which is what a dispute actually is.

This contradicts the source PRD, which puts
`status (draft/submitted/approved/disputed/rejected)` on the `election_forms`
record. That single column conflates two lifecycles: nothing can approve a
photograph of a signed document into or out of existence. Approval belongs to the
Claim; the Evidence it cites is untouched either way.
