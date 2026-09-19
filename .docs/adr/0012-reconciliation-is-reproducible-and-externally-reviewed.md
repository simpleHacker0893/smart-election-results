# Reconciliation is proved by reproducibility and external review

Two things carry the claim that a Reconciliation is honest, and neither is a
statement we make about ourselves.

**Reproducibility.** The Reconciliation data and the method are published
together, in a form that lets a third party re-run the comparison and get the
same findings. The published set is the Portal Copies used, the readings taken
from them, the comparison rules, and the code that applies those rules.

**External review.** An external reviewer with no ties to Kenyan political
actors examines the method and the findings, and publishes unedited.

## Why reproducibility counts as proof

A cryptographic Envelope proves an Original was not altered after capture. It
proves nothing about the reading we took from that image, the rules we applied,
or the stations we chose to include. Those are the steps where a dishonest
operator would actually cheat, and they are invisible to signature checking.

The remedy is not a stronger assurance from us. It is arranging matters so that
anyone who doubts a finding can derive it themselves and watch it come out the
same. A finding that survives being re-run by someone who wants it to be wrong
is worth more than any attestation we could attach to it.

## Scope, in two parts

This ADR settles **evidence design now**: what a Reconciliation publishes,
in what form, and under what review. It does not settle the **capture app
implementation**, which follows the existing evidence-pipeline spec and is
decided later. The two are separated deliberately so the 2022 Reconciliation is
not blocked on Android work.

## Consequences

- Findings stay descriptive, per Constitution IV.15. We report where records
  agree and where they differ. We never allege intent, and the reviewer is
  briefed that a finding phrased as a motive is a defect.
- "No ties to Kenyan political actors" must be a written, checkable standard
  before a reviewer is approached, not a judgement made afterwards about
  someone already engaged.
- Publishing unedited means agreeing in advance to publish a review that finds
  our method wrong. That commitment is made in writing at engagement.
- The comparison code is part of the published artefact, so it carries the same
  no-secrets rule as the rest of the repository.
