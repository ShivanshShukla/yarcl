import { Badge, Button, Card, Divider, Grid, Heading, Inline, Stack, Text, VisuallyHidden, config, type Shadow, type Spacing } from '@yarcl/react';
import { SearchIcon } from './icons';

export function GridDemo() {
  return (
    <Stack style={{ width: '100%' }}>
      <Text textStyle="label">Equal columns</Text>
      <Grid columns={3}>
        {['Revenue', 'Orders', 'Visitors'].map((label) => <Card key={label} padding="sm">{label}</Card>)}
      </Grid>
      <Text textStyle="label">Cards that fit the available space</Text>
      <Grid minItemWidth="12rem">
        {['Overview', 'Activity', 'Reports'].map((label) => <Card key={label}>{label}</Card>)}
      </Grid>
      <Text textStyle="label">Sidebar and content</Text>
      <Grid columns="6rem minmax(0, 1fr)">
        <Card padding="sm">Menu</Card>
        <Card padding="sm">Workspace</Card>
      </Grid>
    </Stack>
  );
}

const spacings = Object.keys(config.spacing) as Spacing[];
const shadows = Object.keys(config.shadows) as Shadow[];

function Box({ label }: { label: string }) {
  return <span className="demo-box">{label}</span>;
}

export function StackDemo() {
  return (
    <Inline gap="xl" align="start">
      {(['xs', 'md', 'xl'] as Spacing[]).map((gap) => (
        <Stack key={gap} gap={gap}>
          <Text textStyle="caption" muted>
            gap="{gap}"
          </Text>
          <Box label="1" />
          <Box label="2" />
          <Box label="3" />
        </Stack>
      ))}
    </Inline>
  );
}

export function InlineDemo() {
  return (
    <Stack>
      {spacings.map((gap) => (
        <Inline key={gap} gap={gap}>
          <Text textStyle="code" className="demo-label">
            {gap}
          </Text>
          <Box label="1" />
          <Box label="2" />
          <Box label="3" />
        </Inline>
      ))}
      <Inline justify="between" className="demo-bordered">
        <Text>justify="between"</Text>
        <Inline gap="sm">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </Inline>
      </Inline>
    </Stack>
  );
}

export function CardDemo() {
  return (
    <Inline align="stretch">
      {shadows.map((shadow) => (
        <Card key={shadow} shadow={shadow} className="demo-card">
          <Stack gap="xs">
            <Text textStyle="label">Card</Text>
            <Text textStyle="caption" muted>
              shadow="{shadow}"
            </Text>
          </Stack>
        </Card>
      ))}
      <Card padding="sm" radius="lg" className="demo-card">
        <Stack gap="xs">
          <Text textStyle="label">Card</Text>
          <Text textStyle="caption" muted>
            padding="sm", radius="lg"
          </Text>
        </Stack>
      </Card>
    </Inline>
  );
}

export function CardComposedDemo() {
  return (
    <Card shadow="md" className="demo-wide">
      <Stack>
        <Inline justify="between">
          <Heading level={3}>Pro plan</Heading>
          <Badge color="success">Active</Badge>
        </Inline>
        <Text as="p" muted>
          Renews on October 12. You can change or cancel your plan at any time.
        </Text>
        <Divider />
        <Inline justify="between">
          <Inline gap="sm">
            <Text textStyle="caption">3 seats</Text>
            <Divider orientation="vertical" />
            <Text textStyle="caption">$36 / month</Text>
          </Inline>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
}

export function DividerDemo() {
  return (
    <Stack className="demo-wide">
      <Text>Above</Text>
      <Divider />
      <Text>Below</Text>
      <Inline gap="sm">
        <Text>Left</Text>
        <Divider orientation="vertical" />
        <Text>Right</Text>
      </Inline>
    </Stack>
  );
}

export function VisuallyHiddenDemo() {
  return (
    <Button variant="outline">
      <SearchIcon />
      <VisuallyHidden>Search projects</VisuallyHidden>
    </Button>
  );
}
