# Smart Elections Kenya — Site design and implementation guide

Date: 2026-09-19
Owner: Njuguna Njenga
Scope: `apps/site` only (the public website). The console (`apps/console`) and
the Public Tally (`apps/tally`) are separate apps on separate origins and are
out of scope here, except where the site links to them.

> Status: proposed. Decisions marked **DECIDED** came from the owner. Items
> marked **OPEN** must be settled in grilling before the ticket that needs them.

---

## 1. What the site is

The website of the app: what Smart Elections Kenya does, who it is for, what it
costs, why it can be trusted, and where to see it working. It is not the Public
Tally and holds no election data, no sign-in and no database.

| Origin | App | Purpose | Third-party scripts |
|---|---|---|---|
| `www.` | `apps/site` | Landing page, features, pricing, research, contact | None (first-party analytics only) |
| `tally.` | `apps/tally` | Public Tally and 2022 Reconciliation | None, ever — stated on the page |
| `app.` | `apps/console` | Clerk + Convex review console, PWA | Auth provider only |

**DECIDED:** separate origins from day one; one repo; shared design tokens.

### The one rule that shapes all copy

Nothing on the site may describe software that does not exist as if it did.
Every feature carries a status label: **Available**, **In pilot** or
**Planned**. In a product whose whole claim is "you can check us", one
overstated screenshot costs more than an empty section.

---

## 2. Prerequisites (run once)

```bash
# from the repo root — see what each repo offers before installing
npx skills add vercel-labs/agent-skills --list
npx skills add anthropics/skills --list

# install for Claude Code, project scope
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code
npx skills add anthropics/skills --skill frontend-design -a claude-code

# UI/UX Pro Max ships through its own installer, not the skills CLI
npm install -g uipro-cli
uipro init --ai claude
```

Skill names move; if `--skill` fails, use the name shown by `--list`. Note that
most skills in `vercel-labs/agent-skills` carry a `vercel-` prefix — the name is
`vercel-react-best-practices`, not `react-best-practices`. Also installed and
used here: Matt Pocock skills, `nextjs-expert`, Graphify.

Restart Claude Code after installing. Check for name collisions afterwards: on
Windows the skills CLI copies rather than symlinks, so `.agents/skills/` and
`.claude/skills/` each hold a full copy of any universally-installed skill.

| Skill | Used for |
|---|---|
| `frontend-design` | Visual direction that does not look templated |
| `prototype` (Matt Pocock) | Three home-page variants on one route |
| `web-design-guidelines` | Audit before each merge: accessibility, UX, performance |
| `vercel-react-best-practices` | Bundle size, Server Component boundaries |
| `ui-ux-pro-max` | Styles, palettes, font pairings, component patterns |
| `nextjs-expert` | Next.js 16 specifics: static rendering, metadata, images |

---

## 3. Page map

All routes live under a language segment: `/en/...` and `/sw/...`.

| Route | Content | Ships in |
|---|---|---|
| `/` | Landing page (section 4) | Ticket 2–6 |
| `/how-it-works` | Capture → seal → confirm → publish, in plain language | Ticket 7 |
| `/features` | Full feature list by audience, each with a status label | Ticket 7 |
| `/pricing` | Price list (blocked on the pricing design doc) | Ticket 9 |
| `/trust` | Threat model summary, what we cannot do, zero-script pledge, funding and ownership, policy on serving competing Candidates | Ticket 8 |
| `/research` | Research docs and ADRs rendered from `.docs/` at build time | Ticket 8 |
| `/contact` | "Talk to us" form, email, secure channel | Ticket 6 |
| `/legal/*` | Independence statement, privacy notice, terms | Ticket 8 |
| `tally.` links | "View the Tally" and "2022 Reconciliation" go to the other origin | When it exists |

---

## 4. Landing page, top to bottom

1. **Header.** Wordmark, five links at most (How it works, Features, Pricing,
   Tally, Research), language switch, one button: "Talk to us".
2. **Hero.** One sentence saying what it does for a Candidate. One line of
   independence: not IEBC, does not declare results. Primary button "Talk to
   us"; secondary link "See the 2022 Reconciliation". The visual is a real
   Statutory Form with callouts, never a mock-up of an unbuilt screen.
