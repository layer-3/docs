const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const versionToFreeze = process.argv[2];
const nextDevVersion = process.argv[3];

if (!versionToFreeze || !nextDevVersion) {
    console.error('Usage: npm run version:release <version_to_freeze> <next_dev_version>');
    console.error('Example: npm run version:release 0.5.x 0.6.x');
    process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Validation: Ensure the current project version matches the version being frozen.
// This prevents mistakes like being on 0.5.x but trying to freeze 0.6.x (skipping a version).
if (pkg.version !== versionToFreeze) {
    console.error(`Error: Version mismatch.`);
    console.error(`You are trying to freeze/release "${versionToFreeze}", but the current project version (in package.json) is "${pkg.version}".`);
    console.error(`Please update package.json to "${versionToFreeze}" first, or check your release arguments.`);
    process.exit(1);
}

try {
    // 1. Snapshot the current docs as the frozen version
    console.log(`Freezing current docs as ${versionToFreeze}...`);
    execSync(`npm run docusaurus docs:version ${versionToFreeze}`, { stdio: 'inherit' });

    // 2. Bump package.json to the new dev version
    console.log(`Creating next version ${nextDevVersion} (updating package.json)...`);

    // Update the version in the already loaded pkg object
    pkg.version = nextDevVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));

    // 3. Automate docusaurus.config.ts update to avoid "Duplicate routes" warnings
    const configPath = path.join(rootDir, 'docusaurus.config.ts');
    if (fs.existsSync(configPath)) {
        let configContent = fs.readFileSync(configPath, 'utf8');

        // We want to insert the new version config BEFORE the closing brace of the versions object.
        // Look for the 'current' block's closing brace, then comma, then insert.
        // Or simpler: Look for "current: {" block, find its closing "},", and append after it.

        // This snippet formats the entry for the frozen version
        const newVersionEntry = `
            '${versionToFreeze}': {
              label: '${versionToFreeze}',
              path: '${versionToFreeze}',
              banner: 'none',
            },`;

        // Regex to find the end of the 'current' block inside 'versions'
        // Pattern: inside versions { ... current: { ... }, <INSERT HERE> }
        // We look for the closing brace of 'current' followed by comma
        const currentVersionEndRegex = /(current:\s*{[\s\S]*?},)/;

        if (currentVersionEndRegex.test(configContent)) {
            // Check if already exists to avoid duplication
            if (!configContent.includes(`'${versionToFreeze}': {`)) {
                const newContent = configContent.replace(currentVersionEndRegex, `$1${newVersionEntry}`);
                fs.writeFileSync(configPath, newContent, 'utf8');
                console.log(`Updated docusaurus.config.ts: Added configuration for version '${versionToFreeze}'.`);
            }
        } else {
            console.warn('Warning: Could not auto-update docusaurus.config.ts. Please verify versions config.');
        }
    }

    console.log('---------------------------------------------------');
    console.log(`Release Complete!`);
    console.log(`- Frozen Version: ${versionToFreeze} (saved in versioned_docs/)`);
    console.log(`- Created Next Version: ${nextDevVersion} (active in docs/)`);
    console.log(`- Configuration: Auto-updated docusaurus.config.ts`);

} catch (error) {
    console.error('Release failed:', error.message);
    process.exit(1);
}
