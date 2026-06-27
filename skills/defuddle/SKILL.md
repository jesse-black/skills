---
name: defuddle
description: Extract clean markdown content from web pages using Defuddle CLI, removing clutter and navigation to save tokens. Use instead of WebFetch or the built in fetcher when the user provides a URL to read or analyze, for online documentation, articles, blog posts, YouTube videos, or any standard web page. Also use when the user asks to clip, save, or archive a web page to the repo or vault.
---

# Defuddle

Use Defuddle CLI to extract clean readable content from web pages. Prefer over WebFetch or the built in fetcher because it:

- removes navigation, ads, and clutter, reducing token usage
- clips transcripts from YouTube videos
- enables archiving reference material to git repositories or Obsidian vaults

Do NOT use for URLs ending in .md — those are already markdown, use WebFetch or the built in fetcher directly.

## Usage

Run the bundled wrapper with Node:

```bash
node scripts/defuddle.js <url>
```

Save to file:

```bash
node scripts/defuddle.js <url> -o content.md
```

The wrapper always requests Markdown with frontmatter, supplies a browser user
agent, and rewrites Reddit URLs to `old.reddit.com`. The rewrite is necessary
because Defuddle's secondary Reddit request does not honor its CLI user-agent
option. Pass any additional Defuddle options after the URL. Set
`DEFUDDLE_USER_AGENT` or pass `-u`/`--user-agent` to override the default.
