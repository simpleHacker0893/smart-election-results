# Separate origins for the site, the Public Tally and the console

Three apps ship on three origins from day one: `www.` for the marketing site
(`apps/site`), `tally.` for the Public Tally and the Reconciliation
(`apps/tally`), and `app.` for the review console (`apps/console`). They share
one repository and one set of design tokens.

`tally.` carries **zero third-party scripts, ever**, and says so on the page.
No origin sets a cookie scoped to the whole domain.

## Why

The Public Tally is the product's trust artefact. Any analytics tag, chat
widget or tag manager sharing its origin is a script that can rewrite displayed
vote counts, and its presence cannot be disproved to a sceptical reader.
Marketing sites inevitably accumulate exactly those scripts.

## Consequences

Station permalinks must be designed now — keyed on station code, election and
contest — because those are the URLs people will share, and moving them later
means breaking links on the one date they matter.

Splitting origins later would require changing every shared link, so the cost
of doing it at the start is near zero and the cost of deferring is not.
