import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env

const spaceId = process.env.STORYBLOK_SPACE_ID;
if (!spaceId) {
  console.error('Error: STORYBLOK_SPACE_ID is not set in .env');
  process.exit(1);
}

const resourcesPath = `./src/lib/storyblok/resources/`;

try {
  console.log('Pulling Storyblok components...');
  execSync(`storyblok components --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  console.log('Pulling Storyblok TypeScript types...');
  execSync(`storyblok types --space ${spaceId} --path ${resourcesPath} generate`, { stdio: 'inherit' });

  console.log('Pulling Storyblok datasources...');
  execSync(`storyblok datasources --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  console.log('Pulling Storyblok languages...');
  execSync(`storyblok languages --space ${spaceId} --path ${resourcesPath} pull`, { stdio: 'inherit' });

  console.log('✅ Types generated successfully!');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
