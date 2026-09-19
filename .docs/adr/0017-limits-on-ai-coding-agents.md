# AI coding agents touch development and preview only

This repository is built by one engineer working with coding agents. The
limits on what those agents may do are written down rather than left to the
judgement of whoever is driving at the time.

- **Environments.** Agents work against development and preview only.
  Production data, production deploys, DNS, domains, billing and purchases are
  human actions.
- **Secrets.** No secret enters the repository, a prompt, a log or a commit.
  This repository is public; every file is treated as published.
- **Merges.** Agents do not merge to `main`. A person reviews and merges every
  change.
- **Destruction.** Deleting data, projects, branches or log entries requires an
  explicit human instruction in the same session.

## Why write this down

An agent with production credentials and a plausible-sounding reason is
indistinguishable, from the outside, from a compromised operator. Under
ADR-0002 the threat model already includes an adversary who would very much
like a path into the system that leaves an ordinary-looking audit trail, and a
tool that can deploy, buy and delete on a natural-language instruction is that
path.

The rules are also what make agent work *fast*. An agent that cannot reach
production does not need a human watching each step.

## How it is enforced

Enforcement is mechanical where it can be, because a rule an agent can read is
a rule an agent can rationalise around:

- Vercel purchase, promote and firewall tools, production deploy commands and
  reads of `.env*` are denied in `.claude/settings.json`.
- The Convex MCP server stays on its default, which blocks writes to
  production unless an override flag is passed.
- Git guardrails block destructive git operations before they execute.
- Production deploys happen by merging to `main`, which only a person does.

## Consequences

- Provisioning is slower. Creating the Convex project, the Clerk instance, the
  Vercel projects and the domain are all human steps, and a session that needs
  one of them stops and asks.
- The `.claude/settings.json` deny list is part of the reviewed surface of this
  repository. Changing it is a decision, not configuration drift.
- A public repository means the deny list itself is public. That is accepted:
  it tells an attacker what is blocked, and it tells a reader what we actually
  constrain, which is worth more.
