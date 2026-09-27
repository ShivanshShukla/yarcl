import { useState } from 'react';
import { Accordion, Avatar, AvatarGroup, Badge, Breadcrumb, Inline, Pagination, Stack, Table, Tabs, Text, ToggleGroup, config, type Density } from '@yarcl/react';

const avatarImage = '/avatar-demo.svg';

export function AvatarDemo() {
  return (
    <Stack gap="sm">
      <Inline gap="sm">
        <Avatar name="Ada Lovelace" src={avatarImage} />
        <Avatar name="Grace Hopper" color="success" />
        <Avatar name="Alan Turing" color="warning" variant="outline" />
      </Inline>
      <AvatarGroup max={3} total={5} aria-label="Project members">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" color="success" />
        <Avatar name="Alan Turing" color="warning" />
        <Avatar name="Katherine Johnson" color="danger" />
      </AvatarGroup>
    </Stack>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="demo-wide">
      <Tabs.List aria-label="Project">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <Text as="p">Overview panel. Use the arrow keys to move between tabs.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="activity">
        <Text as="p">Activity panel.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Text as="p">Settings panel.</Text>
      </Tabs.Panel>
    </Tabs>
  );
}

const invoices = [
  { id: 'INV-1042', customer: 'Ada Lovelace', status: 'Paid', amount: 1200 },
  { id: 'INV-1043', customer: 'Grace Hopper', status: 'Pending', amount: 860.5 },
  { id: 'INV-1044', customer: 'Alan Turing', status: 'Overdue', amount: 45 },
  { id: 'INV-1045', customer: 'Katherine Johnson', status: 'Paid', amount: 13075.25 },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const statusColor = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;

export function TableDemo() {
  const [density, setDensity] = useState<string | null>(config.defaults.density);
  return (
    <Stack className="demo-wide">
      <ToggleGroup type="single" required value={density} onValueChange={setDensity} size="sm" aria-label="Density">
        {Object.keys(config.density).map((key) => (
          <ToggleGroup.Item key={key} value={key}>
            {key}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>
      <Table density={(density ?? undefined) as Density | undefined} striped interactive caption="Invoices">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Invoice</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell align="end">Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {invoices.map((invoice) => (
            <Table.Row key={invoice.id}>
              <Table.Cell>
                <Text textStyle="code">{invoice.id}</Text>
              </Table.Cell>
              <Table.Cell>{invoice.customer}</Table.Cell>
              <Table.Cell>
                <Badge color={statusColor[invoice.status as keyof typeof statusColor]}>{invoice.status}</Badge>
              </Table.Cell>
              <Table.Cell align="end">{money.format(invoice.amount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(6);
  return (
    <Stack>
      <Pagination count={20} page={page} onPageChange={setPage} aria-label="Search results" />
      <Text muted>
        Page {page} of 20
      </Text>
    </Stack>
  );
}

export function PaginationStylesDemo() {
  return (
    <Stack>
      <Pagination count={10} defaultPage={4} attached variant="outline" selectedVariant="solid" color="neutral" aria-label="Attached example" />
      <Pagination count={50} defaultPage={25} siblings={2} boundaries={2} size="sm" aria-label="Wider range example" />
      <Pagination count={5} defaultPage={2} radius="rounded" variant="ghost" aria-label="Rounded example" />
    </Stack>
  );
}

export function BreadcrumbDemo() {
  return (
    <Stack gap="md">
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Apollo</Breadcrumb.Item>
        <Breadcrumb.Item>Settings</Breadcrumb.Item>
      </Breadcrumb>
      <Breadcrumb aria-label="Documentation path" separator="/" maxItems={3}>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Documentation</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Components</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Navigation</Breadcrumb.Item>
        <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
      </Breadcrumb>
    </Stack>
  );
}

const faq = [
  { value: 'shipping', title: 'Shipping', body: 'Orders ship within two working days.' },
  { value: 'returns', title: 'Returns', body: 'Free returns within 30 days of delivery.' },
  { value: 'gift-cards', title: 'Gift cards', body: 'Coming soon.', disabled: true },
  { value: 'warranty', title: 'Warranty', body: 'Two years on every product.' },
];

export function AccordionDemo() {
  return (
    <Accordion type="single" defaultValue="shipping" className="demo-wide">
      {faq.map((item) => (
        <Accordion.Item key={item.value} value={item.value} disabled={item.disabled}>
          <Accordion.Trigger>{item.title}</Accordion.Trigger>
          <Accordion.Content>
            <Text as="p">{item.body}</Text>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

const settings = [
  { value: 'account', title: 'Account', body: 'Name, email and password.' },
  { value: 'notifications', title: 'Notifications', body: 'Email and push preferences.' },
  { value: 'privacy', title: 'Privacy', body: 'Who can see your profile.' },
];

export function AccordionMultipleDemo() {
  const [open, setOpen] = useState<string[]>(['account']);
  return (
    <Stack className="demo-wide">
      <Text textStyle="caption" muted>
        Open: {open.length ? open.map((v) => settings.find((s) => s.value === v)?.title).join(', ') : 'none'}
      </Text>
      <Accordion type="multiple" value={open} onValueChange={setOpen} size="sm" color="success">
        {settings.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
            <Accordion.Content>
              <Text as="p">{item.body}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
}
