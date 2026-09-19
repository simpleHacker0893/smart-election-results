# Smart Elections

Election result verification and validation for Kenya. See `.docs/` for design
documents and specs.

This file is the canonical agent instructions for this repo. `CLAUDE.md` points
here; keep the content in this file only, so the two cannot drift apart.

## Binding documents

Read both before writing code, copy, tickets or docs.

- `CONSTITUTION.md` — the rules that do not bend: independence, evidence,
  claims, honesty, neutrality, privacy, origin separation, limits on AI coding
  agents, engineering standards. If a task conflicts with an article, stop and
  raise it. Do not work around it.
- `.docs/2026-09-19-techstack-design.md` — the stack for each surface, what
  data lives where, and which decisions are still open.

## Web surfaces

Three apps on three origins in one repository. No origin sets a cookie scoped
to the whole domain (ADR-0007).

| Origin | App | What it is | Client JavaScript |
|---|---|---|---|
| `www.` | `apps/site` | Marketing site. No election data, no sign-in, no database. | First-party only |
| `tally.` | `apps/tally` | Public Tally and Reconciliation. | None, ever — `script-src 'none'` |
| `app.` | `apps/console` | Review console: Clerk, Convex, PWA. | Yes |

- `apps/tally` is built by a zero-JavaScript generator, not Next.js, and shares
  no markup with the other two apps. The shared layer is `packages/tokens`.
  See ADR-0010 and ADR-0011.
- `apps/site` and `apps/console` are scaffolded. `apps/tally` does not exist
  yet, so its row above describes intent.
- Evidence never lives in Convex. Convex holds derived data only (ADR-0015).

## Agent skills

### Issue tracker

Issues and specs live as local markdown under `.docs/<feature-slug>/`.
See `.docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, unchanged: `needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`.
See `.docs/agents/triage-labels.md`.

### Domain docs

Single-context. Glossary in `CONTEXT.md` at the repo root; architecture
decision records in `.docs/adr/`.
See `.docs/agents/domain.md`.

## Repo conventions

- All documentation lives under `.docs/`. There is deliberately no `docs/`
  directory — two near-identical top-level names would be a trip hazard.
- Design documents are named `.docs/YYYY-MM-DD-<topic>-design.md`.
- Specs are named `.docs/YYYY-MM-DD-<topic>-spec.md`.
- Per-feature working files live in `.docs/<feature-slug>/`.
