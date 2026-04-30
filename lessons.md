## Sidebar arrow-only toggle (2026-04-29)

The sidebar uses Docusaurus's `DocSidebarItem/Category`. The `>` chevron previously visible was a CSS `::before` pseudo-element on `.menu__link--sublist` — purely decorative; clicking the row text triggered the toggle.

To make only the chevron clickable:
1. Swizzle `src/theme/DocSidebarItem/Category/index.tsx` and always render the upstream `<CollapseButton>` (`.clean-btn.menu__caret`) before the link. Its `onClick` calls `updateCollapsed()`. The link's `onClick` only navigates (when `href`) or `preventDefault`s (when not).
2. CSS: hide the legacy `::before` arrows on `.menu__link--sublist`/`.menu__list-item-collapsible > .menu__link`, then style `.menu__list-item-collapsible > .menu__caret` as the new chevron with rotation on `[aria-expanded="true"]`.
3. Infima ships its own rotations on `.menu__caret::before` (`rotate(180deg)` default and `rotateZ(90deg)` under `.menu__list-item--collapsed`). Reset both with `transform: none !important;` on the base rule, then apply `transform: rotate(90deg)` only on `[aria-expanded="true"]`.
4. Per-item `collapsible: false` in `sidebars-*.ts` makes a category non-collapsible (no chevron rendered, `useCollapsible` returns always-expanded). Removing the override defaults to `collapsible: true`.
