---
title: Accessibility
description: What yarcl handles for you, and what's still up to you.
sidebar:
  order: 3
---

## Built in

- **Native elements first**: `<button>`, `<input>`, `<dialog>`, `<hr>`, `<table>`, `<fieldset>` and `<legend>`, so browsers and assistive technology get the semantics for free.
- **Keyboard support** for every interactive component. Menus, selects and toggle groups use roving focus; menus and selects support type-to-select.
- **Focus management**: dialogs and drawers trap focus and return it on close; menus and popovers return focus to their trigger.
- **Labelling**: `Field` and `RadioGroup` connect labels, descriptions and errors; `IconButton` requires `aria-label` in its types.
- **Live regions**: toasts use `role="status"` (or `role="alert"` when urgent); alerts opt in with `live`.
- **Visible focus**: every focusable component shows the same focus ring for keyboard users (`:focus-visible`), configured in `focusRing`. Highlighted options in menus, selects and comboboxes use a solid fill with at least 3:1 contrast. The e2e suite tabs through both demo apps and checks every stop is visible and every ring matches.
- **Contrast**: text on a color gets a computed foreground, and a color drawn as text gets a computed text shade, both at least 4.5:1 (WCAG AA) in light and dark mode. The build warns when a foreground can't reach it.
- **Automated audits**: the e2e suite runs axe-core (WCAG 2.2 A and AA) on both demo apps in light and dark mode, including every open menu, select, combobox, popover, tooltip, hover card, dialog, drawer and toast.
- **Reduced motion**: transitions and entry animations are turned off when the user prefers reduced motion.
- **Scalable sizes**: sizes in `rem` follow the user's browser font size.

## Keyboard reference

| Component | Keys |
|---|---|
| [Menu](/components/overlays/menu/) | <kbd>↑</kbd> <kbd>↓</kbd>, typing, <kbd>Enter</kbd>, <kbd>Esc</kbd> |
| [Select](/components/forms/select/) | <kbd>↑</kbd> <kbd>↓</kbd>, typing (open or closed), <kbd>Enter</kbd>, <kbd>Esc</kbd> |
| [Combobox](/components/forms/combobox/) | typing, <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>; with `multiple`, <kbd>Backspace</kbd> and <kbd>←</kbd> <kbd>→</kbd> across chips |
| [Tabs](/components/data/tabs/) | <kbd>←</kbd> <kbd>→</kbd>, <kbd>Home</kbd>, <kbd>End</kbd> |
| [Accordion](/components/data/accordion/) | <kbd>Enter</kbd> <kbd>Space</kbd>, <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd>, <kbd>End</kbd> |
| [ToggleGroup](/components/buttons/toggle-group/) | arrow keys, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Space</kbd> |
| [Slider](/components/forms/slider/) | <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd>, <kbd>End</kbd> |
| [Dialog](/components/overlays/dialog/), [Drawer](/components/overlays/drawer/), [Popover](/components/overlays/popover/), [Tooltip](/components/overlays/tooltip/) | <kbd>Esc</kbd> |

## Up to you

- Give icon-only buttons, button groups, toggle groups and tab lists meaningful labels.
- Choose heading levels by document structure; change the look with `textStyle`.
- Keep links in running text underlined.
- Check your own CSS that uses `--yarcl-color-{key}` for text; use `--yarcl-color-{key}-text` instead.
- Set `live` on alerts that appear in response to user actions.
