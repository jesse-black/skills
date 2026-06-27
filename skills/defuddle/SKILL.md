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

Pass additional Defuddle options after the URL.
