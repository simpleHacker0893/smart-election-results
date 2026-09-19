# A Claim is append-only, and nobody verifies their own

Four invariants govern every Claim, whatever the review workflow around it
eventually looks like.

1. **Append-only.** A Claim is never overwritten. Every change is a new version
   recording who made it, when, and why. Earlier versions stay readable.
2. **Cited.** Every Claim names the Evidence it was read from. A Claim with no
   citation is not a Claim.
3. **No self-verification.** "Verified" means a *different* person confirmed
   the Claim against the image. The person who entered a reading can never move
   it to verified, whatever role they hold.
4. **Transcribed as written.** A form that is wrong on its face is entered as
   it is written. The discrepancy is a finding about the form, never an error
   attributed to the Party Agent who captured it.

## Why append-only and separation of duties are load-bearing

Everything this product sells rests on a reader being able to reconstruct how a
figure came to be displayed. An overwritten Claim destroys exactly that: the
figure remains but the history of how it changed, and who changed it, is gone —
and the moment it matters is the moment someone alleges the figure was edited
after the fact. Versioning is the only answer that survives the accusation.

Self-verification is the corresponding failure on the people side. A single
operator who can both enter and confirm a reading is a single point at which
the entire Tally can be moved, by coercion or by carelessness, with no trace
that anything unusual happened. Requiring a second person does not make that
impossible; it makes it require two people, and it leaves both names attached.

Transcribing a wrong form as written protects the Party Agent and the finding
at once. Silent correction hides the very discrepancy that a Reconciliation
exists to surface, and turns a fact about a form into an accusation about a
person.

## What this ADR does not settle

The state names, the review queue, the roles that may confirm, and what
happens to a flagged Claim belong to the roles-and-Claims design and are
**open**. This ADR fixes the invariants that design must satisfy, so that the
design cannot quietly trade one away for throughput.

## Consequences

- Storage is append-only at the schema level, not by convention. There is no
  update path on a Claim, only an insert of a new version.
- The console needs a Station Assignment model good enough to tell who entered
  what, before any confirmation UI is worth building.
- Two people per station is a staffing cost on counting night, and it is a real
  one. It is accepted, not optimised away.
- Unsealed uploads — those with no provable origin — are labelled "unsealed"
  everywhere they appear and are never silently mixed with sealed Evidence.
