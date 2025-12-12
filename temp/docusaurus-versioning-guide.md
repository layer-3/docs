# Docusaurus Version Switcher Implementation Guide
## Comprehensive Research for Yellow Network Documentation

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Industry Standard Approaches](#industry-standard-approaches)
3. [Folder Structure for Versioning](#folder-structure-for-versioning)
4. [Implementation Steps](#implementation-steps)
5. [Configuration Examples](#configuration-examples)
6. [Matching Your Figma Wireframe](#matching-your-figma-wireframe)
7. [Recommended Approach for Yellow Network](#recommended-approach)
8. [Migration Strategy: 0.5.0 → 0.6.0](#migration-strategy)

---

## Executive Summary

Based on my research, Docusaurus provides built-in versioning capabilities that create a version dropdown in the navbar. The industry standard approach involves:

1. **`versions.json`** file - Lists all available versions
2. **`versioned_docs/`** folder - Contains frozen documentation for each version
3. **`versioned_sidebars/`** folder - Contains sidebar configs per version
4. **`docs/`** folder - Always contains the "current" (next/development) version

For your Yellow Network docs currently at v0.5.0, you'll want to set up versioning that allows users to switch between stable releases (like the wireframe shows with "v0.53").

---

## Industry Standard Approaches

### Approach 1: Standard Docusaurus Versioning (Recommended for most cases)

This is used by Facebook, Docusaurus itself, Jest, and many major projects.

**How it works:**
- `docs/` folder = "current" version (labeled "Next" by default)
- When you release, run `npm run docusaurus docs:version X.X.X`
- Creates `versioned_docs/version-X.X.X/` with a copy of all docs
- Creates `versioned_sidebars/version-X.X.X-sidebars.json`
- Updates `versions.json`

**Pros:**
- Simple to implement
- Built-in CLI commands
- Automatic version dropdown
- Page-aware version switching (stays on same page when switching versions)

**Cons:**
- Duplicates files (can bloat repo for large docs)
- Build times increase with each version

### Approach 2: Git Branch-Based Versioning (Used by Spectro Cloud)

**How it works:**
- Each version lives in a separate git branch
- CI/CD builds and deploys each branch separately
- Custom version switcher redirects between deployed sites

**Pros:**
- No file duplication in repo
- Cleaner git history
- Smaller repo size

**Cons:**
- More complex CI/CD setup
- Harder to maintain consistency across versions
- Requires custom version switcher implementation

### Approach 3: Hybrid - Version Labels Without Duplication (Used by Consensys)

**How it works:**
- Single `docs/` folder for the "current" stable version
- Configure `lastVersion: 'current'` to avoid "Next" label
- Version label configured in `docusaurus.config.js`

**Pros:**
- Simpler structure
- No file duplication
- Good for projects where older versions aren't maintained

**Cons:**
- Only practical if you don't need to maintain multiple versions simultaneously

---

## Folder Structure for Versioning

### Standard Versioned Site Structure

```
yellow-docs/
├── docs/                              # Current (development/next) version
│   ├── learn/
│   │   └── introduction.md
│   ├── build/
│   │   └── getting-started.md
│   ├── manuals/
│   │   └── protocol-guide.md
│   ├── tutorials/
│   │   └── quickstart.md
│   └── api-reference/
│       └── nitrolite-api.md
│
├── versioned_docs/                    # Frozen versions
│   ├── version-0.5.0/
│   │   ├── learn/
│   │   ├── build/
│   │   ├── manuals/
│   │   ├── tutorials/
│   │   └── api-reference/
│   │
│   └── version-0.4.0/                 # (if maintaining older versions)
│       ├── learn/
│       └── ...
│
├── versioned_sidebars/                # Sidebar configs per version
│   ├── version-0.5.0-sidebars.json
│   └── version-0.4.0-sidebars.json
│
├── versions.json                      # List of versions ["0.5.0", "0.4.0"]
├── sidebars.js                        # Sidebar for current version
├── docusaurus.config.js               # Main configuration
└── package.json
```

### versions.json Format

```json
[
  "0.5.0",
  "0.4.0"
]
```

Note: Versions are ordered from newest to oldest. The first version is considered the "latest" stable version.

---

## Implementation Steps

### Step 1: Add Version Dropdown to Navbar

In `docusaurus.config.js`, add the `docsVersionDropdown` item to your navbar:

```javascript
module.exports = {
  themeConfig: {
    navbar: {
      // Your existing logo config
      logo: {
        alt: 'Yellow Network',
        src: 'img/yellow-logo.svg',
      },
      items: [
        // Existing items...
        {
          type: 'docsVersionDropdown',
          position: 'left',  // Position as shown in your Figma (top-left under logo)
          dropdownActiveClassDisabled: true,
          // Optional: Add "All versions" link
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: 'All versions',
            },
          ],
        },
        // Other navbar items...
      ],
    },
  },
};
```

### Step 2: Configure Docs Plugin with Versioning

```javascript
module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Enable editing
          editUrl: 'https://github.com/layer-3/docs/tree/master/',
          
          // Versioning configuration
          lastVersion: '0.5.0',  // This will be the default/latest version
          
          // Optional: Don't show "current" (development) version publicly
          includeCurrentVersion: true,  // Set to false to hide development docs
          
          versions: {
            current: {
              label: '0.6.0-dev',  // Label for unreleased/development version
              path: 'next',        // URL path: /docs/next/
              banner: 'unreleased', // Show "unreleased" banner
            },
            '0.5.0': {
              label: 'v0.5.0',     // Displayed in dropdown
              path: '',            // Default path: /docs/
              banner: 'none',      // No banner for stable
            },
            // Add more versions as needed
          },
        },
      },
    ],
  ],
};
```

### Step 3: Create Your First Version

When you're ready to release v0.5.0:

```bash
# This creates versioned_docs/version-0.5.0/ and updates versions.json
npm run docusaurus docs:version 0.5.0
```

### Step 4: Prepare for Next Version (0.6.0)

After running the version command:
- `docs/` folder now represents v0.6.0 (development)
- `versioned_docs/version-0.5.0/` contains the frozen v0.5.0 docs
- Continue working on `docs/` for v0.6.0 features

---

## Configuration Examples

### Complete docusaurus.config.js Example

```javascript
const config = {
  title: 'Yellow Network',
  tagline: 'Decentralized Clearing Network',
  url: 'https://docs.yellow.org',
  baseUrl: '/',
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/layer-3/docs/tree/master/',
          routeBasePath: '/',  // Docs at root URL
          
          // Versioning
          lastVersion: '0.5.0',
          includeCurrentVersion: true,
          onlyIncludeVersions: ['current', '0.5.0'],  // Limit versions for faster builds
          
          versions: {
            current: {
              label: 'v0.6.0 (dev)',
              path: 'next',
              banner: 'unreleased',
              badge: true,
            },
            '0.5.0': {
              label: 'v0.5.0',
              path: '',
              banner: 'none',
              badge: false,
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Yellow Network',
        src: 'img/yellow-logo.svg',
      },
      items: [
        // Version dropdown - matches your Figma wireframe placement
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
        },
        // Main navigation items
        {
          type: 'docSidebar',
          sidebarId: 'learnSidebar',
          position: 'left',
          label: 'Learn',
        },
        {
          type: 'docSidebar',
          sidebarId: 'buildSidebar',
          position: 'left',
          label: 'Build',
        },
        {
          type: 'docSidebar',
          sidebarId: 'manualsSidebar',
          position: 'left',
          label: 'Manuals',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialsSidebar',
          position: 'left',
          label: 'Tutorials',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        // GitHub link
        {
          href: 'https://github.com/layer-3/docs',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    
    // Optional: Version announcement bar
    announcementBar: {
      id: 'version_announcement',
      content: '📢 v0.5.0 is now available! <a href="/changelog">See what\'s new</a>',
      backgroundColor: '#FFEC00',  // Yellow Network brand color
      textColor: '#000',
      isCloseable: true,
    },
  },
};

module.exports = config;
```

---

## Matching Your Figma Wireframe

Based on the wireframe you provided, here's how to achieve the exact look:

### Sidebar Layout (Left Panel)
```
┌─────────────────────────────┐
│  yellow.                    │  ← Logo
├─────────────────────────────┤
│  🐙 v0.53 ▼                 │  ← GitHub icon + Version dropdown
├─────────────────────────────┤
│  Learn                      │
│  Build                      │
│  Manuals                    │
│  Tutorials                  │
│  API Reference              │
│  Legacy                     │
└─────────────────────────────┘
```

### Custom Sidebar Component for Version Switcher

To get the exact layout from your Figma (GitHub icon + version dropdown in sidebar), create a custom sidebar component:

```jsx
// src/theme/DocSidebar/index.js (swizzle the sidebar)
import React from 'react';
import OriginalSidebar from '@theme-original/DocSidebar';
import {
  useVersions,
  useActiveVersion,
} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

function VersionSwitcher() {
  const versions = useVersions();
  const activeVersion = useActiveVersion();
  
  return (
    <div className={styles.versionSwitcher}>
      <a 
        href="https://github.com/layer-3/docs" 
        target="_blank" 
        className={styles.githubLink}
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path 
            fill="currentColor" 
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
      </a>
      <select 
        value={activeVersion?.name || 'current'}
        onChange={(e) => {
          const version = versions.find(v => v.name === e.target.value);
          if (version) {
            window.location.href = version.path + '/';
          }
        }}
        className={styles.versionSelect}
      >
        {versions.map((version) => (
          <option key={version.name} value={version.name}>
            v{version.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function DocSidebarWrapper(props) {
  return (
    <>
      <VersionSwitcher />
      <OriginalSidebar {...props} />
    </>
  );
}
```

### Custom CSS for Sidebar Version Switcher

```css
/* src/theme/DocSidebar/styles.module.css */

.versionSwitcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  margin-bottom: 8px;
}

.githubLink {
  display: flex;
  align-items: center;
  color: var(--ifm-color-emphasis-700);
  transition: color 0.2s;
}

.githubLink:hover {
  color: var(--ifm-color-primary);
}

.versionSelect {
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  color: var(--ifm-font-color-base);
}

.versionSelect:hover {
  border-color: var(--ifm-color-primary);
}

.versionSelect:focus {
  outline: none;
  border-color: var(--ifm-color-primary);
  box-shadow: 0 0 0 2px var(--ifm-color-primary-light);
}
```

---

## Recommended Approach for Yellow Network

Given your requirements (current v0.5.0, preparing for v0.6.0), I recommend:

### 1. **Use Standard Docusaurus Versioning**
- It's well-documented and widely used
- Perfect for your 2-3 version use case
- Built-in CLI support

### 2. **Version Strategy**
```
docs/                    → v0.6.0 (development/next)
versioned_docs/v0.5.0/   → v0.5.0 (current stable)
```

### 3. **Hide Development Version Initially**
- Set `includeCurrentVersion: false` until v0.6.0 is ready
- Or label it as "dev" and show an "unreleased" banner

### 4. **Keep Versions Limited**
- Docusaurus recommends <10 versions
- For a new project, maintain only 2-3 versions max
- Archive older versions to static deployments if needed

---

## Migration Strategy: 0.5.0 → 0.6.0

### Phase 1: Setup Versioning (Do Now)

```bash
# 1. Install any missing dependencies
npm install

# 2. Create your first version snapshot
npm run docusaurus docs:version 0.5.0

# 3. Verify structure
ls -la
# Should see: versions.json, versioned_docs/, versioned_sidebars/
```

### Phase 2: Configure (Do Now)

Update `docusaurus.config.js`:
```javascript
// Set current stable as default
lastVersion: '0.5.0',
versions: {
  current: {
    label: 'v0.6.0-dev',
    path: 'next',
    banner: 'unreleased',
  },
  '0.5.0': {
    label: 'v0.5.0',
    path: '',  // default path
  },
},
```

### Phase 3: Development (Ongoing)

- Continue all v0.6.0 work in `docs/` folder
- Any v0.5.0 hotfixes go in `versioned_docs/version-0.5.0/`
- Build locally to verify both versions work

### Phase 4: Release v0.6.0 (When Ready)

```bash
# 1. Freeze current docs as v0.6.0
npm run docusaurus docs:version 0.6.0

# 2. Update config to make v0.6.0 the new default
# Change lastVersion: '0.6.0'

# 3. Optionally remove older versions if no longer needed
# Delete from versions.json and remove folder
```

---

## Quick Reference: CLI Commands

```bash
# Create a new version
npm run docusaurus docs:version <VERSION>

# Example: Create v0.5.0
npm run docusaurus docs:version 0.5.0

# Build to verify all versions
npm run build

# Start dev server with all versions
npm run start

# Clear cache if issues arise
npm run docusaurus clear
```

---

## Key Configuration Options Summary

| Option | Purpose | Example |
|--------|---------|---------|
| `lastVersion` | Default version shown | `'0.5.0'` |
| `includeCurrentVersion` | Show dev version | `true/false` |
| `onlyIncludeVersions` | Limit versions built | `['current', '0.5.0']` |
| `versions.X.label` | Display name | `'v0.5.0'` |
| `versions.X.path` | URL path | `''` (root) or `'0.5.0'` |
| `versions.X.banner` | Warning banner | `'none'`, `'unreleased'`, `'unmaintained'` |
| `versions.X.badge` | Show version badge | `true/false` |

---

## References

- [Docusaurus Official Versioning Guide](https://docusaurus.io/docs/versioning)
- [Docusaurus Theme Configuration](https://docusaurus.io/docs/api/themes/configuration)
- [Consensys Docs Versioning Guide](https://docs-template.consensys.io/configure/versioning)
- [Spectro Cloud Git-based Versioning](https://www.spectrocloud.com/blog/when-docs-and-a-dinosaur-git-along-enabling-versioning-in-docusaurus)
- [Docusaurus Tutorial - Manage Versions](https://tutorial.docusaurus.io/docs/tutorial-extras/manage-docs-versions/)
