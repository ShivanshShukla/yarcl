---
title: Generated CSS
description: The stylesheet the plugin generates from your config, and how to use its variables and classes.
sidebar:
  order: 9
---

The plugin serves a virtual stylesheet, `@yarcl/react/styles.css`, generated from your config at build time. Importing `@yarcl/react` loads it together with the library's own styles.

Components never set inline styles. They render class names, and all values come from CSS. That means:

- **no runtime cost**: nothing is computed in the browser
- **works with a strict Content Security Policy** that blocks inline styles
- **server rendering works** with no flash of unstyled content
- **editing the config hot-reloads** the stylesheet in the dev server

## Variables on `:root`

| Variable | From |
|---|---|
| `--yarcl-color-{key}`, `--yarcl-color-{key}-on`, `--yarcl-color-{key}-text` | `colors` |
| `--yarcl-neutral-{key}` | `neutrals` |
| `--yarcl-size-{key}-height`, `-padding-x`, `-font-size`, `-icon-size` | `sizes` |
| `--yarcl-radius-{key}` | `radii` |
| `--yarcl-space-{key}` | `spacing` |
| `--yarcl-shadow-{key}` | `shadows` |
| `--yarcl-font-family-{key}`, `--yarcl-font-{key}` | `typography.families` |
| `--yarcl-font-body`, `--yarcl-font-heading`, `--yarcl-font-mono` | `typography.fonts` |
| `--yarcl-modal-{key}` | `modalSizes` |
| `--yarcl-z-{key}` | `zIndex` |
| `--yarcl-motion-{key}` | `motion` |
| `--yarcl-border-{key}` | `borders` |
| `--yarcl-focus-width`, `-offset`, `-color`, `-style` | `focusRing` |
| `--yarcl-accent`, `--yarcl-error`, `--yarcl-floating-shadow`, `--yarcl-padding`, `--yarcl-gap` | `defaults` |
| `--yarcl-h`, `--yarcl-px`, `--yarcl-fs`, `--yarcl-icon`, `--yarcl-r` | default size and radius |

Colors are emitted as `light-dark(light, dark)`, and `:root` gets `color-scheme: light dark`.

## Modifier classes

One class per key, shared by every component:

| Class | Sets |
|---|---|
| `yarcl-color-{key}` | `--yarcl-c`, `--yarcl-c-on`, `--yarcl-c-text` |
| `yarcl-size-{key}` | `--yarcl-h`, `--yarcl-px`, `--yarcl-fs`, `--yarcl-icon` |
| `yarcl-radius-{key}` | `--yarcl-r` |
| `yarcl-variant-{key}` | `--yarcl-v-bg`, `--yarcl-v-bg-hover`, `--yarcl-v-bg-active`, `--yarcl-v-border`, `--yarcl-v-fg` |
| `yarcl-gap-{key}`, `yarcl-padding-{key}` | `--yarcl-component-gap`, `--yarcl-component-padding` |
| `yarcl-shadow-{key}` | `box-shadow` |
| `yarcl-density-{key}` | table cell padding and font size |
| `yarcl-modal-size-{key}` | `--yarcl-modal-width` |
| `yarcl-type-{key}` | font family, size, weight, line height, letter spacing |

A button renders like this:

```html
<button class="yarcl-button yarcl-size-md yarcl-radius-md yarcl-color-primary yarcl-variant-solid">
```

The generated file grows with the number of token keys and configured component size overrides.

`components.<Name>.sizeOverrides` emits scoped rules after the shared size classes. Only the overridden variables are repeated, so the remaining fields continue to inherit from the global size:

```css
.yarcl-sized-Button.yarcl-size-md {
  --yarcl-px: 1.25rem;
}
```

## Using tokens in your own CSS

```css
.sidebar {
  width: 16rem;
  padding: var(--yarcl-space-md);
  background: var(--yarcl-neutral-surface);
  border-right: var(--yarcl-border-width) solid var(--yarcl-neutral-border);
}

.page-title {
  color: var(--yarcl-accent);
  font-family: var(--yarcl-font-heading);
}
```

Use stable role variables for application semantics. Key variables such as `--yarcl-font-family-serif` are available when a style intentionally targets one config key.

Or reuse the modifier classes on your own elements, for example `class="yarcl-type-caption"`.

## Overriding a component

Component classes are plain, unscoped classes with low specificity. Override them with your own class:

```css
.checkout .yarcl-button {
  --yarcl-h: 3.5rem;
}
```

## Naming

Class names are `yarcl-{component}`, `yarcl-{component}-{element}` and `yarcl-{group}-{key}`. Because modifiers include the group name, a size called `sm` and a radius called `sm` never collide. Keys can contain any character except whitespace; the plugin escapes them in selectors.
