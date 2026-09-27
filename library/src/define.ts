/** A color with a value for each color scheme. Emitted as CSS `light-dark()`. */
export interface ColorPair {
  /** Value used when the color scheme is light. */
  light: string;
  /** Value used when the color scheme is dark. */
  dark: string;
}

/** A semantic color: one value per color scheme, plus an optional foreground. */
export interface ColorToken extends ColorPair {
  /**
   * Text color used on top of this color.
   * Computed by contrast (black or white) per scheme when omitted; requires hex values.
   */
  on?: string | ColorPair;
  /**
   * Color used when this color is drawn as text: outline, soft and ghost variants, colored `Text`,
   * `Link`, menu items. Computed per scheme when omitted: the color itself when it has enough
   * contrast on the page, surface and tinted backgrounds, otherwise mixed toward the neutral text
   * color until it does. Requires hex values.
   */
  text?: string | ColorPair;
}

/**
 * A single step of the shared control size scale.
 * Every sized control reads the same entry, so controls of the same size share the same height.
 */
export interface SizeToken {
  /** Control height, e.g. `'2.5rem'`. */
  height: string;
  /** Horizontal padding, e.g. `'1rem'`. */
  paddingX: string;
  /** Font size, e.g. `'0.875rem'`. */
  fontSize: string;
  /** Size of icons inside controls of this size, e.g. `'1rem'`. */
  iconSize: string;
}

/**
 * A style recipe applied on top of a semantic color.
 * Shared by every component that takes a `variant` prop.
 */
export interface VariantToken {
  /** `fill`: the color itself; `tint`: a translucent wash of the color; `none`: transparent. */
  background: 'fill' | 'tint' | 'none';
  /** `color`: the semantic color; `neutral`: the neutral border color; `none`: no visible border. */
  border: 'color' | 'neutral' | 'none';
  /** `on`: the color's foreground; `color`: the semantic color; `neutral`: the default text color. */
  text: 'on' | 'color' | 'neutral';
}

/** Cell spacing for tables at one density. */
export interface DensityToken {
  /** Horizontal cell padding, e.g. `'0.75rem'`. */
  paddingX: string;
  /** Vertical cell padding, e.g. `'0.5rem'`. */
  paddingY: string;
  /** Cell font size, e.g. `'0.875rem'`. */
  fontSize: string;
}

