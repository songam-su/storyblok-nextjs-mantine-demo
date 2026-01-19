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

// Paths for components
const componentFiles = [
  `${resourcesPath}components/${spaceId}/components.json`,
  `${resourcesPath}components/${spaceId}/groups.json`,
  `${resourcesPath}components/${spaceId}/presets.json`,
];

try {
  console.log('Pulling Storyblok components...');
  execSync(`storyblok components --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  componentFiles.forEach((file) => {
    if (!existsSync(file)) {
      throw new Error(
        [
          `Components output file not found: ${file}`,
          'This usually means the Storyblok CLI could not fetch data (even if it printed "Pull complete").',
          'Try: pnpm sb:login (ensure correct region), then rerun: pnpm sb:pull-components',
        ].join('\n')
      );
    }
  });
  console.log('✅ Pull components complete. Moving files...');

  // Move component files and remove folder with spaceId
  componentFiles.forEach((file) => {
    if (existsSync(file)) {
      execSync(`node ${moveScript} ${file} ${resourcesPath}components`, { stdio: 'inherit', shell: true });
    } else {
      console.warn(`⚠️ Component file not found: ${file}`);
    }
  });

  console.log('✅ Component files moved successfully. SpaceId folders removed successfully.');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
