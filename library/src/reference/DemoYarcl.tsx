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
  Combobox,
  CommandPalette,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  EmptyState,
  Field,
  Heading,
  HoverCard,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  Menu,
  NumberInput,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Toaster,
  ToggleGroup,
  Tooltip,
  VisuallyHidden,
} from '../index';
import { DesignReference } from './DesignReference';
import '@yarcl/react/styles.css';
import '../styles.css';

const components = [
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
  Combobox,
  CommandPalette,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  EmptyState,
  Field,
  Heading,
  HoverCard,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  Menu,
  NumberInput,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Toaster,
  ToggleGroup,
  Tooltip,
  VisuallyHidden,
];

const options = [
  { value: 'first', label: 'First option' },
  { value: 'second', label: 'Second option' },
];

/** Props for {@link DemoYarcl}. */
export interface DemoYarclProps {
  /** Page heading. */
  title?: string;
}

/**
 * A package-wide demo for validating a yarcl installation and previewing its active config.
 * Import from `@yarcl/react/reference`.
 */
export function DemoYarcl({ title = 'yarcl demo' }: DemoYarclProps) {
  const componentNames = components.map((component) => component.name).join(',');

  return (
    <Stack data-yarcl-components={componentNames}>
      <DesignReference title={title} />
      <Divider />
      <Heading level={2}>Components</Heading>
      <Card>
        <Stack>
          <Inline>
            <Button>Button</Button>
            <IconButton aria-label="Add item">+</IconButton>
            <Badge>Badge</Badge>
            <Avatar name="Ada Lovelace" />
            <AvatarGroup aria-label="Team">
              <Avatar name="Ada Lovelace" />
              <Avatar name="Grace Hopper" />
            </AvatarGroup>
            <Spinner label="Loading" />
          </Inline>
          <ButtonGroup aria-label="Actions">
            <Button>Save</Button>
            <Button>Cancel</Button>
          </ButtonGroup>
          <ToggleGroup type="single" defaultValue="one" aria-label="View">
            <ToggleGroup.Item value="one">One</ToggleGroup.Item>
            <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
          </ToggleGroup>
          <Field label="Name">
            <Input placeholder="Ada Lovelace" />
          </Field>
          <Label htmlFor="yarcl-demo-notes">Notes</Label>
          <Textarea id="yarcl-demo-notes" />
          <NumberInput aria-label="Quantity" defaultValue={1} />
          <Inline>
            <Checkbox defaultChecked>Checkbox</Checkbox>
            <Radio name="yarcl-demo-radio" value="radio" defaultChecked>
              Radio
            </Radio>
            <Switch defaultChecked>Switch</Switch>
          </Inline>
          <RadioGroup label="Choice" defaultValue="first">
            <Radio value="first">First</Radio>
            <Radio value="second">Second</Radio>
          </RadioGroup>
          <Slider aria-label="Amount" defaultValue={50} />
          <Select aria-label="Select option" options={options} defaultValue="first" />
          <Combobox aria-label="Search options" options={options} />
          <DatePicker aria-label="Choose date" />
          <Progress value={60} label="Progress" showValue />
          <Alert title="Installation works">Every public component is available to this build.</Alert>
          <Skeleton lines={2} aria-label="Loading content" />
          <EmptyState title="Nothing here" description="This is the empty state component." />
          <Breadcrumb aria-label="Breadcrumb">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Demo</Breadcrumb.Item>
          </Breadcrumb>
          <Text>
            Text with a <Link href="#">link</Link> and <VisuallyHidden>accessible context</VisuallyHidden>.
          </Text>
          <Inline>
            <Tooltip content="Tooltip content">
              <Button>Tooltip</Button>
            </Tooltip>
            <HoverCard content="Hover card content">
              <Button>Hover card</Button>
            </HoverCard>
            <Popover>
              <Popover.Trigger>
                <Button>Popover</Button>
              </Popover.Trigger>
              <Popover.Content>Popover content</Popover.Content>
            </Popover>
            <Menu>
              <Menu.Trigger>
                <Button>Menu</Button>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item>Menu item</Menu.Item>
              </Menu.Content>
            </Menu>
            <Dialog trigger={<Button>Dialog</Button>} title="Dialog" />
            <Drawer trigger={<Button>Drawer</Button>} title="Drawer" />
            <CommandPalette commands={[]} trigger={<Button>Commands</Button>} />
          </Inline>
          <Tabs defaultValue="first">
            <Tabs.List aria-label="Demo tabs">
              <Tabs.Trigger value="first">First</Tabs.Trigger>
              <Tabs.Trigger value="second">Second</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="first">First panel</Tabs.Panel>
            <Tabs.Panel value="second">Second panel</Tabs.Panel>
          </Tabs>
          <Accordion type="single" defaultValue="first">
            <Accordion.Item value="first">
              <Accordion.Trigger>Details</Accordion.Trigger>
              <Accordion.Content>Accordion content</Accordion.Content>
            </Accordion.Item>
          </Accordion>
          <Pagination count={5} aria-label="Demo pages" />
          <Table caption="Demo table">
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell scope="row">Status</Table.HeaderCell>
                <Table.Cell>Ready</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Stack>
      </Card>
      <Toaster />
    </Stack>
  );
}