/** A font file to load, emitted as an `@font-face` rule. */
export interface FontFaceToken {
  /** Family name to reference from `typography.families`, e.g. `'Inter'`. */
  family: string;
  /**
   * Font file URL(s), e.g. `'/fonts/inter.woff2'`, or `'local(Inter)'`.
   * The format is inferred from the extension.
   */
  src: string | string[];
  /** Weight or weight range, e.g. `400` or `'100 900'` for variable fonts. */
  weight?: number | string;
  /** Font style of this file. */
  style?: 'normal' | 'italic';
  /**
   * How the font displays while loading.
   * @default 'swap'
   */
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

/** A named text style. */
export interface TextStyleToken {
  /** A key of `typography.families`. */
  family: string;
  /** Font size, e.g. `'1rem'`. */
  size: string;
  /** Font weight, e.g. `400`. */
  weight: number;
  /** Unitless line height, e.g. `1.5`. */
  lineHeight: number;
  /** Letter spacing, e.g. `'-0.01em'`. */
  letterSpacing?: string;
}

/**
 * Token props each component accepts in `components`. A component's defaults can only set
 * props it actually has.
 */
export interface ComponentTokenProps {
  Button: 'size' | 'radius' | 'color' | 'variant';
  IconButton: 'size' | 'radius' | 'color' | 'variant';
  ToggleGroup: 'size' | 'radius' | 'color' | 'variant' | 'selectedVariant';
  Input: 'size' | 'radius' | 'color';
  Textarea: 'size' | 'radius' | 'color';
  NumberInput: 'size' | 'radius' | 'color';
  Select: 'size' | 'radius' | 'color';
  Combobox: 'size' | 'radius' | 'color';
  DatePicker: 'size' | 'radius' | 'color' | 'variant';
  Checkbox: 'size' | 'color';
  Radio: 'size' | 'color';
  Switch: 'size' | 'color';
  Slider: 'size' | 'radius' | 'color';
  Badge: 'size' | 'radius' | 'color' | 'variant';
  Avatar: 'size' | 'radius' | 'color' | 'variant';
  AvatarGroup: 'size' | 'radius' | 'color' | 'variant';
  Alert: 'radius' | 'color' | 'variant' | 'gap' | 'padding' | 'textStyle';
  Card: 'radius' | 'padding' | 'shadow';
  Popover: 'radius' | 'padding';
  HoverCard: 'radius' | 'padding';
  Dialog: 'radius' | 'size';
  Drawer: 'size';
  CommandPalette: 'size' | 'radius' | 'color';
  Menu: 'size';
  Tabs: 'size' | 'color';
  Pagination: 'size' | 'radius' | 'color' | 'variant' | 'selectedVariant';
  Accordion: 'size' | 'radius' | 'color';
  Table: 'density' | 'radius';
  Stack: 'gap';
  Inline: 'gap';
  Text: 'textStyle' | 'color';
  Label: 'textStyle' | 'color' | 'variant' | 'size' | 'radius';
  Link: 'color';
  Breadcrumb: 'textStyle' | 'color';
  Spinner: 'size' | 'color';
  Skeleton: 'size' | 'radius';
  Progress: 'size' | 'color' | 'radius';
  EmptyState: 'color' | 'gap' | 'padding' | 'textStyle';
  Tooltip: 'radius' | 'padding' | 'textStyle';
  Toast: 'radius' | 'color' | 'gap' | 'padding' | 'textStyle';
}

/** Names of components that accept defaults in `components`. */
export type ComponentName = keyof ComponentTokenProps;

/**
 * The structure every yarcl config must satisfy.
 *
 * Open groups (`colors`, `sizes`, `radii`, `variants`, `spacing`, `shadows`, `density`, `modalSizes`, `typography`) take any keys;
 * those keys become the valid prop values. Groups with required keys (`neutrals`, `zIndex`,
 * `motion`, `timing`, `borders`) must include the keys the library depends on, and accept any extra
 * keys, which are emitted as CSS variables for the consumer's own styles.
 */
export interface YarclShape {
  /** Semantic colors. Keys become the valid values of the `color` prop. */
  colors: Record<string, ColorToken>;
  /** Neutral colors for backgrounds, text and borders. Extra keys allowed. */
  neutrals: Record<string, ColorPair> & {
    /** Page background. */
    bg: ColorPair;
    /** Background of controls and raised surfaces. */
    surface: ColorPair;
    /** Default text. */
    text: ColorPair;
    /** Secondary text and placeholders. */
    muted: ColorPair;
    /** Default border. */
    border: ColorPair;
  };
  /** Control size scale. Keys become the valid values of the `size` prop. */
  sizes: Record<string, SizeToken>;
  /**
   * Border radii. Keys become the valid values of the `radius` prop. Name them after your
   * sizes (`sm`, `md`, `lg` …) so controls can match their size, plus exceptions such as
   * `square` and `rounded`. `size` is reserved.
   */
  radii: Record<string, string>;
  /** Style recipes. Keys become the valid values of the `variant` prop. */
  variants: Record<string, VariantToken>;
  /** Spacing scale, e.g. for `gap` and padding. */
  spacing: Record<string, string>;
  /** Box shadows. */
  shadows: Record<string, string>;
  /** Table densities. Keys become the valid values of the `density` prop. */
  density: Record<string, DensityToken>;
  /**
   * Widths of `Dialog` and `Drawer`, e.g. `{ sm: '24rem', md: '32rem', full: '100vw' }`.
   * Keys become the valid values of their `size` prop. Separate from `sizes`, which sets control heights.
   */
  modalSizes: Record<string, string>;
  /** Font files, font families, named text styles and heading levels. */
  typography: {
    /** Font files to load. Reference their `family` names in `families`. */
    fontFaces?: readonly FontFaceToken[];
    /** Font stacks, e.g. `{ sans: 'Inter, system-ui, sans-serif' }`. */
    families: Record<string, string>;
    /** Named text styles. Keys become the valid text style names. */
    styles: Record<string, TextStyleToken>;
    /** Text style for each heading level, used by `Heading`. Each must be a key of `styles`. */
    headings: { h1: string; h2: string; h3: string; h4: string; h5: string; h6: string };
  };
  /** Stacking order of floating layers. Extra keys allowed. */
  zIndex: Record<string, number> & { dropdown: number; tooltip: number; dialog: number; toast: number };
  /** Transition timing. Extra keys allowed. */
  motion: Record<string, string> & {
    /** Short transitions, e.g. hover. */
    fast: string;
    /** Standard transitions, e.g. opening a popover. */
    base: string;
    /** Easing function. */
    easing: string;
  };
  /** Interaction timing in milliseconds, read by components at render time. Extra keys allowed. */
  timing: Record<string, number> & {
    /** Delay before a `Tooltip` opens on hover. */
    tooltipDelay: number;
    /** Delay before a `HoverCard` opens on hover. */
    hoverOpenDelay: number;
    /** Delay before a `HoverCard` closes after the pointer leaves. */
    hoverCloseDelay: number;
    /** How long a toast stays before it dismisses itself. `0` keeps toasts until dismissed. */
    toastDuration: number;
  };
  /** Border widths. Extra keys allowed. */
  borders: Record<string, string> & { width: string };
  /** Keyboard focus indicator, shared by every focusable component. */
  focusRing: {
    /** Outline width, e.g. `'2px'`. */
    width: string;
    /** Gap between the element and the outline, e.g. `'2px'`. Negative values draw it inside. */
    offset: string;
    /** A key of `colors`. */
    color: string;
    /**
     * Outline style.
     * @default 'solid'
     */
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
  };
  /**
   * Per-component defaults, e.g. `{ Button: { radius: 'square' } }`. Applied when a prop is omitted,
   * before the global `defaults`. Each value must be a key of its group.
   */
  components?: { [C in ComponentName]?: { [P in ComponentTokenProps[C]]?: string } };
  /** Values used when a component prop is omitted. Each must be a key of its group. */
  defaults: {
    size: string;
    /**
     * A key of `radii`, or `'size'` to use the radius named like the control's size
     * (a `lg` button gets `radii.lg`). Components without a size use `defaults.size`.
     */
    radius: string;
    color: string;
    variant: string;
    /** Color used for invalid fields. A key of `colors`. */
    errorColor: string;
    /** Text style for `Text`. A key of `typography.styles`. */
    textStyle: string;
    /** Text style for form labels and legends. A key of `typography.styles`. */
    labelStyle: string;
    /** Text style for helper and error text below form controls. A key of `typography.styles`. */
    helperStyle: string;
    /** Gap for `Stack` and `Inline`. A key of `spacing`. */
    gap: string;
    /** Padding for `Card`. A key of `spacing`. */
    padding: string;
    /** Elevation of popovers, menus and listboxes. A key of `shadows`. */
    floatingShadow: string;
    /** Density for `Table`. A key of `density`. */
    density: string;
    /** Variant for low-emphasis components such as `Badge` and `Alert`. A key of `variants`. */
    softVariant: string;
    /** Width of `Dialog` and `Drawer`. A key of `modalSizes`. */
    modalSize: string;
  };
}

type Whitespace = ' ' | '\n' | '\t';

type KeyCheck<G> = {
  [K in keyof G as K extends `${string}${Whitespace}${string}` ? K : never]: {
    error: `Key "${K & string}" must not contain whitespace`;
  };
};

interface TokenKeys<T extends YarclShape> {
  size: keyof T['sizes'];
  radius: keyof T['radii'] | 'size';
  color: keyof T['colors'];
  variant: keyof T['variants'];
  selectedVariant: keyof T['variants'];
  gap: keyof T['spacing'];
  padding: keyof T['spacing'];
  shadow: keyof T['shadows'];
  density: keyof T['density'];
  textStyle: keyof T['typography']['styles'];
}

type ComponentChecks<T extends YarclShape> = {
  [C in keyof T['components']]: C extends ComponentName
    ? {
        [P in keyof T['components'][C]]: P extends ComponentTokenProps[C]
          ? C extends 'Dialog' | 'Drawer'
            ? P extends 'size'
              ? keyof T['modalSizes']
              : TokenKeys<T>[P]
            : TokenKeys<T>[P]
          : never;
      }
    : { error: `Unknown component "${C & string}"` };
};

type Checks<T extends YarclShape> = {
  components?: ComponentChecks<T>;
  colors: KeyCheck<T['colors']>;
  neutrals: KeyCheck<T['neutrals']>;
  zIndex: KeyCheck<T['zIndex']>;
  motion: KeyCheck<T['motion']>;
  timing: KeyCheck<T['timing']>;
  borders: KeyCheck<T['borders']>;
  sizes: KeyCheck<T['sizes']>;
  radii: KeyCheck<T['radii']> & { size?: { error: 'The radius key "size" is reserved' } };
  variants: KeyCheck<T['variants']>;
  spacing: KeyCheck<T['spacing']>;
  shadows: KeyCheck<T['shadows']>;
  density: KeyCheck<T['density']>;
  modalSizes: KeyCheck<T['modalSizes']>;
  typography: {
    families: KeyCheck<T['typography']['families']>;
    styles: KeyCheck<T['typography']['styles']> & {
      [K in keyof T['typography']['styles']]: { family: keyof T['typography']['families'] };
    };
    headings: Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', keyof T['typography']['styles']>;
  };
  focusRing: { color: keyof T['colors'] };
  defaults: {
    size: keyof T['sizes'];
    radius: keyof T['radii'] | 'size';
    color: keyof T['colors'];
    variant: keyof T['variants'];
    errorColor: keyof T['colors'];
    textStyle: keyof T['typography']['styles'];
    labelStyle: keyof T['typography']['styles'];
    helperStyle: keyof T['typography']['styles'];
    gap: keyof T['spacing'];
    padding: keyof T['spacing'];
    floatingShadow: keyof T['shadows'];
    density: keyof T['density'];
    softVariant: keyof T['variants'];
    modalSize: keyof T['modalSizes'];
  };
};

/**
 * Declares a yarcl design system config.
 *
 * Checks at compile time that:
 * - every color has a `light` and `dark` value
 * - `defaults`, `focusRing.color`, `typography.headings` and each text style's `family` reference existing keys
 * - no key contains whitespace
 * - `components` only names known components, only sets props they have, and only uses existing keys
 *
 * Returns the config unchanged with literal types preserved, so the library can derive
 * its prop types from it. Spread `@yarcl/react/defaults` to extend the library defaults instead
 * of replacing them.
 *
 * @example
 * ```ts
 * // src/yarcl.config.ts
 * import { defineConfig } from '@yarcl/react/define';
 * import defaults from '@yarcl/react/defaults';
 *
 * export default defineConfig({
 *   ...defaults,
 *   colors: { ...defaults.colors, brand: { light: '#2d4bb8', dark: '#8aa2ff' } },
 *   defaults: { ...defaults.defaults, color: 'brand' },
 * });
 * ```
 */
export function defineConfig<const T extends YarclShape>(config: T & Checks<T>): T {
  return config;
}
