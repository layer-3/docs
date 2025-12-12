const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
    console.error('Please provide a version to remove. Usage: npm run version:remove <version>');
    process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const versionsJsonPath = path.join(rootDir, 'versions.json');
const versionedDocsPath = path.join(rootDir, 'versioned_docs', `version-${version}`);
const versionedSidebarsPath = path.join(rootDir, 'versioned_sidebars', `version-${version}-sidebars.json`);

console.log(`Removing version ${version}...`);

// 1. updates versions.json
if (fs.existsSync(versionsJsonPath)) {
    const versions = JSON.parse(fs.readFileSync(versionsJsonPath, 'utf8'));
    const newVersions = versions.filter(v => v !== version);
    fs.writeFileSync(versionsJsonPath, JSON.stringify(newVersions, null, 2));
    console.log(`Updated versions.json`);
} else {
    console.warn(`versions.json not found at ${versionsJsonPath}`);
}

// 2. Removes versioned_docs/version-<ver>
if (fs.existsSync(versionedDocsPath)) {
    fs.rmSync(versionedDocsPath, { recursive: true, force: true });
    console.log(`Removed ${versionedDocsPath}`);
} else {
    console.warn(`Versioned docs not found at ${versionedDocsPath}`);
}

// 3. Removes versioned_sidebars/version-<ver>-sidebars.json
if (fs.existsSync(versionedSidebarsPath)) {
    fs.rmSync(versionedSidebarsPath);
    console.log(`Removed ${versionedSidebarsPath}`);
} else {
    console.warn(`Versioned sidebar not found at ${versionedSidebarsPath}`);
}

console.log(`Successfully removed version ${version}.`);
