# Each origin gets its own Content-Security-Policy

`www.` and `tally.` run different policies, and neither is a compromise
between the two.

`www.` (`apps/site`) ships `script-src 'self' 'unsafe-inline'` with every other
directive locked to `'self'`. `tally.` (`apps/tally`) ships `script-src 'none'`
and serves no script of any kind. Both set `Referrer-Policy`,
`X-Content-Type-Options`, `Permissions-Policy` and
`Strict-Transport-Security`.

## Why two policies rather than one

A nonce-based policy is stricter, but Next.js computes the nonce per request,
which forces dynamic rendering and gives up the fully static build the site is
designed around. `script-src 'self' 'unsafe-inline'` keeps the site static and
still blocks every external origin — which is the threat that matters here,
because the attack in scope is a third-party tag rewriting displayed figures,
not an injected inline string on a site with no user input rendered to HTML.

`tally.` does not need that trade-off. It has no interactive surface, so it can
take the strictest policy that exists and say so on the page, which is worth
more to a sceptical reader than any prose about trustworthiness.

## Consequences

- `script-src 'none'` is incompatible with Next.js App Router, which always
  emits hydration scripts: every Public Tally page would log blocked-script
  errors and spoil the devtools check a reader runs. `apps/tally` therefore
  needs a zero-JavaScript generator. See ADR-0011.
- The header is the backstop, not the enforcement. A Playwright test loads
  every page and fails the build if any request leaves the origin, and a second
  test fails if `tally.` serves a `<script>` tag at all.
- `'unsafe-inline'` on `www.` is a real weakening and is recorded as such. It
  is revisited if the site ever renders user-supplied content.
