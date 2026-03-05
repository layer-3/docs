/**
 * Syncs smart-contract documentation from vendors/yellow/docs
 * into docs/contracts/ with Docusaurus-compatible frontmatter
 * and category metadata.
 *
 * Usage: node scripts/sync-contracts-docs.js
 *
 * Safe to re-run — it wipes docs/contracts/ and rebuilds from source.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'vendors', 'yellow', 'docs');
const DEST = path.join(ROOT, 'docs', 'contracts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  ensureDir(dir);
}

/**
 * Escape {word} patterns in prose lines so MDX doesn't interpret them as JSX.
 * Preserves code blocks (``` fenced) and inline code (`...`).
 */
function escapeCurlyBracesOutsideCode(text) {
  const lines = text.split('\n');
  let inCodeBlock = false;
  return lines.map(line => {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) return line;
    // Escape {word} outside of inline code spans
    return line.replace(/(`[^`]*`)|(\{[^}]+\})/g, (match, code, braces) => {
      if (code) return code; // preserve inline code
      return '\\' + braces.slice(0, -1) + '\\}';
    });
  }).join('\n');
}

/**
 * Strip existing frontmatter (--- delimited) or auto-generated comments,
 * then prepend Docusaurus frontmatter.
 */
function copyWithFrontmatter(srcFile, destFile, { title, description, sidebarPosition }) {
  let content = fs.readFileSync(srcFile, 'utf-8');

  // Strip existing frontmatter
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      content = content.slice(endIdx + 3).replace(/^\n/, '');
    }
  }

  // Strip auto-generated comments
  content = content.replace(/^<!-- AUTO-GENERATED.*?-->\n*/m, '');

  // Escape curly braces in prose so MDX doesn't treat them as JSX expressions.
  // Only escape {word} patterns outside of code blocks/fences.
  content = escapeCurlyBracesOutsideCode(content);

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `description: "${description}"`,
    `sidebar_position: ${sidebarPosition}`,
    `displayed_sidebar: contractsSidebar`,
    '---',
    '',
    '',
  ].join('\n');

  ensureDir(path.dirname(destFile));
  fs.writeFileSync(destFile, frontmatter + content);
}

/**
 * Write a Docusaurus _category_.json file.
 */
function writeCategory(dir, { label, position, link }) {
  ensureDir(dir);
  const data = {
    label,
    position,
    link: link || { type: 'generated-index' },
    collapsible: false,
    collapsed: false,
  };
  fs.writeFileSync(path.join(dir, '_category_.json'), JSON.stringify(data, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Document mapping
// ---------------------------------------------------------------------------

const DOCS = {
  // Top-level pages
  index: {
    src: 'what-is-yellow.md',
    title: 'Smart Contracts',
    description: 'Overview of Yellow Network smart contracts, governance, and on-chain infrastructure.',
    sidebarPosition: 1,
  },
  addresses: {
    src: 'operations/addresses.md',
    title: 'Deployed Addresses',
    description: 'Mainnet and testnet contract addresses for Yellow Network.',
    sidebarPosition: 2,
  },
  faq: {
    src: 'FAQ.md',
    title: 'FAQ',
    description: 'Frequently asked questions about Yellow Network smart contracts.',
    sidebarPosition: 7,
  },

  // Protocol
  'protocol/overview': {
    src: 'protocol/overview.md',
    title: 'Protocol Overview',
    description: 'Architecture, contracts, and how they fit together.',
    sidebarPosition: 1,
  },
  'protocol/governance': {
    src: 'protocol/governance.md',
    title: 'Governance',
    description: 'On-chain parameter administration via YellowGovernor.',
    sidebarPosition: 2,
  },
  'protocol/staking': {
    src: 'protocol/staking.md',
    title: 'Collateral & Staking',
    description: 'Lock/unlock state machine for NodeRegistry and AppRegistry.',
    sidebarPosition: 3,
  },
  'protocol/slashing': {
    src: 'protocol/slashing.md',
    title: 'Slashing',
    description: 'Adjudicator slashing and cooldown mechanism.',
    sidebarPosition: 4,
  },
  'protocol/treasury': {
    src: 'protocol/treasury.md',
    title: 'Treasury',
    description: 'Foundation asset management.',
    sidebarPosition: 5,
  },

  // Contract API Reference
  'api-reference/yellow-token': {
    src: 'contracts/Token.sol/contract.YellowToken.md',
    title: 'YellowToken',
    description: 'ERC-20 token with fixed 10B supply.',
    sidebarPosition: 1,
  },
  'api-reference/locker': {
    src: 'contracts/Locker.sol/abstract.Locker.md',
    title: 'Locker',
    description: 'Abstract lock/unlock/withdraw state machine.',
    sidebarPosition: 2,
  },
  'api-reference/node-registry': {
    src: 'contracts/NodeRegistry.sol/contract.NodeRegistry.md',
    title: 'NodeRegistry',
    description: 'Node operator registry with voting power.',
    sidebarPosition: 3,
  },
  'api-reference/app-registry': {
    src: 'contracts/AppRegistry.sol/contract.AppRegistry.md',
    title: 'AppRegistry',
    description: 'App builder registry with slashing.',
    sidebarPosition: 4,
  },
  'api-reference/yellow-governor': {
    src: 'contracts/Governor.sol/contract.YellowGovernor.md',
    title: 'YellowGovernor',
    description: 'OpenZeppelin Governor for protocol parameters.',
    sidebarPosition: 5,
  },
  'api-reference/treasury': {
    src: 'contracts/Treasury.sol/contract.Treasury.md',
    title: 'Treasury',
    description: 'Secure vault for Foundation assets.',
    sidebarPosition: 6,
  },
  'api-reference/faucet': {
    src: 'contracts/Faucet.sol/contract.Faucet.md',
    title: 'Faucet',
    description: 'Testnet token faucet.',
    sidebarPosition: 7,
  },
  'api-reference/interfaces/ilock': {
    src: 'contracts/interfaces/ILock.sol/interface.ILock.md',
    title: 'ILock',
    description: 'Lock/unlock/withdraw interface.',
    sidebarPosition: 1,
  },
  'api-reference/interfaces/islash': {
    src: 'contracts/interfaces/ISlash.sol/interface.ISlash.md',
    title: 'ISlash',
    description: 'Slashing interface.',
    sidebarPosition: 2,
  },

  // SDK
  'sdk/getting-started': {
    src: 'sdk/getting-started.md',
    title: 'Getting Started',
    description: 'Install, import, and use the contracts SDK.',
    sidebarPosition: 1,
  },
  'sdk/api-reference': {
    src: 'sdk/api-reference.md',
    title: 'SDK API Reference',
    description: 'All exports: ABIs, addresses, and types.',
    sidebarPosition: 2,
  },
  'sdk/examples': {
    src: 'sdk/examples.md',
    title: 'Examples',
    description: 'Code samples for viem, ethers.js, and wagmi.',
    sidebarPosition: 3,
  },

  // Integration
  'integration/deployment': {
    src: 'integration/deployment.md',
    title: 'Deployment',
    description: 'Deploying contracts and configuration.',
    sidebarPosition: 1,
  },
  'integration/events': {
    src: 'integration/events.md',
    title: 'Events',
    description: 'Contract events for real-time subscriptions.',
    sidebarPosition: 2,
  },
  'integration/ui-spec': {
    src: 'integration/ui-spec.md',
    title: 'UI Specification',
    description: 'Frontend implementation guide.',
    sidebarPosition: 3,
  },
};

// Category metadata
const CATEGORIES = [
  { dir: 'protocol', label: 'Protocol', position: 3 },
  { dir: 'api-reference', label: 'Contract API Reference', position: 4 },
  { dir: 'api-reference/interfaces', label: 'Interfaces', position: 8 },
  { dir: 'sdk', label: 'SDK', position: 5 },
  { dir: 'integration', label: 'Integration', position: 6 },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Validate source
  if (!fs.existsSync(SRC)) {
    console.error(`Error: vendor docs not found at ${SRC}`);
    console.error('Run: git submodule update --init --recursive');
    process.exit(1);
  }

  console.log('Syncing smart-contract docs from vendors/yellow/docs...\n');

  // Clean and recreate destination
  cleanDir(DEST);

  // Write category files
  for (const cat of CATEGORIES) {
    writeCategory(path.join(DEST, cat.dir), {
      label: cat.label,
      position: cat.position,
    });
  }

  // Copy and transform each document
  let count = 0;
  const missing = [];

  for (const [destSlug, meta] of Object.entries(DOCS)) {
    const srcFile = path.join(SRC, meta.src);
    const destFile = path.join(DEST, destSlug + '.md');

    if (!fs.existsSync(srcFile)) {
      missing.push(meta.src);
      continue;
    }

    copyWithFrontmatter(srcFile, destFile, meta);
    count++;
    console.log(`  copied  ${meta.src} -> contracts/${destSlug}.md`);
  }

  if (missing.length > 0) {
    console.warn(`\nWarning: ${missing.length} source file(s) not found:`);
    for (const m of missing) {
      console.warn(`  missing  ${m}`);
    }
  }

  console.log(`\nSynced ${count} docs into docs/contracts/`);
  console.log('\nStructure:');

  // Print tree
  function printTree(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
      // Directories first
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    entries.forEach((entry, i) => {
      const isLast = i === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const full = path.join(dir, entry.name);

      if (entry.name === '_category_.json') return; // skip noise

      console.log(`${prefix}${connector}${entry.name}`);
      if (entry.isDirectory()) {
        printTree(full, prefix + (isLast ? '    ' : '│   '));
      }
    });
  }

  console.log('docs/contracts/');
  printTree(DEST, '');
}

main();
