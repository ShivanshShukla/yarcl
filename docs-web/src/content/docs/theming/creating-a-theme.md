---
title: Creating a theme
description: Re-theme yarcl by changing values in your config, step by step.
sidebar:
  order: 1
---

In yarcl, your config file *is* the theme. There's no theme object, provider or CSS override layer: you change values in `yarcl.config.ts`, and the build regenerates the styles.

A useful way to think about it:

- **Keys** are your design system's vocabulary: which sizes, colors, radii and variants exist. They're what your code references (`size="md"`, `color="danger"`).
- **Values** are the theme: what `md` measures, what `danger` looks like.

Re-theming means changing values. Keep the keys and nothing in your app needs to change.

## Start from something

Start from the library defaults or from one of the [bundled themes](/theming/bundled-themes/), and override what you need:

```ts title="src/yarcl.config.ts"
import { defineConfig } from '@yarcl/react/define';
import { editorial } from '@yarcl/react/themes';

export default defineConfig({
  ...editorial,
  colors: { ...editorial.colors, primary: { light: '#1e3a8a', dark: '#93c5fd' } },
});
```

## Step by step

Work from the largest effect to the smallest. After each step, open the [design reference](/configuration/design-reference/) or your app and look.

### 1. Brand color

`colors.primary` (or whichever key your app uses as its main color) changes every solid button, link, focus ring, selected tab and checked control at once. Give it a light and a dark value; the dark one is usually lighter and more saturated.

### 2. Neutrals

`neutrals` sets the page background, surfaces, text, muted text and borders. Warm grays, cool grays and pure grays change the feel more than the brand color does. Keep `text` on `surface` well above 4.5:1.

### 3. Shape

`radii` and `defaults.radius` decide whether the UI feels sharp, soft or playful. Per-component defaults let buttons differ from cards:

```ts
defaults: { radius: 'md' },
components: { Button: { radius: 'rounded' }, Card: { radius: 'lg' } },
```

### 4. Density

`sizes` sets control heights, padding and font sizes. A 32px `md` feels like a dense enterprise tool; 40px feels relaxed. `spacing`, `defaults.gap`, `defaults.padding` and `density` do the same for layout and tables.

### 5. Type

`typography.fontFaces`, `families`, stable `fonts` roles and `styles`, plus `headings` for the h1 to h6 scale and `defaults.labelStyle` for form labels.

### 6. Variants

`variants` decides what `solid`, `soft`, `outline` and `ghost` mean. For example, a gray bordered default button (common in enterprise UIs) is:

```ts
outline: { background: 'none', border: 'neutral', text: 'neutral' },
```

### 7. Depth and borders

`shadows`, `defaults.floatingShadow` and `borders.width`. Use `light-dark()` for shadow colors so they stay visible in dark mode.

### 8. Focus

`focusRing` sets the keyboard focus outline for every component: width, offset, color and style. A thick ring with no offset reads as bold; a thin inset ring reads as subtle.

## Check your work

- The build warns when a color's text doesn't reach 4.5:1, in light or dark mode.
- Colors drawn as text get a readable shade automatically.
- Switch your OS to dark mode, or set `color-scheme: dark` on `<html>`, and check both schemes.
- Try it live in the [theme playground](/theming/playground/).
