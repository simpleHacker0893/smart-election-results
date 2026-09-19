# Smart Elections Kenya — Tech stack

Date: 2026-09-19
Owner: Njuguna Njenga
Companion to `.docs/2026-09-18-techstack-research.md` (evidence pipeline
research) and ADRs 0001–0006. This document fixes the stack per surface and
lists what is still open. **DECIDED** items came from the owner or an ADR.

---

## 1. Surfaces

| Surface | Path | Origin | Stack | Status |
|---|---|---|---|---|
| Site | `apps/site` | `www.` | Next.js 16 App Router, fully static, Tailwind 4, shadcn/ui | DECIDED, scaffolded |
| Public Tally and Reconciliation | `apps/tally` | `tally.` | Static HTML and server-rendered SVG, no client JavaScript, `script-src 'none'` | Policy DECIDED; **generator OPEN** (see 4.1) |
| Console | `apps/console` | `app.` | Next.js 16, Clerk (phone OTP, organizations), Convex, PWA | DECIDED, scaffolded; no Convex or Clerk instance yet |
| Capture app | `apps/android` | — | Native Kotlin, hardware keystore signing, single-frame Originals (ADR-0006) | DECIDED, not started |
| Evidence services | `services/*` | — | Ingest, Tessera transparency log (ADR-0005), witness publisher, write-once blob store | Log DECIDED; **service language and hosting OPEN** |
| Shared | `packages/tokens`, `packages/registry` | — | Design tokens; station and contest registry data with versioning | Planned |

### What lives where

- **Convex** holds only mutable, derived data: users, organizations, Station
  Assignments, contests, Claims and their versions, confirmations, flags,
  Tally snapshots, audit records.
- **Evidence** (Envelopes, Originals, Masked Renditions, the Transparency Log)
  never lives in Convex. The console reads it through the ReadAPI.
- **The site** holds no data. The contact form sends one email and stores nothing.
- **The Tally** is generated from published snapshots and served from a CDN.

---

## 2. Tooling

| Need | Choice |
|---|---|
| Package manager | pnpm workspace at the repo root (`apps/*`, `packages/*`), one lockfile |
| Language | TypeScript strict everywhere except Android (Kotlin) and the log (Go, via Tessera) |
| Unit and component tests | Vitest, Testing Library, `convex-test` |
| End-to-end | Playwright, including the cross-origin and no-JavaScript checks |
| Accessibility | axe through Playwright |
| Budgets | Lighthouse CI on a low-end Android profile |
| Lint and format | ESLint (Next config); pre-commit via the `setup-pre-commit` skill |
| CI | GitHub Actions: lint, typecheck, test, build, Playwright, Lighthouse |
| Hosting | Vercel, one project per app, root directory set per project |
| Knowledge graph | Graphify, refreshed at the end of each phase |
| Issue tracker | Local markdown under `.docs/<feature-slug>/` |

---

## 3. Accounts, CLIs and agent access

| Service | CLI | Agent skills | MCP |
|---|---|---|---|
| Vercel | `vercel` | `vercel-labs/agent-skills` | `https://mcp.vercel.com` |
| Convex | `npx convex` | bundled in `convex@claude-plugins-official` | bundled in the plugin |
| Clerk | `npx clerk@latest` | `clerk/skills` | `https://mcp.clerk.com/mcp` (SDK snippets only) |
| GitHub | `gh` | — | optional |

Rules (Constitution VIII): MCP servers point at development and preview only.
The Convex MCP server is left at its default, which blocks writes to
production. Vercel purchase, promote and firewall tools are denied in
`.claude/settings.json`. Production deploys happen by merging to `main`.

### Environment variables

| App | Variable | Where it comes from |
|---|---|---|
| console | `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT` | written by `npx convex dev` |
| console | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk dashboard or `clerk` CLI |
| console (Convex env) | `CLERK_JWT_ISSUER_DOMAIN` | Clerk's Convex integration page |
| site | `CONTACT_TO`, email provider key | chosen provider |

All in `.env.local` (ignored) and in Vercel project settings. Commit a
`.env.example` with names only.

---

## 4. Open decisions

### 4.1 Tally generator

`script-src 'none'` means the browser runs no script at all. Next.js App
Router always emits hydration scripts, so a Next.js build would work but throw
blocked-script errors on every page. Options: a zero-JavaScript static
generator such as Astro; a small build script that renders HTML from snapshot
JSON; or Next.js with the noise accepted. **DECIDED: Astro with no client
islands**, so the devtools check a reader runs comes back clean. See ADR-0011.

Consequences of no JavaScript: navigation is plain links; filters are separate
pages; charts are server-rendered SVG; "live" is a page regenerated on an
interval with a visible "as of" time; language switch is a link.

### 4.2 Convex region and jurisdiction

A Convex deployment's region cannot be changed after creation. Choose
deliberately against ADR-0002. Convex holds derived data only, which lowers
but does not remove the stakes: Claims and user phone numbers are in it.
Frame and criteria: ADR-0015. The region itself is still **Unverified**.

### 4.3 Evidence services language and hosting

Carried from the techstack research; decide before the evidence-pipeline spec
is broken into tickets.

### 4.4 SMS for phone OTP

Verify Clerk's delivery and price to Kenyan numbers at the volume Enrollment
implies, and define the fallback if OTP fails on counting night.

### 4.5 Email provider for the contact form

Choose on custody: where message content is stored, for how long, under whose
jurisdiction, and who can read the mailbox. Prefer a provider that can disable
content retention. Frame and the four criteria: ADR-0013. No provider chosen.

### 4.6 Domains

Non-Kenyan primary, canonical; `.co.ke` redirecting to it. Registrar lock,
DNSSEC, hardware-key two-factor on the registrar account, DNS hosted outside
Kenya. Frame: ADR-0014. Availability and trademark checks still **Unverified**.

---

## 5. ADR index

Every ADR listed here as still-to-write on 2026-09-19 has been recorded. Those
carrying unresolved external facts say so inside the ADR.

| ADR | Topic | Open questions inside |
|---|---|---|
| 0007 | One origin per surface; no domain-wide cookies | — |
| 0008 | The Tally and form images are public | — |
| 0009 | Masked Rendition for publication | — |
| 0010 | Content-Security-Policy per origin | — |
| 0011 | Zero-JavaScript generator for the Public Tally | Build time at 46,229-station scale |
| 0012 | Reconciliation is reproducible and externally reviewed | Reviewer independence standard |
| 0013 | Contact data custody | Email provider (4.5) |
| 0014 | Domain strategy | Availability, trademark, registrar (4.6) |
| 0015 | Convex holds derived data only | Region (4.2) |
| 0016 | Claim lifecycle and no self-verification | State names, review queue, roles |
| 0017 | Limits on AI coding agents | — |

Still without an ADR, deliberately: evidence services language and hosting
(4.3) and SMS for phone OTP (4.4). Both are decided before the work that
depends on them is broken into tickets.
