---
title: Spacing, shadows and density
description: The spacing scale, shadows and table densities.
sidebar:
  order: 6
---

## Spacing

`spacing` is an open group used by `gap` on [`Stack`](/components/layout/stack/) and [`Inline`](/components/layout/inline/), and by `padding` on [`Card`](/components/layout/card/), [`Popover`](/components/overlays/popover/) and [`HoverCard`](/components/overlays/hover-card/). [`Alert`](/components/feedback/alert/), [`Tooltip`](/components/overlays/tooltip/) and [`Toast`](/components/overlays/toast/) also use it for their internal spacing. Their defaults live in `components`.

```ts
spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
```

Keys can be anything that suits your team: `tight` / `normal` / `loose`, or numbers like Tailwind's `'1'`, `'2'`, `'4'`.

- `defaults.gap`: the gap of `Stack` and `Inline`.
- `defaults.padding`: the padding of `Card`, `Popover`, `HoverCard`, and of dialog and drawer content.

Every step is a CSS variable, `--yarcl-space-{key}`.

## Shadows

```ts
shadows: {
  sm: '0 1px 2px light-dark(rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.5))',
  md: '0 4px 12px light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.6))',
},
```

Use `light-dark()` for the shadow color: shadows need to be much stronger on dark backgrounds to be visible.

`defaults.floatingShadow` is the shadow of popovers, menus, listboxes, dialogs and toasts.

## Density

`density` is an open group of table cell spacings, used by [`Table`](/components/data/table/):

```ts
density: {
  compact:     { paddingX: '0.5rem',  paddingY: '0.25rem',  fontSize: '0.8125rem' },
  comfortable: { paddingX: '0.75rem', paddingY: '0.625rem', fontSize: '0.875rem' },
},
```

`defaults.density` is the density when the prop is omitted.
