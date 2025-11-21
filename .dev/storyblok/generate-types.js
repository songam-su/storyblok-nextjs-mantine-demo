// scripts/generate-storyblok-types.js
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const sourcePath = './src/lib/storyblok/resources/components/288596360272599/components.json';
const targetDir = './src/lib/storyblok/resources/bloks/288596360272599';
const targetFile = path.join(targetDir, 'bloks.json');

// ✅ Ensure target directory exists
if (!existsSync(targetDir)) {
  console.log(`Creating target directory: ${targetDir}`);
  mkdirSync(targetDir, { recursive: true });
}

// ✅ Run storyblok-generate-ts
const cmd = `pnpm storyblok-generate-ts source=${sourcePath} target=${targetFile}`;
console.log(`Executing: ${cmd}`);

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
  console.log(`✅ Types generated successfully at ${targetFile}`);
} catch (error) {
  console.error('❌ Failed to generate Storyblok types:', error.message);
  process.exit(1);
}
