const fs = require('fs');
const path = require('path');

const targetVersion = process.argv[2];

if (!targetVersion) {
    console.error('Usage: npm run version:reset <target_single_version>');
    console.error('Example: npm run version:reset 0.5.x');
    process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const versionsJsonPath = path.join(rootDir, 'versions.json');
const versionedDocsPath = path.join(rootDir, 'versioned_docs');
const versionedSidebarsPath = path.join(rootDir, 'versioned_sidebars');
const packageJsonPath = path.join(rootDir, 'package.json');

console.log(`WARNING: This will delete ALL historical versions and reset the project to single version '${targetVersion}'.`);

// 1. Delete versioned folders
if (fs.existsSync(versionedDocsPath)) {
    fs.rmSync(versionedDocsPath, { recursive: true, force: true });
    console.log('Removed versioned_docs/');
}

if (fs.existsSync(versionedSidebarsPath)) {
    fs.rmSync(versionedSidebarsPath, { recursive: true, force: true });
    console.log('Removed versioned_sidebars/');
}

// 2. Delete versions.json
if (fs.existsSync(versionsJsonPath)) {
    fs.rmSync(versionsJsonPath);
    console.log('Removed versions.json');
}

// 3. Update package.json version
if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    pkg.version = targetVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
    console.log(`Updated package.json version to ${targetVersion}`);
}

console.log('---------------------------------------------------');
console.log(`Reset Complete. The project is now single-version: ${targetVersion}`);
console.log('The "Next" version in the dropdown will now show this version.');
console.log('');
console.log('IMPORTANT: You must manually update docusaurus.config.ts to disable default versioning');
console.log('configuration (comment out "lastVersion", "versions", etc.) until you serve a new version.');
