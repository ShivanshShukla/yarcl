---
title: TypeScript
description: How the prop types are derived from your config, exported types, and contract tests.
sidebar:
  order: 10
---

## How types are derived

`defineConfig` is generic with a `const` type parameter, so your config keeps its literal types. The library imports your config through `@yarcl/config` and derives each prop type with `keyof`:

```ts
// inside the library
import type config from '@yarcl/config';

export type Size = keyof (typeof config)['sizes'];
export type Color = keyof (typeof config)['colors'];
```

Because `@yarcl/config` resolves to your file (through `paths` in your `tsconfig.json`), `Size` is your sizes.

`ComponentSize<'Button'>` narrows that global union when `components.Button.allowedSizes` is present. Component props use this type internally, so completion and validation only offer that component's allowed values.

## Exported types

Use them to type your own components:

```ts
import type { Color, ComponentSize, Density, ModalSize, Radius, Shadow, Size, Spacing, TextStyle, Variant } from '@yarcl/react';

interface PriceTagProps {
  tone?: Color;
  size?: ComponentSize<'Button'>;
}
```

`config` is exported too, the resolved config object, for iterating over keys:

```tsx
import { Button, config, type Color } from '@yarcl/react';

const colors = Object.keys(config.colors) as Color[];
colors.map((color) => <Button key={color} color={color}>{color}</Button>);
```

## Contract tests

Keep a file of `@ts-expect-error` lines to prove that invalid values stay invalid. If one of them stops being an error, for example after someone adds a `primary` color by accident, type-checking fails:

```tsx title="src/contract.check.tsx"
import { Button, Stack } from '@yarcl/react';

export const contract = (
  <>
    <Button size="lg" color="brand" />
    {/* @ts-expect-error: not in this design system */}
    <Button size="gigantic" />
    {/* @ts-expect-error */}
    <Button color="primary" />
    {/* @ts-expect-error */}
    <Stack gap="huge" />
  </>
);
```

## Requirements

- `"moduleResolution": "bundler"` (or `node16` / `nodenext`)
- `"strict": true` is recommended
- the `paths` entry for `@yarcl/config`, as shown in [installation](/getting-started/installation/)
