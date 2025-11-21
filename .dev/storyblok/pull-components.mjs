import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env

const spaceId = process.env.STORYBLOK_SPACE_ID;
if (!spaceId) {
  console.error('Error: STORYBLOK_SPACE_ID is not set in .env');
  process.exit(1);
}

const resourcesPath = `./src/lib/storyblok/resources/`;
const moveScript = './.dev/storyblok/helpers/move-files.mjs';

try {
  console.log('Pulling Storyblok components...');
  execSync(`storyblok components --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });
  console.log('✅ Pull components complete. Moving files...');

  // Move files individually
  execSync(`node ${moveScript} ${resourcesPath}components/${spaceId}/components.json ${resourcesPath}components`, {
    stdio: 'inherit',
    shell: true,
  });
  execSync(`node ${moveScript} ${resourcesPath}components/${spaceId}/groups.json ${resourcesPath}components`, {
    stdio: 'inherit',
    shell: true,
  });
  execSync(`node ${moveScript} ${resourcesPath}components/${spaceId}/presets.json ${resourcesPath}components`, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('✅ Component files moved successfully. SpaceId folders removed successfully.');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
