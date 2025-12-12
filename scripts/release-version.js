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

    console.log('---------------------------------------------------');
    console.log(`Release Complete!`);
    console.log(`- Frozen Version: ${versionToFreeze} (saved in versioned_docs/)`);
    console.log(`- Created Next Version: ${nextDevVersion} (active in docs/)`);

} catch (error) {
    console.error('Release failed:', error.message);
    process.exit(1);
}
