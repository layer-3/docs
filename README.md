# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Site Architecture

This site hosts two product docs as separate sub-sites under one Docusaurus instance:

- **`/nitrolite/*`** — State channel SDK docs (versioned 1.x / 0.5.x)
- **`/clearnet/*`** — Decentralized clearing protocol docs (unversioned)
- **`/`** — Portal landing page linking to both sub-sites

Source layout:

- `docs/nitrolite/` — Nitrolite content (managed by the preset's docs plugin)
- `docs/clearnet/` — Clearnet content (managed by a second `@docusaurus/plugin-content-docs` instance, id: `clearnet`)
- `sidebars-nitrolite.ts` / `sidebars-clearnet.ts` — sidebar configs per sub-site
- `src/theme/Navbar/Content/` — swizzled component that filters top-navbar items by current path (via `customProps.showOn`)

### Known Limitations

- **Search**: lunr-search uses a single index across both sub-sites. A query from `/nitrolite/...` may surface Clearnet results and vice versa. To scope search per sub-site, replace lunr-search with Algolia (separate indices) or a custom search component.
- **Versioned docs links**: `versioned_docs/version-0.5.x/` is a historical snapshot and still contains `/docs/...` links from when the site lived under that path. Those links break under the new `/nitrolite/0.5.x/...` routing. Either rewrite versioned content links or accept them as archived.
