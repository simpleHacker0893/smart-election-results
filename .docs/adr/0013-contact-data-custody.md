# Contact data lives in one mailbox and nowhere else

Who has contacted us is the most sensitive data the site touches. A list of
people who approached an election-verification company is a target in a way
that a message body usually is not.

The contact form therefore **stores nothing in a database** and **writes no
message body to logs**. It sends one email and forgets. Messages land in one
shared mailbox with a named access list, are deleted after 90 days, and the
90-day period is stated beside the submit button rather than buried in a
privacy page.

A Signal username and a PGP key appear on `/contact` with the same prominence
as the form, for people for whom being seen to contact us is the risk.

## Why no database

A form that writes to a database creates a second copy under a second
retention policy, and in practice a third in backups. Every copy is one more
thing to disclose, subpoena or breach, and none of them makes the product
better: nobody needs to query historical contact submissions. Sending straight
to a mailbox keeps the number of places this data exists at one.

## The provider decision is open

**Unverified.** No provider is chosen. The comparison is made on custody, not
price or deliverability, against four criteria:

1. Where message content is stored, physically and legally.
2. How long it is retained by default.
3. Whether content retention can be disabled outright.
4. Which jurisdiction can compel disclosure, and under what process.

Constitution VI.21 requires the mailbox to sit outside Kenyan legal reach, so a
provider that cannot satisfy that is excluded regardless of how it scores
elsewhere. A provider that cannot disable content retention is strongly
disfavoured, because it reintroduces the second copy this ADR exists to avoid.

## Consequences

- Spam control cannot use a third-party captcha, which would be a script from
  another origin on `www.` and would tell that third party who is submitting.
  A honeypot field, a time-to-submit check and a per-address rate limit are
  used instead.
- Rate limiting needs some state. It stores a salted hash and a timestamp, with
  no address and no message content, and expires on the same 90-day clock.
- 90 days is a commitment to delete, not a maximum we drift past. Whoever holds
  the mailbox is responsible for it actually happening.
