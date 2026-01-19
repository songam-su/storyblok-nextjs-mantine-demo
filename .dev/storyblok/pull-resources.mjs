import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

import { ensureStoryblokCliLoggedIn } from './helpers/ensure-storyblok-login.mjs';

dotenv.config();

try {
  ensureStoryblokCliLoggedIn();
} catch (error) {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const spaceId = process.env.STORYBLOK_SPACE_ID;
if (!spaceId) {
  console.error('Error: STORYBLOK_SPACE_ID is not set in .env');
  process.exit(1);
}

const resourcesPath = './src/lib/storyblok/resources/';
const moveScript = './.dev/storyblok/helpers/move-files.mjs';

const componentFiles = [
  `${resourcesPath}components/${spaceId}/components.json`,
  `${resourcesPath}components/${spaceId}/groups.json`,
  `${resourcesPath}components/${spaceId}/presets.json`,
];
const typeFile = `${resourcesPath}types/${spaceId}/storyblok-components.d.ts`;
const datasourcesFile = `${resourcesPath}datasources/${spaceId}/datasources.json`;
// const languagesFile = `${resourcesPath}languages/${spaceId}/languages.json`; // TODO: determine correct filename and path

function assertExistsOrThrow(filePath, label) {
  if (existsSync(filePath)) return;
  throw new Error(
    [
      `${label} output file not found: ${filePath}`,
      'This usually means the Storyblok CLI could not fetch data (even if it printed "Pull complete").',
      'Try: pnpm sb:login (ensure correct region), then rerun: pnpm sb:pull',
    ].join('\n')
  );
}

try {
  console.log('Pulling Storyblok components...');
  execSync(`storyblok components --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  // Storyblok CLI may exit 0 even on failures; verify outputs before continuing.
  componentFiles.forEach((filePath) => assertExistsOrThrow(filePath, 'Components'));

  console.log('Pulling Storyblok types...');
  execSync(`storyblok types --space ${spaceId} --path ${resourcesPath} generate`, { stdio: 'inherit' });

  assertExistsOrThrow(typeFile, 'Types');

  console.log('Pulling Storyblok datasources...');
  execSync(`storyblok datasources --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  assertExistsOrThrow(datasourcesFile, 'Datasources');

  console.log('Pulling Storyblok languages...');
  execSync(`storyblok languages --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  console.log('✅ Pull complete. Moving files...');

  // Move component files and remove folder with spaceId
  componentFiles.forEach((file) => {
    if (existsSync(file)) {
      execSync(`node ${moveScript} ${file} ${resourcesPath}components`, { stdio: 'inherit', shell: true });
    } else {
      console.warn(`⚠️ Component file not found: ${file}`);
    }
  });

  // Move types file and remove folder with spaceId
  if (existsSync(typeFile)) {
    execSync(`node ${moveScript} ${typeFile} ${resourcesPath}types`, { stdio: 'inherit', shell: true });
  } else {
    console.warn(`⚠️ Types file not found: ${typeFile}`);
  }

  // Move datasources file and remove folder with spaceId
  if (existsSync(datasourcesFile)) {
    execSync(`node ${moveScript} ${datasourcesFile} ${resourcesPath}datasources`, { stdio: 'inherit', shell: true });
  } else {
    console.warn(`⚠️ Datasource file not found: ${datasourcesFile}`);
  }

  // TODO: determine correct filename and path to be able to move languages file and remove folder with spaceId
  // Move languages file and remove folder with spaceId
  // if (existsSync(datasourcesFile)) {
  //   execSync(`node ${moveScript} ${datasourcesFile} ${resourcesPath}types`, { stdio: 'inherit', shell: true });
  // } else {
  //   console.warn(`⚠️ Types file not found: ${datasourcesFile}`);
  // }

  console.log('✅ All files moved successfully. SpaceId folders removed successfully.');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
