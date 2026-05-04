# Codex Instructions for yellow-docs

- For Docusaurus changes, run `npm run typecheck` and `npm run build`.
- After build, run a local Docusaurus server with `npm run serve -- --host 127.0.0.1 --port <free-port>` and fetch each changed public route with `curl -fsS -L`.
- For navigation or versioning changes, fetch both current and versioned routes and confirm the expected links, labels, and version switch targets appear in the returned HTML.
- Internal Docusaurus doc links should be extensionless. Do not add `.md` or `.mdx` suffixes to Markdown links unless linking to a raw file intentionally.
- For Nitrolite protocol docs, keep content language-agnostic and source-bound to `/Users/maharshimishra/Documents/nitrolite/docs/protocol`.
