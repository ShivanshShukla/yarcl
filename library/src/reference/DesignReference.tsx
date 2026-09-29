import type { ReactNode } from 'react';
import { contrast, parseHex, readableOn } from '../color';
import type { ColorPair, ColorToken, YarclShape } from '../define';
import {
  Button,
  Card,
  Heading,
  IconButton,
  Inline,
  Input,
  Stack,
  Table,
  Text,
  type Color,
  type Density,
  type Radius,
  type Shadow,
  type Size,
  type Spacing,
  type TextStyle,
  type Variant,
} from '../index';
import { useConfig } from '../runtime';
import './reference.css';

const keys = <T extends string>(group: object) => Object.keys(group) as T[];

function ratio(background: string, token: ColorToken, mode: keyof ColorPair): string {
  const bg = parseHex(background);
  if (!bg) return 'n/a';
  const onValue = typeof token.on === 'string' ? token.on : token.on?.[mode];
  const fg = parseHex(onValue ?? readableOn(bg));
  return fg ? `${contrast(bg, fg).toFixed(1)}:1` : 'n/a';
}

function Section({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <Stack as="section" className="yarcl-ref-section">
      <Heading level={2}>{title}</Heading>
      {description != null && (
        <Text as="p" muted>
          {description}
        </Text>
      )}
      {children}
    </Stack>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="yarcl-ref-code">{children}</code>;
}

function KeyValues({ caption, rows }: { caption: string; rows: [string, ReactNode][] }) {
  const config = useConfig();
  return (
    <Table caption={caption} density={config.defaults.density}>
      <Table.Body>
        {rows.map(([key, value]) => (
          <Table.Row key={key}>
            <Table.HeaderCell scope="row">{key}</Table.HeaderCell>
            <Table.Cell>{value}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

const pair = (value: ColorPair) => (
  <>
    <Code>{value.light}</Code> / <Code>{value.dark}</Code>
  </>
);

/** Props for {@link DesignReference}. */
export interface DesignReferenceProps {
  /**
   * Page heading.
   * @default 'Design reference'
   */
  title?: ReactNode;
}

/**
 * A living reference of the active design system, rendered from the consumer's config:
 * colors with contrast ratios, the size scale with live controls, radii, variants, spacing,
 * shadows, fonts, text styles, heading levels, density, other tokens and defaults.
 * Import from `@yarcl/react/reference`.
 *
 * @example
 * ```tsx
 * import { DesignReference } from '@yarcl/react/reference';
 *
 * <DesignReference title="Acme design system" />
 * ```
 */
export function DesignReference({ title = 'Design reference' }: DesignReferenceProps) {
  const config = useConfig();
  const shape = config as unknown as YarclShape;
  const colors = keys<Color>(config.colors);
  const variants = keys<Variant>(config.variants);
  const { typography } = shape;

  return (
    <Stack gap={config.defaults.padding} className="yarcl-ref">
      <Heading level={1}>{title}</Heading>

      <Section title="Colors" description="Semantic colors for the color prop. Ratios are foreground on background, light / dark.">
        <div className="yarcl-ref-grid">
          {colors.map((key) => {
            const token = shape.colors[key];
            return (
              <Card key={key} padding={config.defaults.gap} className="yarcl-ref-color">
                <div className={`yarcl-ref-swatch yarcl-color-${key}`}>Aa</div>
                <Stack gap={config.defaults.gap}>
                  <Text textStyle={config.defaults.labelStyle}>{key}</Text>
                  <Text textStyle={config.defaults.helperStyle} muted>
                    {pair(token)}
                  </Text>
                  <Text textStyle={config.defaults.helperStyle} muted>
                    {ratio(token.light, token, 'light')} / {ratio(token.dark, token, 'dark')}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Neutrals" description="Backgrounds, text and borders.">
        <div className="yarcl-ref-grid">
          {Object.entries(shape.neutrals).map(([key, value]) => (
            <Card key={key} padding={config.defaults.gap} className="yarcl-ref-color">
              <div className="yarcl-ref-swatch yarcl-ref-neutral" style={{ background: `var(--yarcl-neutral-${key})` }} />
              <Text textStyle={config.defaults.labelStyle}>{key}</Text>
              <Text textStyle={config.defaults.helperStyle} muted>
                {pair(value)}
              </Text>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Sizes" description="The base scale shared by every control, before per-component overrides.">
        <Table caption="Control sizes" density={config.defaults.density}>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Height</Table.HeaderCell>
              <Table.HeaderCell>Padding X</Table.HeaderCell>
              <Table.HeaderCell>Font</Table.HeaderCell>
              <Table.HeaderCell>Icon</Table.HeaderCell>
              <Table.HeaderCell>Preview</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {keys<Size>(config.sizes).map((key) => {
              const size = shape.sizes[key];
              return (
                <Table.Row key={key}>
                  <Table.HeaderCell scope="row">{key}</Table.HeaderCell>
                  <Table.Cell>
                    <Code>{size.height}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{size.paddingX}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{size.fontSize}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Code>{size.iconSize}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Inline gap={config.defaults.gap} wrap={false}>
                      <Input size={key} placeholder="Input" aria-label={`Input ${key}`} className="yarcl-ref-input" />
                      <Button size={key}>Button</Button>
                      <IconButton size={key} aria-label="Add">
                        +
                      </IconButton>
                    </Inline>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Section>

      <Section
        title="Radii"
        description={
          shape.defaults.radius === 'size'
            ? 'Controls use the radius named like their size; other keys are exceptions.'
            : `Default radius: ${shape.defaults.radius}.`
        }
      >
        <Inline>
          {keys<Radius>(config.radii).map((key) => (
            <Stack key={key} gap={config.defaults.gap} align="center">
              <div className={`yarcl-ref-radius yarcl-radius-${key}`} />
              <Text textStyle={config.defaults.labelStyle}>{key}</Text>
              <Text textStyle={config.defaults.helperStyle} muted>
                <Code>{shape.radii[key]}</Code>
              </Text>
            </Stack>
          ))}
        </Inline>
      </Section>

      <Section title="Variants" description="Recipes applied on top of any color.">
        {variants.map((key) => {
          const recipe = shape.variants[key];
          return (
            <Inline key={key}>
              <Text textStyle={config.defaults.labelStyle} className="yarcl-ref-label">
                {key}
              </Text>
              {colors.map((color) => (
                <Button key={color} variant={key} color={color} size={config.defaults.size}>
                  {color}
                </Button>
              ))}
              <Text textStyle={config.defaults.helperStyle} muted>
                background <Code>{recipe.background}</Code>, border <Code>{recipe.border}</Code>, text <Code>{recipe.text}</Code>
              </Text>
            </Inline>
          );
        })}
      </Section>

      <Section title="Spacing">
        {keys<Spacing>(config.spacing).map((key) => (
          <Inline key={key}>
            <Text textStyle={config.defaults.labelStyle} className="yarcl-ref-label">
              {key}
            </Text>
            <div className="yarcl-ref-space" style={{ width: `var(--yarcl-space-${key})` }} />
            <Code>{shape.spacing[key]}</Code>
          </Inline>
        ))}
      </Section>

      <Section title="Shadows">
        <Inline gap={config.defaults.padding}>
          {keys<Shadow>(config.shadows).map((key) => (
            <Card key={key} shadow={key} className="yarcl-ref-shadow">
              <Text textStyle={config.defaults.labelStyle}>{key}</Text>
            </Card>
          ))}
        </Inline>
      </Section>

      <Section title="Typography">
        {(typography.fontFaces?.length ?? 0) > 0 && (
          <Table caption="Font files" density={config.defaults.density}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Family</Table.HeaderCell>
                <Table.HeaderCell>Source</Table.HeaderCell>
                <Table.HeaderCell>Weight</Table.HeaderCell>
                <Table.HeaderCell>Style</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {typography.fontFaces!.map((face, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{face.family}</Table.Cell>
                  <Table.Cell>
                    <Code>{[face.src].flat().join(', ')}</Code>
                  </Table.Cell>
                  <Table.Cell>{face.weight ?? 'n/a'}</Table.Cell>
                  <Table.Cell>{face.style ?? 'normal'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        <KeyValues
          caption="Families"
          rows={Object.entries(typography.families).map(([key, stack]) => [
            key,
            <span style={{ fontFamily: `var(--yarcl-font-${key})` }}>
              The quick brown fox <Code>{stack}</Code>
            </span>,
          ])}
        />
        <Table caption="Text styles" density={config.defaults.density}>
          <Table.Body>
            {keys<TextStyle>(config.typography.styles).map((key) => {
              const style = typography.styles[key];
              return (
                <Table.Row key={key}>
                  <Table.HeaderCell scope="row">{key}</Table.HeaderCell>
                  <Table.Cell>
                    <Text textStyle={key}>The quick brown fox</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle={config.defaults.helperStyle} muted>
                      {style.family} · {style.size} · {style.weight} · {style.lineHeight}
                      {style.letterSpacing ? ` · ${style.letterSpacing}` : ''}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <KeyValues
          caption="Heading levels"
          rows={(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((level) => [
            level,
            <Text textStyle={config.typography.headings[level]}>
              {typography.headings[level]}
            </Text>,
          ])}
        />
      </Section>

      <Section title="Modal sizes" description="Widths of dialogs and drawers.">
        <KeyValues
          caption="Modal sizes"
          rows={Object.entries(shape.modalSizes).map(([key, value]): [string, ReactNode] => [key, <Code>{value}</Code>])}
        />
      </Section>

      <Section title="Density">
        <KeyValues
          caption="Table density"
          rows={keys<Density>(config.density).map((key) => {
            const density = shape.density[key];
            return [key, <Code>{`${density.paddingY} ${density.paddingX} · ${density.fontSize}`}</Code>];
          })}
        />
      </Section>

      <Section title="Other tokens">
        <KeyValues
          caption="Layers, motion, borders and focus"
          rows={[
            ...Object.entries(shape.zIndex).map(([k, v]): [string, ReactNode] => [`zIndex.${k}`, <Code>{v}</Code>]),
            ...Object.entries(shape.motion).map(([k, v]): [string, ReactNode] => [`motion.${k}`, <Code>{v}</Code>]),
            ...Object.entries(shape.borders).map(([k, v]): [string, ReactNode] => [`borders.${k}`, <Code>{v}</Code>]),
            ['focusRing', <Code>{`${shape.focusRing.width} · offset ${shape.focusRing.offset} · ${shape.focusRing.color}`}</Code>],
          ]}
        />
      </Section>

      <Section
        title="Defaults"
        description="Values used when a component prop is omitted: the prop, then an enclosing group, then component defaults, then global defaults."
      >
        {Object.keys(shape.components ?? {}).length > 0 && (
          <KeyValues
            caption="Component defaults"
            rows={Object.entries(shape.components ?? {}).map(([name, values]): [string, ReactNode] => [
              name,
              <Code>
                {Object.entries(values ?? {})
                  .map(([prop, value]) => `${prop}: ${value}`)
                  .join(' · ')}
              </Code>,
            ])}
          />
        )}
        <KeyValues
          caption="Global defaults"
          rows={Object.entries(shape.defaults).map(([key, value]): [string, ReactNode] => [key, <Code>{value}</Code>])}
        />
      </Section>
    </Stack>
  );
}
