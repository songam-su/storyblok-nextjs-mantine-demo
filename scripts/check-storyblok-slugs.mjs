import dotenv from 'dotenv';
import * as path from 'node:path';
import StoryblokClient from 'storyblok-js-client';

function loadEnv() {
  // Match Next/Vercel conventions (best-effort). CI should set env vars explicitly.
  for (const filename of ['.env.local', '.env']) {
    dotenv.config({ path: path.join(process.cwd(), filename) });
  }
}

function getToken(version) {
  const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN ?? process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN;
  const publicToken = process.env.STORYBLOK_PUBLIC_TOKEN ?? process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN;

  if (version === 'draft') {
    if (!previewToken) throw new Error('Missing Storyblok preview token env var (STORYBLOK_PREVIEW_TOKEN)');
    return previewToken;
  }

  if (publicToken) return publicToken;
  if (previewToken) return previewToken;
  throw new Error('Missing Storyblok public/preview token env var');
}

function parseArgs(argv) {
  const args = {
    help: false,
    version: 'draft',
    startsWith: null,
    failOnUnderscore: false,
    failOnSpace: false,
    includeFolders: true,
    perPage: 100,
  };

  for (const raw of argv) {
    if (raw === '--help' || raw === '-h') {
      args.help = true;
      continue;
    }

    if (raw.startsWith('--version=')) {
      args.version = raw.split('=')[1];
      continue;
    }

    if (raw.startsWith('--starts-with=')) {
      args.startsWith = raw.split('=')[1] || null;
      continue;
    }

    if (raw === '--fail-on-underscore') {
      args.failOnUnderscore = true;
      continue;
    }

    if (raw === '--fail-on-space') {
      args.failOnSpace = true;
      continue;
    }

    if (raw === '--strict') {
      args.failOnUnderscore = true;
      args.failOnSpace = true;
      continue;
    }

    if (raw === '--stories-only') {
      args.includeFolders = false;
      continue;
    }

    if (raw.startsWith('--per-page=')) {
      const value = Number(raw.split('=')[1]);
      if (Number.isFinite(value) && value > 0) args.perPage = value;
      continue;
    }

    throw new Error(`Unknown arg: ${raw}`);
  }

  return args;
}

function printHelp() {
  // Keep help simple and pnpm-friendly.
  console.log(
    `Storyblok slug check (CI-friendly)\n\nUsage:\n  pnpm -s lint:storyblok-slugs\n  pnpm -s lint:storyblok-slugs -- --version=published\n  pnpm -s lint:storyblok-slugs -- --starts-with=articles\n  pnpm -s lint:storyblok-slugs -- --strict\n\nOptions:\n  --version=draft|published     Which version to query (default: draft)\n  --starts-with=<prefix>        Restrict to a folder/prefix (e.g. articles)\n  --stories-only                Exclude folders from checks\n  --fail-on-underscore          Fail if any slug contains '_'\n  --fail-on-space               Fail if any slug contains whitespace\n  --strict                      Equivalent to --fail-on-underscore --fail-on-space\n  --per-page=<n>                Page size for API requests (default: 100)\n`
  );
}

function asSlugString(link) {
  // Storyblok link object shapes vary slightly; be defensive.
  const raw = link?.slug ?? link?.full_slug ?? link?.path ?? link?.real_path ?? link?.cached_url ?? '';

  if (typeof raw !== 'string') return '';
  return raw;
}

function formatOffender(off) {
  const tag = off.is_folder ? 'folder' : 'story';
  const id = off.id ?? off.uuid ?? off.slug;
  return `${off.slug} (${tag}${id ? `, id: ${id}` : ''})`;
}

async function fetchAllLinks(client, args) {
  const collected = [];
  let page = 1;

  while (true) {
    const query = {
      version: args.version,
      per_page: args.perPage,
      page,
      ...(args.startsWith ? { starts_with: args.startsWith } : null),
    };

    // storyblok-js-client: client.get('cdn/links', params)
    const res = await client.get('cdn/links', query);
    const linksObj = res?.data?.links ?? {};
    const links = Object.values(linksObj);

    if (!links.length) break;

    collected.push(...links);

    const total = res?.data?.total;
    if (typeof total === 'number' && collected.length >= total) break;

    // Fallback stop condition if total not provided.
    if (links.length < args.perPage) break;

    page += 1;
  }

  return collected;
}

async function main() {
  loadEnv();

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (args.version !== 'draft' && args.version !== 'published') {
    throw new Error(`Invalid --version: ${args.version}`);
  }

  const accessToken = getToken(args.version);
  const region = process.env.STORYBLOK_REGION;

  const client = new StoryblokClient({
    accessToken,
    ...(region ? { region } : null),
  });

  const links = await fetchAllLinks(client, args);

  const offendersUpper = [];
  const offendersUnderscore = [];
  const offendersSpace = [];

  for (const link of links) {
    const obj = link && typeof link === 'object' ? link : {};
    if (!args.includeFolders && obj.is_folder) continue;

    const slug = asSlugString(obj);
    if (!slug) continue;

    if (/[A-Z]/.test(slug)) offendersUpper.push({ slug, ...obj });
    if (/_/.test(slug)) offendersUnderscore.push({ slug, ...obj });
    if (/\s/.test(slug)) offendersSpace.push({ slug, ...obj });
  }

  const failReasons = [];
  if (offendersUpper.length) failReasons.push('uppercase');
  if (args.failOnUnderscore && offendersUnderscore.length) failReasons.push('underscore');
  if (args.failOnSpace && offendersSpace.length) failReasons.push('space');

  const anyFail = failReasons.length > 0;

  if (!offendersUpper.length && !offendersUnderscore.length && !offendersSpace.length) {
    console.log(`✅ Storyblok slugs look good (${links.length} links checked).`);
    return;
  }

  console.log(
    `Checked ${links.length} Storyblok links (version=${args.version}${args.startsWith ? `, starts_with=${args.startsWith}` : ''}).`
  );

  if (offendersUpper.length) {
    console.log(`\n❌ Uppercase slugs (${offendersUpper.length}):`);
    for (const off of offendersUpper.sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
      console.log(`- ${formatOffender(off)}`);
    }
  }

  if (offendersUnderscore.length) {
    console.log(`\n${args.failOnUnderscore ? '❌' : '⚠️ '} Underscore slugs (${offendersUnderscore.length}):`);
    for (const off of offendersUnderscore.sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
      console.log(`- ${formatOffender(off)}`);
    }
  }

  if (offendersSpace.length) {
    console.log(`\n${args.failOnSpace ? '❌' : '⚠️ '} Whitespace slugs (${offendersSpace.length}):`);
    for (const off of offendersSpace.sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
      console.log(`- ${formatOffender(off)}`);
    }
  }

  if (anyFail) {
    console.error(`\nFAILED: slug policy violated (${failReasons.join(', ')}).`);
    process.exit(1);
  }

  console.log(`\nOK (uppercase is the only failing rule by default). To fail on more, pass --strict.`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
