import { existsSync, mkdirSync, renameSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node move-files.mjs <sourceFilePath> <targetDirPath>');
  process.exit(1);
}

const [sourceFilePath, targetDirPath] = args;

// Validate source file
if (!existsSync(sourceFilePath)) {
  console.error(`❌ Source file does not exist: ${sourceFilePath}`);
  process.exit(1);
}

// Ensure target directory exists
if (!existsSync(targetDirPath)) {
  console.log(`Creating target directory: ${targetDirPath}`);
  mkdirSync(targetDirPath, { recursive: true });
}

// Compute new path
const fileName = path.basename(sourceFilePath);
const targetFilePath = path.join(targetDirPath, fileName);

// Move file
try {
  console.log(`Moving ${sourceFilePath} → ${targetFilePath}`);
  renameSync(sourceFilePath, targetFilePath);
  console.log('✅ File moved successfully.');
} catch (error) {
  console.error('❌ Error moving file:', error.message);
  process.exit(1);
}
