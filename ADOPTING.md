# Adopting @congeo/design in an app

These are the steps every app follows, one app at a time, in its own repo. They are also the shape of the per-app prompts. Start with calendar.

Before you start, take **before** screenshots of the main screens (320 and 390 px, light and dark if the app has dark) and keep them in `docs/design-migration/before/`.

## 1. Add the dependency

```json
"dependencies": {
  "@congeo/design": "github:kysouin/congeo-design#v1.0.0"
}
```

`npm install`. No token is needed; the repo is public. Nothing is built on install.

For Expo / React Native, the same dependency works through Metro. For native Swift parts, add `node_modules/@congeo/design/dist/Tokens.swift` to the Xcode target (a copy step in the build phase, or a symlink).

## 2. Import the CSS

In the app's entry file, before any app CSS:

```js
import '@congeo/design/fonts.css';
import '@congeo/design/congeo.css';
```

Then:

- set `lang="el"` on `<html>`;
- remove every other font loading: Google Fonts `<link>`, `@font-face`, `@import url(...)`, Commissioner, system stacks in CSS;
- remove the app's own reset / normalize if it fights the base layer (body, links, focus ring, selection are in `congeo.css`);
- if the app has dark mode by class, switch it to `data-theme="dark"` on `<html>`; if it has none, it now has one for free through `prefers-color-scheme`.

Tailwind apps (Kaneto): add `presets: [require('@congeo/design/tailwind')]` and delete the local `theme.colors`, `fontFamily`, `borderRadius`, `boxShadow` overrides.

## 3. Replace local colours with tokens

Run the lint once to get the list:

```sh
npx congeo-design-lint src --json > design-lint.json
npx congeo-design-lint src
```

Then, file by file:

| was | becomes |
|---|---|
| page background | `var(--cg-bg)` |
| card / sheet / input background | `var(--cg-surface)`, nested: `var(--cg-surface-2)` |
| borders, dividers | `var(--cg-line)`, softer: `var(--cg-line-soft)`, stronger: `var(--cg-line-strong)` |
| body text | `var(--cg-ink)` |
| secondary text | `var(--cg-ink-2)`; tertiary / placeholders: `var(--cg-ink-3)` |
| brand blue as a fill | `var(--cg-primary)` with `var(--cg-on-primary)` text; never white text on it |
| links | `var(--cg-link)` / `var(--cg-link-hover)` |
| project numbers | `.cg-chip`, or `var(--cg-project-text)` + `.cg-mono` |
| success / warning / error | `var(--cg-ok)` / `var(--cg-warn)` / `var(--cg-err)`, with `-tint` for backgrounds |
| proposals | `var(--cg-proposal)` / `var(--cg-proposal-tint)`, or `<ProposalCard>` |
| calendar event blocks | `var(--cg-event-tint)` / `var(--cg-on-event-tint)` |
| the tool's own colour | `var(--cg-tool-<id>)`, `-tint`, `-on-tint`, or `data-tool="<id>"` + `var(--cg-tool)` |
| shadows | `var(--cg-shadow-card)` / `raised` / `primary` / `sheet` |
| radii | `var(--cg-radius-chip|row|card|card-lg|sheet|pill)` |
| spacing | `var(--cg-space-1..8)` (4 · 8 · 12 · 16 · 20 · 24 · 32) |
| font sizes | `var(--cg-size-12..30)` with `var(--cg-line-*)`; caps: `.cg-cap`; mono numbers: `.cg-mono` |
| transitions | `var(--cg-dur-fast|base|slow) var(--cg-ease)` |

Replace local buttons, rows, chips, pills, segmented controls, sheets, toasts and inputs with the `cg-*` classes or the React components from `@congeo/design/react`. Keep the app's own layout; change only the look.

A value that cannot move yet (a third-party widget, a legacy page) is allowed explicitly and visibly:

```json
"congeoDesignLint": { "allow": ["src/legacy/**"] }
```

and gets a line in the app's CHANGELOG saying when it goes.

## 4. Add `congeo-design-lint` to `npm test`

```json
"scripts": {
  "lint:design": "congeo-design-lint src app",
  "test": "npm run lint:design && <the existing tests>"
}
```

CI must run `npm test`. From now on a hard-coded colour or font fails the build.

## 5. Take before/after screenshots

Same screens, same widths, same themes as in step 0, into `docs/design-migration/after/`. Put both sets side by side in the PR description. Check at 320 px that nothing scrolls sideways and that every touch target is at least 44 px.

## Report (end of the app's prompt)

1. The list of files changed and the number of lint findings before and after (after must be 0, or every allowed file named with its reason).
2. The before/after screenshots.
3. Anything from the app that had no token (a colour, a component) and what was done with it: mapped to the nearest token, or proposed as a new token in congeo-design (open an issue there; do not add a local value).
4. What was NOT checked.
