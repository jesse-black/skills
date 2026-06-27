# Skills

My collection of agent skills. Also see [execplan-skills](https://github.com/jesse-black/execplan-skills) for my [ExecPlan](https://developers.openai.com/cookbook/articles/codex_exec_plans) skills.

Install with `npx skills add jesse-black/skills`.

## Available skills

### [CLI as harness](skills/cli-as-harness/)

A CLI's `--help` is harness you get for free. Docs in AGENTS.md or a skill drift; help text can't, because it lives next to the parser. Subcommands add progressive disclosure: the agent reads only the help for the task at hand, never the whole manual.

### [Defuddle](skills/defuddle/)

Save web pages as Markdown, including Reddit threads and other sites that normally block Defuddle's default user agent. Based on the original [`defuddle` skill from `kepano/obsidian-skills`](https://github.com/kepano/obsidian-skills/tree/main/skills/defuddle).

