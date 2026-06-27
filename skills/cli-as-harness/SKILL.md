---
name: cli-as-harness
description: Author CLI surfaces as agent-facing documentation, especially parser-generated `--help` and actionable error messages. Use when adding or editing a CLI, improving help text or validation errors, moving command reference out of AGENTS.md / CLAUDE.md / a README / a skill and into generated CLI surfaces, or making errors suggest the corrected command line or tool call.
---

# Authoring CLI surfaces as harness

In agentic engineering the **harness** is everything around the model that shapes what it can do
and know — the agent loop, tool wiring, assembled context, and instructions. Most harness
instruction is *pushed*: baked into a system prompt, an AGENTS.md, or a tool description, all
static and centralized. CLI surfaces are underused local harness: `--help` carries the command
reference, and validation errors carry the recovery path when a command is malformed. Treating a
CLI as harness means deliberately authoring both for an agent reader — not just a human — so the
installed tool explains its current interface and how to recover from common invalid calls.

The organizing rule: **top-level `--help` owns what the tool is for and when to use it;
subcommand `--help` owns command-local semantics; error messages own local recovery from invalid
command use; a skill or AGENTS.md owns cross-tool workflow, policy, and anything that needs the
bigger picture to apply safely.** Most staleness and duplication in agent docs comes from copying
a flag list into AGENTS.md, where it rots the moment the CLI changes.

## Authoring `--help`

If you own the CLI, put the canonical, agent-facing instruction **in the parser**. With Python
`argparse`:

- top-level `description=` / `epilog=` — what the tool is for and when to reach for it.
- `help=` on every argument — the one-line "what this flag is."
- `choices=[...]` so valid values self-document.
- subcommand `description=` / `epilog=` (with `formatter_class=argparse.RawDescriptionHelpFormatter`
  so layout survives) for the richer content below.

Then instruction files carry a **pointer, not a copy**: ``Run `tool <cmd> --help` for the
authoritative reference.``

### What to put in `--help` (beyond the bare flags)

A flag list is the floor, not the ceiling. The high-value additions for an agent reader:

- **Examples** — concrete, copy-pasteable invocations. Subcommand help usually wants examples,
  not recipes: one realistic command line teaches more than a paragraph.
  > `Example:  tool deploy --env staging --dry-run    # preview without applying`
- **Recipes** — short task flows for top-level `tool --help`, so the agent sees the intended
  *order* for common end-to-end work inside that tool. Keep them brief and point to the exact
  subcommands; do not try to replace subcommand help.
  > `Recipe (log then review):  tool add ... ; tool list --due`
- **Isolated guidance** — guidance that is correct on its own,
  because each help page should stand without surrounding narrative. Good: "capture the snapshot
  in the snapshot flags, not --notes"; "a pass/skip is archived, not closed."
- **Gotchas** — the constraint that produces a confusing error if missed
  (e.g. an enforced status↔value pairing). Put the rule next to the flag, then make the matching
  error name the violated constraint and suggest the corrected command line or tool call.
- **Tool when/why** — the root `tool --help` should say when to use the
  tool at all. For example, top-level `tool --help` should briefly explain when that tool belongs
  in the user's workflow. Put common recipes here when they describe flows across that tool's
  own subcommands.

Use this boundary:

- Top-level `tool --help`: recipes for common end-to-end flows inside that tool.
- Subcommand `tool cmd --help`: examples plus command-local gotchas.
- Skill / AGENTS.md: workflows that cross tools, require repo policy, or need domain judgment.

**The isolation test** decides what qualifies: *would this instruction still be correct and
actionable for an agent that read only this `--help` page and nothing else?* If yes, it belongs in
`--help`. If it only makes sense as one step of a larger cross-tool workflow or repo policy, it
belongs in a skill or AGENTS.md instead.

## Authoring error messages

Error messages are part of the harness because agents often see them at the exact moment they need
to recover. Keep them short, specific, and corrective:

- State what failed using the same flag, value, and subcommand names shown in `--help`.
- When the fix is unambiguous, include the exact command line or tool call, already filled in with
  the offending values, that can be copied and run verbatim to recover.
- For validation constraints, name the accepted values or required pairings directly in the error.
- If an error teaches a rule that should have been known before execution, add the same rule to the
  relevant `--help` page so the command is self-documenting before and after failure.
- Keep workflow, rationale, and multi-command orchestration out of error text.

Example: if `tool` rejects a dirty git worktree because untracked files `file1` and `file2` must be
intent-to-add staged first, the recovery line should be:

```bash
git add -N file1 file2 && tool
```

## What to keep out of CLI surfaces

| Belongs in CLI surfaces | Belongs in a skill / AGENTS.md |
|-------------------------|--------------------------------|
| Flags, values, defaults, choices | Cross-tool or policy workflow |
| One-line "what this flag does" | Repo policy |
| Top-level "what this tool is for and when to use it" | Cross-tool when/why |
| Subcommand examples; top-level recipes inside one tool | **Rationale** behind a convention |
| Self-contained gotchas tied to a flag/value | Long narrative, orchestration, multi-tool flows |
| Invalid-call recovery and corrected invocation shapes | Cross-tool strategy |

Don't cram cross-tool workflow narrative into `--help` or error messages, and don't leave flag
enumerations in AGENTS.md. Each surface does what it's structurally good at.
