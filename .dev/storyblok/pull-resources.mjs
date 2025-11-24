import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config();

const spaceId = process.env.STORYBLOK_SPACE_ID;
if (!spaceId) {
  console.error('Error: STORYBLOK_SPACE_ID is not set in .env');
  process.exit(1);
}

const generatedPath = './src/lib/storyblok/generated/';
const moveScript = './.dev/storyblok/helpers/move-files.mjs';

const componentFiles = [
  `${generatedPath}components/${spaceId}/components.json`,
  `${generatedPath}components/${spaceId}/groups.json`,
  `${generatedPath}components/${spaceId}/presets.json`,
];
const typeFile = `${generatedPath}types/${spaceId}/storyblok-components.d.ts`;
const datasourcesFile = `${generatedPath}datasources/${spaceId}/datasources.json`;
// const languagesFile = `${generatedPath}languages/${spaceId}/languages.json`; // TODO: determine correct filename and path

try {
  console.log('Pulling Storyblok components...');
  execSync(`storyblok components --space ${spaceId} --path ${generatedPath} pull`, { stdio: 'inherit' });

  console.log('Pulling Storyblok types...');
  execSync(`storyblok types --space ${spaceId} --path ${generatedPath} generate`, { stdio: 'inherit' });

  console.log('Pulling Storyblok datasources...');
  execSync(`storyblok datasources --space ${spaceId} --path ${generatedPath} pull`, { stdio: 'inherit' });

  console.log('Pulling Storyblok languages...');
  execSync(`storyblok languages --space ${spaceId} --path ${generatedPath} pull`, { stdio: 'inherit' });

  console.log('✅ Pull complete. Moving files...');

  // Move component files and remove folder with spaceId
  componentFiles.forEach((file) => {
    if (existsSync(file)) {
      execSync(`node ${moveScript} ${file} ${generatedPath}components`, { stdio: 'inherit', shell: true });
    } else {
      console.warn(`⚠️ Component file not found: ${file}`);
    }
  });

  // Move types file and remove folder with spaceId
  if (existsSync(typeFile)) {
    execSync(`node ${moveScript} ${typeFile} ${generatedPath}types`, { stdio: 'inherit', shell: true });
  } else {
    console.warn(`⚠️ Types file not found: ${typeFile}`);
  }

  // Move datasources file and remove folder with spaceId
  if (existsSync(datasourcesFile)) {
    execSync(`node ${moveScript} ${datasourcesFile} ${generatedPath}types`, { stdio: 'inherit', shell: true });
  } else {
    console.warn(`⚠️ Datasource file not found: ${datasourcesFile}`);
  }

  // TODO: determine correct filename and path to be able to move languages file and remove folder with spaceId
  // Move languages file and remove folder with spaceId
  // if (existsSync(datasourcesFile)) {
  //   execSync(`node ${moveScript} ${datasourcesFile} ${generatedPath}types`, { stdio: 'inherit', shell: true });
  // } else {
  //   console.warn(`⚠️ Types file not found: ${datasourcesFile}`);
  // }

  console.log('✅ All files moved successfully. SpaceId folders removed successfully.');
} catch (error) {
  console.error('❌ Error executing commands:', error.message);
  process.exit(1);
}
