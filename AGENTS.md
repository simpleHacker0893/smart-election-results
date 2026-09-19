# Smart Elections

Election result verification and validation for Kenya. See `.docs/` for design
documents and specs.

This file is the canonical agent instructions for this repo. `CLAUDE.md` points
here; keep the content in this file only, so the two cannot drift apart.

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
