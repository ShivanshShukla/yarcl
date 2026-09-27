import { useState } from 'react';
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  CommandPalette,
  DatePicker,
  Combobox,
  Dialog,
  Divider,
  EmptyState,
  Heading,
  Inline,
  Label,
  Link,
  Progress,
  Pagination,
  NumberInput,
  Select,
  Slider,
  Stack,
  Table,
  Tabs,
  Text,
  Toaster,
  ToggleGroup,
  toast,
} from '@yarcl/react';
import { DesignReference } from '@yarcl/react/reference';

const garmentSizes = ['XS', 'S', 'M', 'L', 'XL'];
const occasions = ['Office', 'Weekend', 'Travel', 'Evening'].map((label) => ({ value: label.toLowerCase(), label }));
const shades = [
  { value: 'natural', label: 'Natural linen' },
  { value: 'charcoal', label: 'Charcoal' },
  { value: 'olive', label: 'Olive' },
];

type Scheme = 'light dark' | 'light' | 'dark';

export function App() {
  const params = new URLSearchParams(location.search);
  const [scheme, setScheme] = useState<Scheme>(() => {
    const s = params.get('scheme');
    const initial: Scheme = s === 'light' || s === 'dark' ? s : 'light dark';
    document.documentElement.style.colorScheme = initial;
    return initial;
  });
  const [size, setSize] = useState<string | null>(null);
  const [shade, setShade] = useState<string | null>('natural');
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(1);

  function applyScheme(next: Scheme) {
    document.documentElement.style.colorScheme = next;
    setScheme(next);
  }

  function addToBag() {
    if (!size) {
      setSizeError(true);
      return;
    }
    toast({ title: 'Added to bag', description: `Linen overshirt · ${size} · ${shade} · ${quantity ?? 1}`, color: 'moss' });
  }

  return (
    <Stack as="main" gap="12" className="page">
      <Inline as="header" justify="between">
        <Text textStyle="title">Maison Talla</Text>
        <Inline gap="4">
          <Link href="?page=shop" underline="hover" color="ink">
            Shop
          </Link>
          <Link href="?page=reference" underline="hover" color="ink">
            Design reference
          </Link>
          <AvatarGroup aria-label="Design team" max={2} total={4}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Alan Turing" />
          </AvatarGroup>
          <CommandPalette
            trigger={
              <Button variant="text" size="talla-s">
                Search
              </Button>
            }
            placeholder="Search the shop…"
            commands={[
              { id: 'shop', label: 'Shop', group: 'Pages', onSelect: () => location.assign('?page=shop') },
              { id: 'reference', label: 'Design reference', group: 'Pages', onSelect: () => location.assign('?page=reference') },
              { id: 'bag', label: 'Add to bag', group: 'Actions', shortcut: 'Mod+B', onSelect: addToBag },
              { id: 'wishlist', label: 'Save to wishlist', group: 'Actions', onSelect: () => toast({ title: 'Saved to wishlist', color: 'clay' }) },
            ]}
          />
          <ToggleGroup
            type="single"
            required
            value={scheme}
            onValueChange={(v) => v && applyScheme(v as Scheme)}
            size="talla-s"
            variant="text"
            selectedVariant="line"
            aria-label="Color scheme"
          >
            <ToggleGroup.Item value="light dark">Auto</ToggleGroup.Item>
            <ToggleGroup.Item value="light">Light</ToggleGroup.Item>
            <ToggleGroup.Item value="dark">Dark</ToggleGroup.Item>
          </ToggleGroup>
        </Inline>
      </Inline>

      {params.get('page') === 'reference' ? (
        <DesignReference title="Maison Talla design system" />
      ) : (
        <div className="product">
          <div className="product-image" role="img" aria-label="Linen overshirt in natural" />
          <Stack gap="6">
            <Stack gap="2">
              <Breadcrumb maxItems={3}>
                <Breadcrumb.Item href="?page=shop">Shop</Breadcrumb.Item>
                <Breadcrumb.Item href="?page=shop&category=women">Women</Breadcrumb.Item>
                <Breadcrumb.Item href="?page=shop&category=shirts">Shirts</Breadcrumb.Item>
                <Breadcrumb.Item>Linen overshirt</Breadcrumb.Item>
              </Breadcrumb>
              <Inline gap="2">
                <Badge color="clay">New season</Badge>
                <Badge color="moss" variant="line">
                  Organic linen
                </Badge>
              </Inline>
              <Inline gap="2" align="center">
                <Avatar name="Lena Ortiz" />
                <Text textStyle="fine" muted>
                  Curated by Lena Ortiz
                </Text>
              </Inline>
              <Heading level={1}>Linen overshirt</Heading>
              <Text textStyle="price">€ 185</Text>
              <Inline gap="2">
                <Label variant="wash" color="clay" size="talla-s" radius="hairline">
                  Linen
                </Label>
                <Label variant="line" color="moss">
                  Free returns
                </Label>
                <Label color="alert" required>
                  Low stock
                </Label>
              </Inline>
            </Stack>
            <Text as="p" textStyle="lead" muted>
              Cut from heavyweight Portuguese linen that softens with every wash. Relaxed through the body, with a
              straight hem made to be worn open.
            </Text>

            <Stack gap="2">
              <Inline justify="between">
                <Label id="size-label">
                  SIZE
                </Label>
                <Dialog
                  trigger={
                    <Button variant="text" size="talla-s">
                      Size guide
                    </Button>
                  }
                  title="Size guide"
                  description="Body measurements in centimetres."
                  size="regular"
                >
                  <Table caption="Chest and length">
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>Size</Table.HeaderCell>
                        <Table.HeaderCell align="end">Chest</Table.HeaderCell>
                        <Table.HeaderCell align="end">Length</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {garmentSizes.map((s, i) => (
                        <Table.Row key={s}>
                          <Table.Cell>{s}</Table.Cell>
                          <Table.Cell align="end">{96 + i * 6}</Table.Cell>
                          <Table.Cell align="end">{72 + i * 2}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Dialog>
              </Inline>
              <ToggleGroup
                type="single"
                value={size}
                onValueChange={(v) => {
                  setSize(v);
                  setSizeError(false);
                }}
                attached={false}
                variant="line"
                selectedVariant="filled"
                aria-labelledby="size-label"
              >
                {garmentSizes.map((s) => (
                  <ToggleGroup.Item key={s} value={s} icon>
                    {s}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup>
              {sizeError && (
                <Text textStyle="fine" color="alert" role="alert">
                  Choose a size first.
                </Text>
              )}
            </Stack>

            <Inline gap="2">
              <Select options={shades} value={shade} onValueChange={setShade} aria-label="Shade" />
              <NumberInput value={quantity} onValueChange={setQuantity} min={1} max={5} aria-label="Quantity" />
            </Inline>

            <Combobox multiple options={occasions} defaultValue={['office']} aria-label="Occasions" placeholder="Add occasions" />

            <Stack gap="2">
              <Text textStyle="label" id="sleeve-label">
                SLEEVE LENGTH
              </Text>
              <Slider aria-labelledby="sleeve-label" defaultValue={[58, 64]} min={54} max={70} step={2} formatValue={(v) => `${v} cm`} />
            </Stack>
            <DatePicker aria-label="Delivery date" defaultValue={new Date(2026, 9, 5)} min={new Date(2026, 9, 1)} />

            <Stack gap="2">
              <Text textStyle="label">Hem length</Text>
              <Slider aria-label="Hem length" size="talla-m" defaultValue={50} />
            </Stack>

            <Stack gap="2">
              <Text textStyle="label">Fit range</Text>
              <Slider.Range aria-label="Fit range" size="talla-m" defaultValue={[30, 70]} step={10} color="clay" />
            </Stack>

            <ButtonGroup attached={false} size="talla-l">
              <Button onClick={addToBag} className="grow">
                Add to bag
              </Button>
              <Button variant="line" onClick={() => toast({ title: 'Saved to wishlist', color: 'clay' })}>
                Save
              </Button>
            </ButtonGroup>

            <Alert color="clay" title="Free returns within 30 days">
              Delivered in 2–4 working days across the EU.
            </Alert>

            <Progress value={185} max={200} label="€ 15 away from free express shipping" />

            <Divider />

            <EmptyState
              data-testid="brand-b-empty-state"
              headingLevel={2}
              icon={<span>★</span>}
              title="No reviews yet"
              description="Be the first to review this piece."
              actions={<Button variant="line">Write a review</Button>}
            />

            <Tabs defaultValue="details">
              <Tabs.List aria-label="Product information">
                <Tabs.Trigger value="details">Details</Tabs.Trigger>
                <Tabs.Trigger value="care">Care</Tabs.Trigger>
                <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Panel value="details">
                <Text as="p">100% linen, 230 gsm. Corozo buttons. Made in Porto.</Text>
              </Tabs.Panel>
              <Tabs.Panel value="care">
                <Text as="p">Machine wash at 30°. Line dry. Iron while damp.</Text>
              </Tabs.Panel>
              <Tabs.Panel value="shipping">
                <Text as="p">Carbon-neutral shipping. Duties included.</Text>
              </Tabs.Panel>
            </Tabs>

            <Pagination count={9} defaultPage={5} color="ink" aria-label="Reviews" />
            <Accordion type="multiple" defaultValue={['fit']} color="moss">
              <Accordion.Item value="fit">
                <Accordion.Trigger>Fit</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Relaxed. Take your usual size.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="materials">
                <Accordion.Trigger>Materials</Accordion.Trigger>
                <Accordion.Content>
                  <Text as="p">Heavyweight linen from northern Portugal.</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </div>
      )}
      <Toaster placement="top-right" />
    </Stack>
  );
}
