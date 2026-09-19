# Smart Elections Kenya — Constitution

The rules that do not bend. `AGENTS.md` says how to work in this repo;
`CONTEXT.md` says what words mean; this file says what may never be traded away
for speed, revenue or convenience. If a task conflicts with an article, stop
and raise it. Do not work around it.

Amendments: only by the owner, only through an ADR in `.docs/adr/` that names
the article it changes.

---

## I. Independence

1. We are not IEBC and hold no statutory authority. We never declare a result.
2. A Tally is derived and is never presented as a Declared Result. Every public
   page says so, in English and Kiswahili, and shows coverage.
3. We never project or call a winner.

## II. Evidence

4. An Original is never edited, re-encoded, replaced or deleted.
5. Anything derived from an Original (a Masked Rendition, a thumbnail, an OCR
   reading) is a separate artefact with its own hash, stored beside it.
6. Signing keys are generated on the capturing device and never leave it. The
   platform never holds a Party Agent's private key, so it cannot forge a
   Capture even if fully compromised.
7. Every Envelope must be checkable by the standalone Verifier without any
   Smart Elections infrastructure, and must survive the company ceasing to exist.

## III. Claims

8. A Claim is never overwritten. Every change is a new version recording who,
   when and why, and every Claim cites the Evidence it reads.
9. Nobody verifies their own entry. "Verified" always means a different person
   confirmed the Claim against the image.
10. A form that is wrong on its face is transcribed as it is written. The
    discrepancy is a finding about the form, not an error by the Party Agent.
11. Uploads with no provable origin are labelled "unsealed" everywhere they
    appear and are never mixed silently with sealed Evidence.

## IV. Honesty

12. Nothing on any public surface describes software that does not exist as if
    it did. Every feature carries Available, In pilot or Planned.
13. No invented proof. A quotation renders only with a named person and a
    recorded consent.
14. Research claims are labelled Verified, Inferred or Unverified, with sources.
    Statute citations appear in public only once Verified.
15. Reconciliation findings are descriptive. We say what the forms show. We
    never allege intent.

## V. Neutrality

16. One published price list. The same rules, features and response times for
    every Candidate and party, including rivals in the same contest.
17. No party colours, no flag palette, nothing resembling IEBC. Candidates on a
    chart take a neutral sequence in ballot order.
18. A customer's Evidence is never withheld, deleted or degraded for
    non-payment. Raw export is always included.

## VI. Privacy

19. Collect the minimum. State the retention period where data is collected,
    and keep to it. The Data Protection Act 2019 applies, not GDPR.
20. Identity numbers, phone numbers and free-text refusal reasons are masked on
    every public image. When a mask is uncertain, publish counts with "image
    under review"; never default to unmasked.
21. Who has contacted us is sensitive. Contact data lives in one shared mailbox
    with named access, outside Kenyan legal reach, and nowhere else.

## VII. Separation

22. Each surface has its own origin: `www.`, `tally.`, `app.`. No origin sets a
    cookie scoped to the whole domain.
23. The `tally.` origin ships no third-party script, ever, and says so.
24. Counting-night ingest depends on nothing but the transparency log and the
    blob store. No analytics or convenience service may sit in that path.

## VIII. Limits on AI coding agents

25. Agents work against development and preview environments only. Production
    data, production deploys, DNS, domains, billing and purchases are human
    actions.
26. No secret enters the repository, a prompt, a log or a commit. This repo is
    public; treat every file as published.
27. Agents do not merge to `main`. A person reviews and merges every change.
28. Destructive operations (deleting data, projects, branches, log entries)
    need an explicit human instruction in the same session.

## IX. Engineering

29. Work in vertical slices with a failing test first. A slice is done when it
    is deployed, tested and demonstrable.
30. Static by default; Server Components by default; client JavaScript only
    where a person interacts. Usable on 2G and a sub-$80 Android.
31. Accessibility is part of done: semantic HTML, labels, keyboard support,
    visible focus, colour never the only signal.
32. Code style: early returns; arrow-function consts with explicit types;
    `handle*` event names; Tailwind classes only; descriptive names;
    readability over performance; no TODOs or stubs in merged code.
33. `CONTEXT.md` vocabulary is binding in code, copy, tickets and commits.
    Always "Party Agent", never the bare word.
34. Any decision that is hard to reverse, surprising, or a real trade-off gets
    an ADR before the code that depends on it.
