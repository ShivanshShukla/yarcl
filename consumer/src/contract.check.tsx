import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Field,
  Alert,
  Badge,
  Avatar,
  AvatarGroup,
  ButtonGroup,
  RadioGroup,
  ToggleGroup,
  Pagination,
  Combobox,
  Progress,
  DatePicker,
  type DateRange,
  Skeleton,
  Spinner,
  Dialog,
  Drawer,
  CommandPalette,
  Table,
  Tabs,
  toast,
  Heading,
  HoverCard,
  Menu,
  Popover,
  Select,
  Tooltip,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  Breadcrumb,
  NumberInput,
  Radio,
  Stack,
  Slider,
  Switch,
  Text,
  Textarea,
  VisuallyHidden,
} from '@yarcl/react';
import config from './yarcl.config';

type FontFamily = keyof typeof config.typography.families;
const bodyFont: FontFamily = config.typography.fonts.body;
// @ts-expect-error unknown font families cannot be assigned to a role
const invalidFont: FontFamily = 'missing';
void [bodyFont, invalidFont];

export const contract = (
  <>
    <Button size="xl" color="warning" radius="rounded" variant="subtle" />
    <Input size="xs" color="danger" radius="square" />
    <IconButton aria-label="Add" variant="quiet" />
    <Textarea size="lg" radius="size" />
    <NumberInput size="sm" color="success" radius="rounded" min={0} max={10} step={0.5} defaultValue={2} />
    <NumberInput value={null} onValueChange={(v: number | null) => v} incrementLabel="Add" decrementLabel="Remove" />
    <Field label="Guests">
      <NumberInput />
    </Field>
    <Checkbox size="sm" color="success" indeterminate />
    <Radio size="lg" color="neutral" />
    <Switch size="xl" color="brand" />
    <Slider.Range aria-label="Price" size="sm" color="success" radius="rounded" defaultValue={[10, 90]} />
    <Field label="Name">
      <Input />
    </Field>
    <Label htmlFor="name" required variant="subtle" color="brand" size="sm" radius="rounded" textStyle="label" />
    <Text textStyle="caption" color="danger" truncate={2} />
    <Label htmlFor="name" textStyle="caption" color="neutral" required disabled>
      Name
    </Label>
    <Heading level={2} textStyle="display" />
    <Link color="neutral" underline="hover" external />
    <Breadcrumb
      textStyle="caption"
      color="neutral"
      underline="always"
      separator="/"
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      expandLabel="Show path"
    >
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item>Current</Breadcrumb.Item>
    </Breadcrumb>
    <Stack gap="loose" align="center" as="ul" />
    <Inline gap="tight" justify="between" wrap={false} />
    <Card padding="tight" radius="rounded" shadow="lg" as="article" />
    <Divider orientation="vertical" />
    <EmptyState
      title="No projects"
      description="Create your first project."
      icon={<span />}
      actions={<Button>Create project</Button>}
      headingLevel={3}
      color="neutral"
      gap="tight"
      padding="loose"
      textStyle="caption"
    />
    <VisuallyHidden id="hidden-description">Additional context</VisuallyHidden>
    <Tooltip content="Hi" radius="rounded" padding="tight" textStyle="caption">
      <Button />
    </Tooltip>
    <HoverCard content="Hi" padding="tight" radius="xl">
      <Link />
    </HoverCard>
    <Popover placement="top" modal>
      <Popover.Trigger>
        <Button />
      </Popover.Trigger>
      <Popover.Content padding="loose" />
    </Popover>
    <Menu size="sm">
      <Menu.Content>
        <Menu.Item color="danger" />
      </Menu.Content>
    </Menu>
    {/* @ts-expect-error Menu only allows sm and md */}
    <Menu size="lg" />
    <Select options={[{ value: 'a', label: 'A' }]} size="lg" radius="rounded" color="success" />
    <Combobox options={[]} filter={false} allowCustomValue size="xs" />
    <DatePicker
      value={new Date()}
      onValueChange={(d: Date | null) => d}
      min={new Date()}
      max={new Date()}
      isDateDisabled={() => false}
      weekStartsOn={1}
      displayFormat="P"
      placeholder="Pick"
      name="day"
      labels={{ dialog: 'Choose' }}
      size="lg"
      radius="size"
      color="success"
      variant="subtle"
    />
    <DatePicker mode="range" defaultValue={{ from: new Date(), to: null }} onValueChange={(r: DateRange | null) => r} />
    <Combobox options={[{ value: 'a', label: 'A' }]} defaultValue="a" onValueChange={(v: string | null) => v} />
    <Combobox
      multiple
      options={[{ value: 'a', label: 'A' }]}
      defaultValue={['a']}
      onValueChange={(v: string[]) => v}
      maxSelected={3}
      allowCustomValue
      name="tags"
      size="lg"
      radius="rounded"
      color="success"
    />
    <Dialog title="T" radius="xl" size="lg" />
    <Drawer title="T" side="left" />
    <CommandPalette
      commands={[
        { id: 'a', label: 'A', group: 'G', keywords: ['k'], shortcut: 'Mod+A', icon: null, disabled: true, onSelect: () => {} },
      ]}
      open
      defaultOpen={false}
      onOpenChange={() => {}}
      shortcut={false}
      trigger={<Button />}
      onSelect={(command) => command.id}
      inputValue=""
      onInputValueChange={() => {}}
      filter={(command, text) => command.label.includes(text)}
      placeholder="Search"
      label="Commands"
      emptyMessage="Nothing"
      size="lg"
      radius="rounded"
      color="success"
    />
    <Tabs defaultValue="a" size="sm" color="success" />
    <Tabs value="a" onValueChange={() => {}} />
    <Accordion type="single" defaultValue="a" collapsible={false} size="lg" radius="size" color="success" disabled>
      <Accordion.Item value="a" disabled>
        <Accordion.Trigger level={2}>A</Accordion.Trigger>
        <Accordion.Content>A</Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Accordion type="single" value={null} onValueChange={(v: string | null) => v} />
    <Accordion type="multiple" value={['a']} onValueChange={(v: string[]) => v} />
    <Table density="dense" radius="rounded" striped interactive />
    <Badge color="success" variant="outline" size="sm" radius="rounded" onRemove={() => {}} />
    <Avatar name="Ada Lovelace" alt="Ada" fallback="AL" size="lg" radius="rounded" color="success" variant="outline" onImageError={() => {}} />
    <AvatarGroup max={2} total={4} overflowLabel={(count) => `${count} more teammates`} size="sm" radius="rounded" color="neutral" variant="quiet">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
    </AvatarGroup>
    <Alert color="warning" variant="solid" radius="md" gap="tight" padding="normal" textStyle="caption" live="polite" onDismiss={() => {}} />
    <Spinner size="xl" color="danger" />
    <Skeleton shape="control" size="lg" radius="lg" />
    <Skeleton textStyle="display" lines={3} />
    <Progress value={40} max={80} label="Upload" showValue formatValue={(v, max) => `${v}/${max}`} size="lg" color="success" radius="rounded" />
    <Progress aria-label="Loading" radius="size" />
    <Button loading />
    <Heading level={3} />
    <RadioGroup label="L" size="sm" color="success" orientation="horizontal" defaultValue="a">
      <Radio value="a" />
    </RadioGroup>
    <ButtonGroup size="lg" variant="outline" color="neutral" radius="rounded" attached={false} orientation="vertical" />
    <ToggleGroup type="single" defaultValue="a" required variant="quiet" selectedVariant="solid" />
    <ToggleGroup type="multiple" defaultValue={['a']} onValueChange={(v: string[]) => v} />
    <Slider
      size="lg"
      radius="rounded"
      color="success"
      min={0}
      max={10}
      step={0.5}
      largeStep={2}
      defaultValue={4}
      onValueChange={(v: number) => v}
      name="volume"
      disabled
      formatValue={(v) => `${v}`}
      aria-label="Volume"
    />
    <Slider defaultValue={[2, 8]} onValueChange={(v: [number, number]) => v} thumbLabels={['From', 'To']} />
    <Slider value={[2, 8]} />
    <Pagination
      count={10}
      page={2}
      onPageChange={(p: number) => p}
      siblings={2}
      boundaries={0}
      size="sm"
      color="neutral"
      radius="rounded"
      variant="quiet"
      selectedVariant="solid"
      attached
      disabled
      aria-label="Results"
      previousLabel="Back"
      nextLabel="Forward"
      pageLabel={(p) => `Go to ${p}`}
    />
    <Pagination count={5} defaultPage={3} />

    {/* @ts-expect-error */}
    <Button size="gigantic" />
    {/* @ts-expect-error */}
    <Button color="primary" />
    {/* @ts-expect-error */}
    <Input radius="full" />
    {/* @ts-expect-error */}
    <Tooltip content="Hi" padding="compact"><Button /></Tooltip>
    {/* @ts-expect-error */}
    <Table radius="full" />
    {/* @ts-expect-error */}
    <Alert textStyle="heading" />
    {/* @ts-expect-error */}
    <Button variant="ghost" />
    {/* @ts-expect-error */}
    <IconButton />
    {/* @ts-expect-error */}
    <NumberInput size="huge" />
    {/* @ts-expect-error */}
    <NumberInput color="primary" />
    {/* @ts-expect-error */}
    <NumberInput value="3" />
    {/* @ts-expect-error */}
    <Switch size="huge" />
    {/* @ts-expect-error */}
    <Slider color="primary" />
    {/* @ts-expect-error */}
    <Slider radius="full" />
    {/* @ts-expect-error */}
    <Slider defaultValue={[1, 2]} onValueChange={(v: number) => v} />
    {/* @ts-expect-error */}
    <Slider defaultValue={[1, 2, 3]} />
    {/* @ts-expect-error */}
    <Slider.Range aria-label="Price" defaultValue={50} />
    {/* @ts-expect-error */}
    <Checkbox color="primary" />
    {/* @ts-expect-error */}
    <Field>
      <Input />
    </Field>
    {/* @ts-expect-error */}
    <Text textStyle="heading" />
    {/* @ts-expect-error */}
    <Label textStyle="heading" />
    {/* @ts-expect-error */}
    <Label color="primary" />
    {/* @ts-expect-error */}
    <Label size="gigantic" />
    {/* @ts-expect-error */}
    <Label variant="ghost" />
    {/* @ts-expect-error */}
    <Heading textStyle="title" />
    {/* @ts-expect-error */}
    <Heading level={7} />
    {/* @ts-expect-error */}
    <Stack gap="md" />
    {/* @ts-expect-error */}
    <Card shadow="xl" />
    {/* @ts-expect-error */}
    <Card padding="lg" />
    {/* @ts-expect-error */}
    <Tooltip>
      <Button />
    </Tooltip>
    {/* @ts-expect-error */}
    <Menu.Item color="primary" />
    {/* @ts-expect-error */}
    <Select options={[]} size="huge" />
    {/* @ts-expect-error */}
    <Combobox options={[]} radius="full" />
    {/* @ts-expect-error */}
    <DatePicker size="huge" />
    {/* @ts-expect-error */}
    <DatePicker variant="ghost" />
    {/* @ts-expect-error */}
    <DatePicker color="primary" />
    {/* @ts-expect-error */}
    <DatePicker mode="range" value={new Date()} />
    {/* @ts-expect-error */}
    <DatePicker value={{ from: new Date(), to: null }} />
    {/* @ts-expect-error */}
    <DatePicker weekStartsOn={7} />
    {/* @ts-expect-error */}
    <Combobox options={[]} multiple size="huge" />
    {/* @ts-expect-error */}
    <Combobox options={[]} multiple defaultValue="a" />
    {/* @ts-expect-error */}
    <Combobox options={[]} multiple onValueChange={(v: string | null) => v} />
    {/* @ts-expect-error */}
    <Combobox options={[]} defaultValue={['a']} />
    {/* @ts-expect-error */}
    <Combobox options={[]} onValueChange={(v: string[]) => v} />
    {/* @ts-expect-error */}
    <Combobox options={[]} maxSelected={2} />
    {/* @ts-expect-error */}
    <Combobox options={[{ value: 'a' as const, label: 'A' }]} multiple defaultValue={['b']} />
    {/* @ts-expect-error */}
    <Card radius="size" />
    {/* @ts-expect-error */}
    <Popover.Content padding="md" />
    {/* @ts-expect-error */}
    <Select options={[{ value: 'a' }]} />
    {/* @ts-expect-error */}
    <Dialog />
    {/* @ts-expect-error */}
    <Drawer title="T" side="top" />
    {/* @ts-expect-error */}
    <CommandPalette />
    {/* @ts-expect-error */}
    <CommandPalette commands={[{ id: 'a' }]} />
    {/* @ts-expect-error */}
    <CommandPalette commands={[]} size="huge" />
    {/* @ts-expect-error */}
    <CommandPalette commands={[]} color="primary" />
    {/* @ts-expect-error */}
    <CommandPalette commands={[]} shortcut />
    {/* @ts-expect-error */}
    <Dialog title="T" size="huge" />
    {/* @ts-expect-error */}
    <Dialog title="T" width="40rem" />
    {/* @ts-expect-error */}
    <Breadcrumb textStyle="huge" />
    {/* @ts-expect-error */}
    <Breadcrumb color="primary" />
    {/* @ts-expect-error */}
    <Breadcrumb underline="sometimes" />
    {/* @ts-expect-error */}
    <Tabs />
    {/* @ts-expect-error */}
    <Accordion />
    {/* @ts-expect-error */}
    <Accordion type="multiple" collapsible />
    {/* @ts-expect-error */}
    <Accordion type="single" defaultValue={['a']} />
    {/* @ts-expect-error */}
    <Accordion type="single" size="huge" />
    {/* @ts-expect-error */}
    <Accordion type="single" color="primary" />
    {/* @ts-expect-error */}
    <Accordion type="single" radius="full" />
    {/* @ts-expect-error */}
    <Accordion.Item />
    {/* @ts-expect-error */}
    <Accordion.Trigger level={7} />
    {/* @ts-expect-error */}
    <Tabs value="a" defaultValue="b" />
    {/* @ts-expect-error */}
    <Table density="comfortable" />
    {/* @ts-expect-error */}
    <Badge variant="soft" />
    {/* @ts-expect-error */}
    <Avatar size="huge" />
    {/* @ts-expect-error */}
    <Avatar color="primary" />
    {/* @ts-expect-error */}
    <AvatarGroup radius="full" />
    {/* @ts-expect-error */}
    <AvatarGroup variant="ghost" />
    {/* @ts-expect-error */}
    <EmptyState title="Empty" color="primary" />
    {/* @ts-expect-error */}
    <EmptyState title="Empty" gap="md" />
    {/* @ts-expect-error */}
    <EmptyState title="Empty" padding="lg" />
    {/* @ts-expect-error */}
    <EmptyState title="Empty" textStyle="body-sm" />
    {/* @ts-expect-error */}
    <Alert live="rude" />
    {/* @ts-expect-error */}
    <Spinner size="huge" />
    {/* @ts-expect-error */}
    <Skeleton shape="triangle" />
    {/* @ts-expect-error */}
    <Progress size="huge" />
    {/* @ts-expect-error */}
    <Progress color="primary" />
    {/* @ts-expect-error */}
    <Progress radius="hairline" />
    {/* @ts-expect-error */}
    <Progress value="50" />
    {/* @ts-expect-error */}
    <Skeleton textStyle="heading" />
    {/* @ts-expect-error */}
    <RadioGroup>
      <Radio value="a" />
    </RadioGroup>
    {/* @ts-expect-error */}
    <ButtonGroup variant="soft" />
    {/* @ts-expect-error */}
    <ToggleGroup defaultValue="a" />
    {/* @ts-expect-error */}
    <ToggleGroup type="multiple" defaultValue="a" />
    {/* @ts-expect-error */}
    <ToggleGroup type="multiple" required />
    {/* @ts-expect-error */}
    <ToggleGroup type="single" selectedVariant="filled" />
    {/* @ts-expect-error */}
    <Pagination />
    {/* @ts-expect-error */}
    <Pagination count={5} size="huge" />
    {/* @ts-expect-error */}
    <Pagination count={5} color="primary" />
    {/* @ts-expect-error */}
    <Pagination count={5} selectedVariant="filled" />
    {/* @ts-expect-error */}
    <Pagination count={5} page="2" />
  </>
);

toast({ title: 'ok', color: 'success', radius: 'rounded', gap: 'tight', padding: 'normal', textStyle: 'caption' });
// @ts-expect-error
toast({ title: 'bad', color: 'primary' });
// @ts-expect-error
toast({ title: 'bad', gap: 'compact' });
