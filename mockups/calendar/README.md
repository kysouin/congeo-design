# Ατζέντα (calendar.congeo.cy): εγκεκριμένα σχέδια οθονών

These are the screens George approved on 8 Nov 2026. Each one comes as a PNG
render (390×844 @2x; Desktop 1280×820 @2x) and its HTML source.

## The screens

| file | screen |
|---|---|
| `Main` | Σήμερα: summary line, quick add, «Καθυστερούν», «Η μέρα» with the now-line, «Χωρίς ώρα» |
| `Timeline` | the day at scale: hour grid, proportional blocks, now-line, filter pills, a row mid-swipe («Έγινε» / «Αύριο») |
| `QuickLive` | quick add in dark mode: tokens coloured as you type (project, date, duration), a live preview, then «Προσθήκη» |
| `Proposal` | the AI proposal card: purple, dashed, «ΠΡΟΤΑΣΗ» |
| `EditTask` | the edit sheet for a task |
| `Project` | one project's agenda |
| `Week` | the week |
| `Desktop` | wide layout |
| `Home`, `ProjectHub` | the future CONGEO hub app; **not** calendar screens, kept here for the shared language |

## Rules for using them

- **Values come from `tokens/`, not from these files.** Where a mockup and a
  token differ, the token wins. Two have already changed: `ink-3` is
  `#646E78` and light `warn` is `#9A5A0A`, for contrast.
- The mockups are fixed pictures of the design, not code to copy. Build with
  the `cg-` components.
- Screens with no mockup (month, a day away from today, the date picker,
  completed tasks, the offline bar and «Δεν στάλθηκαν», Ρυθμίσεις) follow the
  same language, built from the same components.
