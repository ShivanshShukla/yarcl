# ADR 0001: Deliver the consumer's config through a module alias

- Status: accepted
- Date: 2026-09-23

## Context

yarcl's premise is that the consumer defines the design system: the valid sizes, colors, variants and so on. The library needs that config twice:

- **at compile time**, to type props (`size` accepts only the consumer's size keys), and
- **at runtime**, to render the values (a size key's height, a color's value).

The library is written before any consumer config exists, so it can't hardcode either.

## Options

### A. Module alias (chosen)

The library imports `@yarcl/config`. A bundler alias resolves it to the consumer's file for runtime; a `tsconfig.json` `paths` entry resolves it to the same file for types. Types come from `keyof typeof config`.

### B. Module augmentation + Provider

The library declares an empty `interface Register {}`. The consumer adds `declare module '@yarcl/react' { interface Register { config: typeof config } }` for types, and passes the values through `<YarclProvider config={config}>` at runtime. (TanStack Router, Tamagui, MUI's theme augmentation.)

### C. Code generation

A CLI reads the config and writes a `.d.ts` (and possibly CSS) that the library references. (Panda CSS, Chakra v3 typegen.)

## Comparison

| | A. Alias | B. Augmentation + Provider | C. Codegen |
|---|---|---|---|
| Consumer writes | one plain config file | config + `declare module` + Provider | config + a generate step |
| Source of truth | one file for types and values | two wires (type registration, Provider prop) | config, plus generated output that can be stale |
| When wiring is missing | loud: unresolved module / type errors | silent: types fall back to defaults, or values are undefined at runtime | stale types until regenerated |
| New keys (e.g. `xxl`) | valid and rendered as soon as they're in the file | need both wires in place | need a regenerate |
| Build-time CSS from config | natural: the plugin already has the file | needs a separate build step | natural |
| Runtime cost | none: a static import | React context | none |
| Bundler coupling | yes: alias per bundler | none | a CLI in the toolchain |
| Multiple themes in one app | no | yes (nested Providers) | no |
| Library ships compiled `.d.ts` | yes: the declarations keep `@yarcl/config` unresolved | yes | yes |

## Decision

Use **A**. The thesis of the library is "the config file *is* the design system", and the alias is the only option where one file is literally both the types and the values. Its failure mode is loud, and it lets the plugin generate CSS from the same file at build time, so components carry no inline styles and no runtime theme logic.

## Consequences

- Consumers add the plugin for their build tool and a `paths` entry. The two must point at the same file; `yarcl init` writes both.
- One design system per build. Multi-brand apps would add a Provider for runtime values (a hybrid of A and B).
- The package ships compiled ESM and declarations. The declarations keep `@yarcl/config` unresolved so the consumer's `paths` entry supplies the config type.
- Other bundlers need small adapters (webpack `resolve.alias`, Turbopack `resolveAlias`); unplugin could produce them from one implementation.

## When to revisit

- A consumer needs several themes in one bundle → add B for runtime values, keep A for types.
- The plugin uses unplugin adapters for Vite, webpack, Rspack, Rollup and esbuild.
