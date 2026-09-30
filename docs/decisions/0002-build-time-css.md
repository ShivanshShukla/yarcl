# ADR 0002: Generate plain CSS from the config at build time

- Status: accepted
- Date: 2026-09-23

## Context

Every config value (a size's height, a color pair, a radius) has to reach the browser as a style. The consumer's keys are unknown when the library is written, so the library can't ship a finished stylesheet.

## Options

- **Inline styles** computed per render from the config.
- **Tailwind** in the library, with the config mapped to a Tailwind theme.
- **CSS-in-JS** at runtime.
- **Generated plain CSS**: the plugin turns the config into CSS variables and classes at build time.

## Decision

Generate plain CSS. The build plugin loads the config and serves `generateCss(config)` as `@yarcl/react/styles.css`: `:root` variables plus one modifier class per key. Static component styles live in `styles.css` and only read those variables.

- No inline styles, so it's CSP-safe and components carry no style logic.
- SSR-safe with no flash, since the CSS exists before any JS runs.
- Tokens are plain CSS variables, usable in the consumer's own CSS.
- The consumer isn't forced to adopt Tailwind or a CSS-in-JS runtime.
- Config edits hot-reload by invalidating the virtual module.

## Consequences

- Units: rem for sizes and type, px only for borders and focus rings.
- Color modes use `light-dark()` with `:root { color-scheme: light dark }`, so dark mode needs no JS.
- The same `generateCss` runs in the browser for runtime themes (ADR 0006).

## When to revisit

- Consumers want Tailwind utilities for their tokens: generate an optional `@theme` block alongside, not instead.
