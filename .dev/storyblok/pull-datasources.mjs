import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

import { ensureStoryblokCliLoggedIn } from './helpers/ensure-storyblok-login.mjs';

dotenv.config(); // Loads .env

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

const resourcesPath = `./src/lib/storyblok/resources/`;
const moveScript = './.dev/storyblok/helpers/move-files.mjs';
const datasourcesFile = `${resourcesPath}datasources/${spaceId}/datasources.json`;

try {
  console.log('Pulling Storyblok datasources...');

  execSync(`storyblok datasources --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  if (!existsSync(datasourcesFile)) {
    throw new Error(
      [
        `Datasources output file not found: ${datasourcesFile}`,
        'This usually means the Storyblok CLI could not fetch data (even if it printed "Pull complete").',
        'Try: pnpm sb:login (ensure correct region), then rerun: pnpm sb:pull-datasources',
      ].join('\n')
    );
  }

  // Move datasources file and remove folder with spaceId
  if (existsSync(datasourcesFile)) {
    execSync(`node ${moveScript} ${datasourcesFile} ${resourcesPath}datasources`, { stdio: 'inherit', shell: true });
  } else {
    console.warn(`⚠️ Datasource file not found: ${datasourcesFile}`);
  }

  console.log('✅ Datasources resources successfully!');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
