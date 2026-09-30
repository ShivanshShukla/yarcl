---
title: Architecture
description: Why yarcl delivers your config through a module alias, and the trade-offs against module augmentation and code generation.
sidebar:
  order: 2
---

yarcl needs your config twice: **at compile time**, to type props, and **at runtime**, to render values. The library is written before any consumer config exists, so it can't hardcode either.

## Options considered

**A. Module alias (chosen).** The library imports `@yarcl/config`. A bundler alias resolves it to your file at runtime; a `tsconfig.json` `paths` entry resolves it to the same file for types.

**B. Module augmentation and a Provider.** The library declares an empty interface; you register your config's type with `declare module '@yarcl/react'` and pass the values through `<YarclProvider config={config}>`. TanStack Router, Tamagui and MUI work this way.

**C. Code generation.** A CLI reads your config and writes type declarations (and CSS). Panda CSS and Chakra v3 work this way.

| | A. Alias | B. Augmentation and Provider | C. Codegen |
|---|---|---|---|
| You write | one plain config file | config, a `declare module` block and a Provider | config and a generate step |
| Source of truth | one file for types and values | two wires that can disagree | config, plus output that can be stale |
| Forget the wiring | loud: unresolved import, type errors | silent: default types, or undefined values at runtime | stale types until regenerated |
| A new key | valid and rendered immediately | needs both wires in place | needs a regenerate |
| CSS from the config | natural: the plugin has the file | needs a separate build step | natural |
| Runtime cost | none | React context | none |
| Bundler coupling | an alias per bundler | none | a CLI in the toolchain |
| Several themes in one app | no | yes | no |

## Decision

The alias, because it's the only option where one file is literally both the types and the values. Its failure mode is loud, and the plugin can generate CSS from the same file, so components carry no inline styles and no runtime theme logic.

## Consequences

- You add the plugin for your build tool and a `paths` entry, and they must point at the same file.
- One design system per build. A multi-brand app would add a Provider for runtime values.
- The package ships compiled ESM and declarations. The declarations keep `@yarcl/config` unresolved so your `paths` entry supplies the config type.
- Other bundlers need small adapters.
