---
title: The config file
description: Every group in yarcl.config.ts, open and required keys, extending the defaults, and what defineConfig checks.
sidebar:
  order: 1
---

Your config file default-exports the result of `defineConfig`. It's plain data: no functions, no theme objects, no CSS.

```ts title="src/yarcl.config.ts"
import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';

export default defineConfig({
  ...defaults,
  colors: {
    brand: { light: '#2d4bb8', dark: '#8aa2ff' },
    danger: { light: '#dc2626', dark: '#f87171' },
  },
  defaults: { ...defaults.defaults, color: 'brand', errorColor: 'danger' },
});
```

## Groups

| Group | Keys | Controls | Guide |
|---|---|---|---|
| `colors` | open | the `color` prop | [Colors and theming](/configuration/colors-and-theming/) |
| `neutrals` | `bg`, `surface`, `text`, `muted`, `border` + any | backgrounds, text, borders | [Colors and theming](/configuration/colors-and-theming/) |
| `sizes` | open | the `size` prop: height, padding, font and icon size | [Sizes and radii](/configuration/sizes-and-radii/) |
| `radii` | open | the `radius` prop | [Sizes and radii](/configuration/sizes-and-radii/) |
| `variants` | open | the `variant` prop | [Variants](/configuration/variants/) |
| `spacing` | open | `gap`, `padding` | [Spacing, shadows, density](/configuration/spacing-shadows-density/) |
| `shadows` | open | `shadow`, floating panels | [Spacing, shadows, density](/configuration/spacing-shadows-density/) |
| `density` | open | `Table` density | [Spacing, shadows, density](/configuration/spacing-shadows-density/) |
| `modalSizes` | open | `Dialog` and `Drawer` width | [Sizes and radii](/configuration/sizes-and-radii/#modal-sizes) |
| `typography` | `fontFaces`, `families`, `styles` (open), `headings` | `Text`, `Heading`, labels | [Typography](/configuration/typography/) |
| `zIndex` | `dropdown`, `tooltip`, `dialog`, `toast` + any | stacking of floating layers | [Motion, layers and focus](/configuration/motion-layers-focus/) |
| `motion` | `fast`, `base`, `easing` + any | transitions | [Motion, layers and focus](/configuration/motion-layers-focus/) |
| `borders` | `width` + any | border width | [Motion, layers and focus](/configuration/motion-layers-focus/) |
| `focusRing` | `width`, `offset`, `color` | keyboard focus outline | [Motion, layers and focus](/configuration/motion-layers-focus/) |
| `components` | component names | per-component defaults and sizing | [Defaults](/configuration/component-defaults/) |
| `defaults` | fixed | values used when a prop is omitted | [Defaults](/configuration/component-defaults/) |

**Open groups** take any keys you like. Those keys become the only valid values of the matching prop.

**Groups with required keys** (`neutrals`, `zIndex`, `motion`, `borders`) must contain the keys the library relies on, and accept any extra keys. Extras are emitted as CSS variables for your own styles, for example `zIndex: { ...defaults.zIndex, banner: 900 }` gives you `--yarcl-z-banner`.

## Extending instead of replacing

`@yarcl/react/defaults` exports the library's default config. Spread it and override what you need; spread a group to add keys to it:

```ts
export default defineConfig({
  ...defaults,
  colors: { ...defaults.colors, brand: { light: '#2d4bb8', dark: '#8aa2ff' } },
  zIndex: { ...defaults.zIndex, banner: 900 },
});
```

Replacing a group removes the library's keys. That's intended: if your design system has no `info` color, `color="info"` should be a type error.

## What `defineConfig` checks

At compile time:

- every color has both a `light` and a `dark` value
- every `defaults` entry, `focusRing.color`, each `typography.headings` level and each text style's `family` points at a key that exists
- `components` only names known components, sets supported options, and uses existing keys; size restrictions are non-empty and contain the resolved default
- required keys are present
- no key contains whitespace

At build and dev time, the plugin also warns when a color's text color fails WCAG AA contrast. See [colors and theming](/configuration/colors-and-theming/#contrast-warnings).

## No config file

If the file the plugin points at doesn't exist, the library defaults are used for both the types and the styles. You can start without a config and add one later.
