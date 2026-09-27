# Trial: Change Brief alongside Guardrails

This branch adds a second automated comment to pull requests in this repo, on
top of the Guardrails code review that already runs here.

## The two comments

| Comment | Posted by | Answers |
|---|---|---|
| **Guardrails review** | the `guardrails-boogiepop` GitHub App (webhook) | Is the code OK — bugs, security, style, this repo's own rules? |
| **Change Brief** | this repo's own GitHub Actions workflow | Does the implementation match the ticket/spec, and what did it actually do? |

Neither replaces the other. Guardrails' check stays informational (`neutral`)
and the Change Brief comment is a pinned summary, not a check — nothing here
blocks a merge on its own.

## Status of this trial

The Change Brief comment on this branch uses a **fixture** (a mock Jira
ticket), not a real brief generated from this PR's actual diff — that
generation step (reading the real diff and chronicle with an LLM) does not
exist yet in the `change-brief` project. This trial only proves the
**mechanics**: two independent bots can comment on the same PR without
conflicting or duplicating, each updating its own comment on new pushes.

See `blanck1945/change-brief` → `docs/GUARDRAILS-TRIAL-PROPOSAL.md` for the
full plan and what comes next (Phase C: a real brief from the real diff).
