import { execSync } from 'child_process';
import dotenv from 'dotenv';

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

try {
  console.log('Pulling Storyblok languages...');
  execSync(`storyblok languages --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });
  console.log('✅ Languages resources successfully!');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
