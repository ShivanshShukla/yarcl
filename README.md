# yarcl

A React component library where **the consumer's config is the design system**.

The library ships mechanisms. Your config file makes the decisions: which colors, sizes, radii, variants, spacing, text styles and densities exist. Every key you define is at the same time

- a **valid prop value**: `<Button size="talla-xl" />` compiles only if `talla-xl` is in your config, and
- a **rendered style**: the plugin generates CSS for it at build time.

No codegen, no module augmentation, no provider. One file.

```ts
// src/yarcl.config.ts
import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';

export default defineConfig({
  ...defaults,
  colors: {
    ink: { light: '#1c1917', dark: '#f5f5f4' },
    clay: { light: '#a4441f', dark: '#f0a07a' },
  },
  sizes: {
    'talla-s': { height: '2.25rem', paddingX: '0.875rem', fontSize: '0.75rem', iconSize: '0.875rem' },
    'talla-m': { height: '2.75rem', paddingX: '1.25rem', fontSize: '0.8125rem', iconSize: '1rem' },
  },
  defaults: { ...defaults.defaults, size: 'talla-m', color: 'ink' },
});
```

```tsx
<Button size="talla-m" color="clay" />  // ✓
<Button size="md" />                    // ✗ Type '"md"' is not assignable to type '"talla-s" | "talla-m"'
```

## How it works

1. **`as const` + `keyof typeof`**: `defineConfig` keeps literal types, and the library derives `Size`, `Color`, `Variant`, … from them.
2. **A module alias**: the library imports `@yarcl/config`. The Vite plugin points it at your config file at runtime, and a matching `paths` entry in your `tsconfig.json` does the same for types. If your file doesn't exist, both fall back to the library defaults.
3. **Build-time CSS**: the plugin loads your config and serves `virtual:yarcl.css`: CSS variables on `:root` plus one `yarcl-{group}-{key}` class per key. Components only set class names; no inline styles, nothing computed at runtime. Editing the config hot-reloads the CSS.

Why an alias instead of module augmentation or codegen: see [ADR 0001](docs/decisions/0001-config-delivery.md).

## Setup

From an existing Vite React project:

```sh
npx @yarcl/react init
```

This installs the package, connects Vite and TypeScript to the same config, and creates `src/yarcl.config.ts`. For manual setup:

```sh
npm install @yarcl/react
```

```ts
// vite.config.ts
import react from '@vitejs/plugin-react';
import { yarcl } from '@yarcl/react/plugin';

export default defineConfig({ plugins: [react(), yarcl({ config: 'src/yarcl.config.ts' })] });
```

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@yarcl/config": ["./src/yarcl.config.ts", "./node_modules/@yarcl/react/dist/yarcl.config.d.ts"]
    }
  }
}
```

## What the config controls

| Group | Keys | Used by |
|---|---|---|
| `colors` | open, `{ light, dark, on? }` → `light-dark()` | `color` prop everywhere |
| `neutrals` | `bg`, `surface`, `text`, `muted`, `border` + any | surfaces, text, borders |
| `sizes` | open, `{ height, paddingX, fontSize, iconSize }` | every control; same size = same height |
| `radii` | open; conventionally `sm`, `md`, `lg`, `xl` plus exceptions (`square`, `rounded`) | `radius` prop; `defaults.radius` (e.g. `md`) applies to every component |
| `variants` | open recipes: `background` / `border` / `text` | `variant` prop (Button, Badge, Alert, …) |
| `spacing` | open | `gap`, `padding` |
| `shadows` | open | `shadow` prop, floating panels |
| `density` | open, `{ paddingX, paddingY, fontSize }` | `Table` |
| `modalSizes` | open, widths | `Dialog` and `Drawer` `size` |
| `typography` | `fontFaces`, `families`, `styles` (open), `headings` h1–h6 | `Text`, `Heading`, labels |
| `zIndex`, `motion`, `borders` | required keys + any | layering, transitions |
| `focusRing`, `defaults` | references to keys above | focus outline, omitted props |
| `components` | per-component defaults, e.g. `{ Button: { radius: 'square' } }` | omitted props, before `defaults` |

A prop resolves as: the prop → an enclosing group (`ButtonGroup`, `RadioGroup`, `ToggleGroup`) → `components.<Name>` → `defaults`.

```ts
radii: { square: '0', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', rounded: '9999px' },
defaults: { radius: 'md', … },                   // every component: md corners
components: { Button: { radius: 'square' } },   // except buttons: always sharp
```

`defineConfig` checks at compile time that every color has both modes, that references (`defaults`, `components`, `headings`, `focusRing.color`, text style families) point at existing keys, that `components` only names known components and props they have, and that required keys exist. The plugin warns when a color's foreground fails WCAG AA contrast.

## Components

**Controls**: Button, IconButton, ButtonGroup, ToggleGroup, Input, NumberInput, Textarea, Checkbox, Radio, RadioGroup, Switch, Slider, Select, Combobox, DatePicker, Field, Label
**Typography & layout**: Text, Heading, Link, Stack, Inline, Card, Divider
**Floating**: Tooltip, HoverCard, Popover, Menu
**Overlays**: Dialog, Drawer, CommandPalette, Toast
**Data & navigation**: Avatar, AvatarGroup, Tabs, Accordion, Table, Pagination, Breadcrumb
**Feedback**: Badge, Alert, Spinner, Skeleton, Progress
**Reference**: `DesignReference` from `@yarcl/react/reference` renders your whole design system from your config.

## Themes

`@yarcl/react/themes` ships four themes that share the library defaults' keys, so they're interchangeable: **Brutalist**, **Bloom**, **Compact** and **Editorial**.

```ts title="src/yarcl.config.ts"
export { editorial as default } from '@yarcl/react/themes';
```

`@yarcl/react/css` exports `generateCss`, the plugin's generator, for switching themes at runtime. The docs include a theme playground: a full dashboard you can re-theme live.

## Repository

| Path | What |
|---|---|
| `library/` | the `@yarcl/react` package: components, `defineConfig`, Vite plugin, CSS generator |
| `consumer/` | demo app with one design system; every component, light and dark |
| `docs-web/` | documentation site (Astro + Starlight) with live examples and a config playground |
| `e2e/` | browser tests; `e2e/consumer/` is a fixture app with completely different keys ("Maison Talla"), proving the types come from each app's own config |
| `docs/decisions/` | architecture decision records |

```sh
pnpm install
pnpm dev          # consumer on :5173
pnpm typecheck    # library + both consumers, including @ts-expect-error contract checks
pnpm size         # gzip budgets per package entry and typical component imports
pnpm test         # Vitest browser mode in headless Chrome: behavior, styling and axe audits, light and dark
pnpm docs:dev     # documentation site on :4321
pnpm docs:build   # static docs site → docs-web/dist
pnpm docs:api     # API reference from JSDoc → docs/api
```

## Limitations

- **Vite only.** The alias works the same way in webpack, Rollup, esbuild and Turbopack; adapters aren't written yet.
- **One config per build.** Two brands in one bundle would need a Provider for the runtime values.
- **Types are a development-time guarantee.** Keep config changes and deploys in the same build.
