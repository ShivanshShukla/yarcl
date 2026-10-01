import { useMemo, useState } from 'react';
import {
  Button,
  CommandPalette,
  Dialog,
  Drawer,
  Field,
  Inline,
  Input,
  Link,
  Pagination,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  config,
  toast,
  type Color,
  type CommandPaletteCommand,
  type Density,
  type SortDirection,
} from '@yarcl/react';

const colors = Object.keys(config.colors) as Color[];
const densities = (Object.keys(config.density) as Density[]).map((d) => ({ value: d, label: d }));

const customers = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Katherine Johnson',
  'Margaret Hamilton',
  'John von Neumann',
  'Claude Shannon',
  'Hedy Lamarr',
  'Tim Berners-Lee',
  'Dorothy Vaughan',
];

const statuses = ['Paid', 'Pending', 'Overdue'] as const;

const initialInvoices = [
  { id: 'INV-1042', customer: 'Ada Lovelace', status: 'Paid' as const, amount: 1200 },
  { id: 'INV-1043', customer: 'Grace Hopper', status: 'Pending' as const, amount: 860.5 },
  { id: 'INV-1044', customer: 'Alan Turing', status: 'Overdue' as const, amount: 45 },
  { id: 'INV-1045', customer: 'Katherine Johnson', status: 'Paid' as const, amount: 13075.25 },
  ...Array.from({ length: 996 }, (_, i) => ({
    id: `INV-${1046 + i}`,
    customer: customers[i % customers.length],
    status: statuses[i % statuses.length],
    amount: ((i * 37 + 120) % 5000) + 50,
  })),
];

const ran = (title: string) => () => toast({ title });

