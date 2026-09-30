import { useState, type ReactNode } from 'react';
import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Divider,
  Field,
  Heading,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  Breadcrumb,
  NumberInput,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Switch,
  Text,
  Textarea,
  Toaster,
  ToggleGroup,
  VisuallyHidden,
  config,
  type Color,
  type Radius,
  type Shadow,
  type Size,
  type Spacing,
  type TextStyle,
  type Variant,
} from '@yarcl/react';
import { DesignReference } from '@yarcl/react/reference';
import { DatePickerDemo } from './DatePickerDemo';
import { FeedbackDemo } from './FeedbackDemo';
import { FloatingDemo } from './FloatingDemo';
import { OverlaysDemo } from './OverlaysDemo';
import { PlusIcon, SearchIcon } from './icons';

const keys = <T extends string>(o: object) => Object.keys(o) as T[];
const sizes = keys<Size>(config.sizes);
const radii = keys<Radius>(config.radii);
const colors = keys<Color>(config.colors);
const variants = keys<Variant>(config.variants);
const spacings = keys<Spacing>(config.spacing);
const shadows = keys<Shadow>(config.shadows);
const textStyles = keys<TextStyle>(config.typography.styles);

type Scheme = 'light dark' | 'light' | 'dark';

function initialScheme(): Scheme {
  const param = new URLSearchParams(location.search).get('scheme');
  return param === 'light' || param === 'dark' ? param : 'light dark';
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack as="section" gap="tight">
      <Heading level={2}>{title}</Heading>
      {children}
    </Stack>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Inline gap="tight">
      <Text as="code" textStyle="code" muted className="label">
        {label}
      </Text>
      {children}
    </Inline>
  );
}

