#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0';

function usage() {
  console.log(`Usage: defuddle.js <url> [defuddle options]

Runs a global Defuddle installation when available, otherwise falls back to
npx. Adds Markdown and frontmatter output, a browser user agent, and an
old.reddit.com rewrite for Reddit URLs.

Examples:
  defuddle.js https://example.com/article
  defuddle.js https://www.reddit.com/r/example/comments/abc123/post/ -o post.md`);
}

const [input, ...forwardedArgs] = process.argv.slice(2);

if (!input || input === '-h' || input === '--help') {
  usage();
  process.exit(input ? 0 : 2);
}

let target;

try {
  target = new URL(input);
} catch {
  console.error(`Invalid URL: ${input}`);
  process.exit(2);
}

if (!['http:', 'https:'].includes(target.protocol)) {
  console.error(`Unsupported URL protocol: ${target.protocol}`);
  process.exit(2);
}

if (/^(?:(?:www|new|old|np)\.)?reddit\.com$/i.test(target.hostname)) {
  target.hostname = 'old.reddit.com';
}

const hasUserAgent = forwardedArgs.some(
  (arg) => arg === '-u' || arg === '--user-agent' || arg.startsWith('--user-agent='),
);
const defuddleArgs = ['parse', target.toString(), '-mf'];

if (!hasUserAgent) {
  defuddleArgs.push('-u', DEFAULT_USER_AGENT);
}

defuddleArgs.push(...forwardedArgs);

const globalDefuddle = process.platform === 'win32' ? 'defuddle.cmd' : 'defuddle';
let command = globalDefuddle;
let result = spawnSync(command, defuddleArgs, { stdio: 'inherit' });

if (result.error?.code === 'ENOENT') {
  command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  result = spawnSync(command, ['-y', 'defuddle', ...defuddleArgs], { stdio: 'inherit' });
}

if (result.error) {
  console.error(`Failed to run ${command}: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
