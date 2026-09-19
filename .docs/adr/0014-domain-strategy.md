# A non-Kenyan .org is canonical; the .co.ke redirects to it

One canonical hostname on a non-Kenyan `.org`, with the matching `.co.ke`
registered and permanently redirecting to it. Every link we publish, every
permalink on `tally.`, and every canonical tag points at the `.org`.

The registrar account is hardened before the domain carries traffic: registrar
lock on, DNSSEC enabled, hardware-key two-factor on the account, the account's
own contact email on a **different** domain, and DNS hosted outside Kenya.

## Why the canonical name is not the .co.ke

`.co.ke` is administered under Kenyan authority, which is the same jurisdiction
as the actors this project's threat model treats as adversaries (ADR-0002). A
Reconciliation that embarrasses a Kenyan political actor is exactly the
circumstance in which a Kenyan-administered name is least dependable. The
`.co.ke` is still registered — so that nobody else can take it, and so Kenyan
readers who guess it arrive somewhere real — but nothing depends on it
resolving.

Registering the account's contact email on a different domain matters more than
it looks: if the domain under attack is also the domain the recovery email
lives on, losing the domain loses the means of recovering it.

## .org is diversity of jurisdiction, not immunity

This buys separation between the authority that can reach the registry and the
authority that can reach us. It does not buy immunity. A `.org` sits under its
own registry operator and its own national law, and is subject to court orders
and registry policy there. The honest claim is "harder to seize quickly and by
a single authority", not "cannot be taken".

*Inferred:* `.org` is administered by a registry operator based outside Kenya.
The specific operator, its jurisdiction, and its published takedown policy are
**Unverified** and are checked before registration.

## Open before registration

All **Unverified**:

- Whether the intended name is available in `.org` and `.co.ke`.
- Whether an existing business, domain or registered trademark uses a similar
  name in Kenya or elsewhere.
- Which registrars support hardware-key two-factor, registrar lock and DNSSEC
  together, and which DNS host is used.

Registration and purchase are human actions under Constitution VIII.25.

## Consequences

- Permalinks on `tally.` are minted against the `.org` from the first published
  Reconciliation. Changing the canonical host later breaks the one class of
  link that matters on the one date it matters.
- The redirect is permanent and one-directional. The `.co.ke` never serves
  content, so it never needs its own certificate story or its own CSP.
