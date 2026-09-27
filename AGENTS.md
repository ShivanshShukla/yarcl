# AGENTS.md

yarcl is a React component library where the consumer's config file is the design system. Config keys become typed prop values and generated CSS, with no codegen and no module augmentation.

## Config injection

The library source never imports a concrete config. It imports a placeholder module, `@yarcl/config`, and the consumer's toolchain decides which file that is. Think of it as file replacement at build time.

The consumer wires it twice, pointing at the same file:

In the build-tool config, for runtime values (Vite shown):

```ts
plugins: [react(), yarcl({ config: 'src/yarcl.config.ts' })]
```

In `tsconfig.json`, for types:

```json
"paths": {
  "@yarcl/config": ["./src/yarcl.config.ts", "./node_modules/@yarcl/react/dist/yarcl.config.d.ts"]
}
```

What each side does:

- **Build plugin** (`library/src/plugin.ts`): uses unplugin to resolve `@yarcl/config` to the consumer's file for Vite, webpack, Rspack, Rollup and esbuild. If that file doesn't exist, it points to the compiled library default in `library/dist/yarcl.config.js`. It also loads the config in Node and serves the generated CSS as `@yarcl/react/styles.css`, and invalidates that CSS when the config or its imports change. Tool-specific entry points live in `library/src/vite.ts`, `webpack.ts`, `rspack.ts`, `rollup.ts` and `esbuild.ts`.
- **tsconfig `paths`**: TypeScript resolves `@yarcl/config` to the same file, so `typeof config` is the consumer's literal config. The second entry falls back to the library defaults.
- **Library side**:
  - `library/src/types.ts` does `import type config from '@yarcl/config'` and derives prop types from its keys (`keyof Config['sizes']`, and so on). Adding a key to the config makes it a valid prop value with no other changes.
  - `library/src/runtime.ts` imports the same module for runtime values (component defaults, the active config).
  - `library/tsconfig.json` points `@yarcl/config` at the library defaults, so the library type-checks on its own.
- **`defineConfig`** (`library/src/define.ts`) uses a `const` generic, so key names stay literal types. It also validates the config at compile time: cross-references, component defaults, reserved keys.

Missing wiring fails loudly: an unresolved module or type errors, never silently wrong types. The decision and alternatives are in `docs/decisions/0001-config-delivery.md`.

## How it renders

- `generateCss` (`library/src/css.ts`) turns the config into `:root` variables and modifier classes (`yarcl-{group}-{key}`). Static component styles in `library/src/styles.css` only consume those variables.
- Components render classes, never inline token values. They read defaults at render time (`useDefaults`, `useConfig`), so `applyTheme` (`library/src/apply.ts`) can swap the config and its CSS at runtime without a rebuild.
- Themes in `library/src/themes/` must satisfy `ThemeContract`, which is keyed from the library defaults, so any theme can replace any other.

## Layout

| Path | Purpose |
|---|---|
| `library/` | the package: components, config schema, plugin, themes, reference |
| `consumer/` | demo app using its own config |
| `e2e/consumer/` | test fixture with a different brand's config, to prove nothing is hardcoded |
| `e2e/suites/` | browser test suites, run by Vitest from `consumer/tests` and `e2e/consumer/tests` |
| `test-utils/` | Vitest browser-mode helpers: a Playwright-style `page` and the suite runner |
| `docs-web/` | Astro Starlight docs site; props tables are generated from TypeDoc JSON |
| `docs/decisions/` | architecture decision records |
| `.github/workflows/` | CI, docs deploy, and agent workflows (`*.md`) |

## Commands

Run from the root with pnpm:

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm size
pnpm test
pnpm test <suite>
pnpm docs:dev
pnpm docs:build
```

`pnpm test` runs Vitest in browser mode with the installed Chrome, headless; set `CHROME_PATH` if it isn't installed as `chrome`. `TEST_CPU_THROTTLE=4 pnpm test` slows the CPU to surface timing races. A change is done when all of the above pass. Kill stale dev servers before checking UI changes in a browser.

## Rules

- Never hardcode token values (sizes, colors, radii, fonts) in components or `styles.css`; they come from the config.
- Every config-driven feature must work in both `consumer` and `e2e/consumer`, and have `@ts-expect-error` checks in their `contract.check.tsx` for invalid values.
- Minimal to no comments, unless they are JSDoc. Public exports always get JSDoc, which feeds the docs.
- No em dashes anywhere: code, JSDoc, docs, UI copy, commits, PRs.
- Demo and docs UI use plain human-readable labels; config keys appear only in code samples.
- The package is published as `@yarcl/react`. Pre-1.0 APIs may change without deprecation paths or compatibility shims.
- React 19 only: `ref` is a regular prop that components spread onto their element. Don't use `forwardRef`.
- Accessibility is required: roles, keyboard support, focus management, and a clean axe audit.
- The package runs from compiled JS (`library/dist`), built by `pnpm install` (`prepare`). After changing library source, run `pnpm -C library build`. Vite bundles the JavaScript and TypeScript emits declarations.
- Releases: bump `library/package.json` `version`, then push a matching tag (`v0.2.0`); `.github/workflows/publish.yml` publishes to npm.
- Don't commit, push, or open PRs unless asked.

## Workflows

- Adding a component: `.github/workflows/add-component.md`
