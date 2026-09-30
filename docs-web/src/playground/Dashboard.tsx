import { useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Combobox,
  CommandPalette,
  DatePicker,
  Dialog,
  Drawer,
  Field,
  Heading,
  IconButton,
  Inline,
  Input,
  Link,
  Menu,
  Progress,
  Pagination,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Slider,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  ToggleGroup,
  Tooltip,
  toast,
} from '@yarcl/react';
import {
  BellIcon,
  ChartIcon,
  DotsIcon,
  DownloadIcon,
  HomeIcon,
  InfoIcon,
  InvoiceIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from './icons';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
  { id: 'customers', label: 'Customers', icon: <UsersIcon /> },
  { id: 'invoices', label: 'Invoices', icon: <InvoiceIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const stats = [
  { label: 'Revenue', value: '$48,294', delta: '+12.4%', up: true },
  { label: 'Subscriptions', value: '2,318', delta: '+4.1%', up: true },
  { label: 'Open invoices', value: '87', delta: '-3.2%', up: false },
  { label: 'Churn', value: '1.9%', delta: '-0.4%', up: true },
];

const orders = [
  { id: 'INV-3021', customer: 'Ada Lovelace', plan: 'Team', status: 'Paid', amount: 1200 },
  { id: 'INV-3022', customer: 'Grace Hopper', plan: 'Pro', status: 'Pending', amount: 360 },
  { id: 'INV-3023', customer: 'Alan Turing', plan: 'Starter', status: 'Overdue', amount: 45 },
  { id: 'INV-3024', customer: 'Katherine Johnson', plan: 'Enterprise', status: 'Paid', amount: 13075 },
  { id: 'INV-3025', customer: 'Margaret Hamilton', plan: 'Team', status: 'Refunded', amount: 980 },
];

const statusColor = { Paid: 'success', Pending: 'warning', Overdue: 'danger', Refunded: 'neutral' } as const;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const customers = [
  { name: 'Ada Lovelace', email: 'ada@analytical.io', seats: 12 },
  { name: 'Grace Hopper', email: 'grace@cobol.dev', seats: 4 },
  { name: 'Alan Turing', email: 'alan@enigma.uk', seats: 1 },
];

const countries = ['Argentina', 'Canada', 'France', 'Germany', 'Japan', 'Portugal', 'Spain', 'Sweden', 'United Kingdom', 'United States'].map(
  (name) => ({ value: name.toLowerCase().replace(/\s+/g, '-'), label: name }),
);

function Navigation({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <Stack as="nav" gap="xs" aria-label="Main">
      {nav.map((item) => (
        <Button
          key={item.id}
          variant={item.id === active ? 'soft' : 'ghost'}
          color={item.id === active ? 'primary' : 'neutral'}
          className="pg-nav-item"
          aria-current={item.id === active ? 'page' : undefined}
          onClick={() => onSelect(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </Stack>
  );
}

function NewInvoiceDialog() {
  return (
    <Dialog
      trigger={
        <Button>
          <PlusIcon /> New invoice
        </Button>
      }
      title="New invoice"
      description="Send an invoice to one of your customers."
      footer={
        <Button
          onClick={() => toast({ title: 'Invoice sent', description: 'INV-3026 is on its way.', color: 'success' })}
        >
          Send invoice
        </Button>
      }
    >
      <Stack>
        <Field label="Customer" required>
          <Combobox options={customers.map((c) => ({ value: c.email, label: c.name }))} placeholder="Search customers" />
        </Field>
        <Inline align="start" wrap={false}>
          <Field label="Amount" className="pg-grow">
            <NumberInput min={0} step={0.01} placeholder="0.00" />
          </Field>
          <Field label="Due">
            <Select
              options={[
                { value: '7', label: 'In 7 days' },
                { value: '14', label: 'In 14 days' },
                { value: '30', label: 'In 30 days' },
              ]}
              defaultValue="14"
            />
          </Field>
        </Inline>
        <Field label="Note" description="Shown on the invoice.">
          <Textarea rows={3} />
        </Field>
      </Stack>
    </Dialog>
  );
}

function SettingsForm() {
  const [name, setName] = useState('Acme Inc.');
  return (
    <Stack as="form" onSubmit={(e) => e.preventDefault()}>
      <Field label="Workspace name" required error={name.trim() ? undefined : 'A name is required.'}>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Plan">
        <Select
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'team', label: 'Team' },
            { value: 'enterprise', label: 'Enterprise' },
          ]}
          defaultValue="team"
        />
      </Field>
      <Field label="Country">
        <Combobox options={countries} placeholder="Search countries" />
      </Field>
      <Field label="Data regions">
        <Combobox multiple options={countries} defaultValue={['germany', 'sweden']} placeholder="Add regions" />
      </Field>
      <Field label="Seats" description="Between 5 and 50 seats.">
        <Slider defaultValue={12} min={5} max={50} />
      </Field>
      <Field label="Renewal date">
        <DatePicker placeholder="Pick a date" />
      </Field>
      <RadioGroup label="Billing" defaultValue="yearly" orientation="horizontal">
        <Radio value="monthly">Monthly</Radio>
        <Radio value="yearly">Yearly (save 20%)</Radio>
      </RadioGroup>
      <Stack gap="sm">
        <Checkbox defaultChecked>Email me invoices</Checkbox>
        <Switch defaultChecked>Weekly report</Switch>
      </Stack>
      <Inline justify="end" gap="sm">
        <Button variant="outline" color="neutral">
          Cancel
        </Button>
        <Button type="submit" onClick={() => toast({ title: 'Settings saved', color: 'success' })}>
          Save changes
        </Button>
      </Inline>
    </Stack>
  );
}

export function Dashboard() {
  const [active, setActive] = useState('dashboard');
  const [alertOpen, setAlertOpen] = useState(true);
  const [range, setRange] = useState<string | null>('30d');

  return (
    <div className="pg-shell">
      <header className="pg-navbar">
        <Inline gap="sm" wrap={false}>
          <Drawer
            side="left"
            title="Acme"
            trigger={
              <IconButton aria-label="Open navigation" variant="ghost" color="neutral" className="pg-menu-button">
                <MenuIcon />
              </IconButton>
            }
          >
            <Navigation active={active} onSelect={setActive} />
          </Drawer>
          <span className="pg-logo" aria-hidden="true" />
          <Text textStyle="subheading">Acme</Text>
        </Inline>
        <CommandPalette
          shortcut="Mod+J"
          trigger={
            <Button className="pg-search" size="sm" variant="outline" color="neutral">
              <SearchIcon />
              Search or jump to…
            </Button>
          }
          commands={[
            ...nav.map((item) => ({
              id: item.id,
              label: `Go to ${item.label.toLowerCase()}`,
              group: 'Navigate',
              icon: item.icon,
              onSelect: () => setActive(item.id),
            })),
            { id: 'invoice', label: 'New invoice', group: 'Actions', icon: <PlusIcon />, shortcut: 'Mod+I', onSelect: () => toast({ title: 'Invoice drafted' }) },
            { id: 'export', label: 'Export report', group: 'Actions', icon: <DownloadIcon />, keywords: ['csv', 'download'], onSelect: () => toast({ title: 'Report exported', color: 'success' }) },
            { id: 'invite', label: 'Invite teammate', group: 'Actions', icon: <UsersIcon />, disabled: true },
          ]}
        />
        <Inline gap="sm" wrap={false}>
          <Tooltip content="Notifications">
            <IconButton aria-label="Notifications" variant="ghost" color="neutral">
              <BellIcon />
            </IconButton>
          </Tooltip>
          <Menu placement="bottom-end">
            <Menu.Trigger>
              <button type="button" className="pg-avatar" aria-label="Account">
                AL
              </button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Billing</Menu.Item>
              <Menu.Separator />
              <Menu.Item color="danger">Sign out</Menu.Item>
            </Menu.Content>
          </Menu>
        </Inline>
      </header>

      <aside className="pg-sidebar">
        <Navigation active={active} onSelect={setActive} />
        <Card padding="sm" className="pg-upgrade">
          <Stack gap="xs">
            <Text textStyle="label">Upgrade to Enterprise</Text>
            <Text textStyle="caption" muted>
              SSO, audit logs and priority support.
            </Text>
            <Button size="sm" variant="soft">
              Learn more
            </Button>
          </Stack>
        </Card>
      </aside>

      <main className="pg-main">
        <Stack gap="lg">
          <Inline justify="between" align="end">
            <Stack gap="xs">
              <Breadcrumb textStyle="caption">
                <Breadcrumb.Item href="#">Acme Inc</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              </Breadcrumb>
              <Heading level={1}>Dashboard</Heading>
              <Text muted>Welcome back, Ada. Here's what happened this month.</Text>
            </Stack>
            <Inline gap="sm">
              <ToggleGroup type="single" required value={range} onValueChange={setRange} size="sm" aria-label="Date range">
                <ToggleGroup.Item value="7d">7d</ToggleGroup.Item>
                <ToggleGroup.Item value="30d">30d</ToggleGroup.Item>
                <ToggleGroup.Item value="1y">1y</ToggleGroup.Item>
              </ToggleGroup>
              <Button variant="outline" color="neutral">
                <DownloadIcon /> Export
              </Button>
              <NewInvoiceDialog />
            </Inline>
          </Inline>

          {alertOpen && (
            <Alert
              color="info"
              icon={<InfoIcon />}
              title="Scheduled maintenance"
              action={
                <Button size="sm" variant="outline" color="info">
                  Details
                </Button>
              }
              onDismiss={() => setAlertOpen(false)}
            >
              Billing will be read-only on Sunday from 02:00 to 03:00 UTC.
            </Alert>
          )}

          <div className="pg-stats">
            {stats.map((stat) => (
              <Card key={stat.label} shadow="sm">
                <Stack gap="xs">
                  <Text textStyle="caption" muted>
                    {stat.label}
                  </Text>
                  <Inline justify="between" align="baseline">
                    <Text textStyle="heading">{stat.value}</Text>
                    <Badge color={stat.up ? 'success' : 'danger'}>{stat.delta}</Badge>
                  </Inline>
                </Stack>
              </Card>
            ))}
          </div>

          <div className="pg-columns">
            <Card shadow="sm" className="pg-panel">
              <Tabs defaultValue="orders">
                <Tabs.List aria-label="Records">
                  <Tabs.Trigger value="orders">Recent invoices</Tabs.Trigger>
                  <Tabs.Trigger value="customers">Customers</Tabs.Trigger>
                  <Tabs.Trigger value="archived" disabled>
                    Archived
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Panel value="orders">
                  <Stack>
                    <Table interactive caption="Recent invoices">
                      <Table.Head>
                        <Table.Row>
                          <Table.HeaderCell>Invoice</Table.HeaderCell>
                          <Table.HeaderCell>Customer</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                          <Table.HeaderCell align="end">Amount</Table.HeaderCell>
                          <Table.HeaderCell>
                            <span className="pg-visually-hidden">Actions</span>
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {orders.map((order) => (
                          <Table.Row key={order.id}>
                            <Table.Cell>
                              <Link href="#" underline="hover">
                                {order.id}
                              </Link>
                            </Table.Cell>
                            <Table.Cell>
                              <Stack gap="xs">
                                <Text>{order.customer}</Text>
                                <Text textStyle="caption" muted>
                                  {order.plan}
                                </Text>
                              </Stack>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge color={statusColor[order.status as keyof typeof statusColor]}>{order.status}</Badge>
                            </Table.Cell>
                            <Table.Cell align="end">{money.format(order.amount)}</Table.Cell>
                            <Table.Cell align="end">
                              <Menu placement="bottom-end" size="sm">
                                <Menu.Trigger>
                                  <IconButton aria-label={`Actions for ${order.id}`} size="sm" variant="ghost" color="neutral">
                                    <DotsIcon />
                                  </IconButton>
                                </Menu.Trigger>
                                <Menu.Content>
                                  <Menu.Item>View</Menu.Item>
                                  <Menu.Item>Download PDF</Menu.Item>
                                  <Menu.Separator />
                                  <Menu.Item color="danger">Void invoice</Menu.Item>
                                </Menu.Content>
                              </Menu>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                    <Inline justify="end">
                      <Pagination count={8} defaultPage={1} size="sm" aria-label="Invoice pages" />
                    </Inline>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="customers">
                  <Stack>
                    {customers.map((customer) => (
                      <Inline key={customer.email} justify="between">
                        <Inline gap="sm" align="center">
                          <Avatar name={customer.name} size="sm" />
                          <Stack gap="xs">
                            <Text textStyle="label">{customer.name}</Text>
                            <Text textStyle="caption" muted>
                              {customer.email}
                            </Text>
                          </Stack>
                        </Inline>
                        <Badge variant="outline" color="neutral">
                          {customer.seats} seats
                        </Badge>
                      </Inline>
                    ))}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Card>

            <Card shadow="sm" className="pg-panel">
              <Stack>
                <Stack gap="xs">
                  <Heading level={2} textStyle="subheading">
                    Workspace settings
                  </Heading>
                  <Text textStyle="caption" muted>
                    Changes apply to everyone in Acme.
                  </Text>
                </Stack>
                <Progress value={18} max={25} label="Seats used" showValue formatValue={(v, max) => `${v} of ${max}`} />
                <SettingsForm />
              </Stack>
            </Card>
          </div>
        </Stack>
      </main>
    </div>
  );
}
