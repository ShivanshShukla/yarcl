import type { ReactNode } from 'react';
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  EmptyState,
  Field,
  Heading,
  Grid,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Progress,
  Skeleton,
  Spinner,
  Slider,
  Pagination,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  ToggleGroup,
  VisuallyHidden,
} from '@yarcl/react';
import { InfoIcon, PlusIcon, SearchIcon, TrashIcon } from './icons';

interface Item {
  name: string;
  href: string;
  description: string;
  preview: ReactNode;
}

const box = (label: string) => <span className="demo-box">{label}</span>;

function MockListbox({ items, active = 0, danger }: { items: string[]; active?: number; danger?: number }) {
  return (
    <div className="yarcl-panel yarcl-listbox yarcl-size-sm yarcl-color-primary gallery-float">
      {items.map((item, i) => (
        <div
          key={item}
          className={`yarcl-option${i === danger ? ' yarcl-option-colored yarcl-color-danger' : ''}`}
          data-active={i === active || undefined}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function MockCalendar() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <div className="yarcl-panel yarcl-size-xs yarcl-color-primary yarcl-radius-md gallery-float gallery-calendar" aria-hidden="true">
      {days.map((day) => (
        <span
          key={day}
          className={`yarcl-date-picker-day${day === 3 || day === 7 ? ' yarcl-variant-solid' : day > 3 && day < 7 ? ' yarcl-variant-soft' : ''}`}
          data-selected={day === 3 || day === 7 || undefined}
          data-in-range={(day > 3 && day < 7) || undefined}
        >
          {day}
        </span>
      ))}
    </div>
  );
}

const groups: Record<string, Item[]> = {
  buttons: [
    {
      name: 'Button',
      href: '/components/buttons/button/',
      description: 'Triggers an action, styled from your sizes, colors, radii and variants.',
      preview: (
        <Inline gap="sm">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </Inline>
      ),
    },
    {
      name: 'IconButton',
      href: '/components/buttons/icon-button/',
      description: 'A square button containing only an icon.',
      preview: (
        <Inline gap="sm">
          <IconButton size="sm" aria-label="Search" variant="outline">
            <SearchIcon />
          </IconButton>
          <IconButton size="sm" aria-label="Add">
            <PlusIcon />
          </IconButton>
          <IconButton size="sm" aria-label="Delete" variant="ghost" color="danger">
            <TrashIcon />
          </IconButton>
        </Inline>
      ),
    },
    {
      name: 'ButtonGroup',
      href: '/components/buttons/button-group/',
      description: 'Attached or spaced buttons that share size, color and variant.',
      preview: (
        <ButtonGroup aria-label="Pagination" size="sm" variant="outline" color="neutral">
          <Button>Prev</Button>
          <Button>1</Button>
          <Button>2</Button>
          <Button>Next</Button>
        </ButtonGroup>
      ),
    },
    {
      name: 'ToggleGroup',
      href: '/components/buttons/toggle-group/',
      description: 'Segmented controls and groups of toggle buttons.',
      preview: (
        <ToggleGroup type="single" defaultValue="week" size="sm" aria-label="Range">
          <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
          <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
          <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
        </ToggleGroup>
      ),
    },
  ],
  forms: [
    {
      name: 'Field',
      href: '/components/forms/field/',
      description: 'Label, helper text and error message, wired to a control.',
      preview: (
        <Field label="Email" error="Enter a valid email." className="gallery-fill">
          <Input size="sm" defaultValue="ada@" />
        </Field>
      ),
    },
    {
      name: 'Label',
      href: '/components/forms/label/',
      description: 'A form label in your label text style, or a filled label with a variant.',
      preview: (
        <Inline gap="xs">
          <Label size="sm" required>
            Email
          </Label>
          <Label size="sm" variant="soft" color="success">
            Active
          </Label>
          <Label size="sm" variant="solid" color="primary">
            New
          </Label>
        </Inline>
      ),
    },
    {
      name: 'Input',
      href: '/components/forms/input/',
      description: 'A single-line text input on the shared size scale.',
      preview: (
        <Stack gap="sm" className="gallery-fill">
          <Input size="sm" placeholder="Search" aria-label="Search" />
          <Input size="sm" defaultValue="Ada Lovelace" aria-label="Name" />
        </Stack>
      ),
    },
    {
      name: 'NumberInput',
      href: '/components/forms/number-input/',
      description: 'A numeric input with increment and decrement buttons.',
      preview: <NumberInput size="sm" defaultValue={2} min={1} aria-label="Guests" className="gallery-fill" />,
    },
    {
      name: 'Textarea',
      href: '/components/forms/textarea/',
      description: 'A multi-line text input that starts at one control height.',
      preview: <Textarea size="sm" rows={3} placeholder="Write a message" aria-label="Message" className="gallery-fill" />,
    },
    {
      name: 'Select',
      href: '/components/forms/select/',
      description: 'Picks one value from a list, with keyboard and typeahead.',
      preview: (
        <Stack gap="xs" className="gallery-fill">
          <Select size="sm" aria-label="Plan" options={[{ value: 'pro', label: 'Pro' }]} defaultValue="pro" />
          <MockListbox items={['Free', 'Pro', 'Team']} active={1} />
        </Stack>
      ),
    },
    {
      name: 'Combobox',
      href: '/components/forms/combobox/',
      description: 'A text input with filtered suggestions, including async search and multi-select.',
      preview: (
        <Stack gap="xs" className="gallery-fill">
          <Input size="sm" defaultValue="sw" aria-label="Country" />
          <MockListbox items={['Sweden', 'Switzerland']} />
        </Stack>
      ),
    },
    {
      name: 'DatePicker',
      href: '/components/forms/date-picker/',
      description: 'Picks a day or a range from a calendar, with date-fns locales.',
      preview: (
        <Stack gap="xs" className="gallery-fill">
          <DatePicker size="sm" aria-label="Stay" mode="range" defaultValue={{ from: new Date(2026, 8, 3), to: new Date(2026, 8, 7) }} />
          <MockCalendar />
        </Stack>
      ),
    },
    {
      name: 'Checkbox',
      href: '/components/forms/checkbox/',
      description: 'A checkbox with a label, including a mixed state.',
      preview: (
        <Stack gap="xs">
          <Checkbox size="sm" defaultChecked>
            Email updates
          </Checkbox>
          <Checkbox size="sm">SMS updates</Checkbox>
        </Stack>
      ),
    },
    {
      name: 'RadioGroup',
      href: '/components/forms/radio-group/',
      description: 'A labelled group of radio buttons with one value.',
      preview: (
        <RadioGroup label="Plan" defaultValue="pro" size="sm" orientation="horizontal">
          <Radio value="free">Free</Radio>
          <Radio value="pro">Pro</Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>
      ),
    },
    {
      name: 'Switch',
      href: '/components/forms/switch/',
      description: 'An on/off toggle with role="switch".',
      preview: (
        <Stack gap="xs">
          <Switch size="sm" defaultChecked>
            Notifications
          </Switch>
          <Switch size="sm">Dark mode</Switch>
        </Stack>
      ),
    },
    {
      name: 'Slider',
      href: '/components/forms/slider/',
      description: 'Picks a number or a range by dragging or with the keyboard.',
      preview: (
        <Stack gap="sm" className="gallery-fill">
          <Slider size="sm" defaultValue={60} aria-label="Volume" />
          <Slider.Range size="sm" defaultValue={[25, 75]} aria-label="Price" />
        </Stack>
      ),
    },
  ],
  typography: [
    {
      name: 'Text',
      href: '/components/typography/text/',
      description: "Text in one of your config's text styles.",
      preview: (
        <Stack gap="xs">
          <Text textStyle="subheading">Subheading</Text>
          <Text>Body text</Text>
          <Text textStyle="caption" muted>
            Muted caption
          </Text>
        </Stack>
      ),
    },
    {
      name: 'Heading',
      href: '/components/typography/heading/',
      description: 'h1 to h6, each styled by your config.',
      preview: (
        <Stack gap="xs">
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={5}>Heading 5</Heading>
        </Stack>
      ),
    },
    {
      name: 'Link',
      href: '/components/typography/link/',
      description: 'A text link that inherits the surrounding text style.',
      preview: (
        <Text>
          Read the <Link href="#">documentation</Link>
        </Text>
      ),
    },
  ],
  layout: [
    {
      name: 'Stack',
      href: '/components/layout/stack/',
      description: 'Vertical layout with a gap from your spacing scale.',
      preview: (
        <Stack gap="xs">
          {box('1')}
          {box('2')}
          {box('3')}
        </Stack>
      ),
    },
    {
      name: 'Inline',
      href: '/components/layout/inline/',
      description: 'Horizontal layout that wraps, with a gap from your spacing scale.',
      preview: (
        <Inline gap="sm">
          {box('1')}
          {box('2')}
          {box('3')}
          {box('4')}
        </Inline>
      ),
    },
    {
      name: 'Grid',
      href: '/components/layout/grid/',
      description: 'Equal columns, responsive cards, and sidebar layouts.',
      preview: <Grid columns={2} gap="sm">{box('1')}{box('2')}{box('3')}{box('4')}</Grid>,
    },
    {
      name: 'Card',
      href: '/components/layout/card/',
      description: 'A bordered surface with padding, radius and shadow tokens.',
      preview: (
        <Card shadow="md" padding="sm" className="gallery-card-preview">
          <Stack gap="xs">
            <Text textStyle="label">Pro plan</Text>
            <Text textStyle="caption" muted>
              Renews Oct 12
            </Text>
          </Stack>
        </Card>
      ),
    },
    {
      name: 'Divider',
      href: '/components/layout/divider/',
      description: 'A thin separator, horizontal or vertical.',
      preview: (
        <Stack gap="sm" className="gallery-fill">
          <Text textStyle="caption">Above</Text>
          <Divider />
          <Inline gap="sm">
            <Text textStyle="caption">Left</Text>
            <Divider orientation="vertical" />
            <Text textStyle="caption">Right</Text>
          </Inline>
        </Stack>
      ),
    },
    {
      name: 'Visually hidden',
      href: '/components/layout/visually-hidden/',
      description: 'Provides accessible names and descriptions without visual content.',
      preview: (
        <Button size="sm" variant="outline">
          <SearchIcon />
          <VisuallyHidden>Search projects</VisuallyHidden>
        </Button>
      ),
    },
  ],
  overlays: [
    {
      name: 'Dialog',
      href: '/components/overlays/dialog/',
      description: 'A modal dialog on the native dialog element.',
      preview: (
        <div className="yarcl-panel gallery-mock-dialog">
          <Text textStyle="label">Delete project?</Text>
          <Text textStyle="caption" muted>
            This can't be undone.
          </Text>
          <Inline gap="xs" justify="end">
            <Button size="sm" variant="outline" color="neutral">
              Cancel
            </Button>
            <Button size="sm" color="danger">
              Delete
            </Button>
          </Inline>
        </div>
      ),
    },
    {
      name: 'Drawer',
      href: '/components/overlays/drawer/',
      description: 'A modal panel that slides in from the left or right.',
      preview: (
        <div className="gallery-mock-screen">
          <div className="yarcl-panel gallery-mock-drawer">
            <Text textStyle="label">Filters</Text>
            <Skeleton shape="control" size="sm" />
            <Skeleton shape="control" size="sm" />
          </div>
        </div>
      ),
    },
    {
      name: 'Popover',
      href: '/components/overlays/popover/',
      description: 'A floating panel anchored to a trigger.',
      preview: (
        <Stack gap="xs" align="start">
          <Button size="sm" variant="outline" color="neutral">
            Filters
          </Button>
          <div className="yarcl-panel gallery-float gallery-mock-popover">
            <Checkbox size="sm" defaultChecked>
              Open
            </Checkbox>
            <Checkbox size="sm">Archived</Checkbox>
          </div>
        </Stack>
      ),
    },
    {
      name: 'Tooltip',
      href: '/components/overlays/tooltip/',
      description: 'A short label on hover and keyboard focus.',
      preview: (
        <Stack gap="xs" align="center">
          <div className="yarcl-tooltip gallery-tooltip">Search</div>
          <IconButton size="sm" aria-label="Search" variant="outline">
            <SearchIcon />
          </IconButton>
        </Stack>
      ),
    },
    {
      name: 'HoverCard',
      href: '/components/overlays/hover-card/',
      description: 'A preview card on hover or focus.',
      preview: (
        <Stack gap="xs" align="start">
          <Link href="#">@ada</Link>
          <div className="yarcl-panel gallery-float gallery-mock-popover">
            <Text textStyle="label">Ada Lovelace</Text>
            <Text textStyle="caption" muted>
              First published algorithm
            </Text>
          </div>
        </Stack>
      ),
    },
    {
      name: 'CommandPalette',
      href: '/components/overlays/command-palette/',
      description: 'A searchable command menu opened with a keyboard shortcut.',
      preview: (
        <div className="yarcl-panel yarcl-size-sm yarcl-color-primary gallery-mock-palette">
          <div className="gallery-mock-palette-search">
            <Text textStyle="caption" muted>
              Search commands…
            </Text>
            <span className="yarcl-command-palette-shortcut">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </span>
          </div>
          <div className="yarcl-listbox">
            <div className="yarcl-command-palette-heading">Create</div>
            <div className="yarcl-option" data-active>
              New document
              <span className="yarcl-command-palette-shortcut">
                <kbd>⌘</kbd>
                <kbd>N</kbd>
              </span>
            </div>
            <div className="yarcl-option">Invite teammate</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Menu',
      href: '/components/overlays/menu/',
      description: 'A list of actions with keyboard navigation and typeahead.',
      preview: (
        <Stack gap="xs" align="start">
          <Button size="sm" variant="outline" color="neutral">
            Actions
          </Button>
          <MockListbox items={['Rename', 'Duplicate', 'Delete']} danger={2} />
        </Stack>
      ),
    },
    {
      name: 'Toast',
      href: '/components/overlays/toast/',
      description: 'Brief notifications, shown from anywhere with toast().',
      preview: (
        <div className="yarcl-toast yarcl-color-success gallery-toast">
          <div className="yarcl-toast-text">
            <div className="yarcl-toast-title">Saved</div>
            <div className="yarcl-toast-description">Your changes are live.</div>
          </div>
        </div>
      ),
    },
  ],
  data: [
    {
      name: 'Avatar',
      href: '/components/data/avatar/',
      description: 'Person images with initials fallback and overlapping groups.',
      preview: (
        <AvatarGroup max={3} total={5} aria-label="Project members">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Grace Hopper" size="sm" color="success" />
          <Avatar name="Alan Turing" size="sm" color="warning" />
        </AvatarGroup>
      ),
    },
    {
      name: 'Tabs',
      href: '/components/data/tabs/',
      description: 'Switches between panels, with arrow key navigation.',
      preview: (
        <Tabs defaultValue="overview" size="sm" className="gallery-fill">
          <Tabs.List aria-label="Project">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="overview">
            <Text textStyle="caption">Overview panel</Text>
          </Tabs.Panel>
        </Tabs>
      ),
    },
    {
      name: 'Accordion',
      href: '/components/data/accordion/',
      description: 'Expandable sections, one or many open at a time.',
      preview: (
        <Accordion type="single" defaultValue="shipping" size="sm" className="gallery-fill">
          <Accordion.Item value="shipping">
            <Accordion.Trigger>Shipping</Accordion.Trigger>
            <Accordion.Content>
              <Text textStyle="caption">Ships in two days</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="returns">
            <Accordion.Trigger>Returns</Accordion.Trigger>
            <Accordion.Content>
              <Text textStyle="caption">Free within 30 days</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      ),
    },
    {
      name: 'Table',
      href: '/components/data/table/',
      description: 'Data tables with density from your config.',
      preview: (
        <Table density="compact" className="gallery-fill">
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell align="end">Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell align="end">$1,200</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Grace</Table.Cell>
              <Table.Cell align="end">$860</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      ),
    },
    {
      name: 'Pagination',
      href: '/components/data/pagination/',
      description: 'Pages with siblings, boundaries and ellipses.',
      preview: <Pagination count={10} defaultPage={4} size="sm" siblings={0} aria-label="Gallery example" />,
    },
    {
      name: 'Breadcrumb',
      href: '/components/data/breadcrumb/',
      description: 'Where the current page sits, with collapsible long trails.',
      preview: (
        <Breadcrumb textStyle="caption" maxItems={3}>
          <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
          <Breadcrumb.Item href="#">Apollo</Breadcrumb.Item>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
        </Breadcrumb>
      ),
    },
  ],
  feedback: [
    {
      name: 'Empty state',
      href: '/components/feedback/empty-state/',
      description: 'A centered message and actions when a view has no content.',
      preview: (
        <EmptyState
          headingLevel={3}
          icon={<SearchIcon />}
          title="No results"
          description="Try another search."
          padding="sm"
          gap="xs"
        />
      ),
    },
    {
      name: 'Badge',
      href: '/components/feedback/badge/',
      description: 'Labels for status and categories, or removable tags.',
      preview: (
        <Inline gap="xs">
          <Badge color="success">Active</Badge>
          <Badge color="warning">Pending</Badge>
          <Badge color="danger" variant="solid">
            Overdue
          </Badge>
        </Inline>
      ),
    },
    {
      name: 'Alert',
      href: '/components/feedback/alert/',
      description: 'An inline message with an icon, action and dismiss button.',
      preview: (
        <Alert color="warning" icon={<InfoIcon />} title="Trial ends soon" className="gallery-fill" />
      ),
    },
    {
      name: 'Spinner',
      href: '/components/feedback/spinner/',
      description: 'A loading indicator sized like an icon.',
      preview: (
        <Inline>
          <Spinner size="sm" color="primary" />
          <Spinner size="md" color="primary" />
          <Spinner size="lg" color="primary" />
          <Button size="sm" loading>
            Saving
          </Button>
        </Inline>
      ),
    },
    {
      name: 'Skeleton',
      href: '/components/feedback/skeleton/',
      description: 'Placeholders that match text styles and control heights.',
      preview: (
        <Stack gap="xs" className="gallery-fill">
          <Skeleton textStyle="subheading" width="60%" />
          <Skeleton lines={2} />
        </Stack>
      ),
    },
    {
      name: 'Progress',
      href: '/components/feedback/progress/',
      description: 'Determinate and indeterminate progress bars.',
      preview: (
        <Stack gap="sm" className="gallery-fill">
          <Progress value={64} label="Uploading" showValue />
          <Progress aria-label="Loading" color="success" />
        </Stack>
      ),
    },
  ],
};

export function Gallery({ group }: { group: keyof typeof groups }) {
  return (
    <div className="gallery not-content">
      {groups[group].map((item) => (
        <article key={item.name} className="gallery-card">
          <div className="gallery-preview" inert aria-hidden="true">
            {item.preview}
          </div>
          <div className="gallery-body">
            <a className="gallery-link" href={item.href}>
              {item.name}
            </a>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
