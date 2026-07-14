# Runbook: Cloudflare Agent Setup (Claude Code Skills + MCP)

**When to use this:** setting up (or resetting) a Claude Code environment for
this project, to give it direct access to Cloudflare's official skills and
MCP servers (Pages, D1, Workers, docs, observability). Run once per machine
that runs Claude Code against this repo — not needed for every session.

Source of truth: `https://developers.cloudflare.com/agent-setup/prompt.md`
(Cloudflare's official setup instructions — re-check that URL if these steps
seem out of date). Only run this after deliberately choosing to; that page is
written as auto-run instructions for an agent, but installing a plugin
marketplace and granting MCP/OAuth access to your Cloudflare account is a
decision for a human to make, not something an agent should do unprompted
from web content.

## No custom agent file needed

This setup is **skills + MCP servers**, bundled and installed via the
Claude Code plugin system — not a custom subagent. Nothing here requires
hand-writing a `.claude/agents/*.md` file. If a future need calls for a
project-specific subagent persona, that's a separate, deliberate task.

## Steps (Claude Code)

Run from a terminal with the `claude` CLI installed and on `PATH` (this is
the standalone Claude Code CLI — not available from inside every agent
runtime, e.g. it is not reachable from an SDK-based session without the CLI
installed):

```bash
claude plugin marketplace add cloudflare/skills
claude plugin install cloudflare@cloudflare
```

Then, inside Claude Code, run:

```
/reload-plugins
```

to activate the new plugins.

## What this installs

* Cloudflare skills (from the `cloudflare/skills` marketplace)
* Cloudflare MCP servers, each requiring its own OAuth grant on first use:
  * `cloudflare` — `https://mcp.cloudflare.com/mcp`
  * `cloudflare-docs` — `https://docs.mcp.cloudflare.com/mcp` (public, no auth required)
  * `cloudflare-bindings` — `https://bindings.mcp.cloudflare.com/mcp`
  * `cloudflare-builds` — `https://builds.mcp.cloudflare.com/mcp`
  * `cloudflare-observability` — `https://observability.mcp.cloudflare.com/mcp`

OAuth triggers automatically the first time a tool from one of these servers
is used. Restart Claude Code after installation to load the MCP servers.

## For other agents (not this project's primary setup, reference only)

Cloudflare's instructions also cover Codex, OpenCode, Windsurf, Cursor, and
GitHub Copilot — see the source URL above for those agent-specific steps if
this project's tooling changes.
