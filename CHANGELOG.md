# Changelog

All notable changes to `@congeo/design`. Apps pin a tag; upgrade by changing the tag.

## v1.0.0 — 2026-11-08

First slice: the source only. No app changes.

### Added

- `tokens/tokens.json`: the single source of values. Light and dark colours, tool colours with tints (Kaneto, Rhoi, Trace, PermitFlow, internal), type (Inter, JetBrains Mono with `tnum`), spacing on a 4-point scale, radii, touch target, shadows, motion, icons, and the declared contrast pairs.
- Generated `dist/`: `congeo.css` (variables for light, dark and forced `[data-theme]`, base layer, `cg-` components), `fonts.css` (@fontsource imports only), `tokens.js` + `tokens.d.ts` (React Native / Expo), `Tokens.swift`, `tailwind.preset.js`, `react/` (compiled components with `.d.ts`).
- Components: Button (primary, secondary, ghost, danger; sm, md; round 44 px icon button), ProjectChip, ToolMark, Card, Row, CheckCircle, Segmented, FilterPill, TabBar, Sheet, TitleBlock, ProposalCard, Toast, StatusBar, Input, Textarea (grows), Skeleton, EmptyState, SwipeRow.
- `congeo-design-lint` bin: finds hex, `rgb()`/`hsl()`, named colours, Tailwind palette classes, `font-family` literals and Google Fonts links outside allowed files; exits 1 with `file:line:col`.
- Reference page `site/index.html` with every token, every component in light and dark, and the contrast table; screenshots at 320 / 390 / 1280 px.
- Checks in `npm test` and CI: contrast (WCAG AA on every declared pair), deterministic generation, lint fixtures, Playwright screenshots, rendered Greek uppercase without accents, and a proof that the contrast check can fail.

### Changed from the approved mockup values (contrast test decided)

- light `ink-3`: `#868E95` → `#646E78`. The original reached 3.04:1 on bg and 2.93:1 on surface-2; AA text needs 4.5. Now 4.75 / 5.19 / 4.58.
- light `warn`: `#A3610C` → `#9A5A0A`. The original was 4.50:1 on bg and 4.34:1 on surface-2. Now 5.00 / 5.47 / 4.82.
- dark tool colours were lifted so marks reach 3:1 on dark surfaces: Rhoi `#5E93E6`, Trace `#E07A45`, PermitFlow `#2DB5A8`, internal `#8A96A1`. Kaneto stays `#00AEEF`. Light tool colours are unchanged.

### Proposed (not in the mockups)

- light: `line-strong #CBD2D9`, `project-text #0071A4`, `ok-tint #E3F4EA`, `warn-tint #FBEEDB`, `err-tint #FCE8E6`, `proposal-tint #F3ECFA`, `scrim`, `focus`.
- dark: `line-soft #1A2833`, `link-hover #8EDBF8`, `warn #F0B957`, `err #FF8F86`, `ok-tint #11352A`, `warn-tint #3D2E12`, `err-tint #43201D`, `proposal-tint #2A1F3D`, `event-tint #123A4D`, `on-event-tint #BFE6F7`, tool tints and on-tints, `scrim`, `focus`.
- Tool tints: Kaneto `#DDF3FC`/`#1F4A5C`, Rhoi `#E6EEF9`/`#26406B`, Trace `#FBEAE0`/`#6E3210`, PermitFlow `#DDF3F0`/`#0B4F4A`, internal `#EEF1F4`/`#3A4752`.
