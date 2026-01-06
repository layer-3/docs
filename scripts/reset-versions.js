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

// Helper to update docusaurus.config.ts
const configPath = path.join(rootDir, 'docusaurus.config.ts');
if (fs.existsSync(configPath)) {
    try {
        let configContent = fs.readFileSync(configPath, 'utf8');

        // Regex to match the versions object and replace it with the single-version default
        // Matches "versions: { ... }" including nested braces for current version
        // This regex assumes standard formatting as seen in the file
        const versionsRegex = /versions:\s*{[\s\S]*?},\s*},/m;

        const cleanVersionsBlock = `versions: {
            current: {
              label: require('./package.json').version,
              path: '', // Root path (docs/)
              banner: 'none',
            },
          },`;

        if (versionsRegex.test(configContent)) {
            const newContent = configContent.replace(versionsRegex, cleanVersionsBlock);
            fs.writeFileSync(configPath, newContent, 'utf8');
            console.log(`Updated docusaurus.config.ts: Reset "versions" configuration.`);
        } else {
            console.warn('Warning: Could not auto-update docusaurus.config.ts (regex match failed). Please check manually.');
        }
    } catch (err) {
        console.warn(`Warning: Failed to update docusaurus.config.ts: ${err.message}`);
    }
}

console.log('---------------------------------------------------');
console.log(`Reset Complete. The project is now single-version: ${targetVersion}`);
console.log(`The "Next" version in the dropdown will now show this version.`);
console.log(`docusaurus.config.ts has been automatically updated.`);