3. **The problem, in three facts.** 2017 nullification; 2022 agents' copies
   rejected by the Supreme Court; what a form with no provenance is worth.
   Each fact links to its source.
4. **How it works.** Four steps with one line each.
5. **Who it is for.** Candidates, parties and coalitions, chief agents,
   observer organizations, the public. Two or three features each, with status
   labels.
6. **Why trust it.** What the platform cannot do (forge a Capture, edit an
   image, publish without a second person); zero third-party scripts; open
   research; who funds it.
7. **See it working.** Link card to the Public Tally and the Reconciliation.
   Hidden until at least one of them is live.
8. **Pricing summary.** Three cards (Candidate, Party or coalition, Observer
   organization) linking to `/pricing`. Hidden until pricing is approved.
9. **Proof.** See section 5.
10. **Questions.** Is this IEBC? Is it legal? Who pays for it? What if two
    parties disagree about a station? What happens to my data? Can the public
    see the forms?
11. **Closing call to action and footer.** Independence statement repeated in
    English and Kiswahili, legal links, contact, secure channel.

One `<h1>`, one primary action, repeated at top and bottom. Every section must
read correctly with JavaScript disabled.

---

## 5. Testimonials and proof

**OPEN, with a recommendation.** There are no users yet, so there are no
testimonials. Invented or placeholder quotes are not acceptable here.

- Build the testimonial component now, driven by a typed content file.
- An entry renders only if it has a named person, a role, an organization, a
  date and a recorded consent reference. No entry, no section.
- A quote from a politician reads as that side's endorsement. Prefer observer
  organizations, election lawyers and technical reviewers.
- Until real quotes exist, the Proof section shows: the Reconciliation
  findings, named advisers and partners (once signed), and pilot numbers.

---

## 6. Design tokens

Ink on warm paper with one indigo accent. Colour is reserved for Claim status
and always paired with an icon and a label. No party colours, no flag palette.
Candidates on any chart get a neutral sequence in ballot order.

`apps/site/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --ink: #14171f;
  --paper: #faf8f3;
  --surface: #ffffff;
  --line: #e4e0d6;
  --muted: #5b6170;
  --accent: #3730a3;
  --confirmed: #0f766e;
  --awaiting: #b45309;
  --disputed: #b42318;
  --missing: #64748b;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #e8e6e1;
    --paper: #0e1116;
    --surface: #171b22;
    --line: #2a303b;
    --muted: #a3a9b6;
    --accent: #a5b4fc;
  }
}

@theme inline {
  --color-ink: var(--ink);
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-confirmed: var(--confirmed);
  --color-awaiting: var(--awaiting);
  --color-disputed: var(--disputed);
  --color-missing: var(--missing);
}
```

Use as `bg-paper text-ink border-line text-accent`. The dark status colours
need their own contrast-checked values before the console uses them.

Type: a serif for headings and quoted form text, a sans for interface text,
tabular numerals for every count. Load with `next/font` so fonts are
self-hosted and no request leaves the origin.

When a second app needs these tokens, move this file to
`packages/tokens/theme.css` and import it from each app.

---

## 7. Structure

```text
apps/site/
  app/
    [lang]/
      layout.tsx            # html lang, fonts, header, footer
      page.tsx              # landing page
      how-it-works/page.tsx
      features/page.tsx
      pricing/page.tsx
      trust/page.tsx
      research/page.tsx
      research/[slug]/page.tsx
      contact/page.tsx
      legal/[slug]/page.tsx
      opengraph-image.tsx
    sitemap.ts
    robots.ts
    globals.css
  components/
    sections/               # Hero, Problem, Steps, Audiences, Trust, Proof, Faq, ClosingCta
    ui/                     # shadcn components
    status-label.tsx        # Available | In pilot | Planned
  content/
    en/*.ts  sw/*.ts        # typed copy, one file per page
    features.ts             # feature list with status and audience
    faq.ts  proof.ts  pricing.ts
  lib/
    i18n.ts                 # locales, dictionary loader
    docs.ts                 # reads ../../.docs at build time
  next.config.ts            # headers, redirects
```

