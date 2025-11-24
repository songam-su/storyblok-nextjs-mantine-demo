import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config(); // Loads .env

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