export function App() {
  const [scheme, setScheme] = useState<Scheme>(() => {
    const s = initialScheme();
    document.documentElement.style.colorScheme = s;
    return s;
  });
  const [email, setEmail] = useState('not-an-email');

  function applyScheme(next: Scheme) {
    document.documentElement.style.colorScheme = next;
    setScheme(next);
  }

  const reference = new URLSearchParams(location.search).get('page') === 'reference';

  return (
    <Stack as="main" gap="loose" className="page">
      <Inline as="header" justify="between">
        <Heading level={1} textStyle="display">
          yarcl
        </Heading>
        <Inline gap="tight">
          <Link href={reference ? '?' : '?page=reference'} underline="hover">
            {reference ? 'Component demo' : 'Design reference'}
          </Link>
          {(['light dark', 'light', 'dark'] as Scheme[]).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={scheme === s ? 'solid' : 'outline'}
              color="neutral"
              onClick={() => applyScheme(s)}
            >
              {s === 'light dark' ? 'system' : s}
            </Button>
          ))}
        </Inline>
      </Inline>
      {reference ? (
        <DesignReference title="Consumer A design system" />
      ) : (
        <>
          <Section title="Sizes">
            {sizes.map((size) => (
              <Row key={size} label={size}>
                <Input size={size} placeholder={`Input ${size}`} />
                <NumberInput size={size} aria-label="Quantity" defaultValue={1} min={0} />
                <Button size={size}>
                  <PlusIcon /> Button
                </Button>
                <IconButton size={size} aria-label="Search" variant="outline">
                  <SearchIcon />
                </IconButton>
                <Checkbox size={size} defaultChecked>
                  Check
                </Checkbox>
                <Switch size={size} defaultChecked>
                  Switch
                </Switch>
              </Row>
            ))}
          </Section>
          <Section title="Variants × colors">
            {colors.map((color) => (
              <Row key={color} label={color}>
                {variants.map((variant) => (
                  <Button key={variant} color={color} variant={variant}>
                    {variant}
                  </Button>
                ))}
                <Button color={color} disabled>
                  disabled
                </Button>
              </Row>
            ))}
          </Section>

          <Section title="Selection controls">
            {colors.map((color) => (
              <Row key={color} label={color}>
                <Checkbox color={color} defaultChecked>
                  Checked
                </Checkbox>
                <Checkbox color={color} indeterminate>
                  Mixed
                </Checkbox>
                <Radio color={color} name={`radio-${color}`} defaultChecked>
                  One
                </Radio>
                <Radio color={color} name={`radio-${color}`}>
                  Two
                </Radio>
                <Switch color={color} defaultChecked>
                  On
                </Switch>
              </Row>
            ))}
            <Row label="disabled">
              <Checkbox disabled>Checkbox</Checkbox>
              <Radio disabled>Radio</Radio>
              <Switch disabled defaultChecked>
                Switch
              </Switch>
            </Row>
          </Section>

          <Section title="Sliders">
            <Stack className="form" data-testid="sliders">
              {sizes.map((size) => (
                <Slider key={size} size={size} defaultValue={40} aria-label={`Volume ${size}`} />
              ))}
              <Slider.Range defaultValue={[20, 80]} step={5} aria-label="Price" formatValue={(v) => `$${v}`} />
              <Slider color="success" radius="rounded" defaultValue={60} aria-label="Brightness" />
              <Slider disabled defaultValue={30} aria-label="Disabled volume" />
            </Stack>
          </Section>

          <Section title="Fields">
            <Stack className="form">
              <Field label="Name" description="As it appears on your ID." required>
                <Input placeholder="Ada Lovelace" />
              </Field>
              <Field label="Email" error={email.includes('@') ? undefined : 'Enter a valid email address.'}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Guests" description="Between 1 and 12 people.">
                <NumberInput min={1} max={12} defaultValue={2} />
              </Field>
              <Field label="Budget" error="Enter a budget of at least 50.">
                <NumberInput step={10} placeholder="50" />
              </Field>
              <Field label="Message" description="One row tall by default, same height as an input.">
                <Textarea rows={1} placeholder="Say hello" />
              </Field>
              <RadioGroup label="Plan" description="You can change this later." defaultValue="pro" orientation="horizontal">
                <Radio value="free">Free</Radio>
                <Radio value="pro">Pro</Radio>
                <Radio value="team">Team</Radio>
              </RadioGroup>
              <RadioGroup label="Billing" error="Choose how often to pay.">
                <Radio value="monthly">Monthly</Radio>
                <Radio value="yearly">Yearly</Radio>
              </RadioGroup>
              <Field label="Volume" description="Use the arrow keys for fine steps.">
                <Slider defaultValue={40} name="volume" />
              </Field>
              <Field label="Price range" error="Pick a narrower range.">
                <Slider defaultValue={[10, 90]} min={0} max={200} step={10} />
              </Field>
              <Field label="Terms" error="You must accept the terms.">
                <Checkbox>I accept the terms</Checkbox>
              </Field>
            </Stack>
          </Section>

          <Section title="Labels">
            <Stack className="form">
              <Inline gap="tight" wrap={false}>
                <Label htmlFor="label-city" className="label" required>
                  City
                </Label>
                <Input id="label-city" placeholder="Zurich" required className="grow" />
              </Inline>
              <Stack gap="tight">
                <Label id="label-birth">Date of birth</Label>
                <Inline role="group" aria-labelledby="label-birth" gap="tight" wrap={false}>
                  <Input aria-label="Day" placeholder="DD" className="grow" inputMode="numeric" />
                  <Input aria-label="Month" placeholder="MM" className="grow" inputMode="numeric" />
                  <Input aria-label="Year" placeholder="YYYY" className="grow" inputMode="numeric" />
                </Inline>
              </Stack>
              <Stack gap="tight">
                <Label id="label-frequency" color="brand" variant="subtle" size="lg" radius="rounded">
                  Digest frequency
                </Label>
                <ToggleGroup type="single" defaultValue="weekly" aria-labelledby="label-frequency">
                  <ToggleGroup.Item value="daily">Daily</ToggleGroup.Item>
                  <ToggleGroup.Item value="weekly">Weekly</ToggleGroup.Item>
                  <ToggleGroup.Item value="monthly">Monthly</ToggleGroup.Item>
                </ToggleGroup>
              </Stack>
              <Inline gap="tight" wrap={false}>
                <Label htmlFor="label-nickname" className="label" disabled>
                  Nickname
                </Label>
                <Input id="label-nickname" placeholder="Unavailable" disabled className="grow" />
              </Inline>
            </Stack>
          </Section>

          <Section title="Floating">
            <FloatingDemo />
          </Section>

          <Section title="Date picker">
            <DatePickerDemo />
          </Section>

          <Section title="Overlays, tabs, table">
            <OverlaysDemo />
          </Section>

          <Section title="Accordion">
            <Accordion type="single" defaultValue="shipping" data-testid="faq">
              <Accordion.Item value="shipping">
                <Accordion.Trigger>Shipping</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Orders ship within two working days.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="returns">
                <Accordion.Trigger>Returns</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Free returns within 30 days.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="gift-cards" disabled>
                <Accordion.Trigger>Gift cards</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Coming soon.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="warranty">
                <Accordion.Trigger>Warranty</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Two years on every product.</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Accordion type="multiple" defaultValue={['account']} size="sm" color="success" data-testid="settings">
              <Accordion.Item value="account">
                <Accordion.Trigger>Account</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Name, email and password.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="notifications">
                <Accordion.Trigger>Notifications</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Email and push preferences.</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Section>

          <Section title="Feedback">
            <FeedbackDemo />
          </Section>

          <Section title="Groups">
            <Inline>
              <ButtonGroup aria-label="Pagination" variant="outline" color="neutral">
                <Button>Previous</Button>
                <Button>1</Button>
                <Button>2</Button>
                <Button>Next</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Save options">
                <Button>Save</Button>
                <IconButton aria-label="More save options">
                  <PlusIcon />
                </IconButton>
              </ButtonGroup>
              <ButtonGroup aria-label="Actions" attached={false} size="sm" variant="subtle">
                <Button>Copy</Button>
                <Button>Share</Button>
              </ButtonGroup>
            </Inline>
            <Inline>
              <ToggleGroup type="single" defaultValue="week" required aria-label="Range" data-testid="range">
                <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
                <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
                <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
                <ToggleGroup.Item value="year" disabled>
                  Year
                </ToggleGroup.Item>
              </ToggleGroup>
              <ToggleGroup type="multiple" defaultValue={['bold']} aria-label="Formatting" color="neutral" variant="quiet" selectedVariant="subtle">
                <ToggleGroup.Item value="bold" icon aria-label="Bold">
                  <b>B</b>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="italic" icon aria-label="Italic">
                  <i>I</i>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="underline" icon aria-label="Underline">
                  <u>U</u>
                </ToggleGroup.Item>
              </ToggleGroup>
              <ToggleGroup type="single" defaultValue="grid" aria-label="View" size="sm" radius="rounded" attached={false} variant="quiet" selectedVariant="solid">
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
                <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
              </ToggleGroup>
            </Inline>
          </Section>

          <Section title="Typography">
            {([1, 2, 3, 4, 5, 6] as const).map((level) => (
              <Row key={level} label={`h${level} → ${config.typography.headings[`h${level}`]}`}>
                <Heading level={level}>Heading level {level}</Heading>
              </Row>
            ))}
            {textStyles.map((style) => (
              <Row key={style} label={style}>
                <Text textStyle={style}>The quick brown fox</Text>
              </Row>
            ))}
            <Row label="color">
              {colors.map((color) => (
                <Text key={color} color={color}>
                  {color}
                </Text>
              ))}
              <Text muted>muted</Text>
            </Row>
            <Row label="link">
              <Text>
                Read the <Link href="#">documentation</Link>, or visit <Link href="https://example.com" external>example.com</Link>.
              </Text>
              <Link href="#" underline="hover" color="neutral">
                Hover underline
              </Link>
            </Row>
            <Row label="breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Apollo</Breadcrumb.Item>
                <Breadcrumb.Item>Settings</Breadcrumb.Item>
              </Breadcrumb>
            </Row>
            <Row label="collapsed breadcrumb">
              <Breadcrumb aria-label="Documentation path" maxItems={3} separator="/">
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Documentation</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Navigation</Breadcrumb.Item>
                <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
              </Breadcrumb>
            </Row>
            <Row label="truncate">
              <Text truncate className="narrow">
                A single line that is much too long for its box and gets an ellipsis
              </Text>
              <Text truncate={2} className="narrow">
                Two lines of text that keep going well past the second line, so the rest is clamped away with an ellipsis at the end.
              </Text>
            </Row>
          </Section>

          <Section title="Layout">
            <Button variant="outline" data-testid="visually-hidden-demo">
              <SearchIcon />
              <VisuallyHidden>Search projects</VisuallyHidden>
            </Button>
            {spacings.map((gap) => (
              <Row key={gap} label={`gap ${gap}`}>
                <Inline gap={gap}>
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className="box" />
                  ))}
                </Inline>
              </Row>
            ))}
            <Inline gap="normal" align="stretch">
              {shadows.map((shadow) => (
                <Card key={shadow} shadow={shadow} className="card">
                  <Stack gap="tight">
                    <Heading level={3} textStyle="body">
                      Card
                    </Heading>
                    <Text textStyle="caption" muted>
                      shadow="{shadow}"
                    </Text>
                  </Stack>
                </Card>
              ))}
              <Card radius="xl" padding="loose" className="card">
                <Stack gap="tight">
                  <Heading level={3} textStyle="body">
                    Card
                  </Heading>
                  <Text textStyle="caption" muted>
                    no shadow, padding="loose"
                  </Text>
                </Stack>
              </Card>
            </Inline>
            <Card>
              <Stack>
                <Heading level={3}>Delete project</Heading>
                <Text as="p" muted>
                  This removes the project and all of its data. It can't be undone.
                </Text>
                <Divider />
                <Inline justify="between">
                  <Inline gap="tight">
                    <Text textStyle="caption">3 members</Text>
                    <Divider orientation="vertical" />
                    <Text textStyle="caption">12 files</Text>
                  </Inline>
                  <Inline gap="tight">
                    <Button variant="outline" color="neutral">
                      Cancel
                    </Button>
                    <Button color="danger">Delete</Button>
                  </Inline>
                </Inline>
              </Stack>
            </Card>
          </Section>

          <Section title="Radii">
            {radii.map((radius) => (
              <Row key={radius} label={radius}>
                <Input radius={radius} placeholder={radius} />
                <Button radius={radius}>{radius}</Button>
                <IconButton radius={radius} aria-label="Add" variant="subtle">
                  <PlusIcon />
                </IconButton>
              </Row>
            ))}
          </Section>
        </>
      )}
      <Toaster />
    </Stack>
  );
}