Copy lives in `content/`, never inline in components, so translation and
review do not touch layout code. `features.ts` is the single list the landing
page, `/features` and the status labels all read from.

---

## 8. Next.js practices that matter for this site

- **Everything static.** `generateStaticParams` returns `en` and `sw`. No
  cookies, headers or search params read during render. `/` redirects to `/en`
  from `next.config.ts`; no language negotiation, so nothing becomes dynamic.
- **Server Components everywhere.** Client Components only for the mobile
  menu, the language switch and the contact form.
- **Images.** `next/image` with explicit dimensions; only the hero image is
  preloaded. Check the current docs for the Next.js 16 prop name.
- **Metadata.** `generateMetadata` per page, canonical and `hreflang`
  alternates for both languages, `opengraph-image.tsx`, `sitemap.ts`,
  `robots.ts`, and Organization plus FAQ structured data as JSON-LD.
- **Budget.** Under 100 KB of JavaScript on the landing page, largest paint
  under 2.5 s on a throttled 3G profile, no layout shift. Tested on a
  low-end Android profile, because that is the audience.
- **Analytics.** First-party only, on `www.` only. Nothing on `tally.`.

---

## 9. Security headers

Goal: no script, style, font, image or connection to any other origin.

- Set `Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options`,
  `Permissions-Policy` and `Strict-Transport-Security` in `next.config.ts`.
- **OPEN:** a nonce-based policy forces dynamic rendering in Next.js. Evaluate
  `script-src 'self' 'unsafe-inline'` with everything else locked to `'self'`
  (keeps pages static, still blocks every external origin) against the
  hash-based options in the current Next.js docs. Record the choice as an ADR.
- A Playwright test loads every page and fails if any request leaves the
  origin. This is the enforcement; the header is the backstop.

---

## 10. Contact form

- A Server Action validates with zod and sends email through a server-side
  provider. No third-party script reaches the browser.
- Spam control without a captcha script: honeypot field, time-to-submit check,
  rate limit per address.
- Collect the minimum: name, organization, role, email or phone, message. Show
  the privacy notice beside the button. State the retention period.
- Offer a secure channel beside the form, for people who should not use email.

---

## 11. Languages

**DECIDED:** English and Kiswahili.

- Both languages share routes and components; only `content/` differs.
- Launch order: English complete; Kiswahili for the landing page, the
  independence statement, the questions section and `/how-it-works`.
- Legal text is translated by a person and reviewed. Never machine-translated.
- The language switch keeps the reader on the same page.

---

## 12. Tests and CI

| Check | Tool | Fails the build when |
|---|---|---|
| Every page renders, one `<h1>`, no console errors | Playwright | Any page breaks |
| No cross-origin requests | Playwright | One request leaves the origin |
| Readable without JavaScript | Playwright, JS disabled | Main content missing |
| Accessibility | axe via Playwright | Any serious violation |
| Every feature has a status label | Vitest on `features.ts` | Label missing |
| Every proof entry has consent | Vitest on `proof.ts` | Field missing |
| Both languages have the same keys | Vitest | A key is missing |
| Budget | Lighthouse CI | Over budget |

---

## 13. Ticket order (input to `/to-tickets`)

1. Walking skeleton: `[lang]` layout, tokens, fonts, header, footer with the
   independence statement, security headers, the cross-origin test, CI, deploy.
2. Hero and closing call to action.
3. Problem and How it works sections.
4. Audiences section reading from `features.ts` with status labels.
5. Trust and Questions sections.
6. Contact page and form.
7. `/how-it-works` and `/features`.
8. `/trust`, `/research` rendered from `.docs/`, `/legal`.
9. `/pricing` — blocked on the approved pricing design.
10. Kiswahili content pass and `hreflang`.
11. Proof section — blocked on the first real entry.
12. Audit with `web-design-guidelines`, fix, then run Graphify.

Each ticket is a vertical slice: content file, component, page wiring, test.

---

## 14. Definition of done for the site

- Deployed on `www.` with every page in section 3 that is not blocked.
- All checks in section 12 green.
- No feature shown without a status label; no quote shown without consent.
- The independence statement is on every page in both languages.
- `graphify-out/` updated and committed.
