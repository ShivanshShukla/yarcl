---
title: Introduction
description: What yarcl is, the problem it solves, and how it works.
sidebar:
  order: 1
---

yarcl is a React component library where **your config file is the design system**. The library ships the mechanisms: buttons, inputs, dialogs, menus, tables. Your config makes the decisions: which colors, sizes, radii, variants, spacing, text styles and densities exist.

Every key you define is, at the same time:

- **a valid prop value**: `<Button size="talla-xl" />` compiles only if `talla-xl` is in your config, and
- **a rendered style**: the build generates the CSS for it.

```ts
// src/yarcl.config.ts
export default defineConfig({
  ...defaults,
  sizes: {
    'talla-s': { height: '2.25rem', paddingX: '0.875rem', fontSize: '0.75rem', iconSize: '0.875rem' },
    'talla-m': { height: '2.75rem', paddingX: '1.25rem', fontSize: '0.8125rem', iconSize: '1rem' },
  },
  defaults: { ...defaults.defaults, size: 'talla-m' },
});
```

```tsx
<Button size="talla-m" />  // ✓ renders at 2.75rem
<Button size="md" />       // ✗ Type '"md"' is not assignable to type '"talla-s" | "talla-m"'
```

## The problem

Most component libraries define the contract. They decide that buttons come in `sm`, `md` and `lg`, and you conform. When your design system has different sizes, you either live with the library's choices, pass free-form strings and lose type safety, or maintain a second list of types by hand that drifts from the real values.

The same happens with colors, variants and spacing. Each is a **configuration contract**: code that assumes a key exists, with nothing enforcing that it does.

## How yarcl inverts it

yarcl lets the consumer own the contract. The library derives its API from your config, using three things you already have:

1. **`as const` generics.** `defineConfig` keeps your config's literal types, so `keyof` your `sizes` is `"talla-s" | "talla-m"`, not `string`.
2. **A module alias.** The library imports `@yarcl/config`. A build plugin points that import at your config file at runtime, and a `paths` entry in your `tsconfig.json` does the same for types. There's no codegen and no module augmentation.
3. **Build-time CSS.** The plugin reads your config and generates CSS variables and one class per key. Components only set class names; nothing is computed at runtime.

The result: adding a key to your config makes it a valid, rendered option everywhere, and removing one turns every stale usage into a compile error.

## What you get

- **More than 30 components**: buttons, form controls, a combobox, menus, dialogs, drawers, toasts, tabs, tables and more. All are accessible and keyboard-friendly.
- **Light and dark mode** from one file, with contrast checks at build time.
- **One size scale** shared by every control, so a button and an input of the same size always line up.
- **Per-component defaults**, e.g. make every button square without touching call sites.
- **A living design reference** generated from your config.

## Next steps

- [Install yarcl](/getting-started/installation/) and connect your config.
- Follow the [quick start](/getting-started/quick-start/) to build a small form.
- Read [the config file](/configuration/config-file/) for everything the config controls.
