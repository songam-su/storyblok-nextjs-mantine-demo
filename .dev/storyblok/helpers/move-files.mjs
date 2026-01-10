import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node move-files.mjs <sourceFilePath> <targetDirPath>');
  process.exit(1);
}

const [sourceFilePath, targetDirPath] = args;

// ✅ Validate source file
if (!existsSync(sourceFilePath)) {
  console.warn(`⚠️ Source file does not exist: ${sourceFilePath}. Skipping move.`);
  process.exit(0); // Exit gracefully without error
}

// ✅ Ensure target directory exists
if (!existsSync(targetDirPath)) {
  console.log(`Creating target directory: ${targetDirPath}`);
  mkdirSync(targetDirPath, { recursive: true });
}

// ✅ Compute new path
const fileName = path.basename(sourceFilePath);
const targetFilePath = path.join(targetDirPath, fileName);

// ✅ Move file safely
try {
  console.log(`Moving ${sourceFilePath} → ${targetFilePath}`);
  renameSync(sourceFilePath, targetFilePath);
  console.log('✅ File moved successfully.');
} catch (error) {
  console.error('❌ Error moving file:', error.message);
  process.exit(1);
}

// ✅ Attempt to delete the original folder if empty
const sourceFolder = path.dirname(sourceFilePath);
try {
  const remainingFiles = readdirSync(sourceFolder);
  if (remainingFiles.length === 0) {
    rmdirSync(sourceFolder);
    console.log(`🗑️ Removed empty folder: ${sourceFolder}`);
  } else {
    console.log(`⚠️ Folder not empty, skipping delete: ${sourceFolder}`);
  }
} catch (error) {
  console.warn(`⚠️ Could not remove folder: ${sourceFolder}. Reason: ${error.message}`);
}
