---
title: Switching themes
description: Keep themes interchangeable with a shared set of keys, then pick one at build time or switch at runtime.
sidebar:
  order: 2
---

## The theme contract

Two themes are interchangeable when they define the same keys. Your app references keys, so any theme with the same keys renders it.

The bundled themes all satisfy `ThemeContract`, the keys of the library defaults. Use it to check your own themes:

```ts
import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';
import type { ThemeContract } from '@yarcl/react/themes';

export const midnight = defineConfig({
  ...defaults,
  colors: { … },
  sizes: { … },
}) satisfies ThemeContract;
```

A missing key (say, no `lg` size) is a type error, so the theme can't silently break a screen that uses `size="lg"`. Extra keys are allowed.

For your own design system, define your own contract the same way: a type listing the keys your app uses.

## At build time

The simplest approach: one theme per build. Point the config file at the theme you want:

```ts title="src/yarcl.config.ts"
export { compact as default } from '@yarcl/react/themes';
```

To build the same app with several themes (white-label products, per-customer builds), keep one config file per theme and choose it with an environment variable in the plugin:

```ts title="vite.config.ts"
yarcl({ config: `src/themes/${process.env.THEME ?? 'default'}.ts` })
```

Remember the matching `paths` entry in `tsconfig.json`; with a shared contract, any of the theme files works for type-checking.

## At runtime

`applyTheme` from `@yarcl/react/css` switches the whole app to another theme without a rebuild:

```ts
import { applyTheme, resetTheme } from '@yarcl/react/css';
import { themes } from '@yarcl/react/themes';

applyTheme(themes.editorial);
// later
resetTheme(); // back to the build-time config
```

It does two things:

1. **Replaces the styles.** It runs `generateCss`, the same generator the build plugin uses at build time, and puts the result in a `<style>` element that overrides the build-time stylesheet. Dialogs, menus and toasts switch too.
2. **Switches the defaults.** Components read `defaults`, per-component `components` defaults and heading levels from the applied theme, and re-render. A theme with `components: { Button: { radius: 'rounded' } }` gets pill buttons, and one with `defaults: { density: 'compact' }` gets compact tables.

The theme must define the keys your app uses, because prop types still come from the build-time config. The bundled themes share the defaults' keys (the contract above), so any of them can replace another.

Pass `onWarning` to receive contrast warnings, and use `useConfig()` from `@yarcl/react` when your own components need the active theme's values:

```ts
applyTheme(theme, { onWarning: (message) => console.warn(message) });
```

This is how the [theme playground](/theming/playground/) and the demo on the home page work. `generateCss` is exported from `@yarcl/react/css` as well, if you only need the stylesheet.

## Light and dark

Every theme has light and dark values built in. The page follows the OS setting, and `color-scheme` switches it:

```ts
document.documentElement.style.colorScheme = 'dark';
```

## Theming a region

Everything is a CSS variable, so a region can override values without a new theme:

```css
.promo {
  --yarcl-color-primary: light-dark(#be185d, #f9a8d4);
  --yarcl-color-primary-on: #fff;
  --yarcl-focus-color: var(--yarcl-color-primary);
}
```
