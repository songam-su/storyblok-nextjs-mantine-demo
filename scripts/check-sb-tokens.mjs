import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

// Treat these as the canonical "global" token providers for `--sb-*`.
// - `globals.scss` contains the site-wide semantic token contract.
// - `StoryblokColors.module.scss` defines Storyblok-driven color tokens used by components.
const tokenDefinitionFiles = [
  'src/styles/globals.scss',
  'src/lib/storyblok/utils/styles/color/StoryblokColors.module.scss',
].map((relativePath) => path.join(repoRoot, relativePath));

const scanRoot = path.join(repoRoot, 'src');
const scanExtensions = new Set(['.scss', '.css']);

const definedTokenRegex = /(--sb-[a-zA-Z0-9-_]+)\s*:/g;
// Capture `var(--sb-token)` vs `var(--sb-token, fallback)`.
// If a fallback is provided, the token being undefined is runtime-safe.
const referencedTokenRegex = /var\(\s*(--sb-[a-zA-Z0-9-_]+)\s*(,)?/g;

function stripComments(text) {
  // Good-enough for our usage: avoids false positives from commented-out code.
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function extractAllMatches(text, regex) {
  const matches = [];
  for (const match of text.matchAll(regex)) {
    matches.push(match);
  }
  return matches;
}

function getLineNumber(text, index) {
  // 1-based
  return text.slice(0, index).split(/\r?\n/).length;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(rootDir) {
  const results = [];
  const entries = await fs.readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      // Skip common large folders just in case they ever appear under src.
      if (entry.name === '.next' || entry.name === 'node_modules') continue;
      results.push(...(await walkFiles(fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name);
    if (!scanExtensions.has(ext)) continue;

    results.push(fullPath);
  }

  return results;
}

async function main() {
  const missingTokenUsages = new Map();

  const globalDefinedTokens = new Set();
  for (const definitionFile of tokenDefinitionFiles) {
    if (!(await fileExists(definitionFile))) continue;

    const raw = await fs.readFile(definitionFile, 'utf8');
    const text = stripComments(raw);
    for (const match of extractAllMatches(text, definedTokenRegex)) {
      globalDefinedTokens.add(match[1]);
    }
  }

  const files = await walkFiles(scanRoot);

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const text = stripComments(raw);

    const definedHere = new Set();
    for (const match of extractAllMatches(text, definedTokenRegex)) {
      definedHere.add(match[1]);
    }

    for (const match of extractAllMatches(text, referencedTokenRegex)) {
      const token = match[1];
      const hasFallback = match[2] === ',';

      if (hasFallback) continue;
      if (globalDefinedTokens.has(token) || definedHere.has(token)) continue;

      const index = match.index ?? 0;
      const line = getLineNumber(raw, index);

      if (!missingTokenUsages.has(token)) missingTokenUsages.set(token, []);
      missingTokenUsages.get(token).push({
        file: path.relative(repoRoot, filePath).replaceAll('\\', '/'),
        line,
      });
    }
  }

  if (missingTokenUsages.size === 0) {
    console.log('✅ All referenced --sb-* tokens are defined (globally or locally).');
    return;
  }

  const tokens = Array.from(missingTokenUsages.keys()).sort();
  console.error(`❌ Found ${tokens.length} --sb-* tokens referenced without a definition.`);
  console.error('These tokens are referenced via var(--sb-...) but are not defined in:');
  for (const definitionFile of tokenDefinitionFiles) {
    console.error(`- ${path.relative(repoRoot, definitionFile).replaceAll('\\', '/')}`);
  }
  console.error('…and are also not defined locally in the referencing stylesheet.');
  console.error('');

  for (const token of tokens) {
    const usages = missingTokenUsages.get(token);
    const examples = usages.slice(0, 5);

    console.error(`${token}`);
    for (const usage of examples) {
      console.error(`  - ${usage.file}#L${usage.line}`);
    }

    if (usages.length > examples.length) {
      console.error(`  - …and ${usages.length - examples.length} more`);
    }

    console.error('');
  }

  process.exitCode = 1;
}

await main();
