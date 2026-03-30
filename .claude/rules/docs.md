---
globs: ["docs/**/*.md", "docs/**/*.mdx", "blog/**/*.md"]
---

- Use MDX for pages needing interactive components; plain Markdown for simple content.
- Always include frontmatter with at least `title` and `sidebar_position`.
- Use Mermaid code blocks for diagrams (theme plugin is configured).
- Use Docusaurus admonitions (`:::note`, `:::tip`, `:::warning`, `:::danger`) for callouts.
- Links between docs must be relative paths, not absolute URLs.
- Code examples must be complete and runnable — no pseudo-code in tutorials.
- Images go in `static/img/` and are referenced as `/img/filename.png`.
- When adding a new doc page, update the relevant sidebar file (`sidebars.ts` or `sidebarsYellowSdk.ts`).
