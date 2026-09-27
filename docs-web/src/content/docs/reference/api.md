---
title: API reference
description: Package entry points and exports. Full generated API docs live at /api/.
sidebar:
  order: 1
---

The complete API reference, generated from the library's JSDoc with TypeDoc, is at **[/api/](/api/)**. Every prop table on the component pages is generated from the same source.

## Entry points

| Import | Contents |
|---|---|
| `@yarcl/react` | components, `toast`, token types, the resolved `config` |
| `@yarcl/react/define` | `defineConfig` and the config types |
| `@yarcl/react/defaults` | the library's default config, for spreading |
| `@yarcl/react/plugin` | the Vite plugin |
| `@yarcl/react/reference` | `DesignReference` |

## Components

| Group | Exports |
|---|---|
| Buttons | `Button`, `IconButton`, `ButtonGroup`, `ToggleGroup` |
| Forms | `Field`, `Label`, `Input`, `NumberInput`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider` |
| Typography | `Text`, `Heading`, `Link` |
| Layout | `Stack`, `Inline`, `Card`, `Divider` |
| Overlays | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `HoverCard`, `Menu`, `CommandPalette`, `Toaster`, `toast` |
| Data display | `Avatar`, `AvatarGroup`, `Tabs`, `Accordion`, `Table`, `Pagination`, `Breadcrumb` |
| Feedback | `Badge`, `Alert`, `Spinner`, `Skeleton`, `Progress` |

## Types

| Type | Meaning |
|---|---|
| `Size`, `Radius`, `Color`, `Variant` | keys of `sizes`, `radii`, `colors`, `variants` in your config |
| `Spacing`, `Shadow`, `Density`, `TextStyle` | keys of `spacing`, `shadows`, `density`, `typography.styles` |
| `ModalSize` | keys of `modalSizes` |
| `TokenProps`, `VariantProps` | the shared `size` / `radius` / `color` and `variant` props |
| `SelectOption` | `{ value, label, disabled? }` for `Select` and `Combobox` |
| `DateRange` | `{ from, to }` for `DatePicker` in range mode |
| `YarclShape`, `ColorToken`, `SizeToken`, `VariantToken`, … | the config schema, from `@yarcl/react/define` |
