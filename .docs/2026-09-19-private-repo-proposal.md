# Proposal: what moves to a private repository

Date: 2026-09-19
Owner: Njuguna Njenga
Status: proposed. Nothing has moved.

This repository is public, and Constitution VIII.26 says to treat every file in
it as published. That rule is cheap to keep while the repo holds only design
documents and decisions. It stops being cheap the moment commercial and human
material arrives, which is why the private home is decided before it does.

## Finding: nothing sensitive is committed today

Checked on 2026-09-19 against the working tree and the tracked file list:

- No currency figure appears anywhere as our own price. The one concrete
  figure in the repository — `₦500K–2M` at
  `.docs/2026-09-18-results-capture-design.md:297` — is an item in a critique
  of an inherited design document, recording that *its* pricing was quoted in
  the wrong currency. It is a finding about a prior document, not a price of
  ours, and it is fine in public.
- No prospect, customer or Party Agent is named.
- No witness operator is named.
- No enrollment roster or schedule exists yet.

So this proposal is preventive. **No history rewrite is needed**, which matters:
rewriting the history of a public repository breaks every existing clone and
every commit link, and is worth doing only for a real exposure.

## What must never enter this repository

| Material | Why |
|---|---|
| Pricing drafts, discounts, commercial models | Constitution V.16 allows exactly one *published* price list. Drafts and per-customer terms would contradict the neutrality promise the moment two versions existed in history. |
| Prospect, customer and partner names; meeting notes | Constitution VI.21 — who has contacted us is sensitive, and a public commit log is the opposite of a named-access mailbox. |
| Party Agent identities, rosters, Station Assignments | A list of who is capturing where is a targeting list. This is operational data and belongs in Convex, never in a repository. |
| Enrollment logistics: training schedules, venues, device allocation | Same reasoning. Locations and dates for gathering Party Agents are targeting information. |
| Legal correspondence and counsel advice | Privileged, and disclosing a legal position early costs the position. |
| Funder and grant material under negotiation | Constitution VIII.26 plus ordinary commercial confidence. |
| Incident response contact trees and escalation numbers | Personal phone numbers, and useful to an attacker choosing when to move. |

## What stays public, deliberately

Moving any of these to private would damage the product, because being
checkable is the product:

- `CONSTITUTION.md`, `CONTEXT.md`, `AGENTS.md`, every ADR.
- Every design document, spec and research document in `.docs/`.
- All application and service code, including the Verifier — Constitution II.7
  requires an Envelope to be checkable without us, which a private Verifier
  would make impossible.
- The Reconciliation method, rules and comparison code (ADR-0012).
- The published price list, once approved.
- `.claude/settings.json`, including the deny list (ADR-0017).

## One item needs a decision, not a move: witness identities

Witness identities were listed as candidates for the private repository. They
split in two, and the split matters:

- **Witness candidates under negotiation** — private. Naming an organisation
  that has not agreed exposes it to pressure before it has decided anything.
- **Operating witnesses** — necessarily **public**. Under the C2SP witness
  protocol a checkpoint cosignature is verified against a known witness key
  named in a published policy. A witness whose identity and key are secret
  proves nothing to anyone, and ADR-0005 makes witness cosigning the structural
  answer to a split-view attack.

So a witness moves from private to public at the moment it starts witnessing,
and that transition should be part of the agreement it signs. This is a real
tension with the wish to protect Kenyan civil-society witnesses from pressure,
and it cannot be resolved by keeping the key secret. It is resolved by
choosing witnesses across several jurisdictions, so that pressure on any one of
them does not stop the log being checkable.

## Mechanism

**Recommendation: a separate private repository, with no link from this one.**

Not a git submodule. A submodule in a public repository publishes the private
repository's URL and the exact commit SHAs being referenced, which leaks its
existence, its name and its activity rate. It also makes it easy to commit to
the wrong repository by accident, which is the failure this proposal exists to
prevent.

Operational data — rosters, Station Assignments, contact records — does not go
in either repository. It belongs in Convex and in the single shared mailbox
(ADR-0013), under their own retention rules.

## What to do now

1. Create the private repository. Human action under Constitution VIII.25.
2. Add a line to `AGENTS.md` stating that commercial, legal and personal
   material does not live in this repository. The statement itself is safe to
   publish, and it is what an agent will actually read before writing a file.
3. Add a pre-commit check for currency figures and a small deny-list of names,
   so the rule is mechanical rather than remembered. Pairs with the
   `setup-pre-commit` skill already planned for P0.
4. Revisit before the first pricing draft and before the first Party Agent is
   enrolled, whichever comes first.
