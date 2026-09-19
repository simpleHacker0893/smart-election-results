# The Public Tally is built by a zero-JavaScript generator, not Next.js

`apps/tally` is built with Astro, configured with no client islands, so the
output is HTML, CSS and server-rendered SVG with no `<script>` tag on any page.

## Considered options

**Next.js with the noise accepted.** One framework across all three apps, one
set of conventions, one thing to learn. Rejected: the App Router always emits
hydration scripts, so under `script-src 'none'` every page logs blocked-script
errors in the console. The Public Tally's entire claim is that a reader can
open devtools and check it for themselves; a console full of CSP violations is
exactly the wrong thing to hand that reader, whatever the explanation beside it.

**A plain build script over snapshot JSON.** The smallest dependency surface,
which suits Constitution II.7 — the artefacts must outlive the company.
Rejected as the default: English and Kiswahili routing, pagination over tens of
thousands of stations, filter pages, sitemaps and stable permalinks are all
real work, and hand-rolling them costs more than it saves for a single
engineer. It stays the fallback if Astro's build time at full scale is bad.

**Astro.** Zero JavaScript by default rather than by configuration, with
layouts, file-based routing, i18n and content collections already built.
Chosen.

## Consequences

- Astro is a build-time dependency only. Nothing from it reaches the browser,
  so its supply chain cannot alter a displayed figure — but it can alter what
  gets generated, so the build runs from a pinned lockfile.
- No JavaScript shapes the design, not just the build: navigation is plain
  links, filters are separate pages rather than controls, charts are
  server-rendered SVG, the language switch is a link, and "live" means a page
  regenerated on an interval carrying a visible "as of" time.
- Build time at 2022 scale (46,229 stations) is a real constraint and is
  measured before the first Reconciliation ships, not after.
- `apps/tally` does not share Next.js components with the other two apps. The
  shared layer is `packages/tokens` — design tokens, not markup.
