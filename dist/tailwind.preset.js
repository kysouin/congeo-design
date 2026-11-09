// Generated from tokens/tokens.json by scripts/build.js. Do not edit.
// Tailwind preset. Every colour is a CSS variable from congeo.css, so dark mode and [data-theme] work without a second palette.
// Usage: module.exports = { presets: [require("@congeo/design/tailwind")], content: [...] }
module.exports = {
  "darkMode": [
    "selector",
    "[data-theme=\"dark\"]"
  ],
  "theme": {
    "extend": {
      "colors": {
        "bg": "var(--cg-bg)",
        "surface": "var(--cg-surface)",
        "surface-2": "var(--cg-surface-2)",
        "stage": "var(--cg-stage)",
        "on-stage": "var(--cg-on-stage)",
        "line": "var(--cg-line)",
        "line-soft": "var(--cg-line-soft)",
        "line-strong": "var(--cg-line-strong)",
        "ink": "var(--cg-ink)",
        "ink-2": "var(--cg-ink-2)",
        "ink-3": "var(--cg-ink-3)",
        "primary": "var(--cg-primary)",
        "on-primary": "var(--cg-on-primary)",
        "link": "var(--cg-link)",
        "link-hover": "var(--cg-link-hover)",
        "project-text": "var(--cg-project-text)",
        "ok": "var(--cg-ok)",
        "warn": "var(--cg-warn)",
        "err": "var(--cg-err)",
        "proposal": "var(--cg-proposal)",
        "ok-tint": "var(--cg-ok-tint)",
        "warn-tint": "var(--cg-warn-tint)",
        "err-tint": "var(--cg-err-tint)",
        "proposal-tint": "var(--cg-proposal-tint)",
        "event-tint": "var(--cg-event-tint)",
        "on-event-tint": "var(--cg-on-event-tint)",
        "tool-kaneto": "var(--cg-tool-kaneto)",
        "tool-kaneto-tint": "var(--cg-tool-kaneto-tint)",
        "tool-kaneto-on-tint": "var(--cg-tool-kaneto-on-tint)",
        "tool-rhoi": "var(--cg-tool-rhoi)",
        "tool-rhoi-tint": "var(--cg-tool-rhoi-tint)",
        "tool-rhoi-on-tint": "var(--cg-tool-rhoi-on-tint)",
        "tool-trace": "var(--cg-tool-trace)",
        "tool-trace-tint": "var(--cg-tool-trace-tint)",
        "tool-trace-on-tint": "var(--cg-tool-trace-on-tint)",
        "tool-permitflow": "var(--cg-tool-permitflow)",
        "tool-permitflow-tint": "var(--cg-tool-permitflow-tint)",
        "tool-permitflow-on-tint": "var(--cg-tool-permitflow-on-tint)",
        "tool-internal": "var(--cg-tool-internal)",
        "tool-internal-tint": "var(--cg-tool-internal-tint)",
        "tool-internal-on-tint": "var(--cg-tool-internal-on-tint)",
        "scrim": "var(--cg-scrim)",
        "focus": "var(--cg-focus)"
      },
      "fontFamily": {
        "sans": [
          "var(--cg-font-sans)"
        ],
        "mono": [
          "var(--cg-font-mono)"
        ]
      },
      "fontSize": {
        "cg-12": [
          "var(--cg-size-12)",
          {
            "lineHeight": "var(--cg-line-12)"
          }
        ],
        "cg-13": [
          "var(--cg-size-13)",
          {
            "lineHeight": "var(--cg-line-13)"
          }
        ],
        "cg-14": [
          "var(--cg-size-14)",
          {
            "lineHeight": "var(--cg-line-14)"
          }
        ],
        "cg-15": [
          "var(--cg-size-15)",
          {
            "lineHeight": "var(--cg-line-15)"
          }
        ],
        "cg-17": [
          "var(--cg-size-17)",
          {
            "lineHeight": "var(--cg-line-17)"
          }
        ],
        "cg-20": [
          "var(--cg-size-20)",
          {
            "lineHeight": "var(--cg-line-20)"
          }
        ],
        "cg-24": [
          "var(--cg-size-24)",
          {
            "lineHeight": "var(--cg-line-24)"
          }
        ],
        "cg-30": [
          "var(--cg-size-30)",
          {
            "lineHeight": "var(--cg-line-30)"
          }
        ]
      },
      "spacing": {
        "cg-1": "var(--cg-space-1)",
        "cg-2": "var(--cg-space-2)",
        "cg-3": "var(--cg-space-3)",
        "cg-4": "var(--cg-space-4)",
        "cg-5": "var(--cg-space-5)",
        "cg-6": "var(--cg-space-6)",
        "cg-8": "var(--cg-space-8)"
      },
      "borderRadius": {
        "chip": "var(--cg-radius-chip)",
        "row": "var(--cg-radius-row)",
        "card": "var(--cg-radius-card)",
        "card-lg": "var(--cg-radius-card-lg)",
        "sheet": "var(--cg-radius-sheet)",
        "pill": "var(--cg-radius-pill)"
      },
      "boxShadow": {
        "card": "var(--cg-shadow-card)",
        "raised": "var(--cg-shadow-raised)",
        "primary": "var(--cg-shadow-primary)",
        "sheet": "var(--cg-shadow-sheet)"
      },
      "transitionDuration": {
        "fast": "var(--cg-dur-fast)",
        "base": "var(--cg-dur-base)",
        "slow": "var(--cg-dur-slow)"
      },
      "transitionTimingFunction": {
        "cg": "var(--cg-ease)"
      },
      "minHeight": {
        "touch": "var(--cg-touch)"
      },
      "minWidth": {
        "touch": "var(--cg-touch)"
      }
    }
  }
};
