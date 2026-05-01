# Yellow Network Documentation Site

Docusaurus 3.9.2 documentation site for Yellow Network / Nitrolite protocol.

## Quick Reference

| Command | What it does |
|---------|-------------|
| `npm start` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run serve` | Serve production build locally |
| `npm run typecheck` | TypeScript type check |
| `npm run sync:contracts` | Sync contract docs from nitrolite repo |
| `npm run version:release` | Create a new versioned snapshot |
| `npm run version:remove` | Remove a version |

## Site Configuration

- **Config:** `docusaurus.config.ts` — site metadata, plugins, theme config
- **Sidebars:** `sidebars.ts` (main) + `sidebarsYellowSdk.ts` (SDK section)
- **Tailwind:** `tailwind.config.js`, `postcss.config.js`
- **TypeScript:** `tsconfig.json`
- **URL:** https://docs.yellow.org

## Documentation Structure

| Path | Content |
|------|---------|
| `docs/learn/` | Conceptual explainers (architecture, state channels, clearing) |
| `docs/guides/` | How-to guides (integration, setup) |
| `docs/tutorials/` | Step-by-step walkthroughs |
| `docs/api-reference/` | SDK and contract API reference |
| `docs/protocol/` | Protocol specification |
| `docs/build/` | Builder guides |

## Versioning

- Versioned docs live in `versioned_docs/` and `versioned_sidebars/`
- `versions.json` tracks released versions
- Scripts in `scripts/` manage version lifecycle

## Content Conventions

- Use **MDX** for interactive content, plain **Markdown** for simple pages
- Always include frontmatter: `title`, `sidebar_position` (minimum)
- Diagrams: use Mermaid (theme plugin included)
- Admonitions: `:::note`, `:::tip`, `:::warning`, `:::danger`
- Code blocks must be complete and runnable
- Use relative links between docs (not absolute URLs)
- Images go in `static/img/`

## Search

- Primary: Algolia DocSearch
- Fallback: Lunr (local, `docusaurus-lunr-search`)

## Key Files

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Site config, plugins, navbar, footer |
| `sidebars.ts` | Main sidebar structure |
| `sidebarsYellowSdk.ts` | SDK docs sidebar |
| `src/pages/` | Custom pages (landing, whitepaper) |
| `src/css/custom.css` | Global style overrides |
| `scripts/sync-contracts-docs.js` | Syncs Solidity NatSpec to docs |

## Git

- Default branch: `master`
- PR target: `master`
- Commit style: `docs|feat|fix(scope): message`
