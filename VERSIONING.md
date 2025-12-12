# Versioning Guide

This project uses Docusaurus versioning to manage documentation for different releases of the Yellow Network protocol and SDK.

## Structure

- **`docs/`**: functionality for the **upcoming/current** development version (labeled as "Next" or derived from `package.json`).
- **`versioned_docs/version-0.5.x/`**: Frozen documentation for the `0.5.x` stable release.

## Workflows

### 1. Releasing a New Version

When you are ready to release the current work, this process involves **freezing** the current version (e.g., `0.6.x`) and **creating** the next development version (e.g., `0.7.x`).

```bash
npm run version:release 0.6.x 0.7.x
```

This single command will:
1.  Snapshot `docs/` to `versioned_docs/version-0.6.x`.
2.  Update `package.json` version to `0.7.x` (which updates the "Next" dropdown label).

### 2. Updating an Old Version

To fix a typo or add a note to an old version (e.g., `0.5.x`):
- Edit the files in `versioned_docs/version-0.5.x/`.
- **Do not** edit files in `docs/` for old versions; `docs/` is always the *future* version.

### 3. Removing an Old Version

To remove an old version that is no longer supported (e.g., `0.5.x`):

```bash
npm run version:remove 0.5.x
```
This performs a safe, complete deletion of the version folder and config entry.

### 4. Resetting to Single Version

To delete ALL history and return to a single-version project (e.g., just `0.5.x`):

```bash
npm run version:reset 0.5.x
```
**Warning**: This deletes all `versioned_docs` folders. You will be left with only the current content in `docs/`, labeled as `0.5.x`.
