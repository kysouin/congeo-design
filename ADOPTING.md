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

## Γλώσσα / Language

Every tool except PermitFlow: English by default, Greek one tap away, one shared choice (see README, «Γλώσσα»). The steps, after the look has moved to tokens:

1. **Wrap the strings in `L()`.** `import { L, t } from '@congeo/design/i18n'`. English first, Greek second, next to the use: `L('Save changes', 'Αποθήκευση αλλαγών')`. Use `t('save')`, `t('cancel')`, … for the common words. Leave alone: data contracts («Έργο: 0637 · …», «Πηγή:», `appProperties`, `extendedProperties`), Drive folder names, and anything a document prints (that goes through `inLang(docLang, …)`). A Greek-first app (congeo-pdf: `L('Ελληνικά', 'English')`) swaps the argument order; a Greek-only app (calendar, invoicing) writes the English now, in British English, with the glossary open. Input that reads free text keeps accepting both languages.
2. **Use the formatters.** Replace local date, time, money and plural code with `fmtDate`, `fmtTime`, `fmtRange`, `fmtRelative`, `fmtMoney`, `num`, `plural`, `verb`. Genitive months in dates, nominative in month headings, 24-hour times, `Europe/Nicosia`.
3. **Add the switch to Settings.** `<LanguageSwitch />` from `@congeo/design/react` («EN | ΕΛ»). Put `dist/i18n/boot.inline.js` inline in `<head>` before the stylesheets, so `<html lang>` is right before the first paint. Expo apps call `setLang`/`useLang` the same way; the cookie is a web concern and localStorage-like storage is used there (see `configureLang`). PermitFlow: `configureLang({ fixed: 'el' })` and no switch.
4. **Turn on `--i18n`.** `congeo-design-lint src app --i18n` in `npm test`. A finding is Greek the user sees outside `L()`. Allow a file only with a reason and a date.
5. **Take screenshots in both languages.** The same screens as the design migration, English and Greek, light and dark, into `docs/design-migration/after-en/` and `after-el/`. Check: no Greeklish, no accent left on uppercase captions, dates and money as in the README table, the switch in Settings, and that a document already made did not change language.

## From v1.1 to v1.2

v1.2 brings into the package what calendar built for itself after v1.0. An app on v1.1 changes the tag and then:

1. **Replace the app's own date and time fields** with `DateField` and `TimeField` from `@congeo/design/react` (ΗΗ/ΜΜ/ΕΕΕΕ and 24-hour ΩΩ:ΛΛ whatever the device locale, ISO values, pickers, errors through `L()`). For calendar: delete `src/components/Fields.tsx` (`DateField`, `TimeField`, `SelectField`) and `src/components/DatePicker.tsx`, and the `parseDate` / `parseTime` / `showDate` / `monthGrid` helpers now in `@congeo/design/i18n`. The `.datefield`, `.select-wrap`, `.picker-*` and `.mgrid` rules for the picker go too.
2. **Replace the app's own select** with `Select` (native, Input chrome, Lucide chevron, label, error, disabled).
3. **Drop the app's sheet gesture.** `Sheet` now closes on a drag down past 25 % of its height or a fast flick, on Escape and on the backdrop, traps focus and returns it. Pass `title` and `closeButton`; remove the app's own pointer handlers, `.sheet-drag` and the panel head (`headExtra` takes anything else the head needs). For calendar: the gesture in `Panel` (`src/components/Common.tsx`).
4. **Drop the status override.** `StatusBar state="ok"` exists, with `count`, auto-hide after 4 s (`persist` to keep it) and `onHide`. For calendar: the `.cg-statusbar.ok` rule and the `sentNotice` branch that reused `offline`.
5. **ProposalCard**: the order is now Reject (secondary) left, Approve (primary) right. Remove any CSS that reordered the buttons.
6. **TitleBlock**: pass `extra` cells (e.g. «NEXT» / «ΕΠΟΜΕΝΟ») or `cells` for full control, 4 to 6 in all; the number is always first. Remove any extra cell the app added by hand.
7. **Pages served before the bundle** (sign-in, server errors): inline `INLINE_CSS` from `@congeo/design/inline` in the Worker or Pages Function and delete the hand-copied values. For calendar: `functions/_lib/gate.ts`.
8. **SwipeRow**: `onDone` / `onLater` are the names now (`onSwipeRight` / `onSwipeLeft` still work).
9. **Textarea**: `onSubmit` replaces the app's own Enter handler.
10. Run `congeo-design-lint src --i18n`, the app's tests, and take the before/after screenshots.

## Report (end of the app's prompt)

1. The list of files changed and the number of lint findings before and after (after must be 0, or every allowed file named with its reason).
2. The before/after screenshots.
3. Anything from the app that had no token (a colour, a component) and what was done with it: mapped to the nearest token, or proposed as a new token in congeo-design (open an issue there; do not add a local value).
4. What was NOT checked.
5. For the language step: the count of `L()` calls added, any string you could not translate with the glossary (marked for George), and the two sets of screenshots.