const commands: CommandPaletteCommand[] = [
  { id: 'dashboard', label: 'Go to dashboard', group: 'Navigation', shortcut: 'G D', onSelect: ran('Opened dashboard') },
  { id: 'projects', label: 'Go to projects', group: 'Navigation', onSelect: ran('Opened projects') },
  { id: 'settings', label: 'Open settings', group: 'Navigation', keywords: ['preferences'], shortcut: 'Mod+,', onSelect: ran('Opened settings') },
  { id: 'new-project', label: 'New project', group: 'Actions', shortcut: 'Mod+Shift+N', onSelect: ran('Project created') },
  { id: 'invite', label: 'Invite teammate', group: 'Actions', keywords: ['member', 'user'], onSelect: ran('Invite sent') },
  { id: 'theme', label: 'Toggle dark mode', group: 'Actions', keywords: ['theme', 'appearance'], onSelect: ran('Theme toggled') },
  { id: 'archive', label: 'Archive project', group: 'Actions', disabled: true },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `recent-${i}`,
    label: `Recent file ${i + 1}`,
    group: 'Recent files',
    onSelect: ran(`Opened recent file ${i + 1}`),
  })),
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function OverlaysDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [density, setDensity] = useState<Density>(config.defaults.density);
  const [invoicePage, setInvoicePage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(['INV-1042']));
  const [sortField, setSortField] = useState<'customer' | 'amount' | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  const sortedInvoices = useMemo(() => {
    if (!sortField || !sortDirection || sortDirection === 'none') return initialInvoices;
    return [...initialInvoices].sort((a, b) => {
      const cmp = sortField === 'customer' ? a.customer.localeCompare(b.customer) : a.amount - b.amount;
      return sortDirection === 'ascending' ? cmp : -cmp;
    });
  }, [sortField, sortDirection]);

  const allSelected = sortedInvoices.length > 0 && selectedIds.size === sortedInvoices.length;
  const someSelected = selectedIds.size > 0;

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(sortedInvoices.map((inv) => inv.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Stack gap="loose">
      <Inline>
        <Dialog
          trigger={<Button>Open dialog</Button>}
          title="Invite a teammate"
          description="They'll get an email with a link to join."
          footer={
            <>
              <Button variant="outline" color="neutral" onClick={() => toast({ title: 'From inside the dialog' })}>
                Toast from dialog
              </Button>
              <Button onClick={() => toast({ title: 'Invite sent', color: 'success' })}>Send invite</Button>
            </>
          }
        >
          <Stack>
            <Field label="Email">
              <Input type="email" placeholder="grace@example.com" />
            </Field>
            <Text textStyle="caption" muted>
              Press Esc or click outside to close.
            </Text>
            <Dialog
              trigger={
                <Button variant="outline" color="neutral" size="sm">
                  Open nested dialog
                </Button>
              }
              title="Nested dialog"
              description="Only this dialog's backdrop is visible."
              size="sm"
            />
          </Stack>
        </Dialog>

        <Button color="danger" variant="outline" onClick={() => setConfirmOpen(true)}>
          Controlled dialog
        </Button>
        <Dialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete project?"
          description="This removes the project and all of its data. It can't be undone."
          size="sm"
          footer={
            <>
              <Button variant="outline" color="neutral" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  setConfirmOpen(false);
                  toast({ title: 'Project deleted', color: 'danger', action: { label: 'Undo', onClick: () => toast({ title: 'Restored' }) } });
                }}
              >
                Delete
              </Button>
            </>
          }
        />

        <CommandPalette commands={commands} trigger={<Button variant="outline">Command palette</Button>} />

        <Drawer side="left" trigger={<Button variant="outline">Left drawer</Button>} title="Navigation">
          <Stack as="nav" gap="tight">
            {['Dashboard', 'Projects', 'Team', 'Settings'].map((item) => (
              <Link key={item} href="#" underline="hover" color="neutral">
                {item}
              </Link>
            ))}
          </Stack>
        </Drawer>
        <Drawer
          trigger={<Button variant="outline">Right drawer</Button>}
          title="Filters"
          description="Narrow down the list."
          footer={<Button>Apply</Button>}
        >
          <Stack>
            {Array.from({ length: 12 }, (_, i) => (
              <Field key={i} label={`Filter ${i + 1}`}>
                <Input />
              </Field>
            ))}
          </Stack>
        </Drawer>
      </Inline>

      <Inline gap="tight">
        {colors.map((color) => (
          <Button key={color} size="sm" variant="subtle" color={color} onClick={() => toast({ title: `${color} toast`, description: 'Dismisses in 5 seconds.', color })}>
            Toast {color}
          </Button>
        ))}
        <Button size="sm" variant="outline" color="neutral" onClick={() => toast({ title: 'Sticky', description: 'Stays until dismissed.', duration: 0 })}>
          Sticky toast
        </Button>
      </Inline>

      <Tabs defaultValue="overview">
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

      <Stack gap="tight">
        <Inline justify="between" align="center">
          <Field label="Density">
            <Select options={densities} value={density} onValueChange={(d) => d && setDensity(d)} size="sm" />
          </Field>
          <Text textStyle="caption" muted>
            {selectedIds.size} of {sortedInvoices.length} selected
          </Text>
        </Inline>
        <Table density={density} striped interactive stickyHeader caption="Invoices" wrapStyle={{ maxHeight: '22rem' }}>
          <Table.Head>
            <Table.Row>
              <Table.SelectAllCell
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onCheckedChange={toggleAll}
              />
              <Table.HeaderCell>Invoice</Table.HeaderCell>
              <Table.HeaderCell
                sortable
                sortDirection={sortField === 'customer' ? sortDirection : undefined}
                onSort={(dir) => {
                  setSortField('customer');
                  setSortDirection(dir);
                }}
              >
                Customer
              </Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell
                align="end"
                sortable
                sortDirection={sortField === 'amount' ? sortDirection : undefined}
                onSort={(dir) => {
                  setSortField('amount');
                  setSortDirection(dir);
                }}
              >
                Amount
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.VirtualBody items={sortedInvoices} rowHeight={36}>
            {(invoice) => (
              <Table.Row key={invoice.id} selected={selectedIds.has(invoice.id)}>
                <Table.SelectionCell
                  aria-label={`Select invoice ${invoice.id}`}
                  checked={selectedIds.has(invoice.id)}
                  onCheckedChange={() => toggleRow(invoice.id)}
                />
                <Table.Cell>
                  <Text textStyle="code">{invoice.id}</Text>
                </Table.Cell>
                <Table.Cell>{invoice.customer}</Table.Cell>
                <Table.Cell>
                  <Text color={invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}>
                    {invoice.status}
                  </Text>
                </Table.Cell>
                <Table.Cell align="end">{money.format(invoice.amount)}</Table.Cell>
              </Table.Row>
            )}
          </Table.VirtualBody>
        </Table>
        <Inline justify="between">
          <Text muted aria-live="polite" data-testid="invoice-page">
            Page {invoicePage} of 12
          </Text>
          <Pagination count={12} page={invoicePage} onPageChange={setInvoicePage} aria-label="Invoice pages" />
        </Inline>
        <Pagination
          count={50}
          defaultPage={10}
          siblings={2}
          attached
          size="sm"
          color="neutral"
          variant="outline"
          selectedVariant="solid"
          aria-label="Search results"
        />
      </Stack>
    </Stack>
  );
}
