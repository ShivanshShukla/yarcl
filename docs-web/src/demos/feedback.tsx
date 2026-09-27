import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Inline,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Text,
  config,
  type Color,
  type Size,
  type Variant,
} from '@yarcl/react';
import { InfoIcon, SearchIcon } from './icons';

const colors = Object.keys(config.colors) as Color[];
const variants = Object.keys(config.variants) as Variant[];
const sizes = Object.keys(config.sizes) as Size[];

export function BadgeDemo() {
  return (
    <Stack gap="sm">
      {variants.map((variant) => (
        <Inline key={variant} gap="sm">
          {colors.map((color) => (
            <Badge key={color} color={color} variant={variant}>
              {color}
            </Badge>
          ))}
          <Text textStyle="caption" muted>
            {variant}
          </Text>
        </Inline>
      ))}
    </Stack>
  );
}

export function TagDemo() {
  const [tags, setTags] = useState(['react', 'typescript', 'vite', 'css']);
  return (
    <Inline gap="sm">
      {tags.map((tag) => (
        <Badge key={tag} radius="rounded" color="neutral" onRemove={() => setTags(tags.filter((t) => t !== tag))} removeLabel={`Remove ${tag}`}>
          {tag}
        </Badge>
      ))}
      {tags.length === 0 && (
        <Button size="sm" variant="ghost" onClick={() => setTags(['react', 'typescript', 'vite', 'css'])}>
          Reset
        </Button>
      )}
    </Inline>
  );
}

export function AlertDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Stack className="demo-wide">
      {open ? (
        <Alert
          color="warning"
          title="Trial ends in 3 days"
          icon={<InfoIcon />}
          action={
            <Button size="sm" color="warning">
              Upgrade
            </Button>
          }
          onDismiss={() => setOpen(false)}
        >
          Add a payment method to keep your projects.
        </Alert>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Show the alert again
        </Button>
      )}
      <Alert color="success" icon={<InfoIcon />}>
        Your changes were saved.
      </Alert>
      <Alert color="danger" variant="solid" title="Payment failed">
        The card was declined.
      </Alert>
      <Alert color="neutral" variant="outline" title="Outline variant" />
    </Stack>
  );
}

export function EmptyStateDemo() {
  return (
    <EmptyState
      headingLevel={3}
      icon={<SearchIcon />}
      title="No matching projects"
      description="Try changing or clearing your filters."
      actions={
        <Inline gap="sm">
          <Button variant="outline">Clear filters</Button>
          <Button>Create project</Button>
        </Inline>
      }
    />
  );
}

export function SpinnerDemo() {
  const [saving, setSaving] = useState(false);
  return (
    <>
      {sizes.map((size) => (
        <Spinner key={size} size={size} color="primary" />
      ))}
      <Button
        loading={saving}
        onClick={() => {
          setSaving(true);
          setTimeout(() => setSaving(false), 1500);
        }}
      >
        {saving ? 'Saving…' : 'Save'}
      </Button>
    </>
  );
}

export function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false);
  return (
    <Inline align="start">
      <Card className="demo-card-wide" aria-busy={!loaded}>
        {loaded ? (
          <Stack gap="sm">
            <Text textStyle="subheading">Ada Lovelace</Text>
            <Text as="p">Mathematician and writer, known for her work on the Analytical Engine.</Text>
            <Inline gap="sm">
              <Button size="sm">Follow</Button>
              <Button size="sm" variant="outline">
                Message
              </Button>
            </Inline>
          </Stack>
        ) : (
          <Stack gap="sm">
            <Skeleton textStyle="subheading" width="50%" />
            <Skeleton lines={2} />
            <Inline gap="sm">
              <Skeleton shape="control" size="sm" width="4.5rem" />
              <Skeleton shape="control" size="sm" width="5.5rem" />
            </Inline>
          </Stack>
        )}
      </Card>
      <Stack gap="sm">
        <Button variant="outline" color="neutral" onClick={() => setLoaded(!loaded)}>
          {loaded ? 'Show skeleton' : 'Show content'}
        </Button>
        <Inline gap="sm">
          <Skeleton shape="circle" size="lg" />
          <Skeleton shape="rect" width="6rem" height="3rem" />
        </Inline>
      </Stack>
    </Inline>
  );
}

export function ProgressDemo() {
  const [upload, setUpload] = useState<number | null>(null);

  useEffect(() => {
    if (upload == null || upload >= 100) return;
    const timer = setTimeout(() => setUpload(Math.min(upload + 12, 100)), 300);
    return () => clearTimeout(timer);
  }, [upload]);

  return (
    <Stack gap="md" className="demo-progress">
      <Progress value={upload ?? 0} label="Uploading photos" showValue />
      <Progress value={82} label="Storage used" showValue color="warning" />
      <Progress value={3} max={8} label="Steps completed" showValue formatValue={(v, max) => `${v} of ${max}`} color="success" />
      <Progress label="Syncing" />
      <Stack gap="sm">
        {sizes.map((size) => (
          <Progress key={size} value={60} size={size} aria-label={`Size ${size}`} />
        ))}
      </Stack>
      <Inline>
        <Button variant="outline" color="neutral" onClick={() => setUpload(0)}>
          {upload == null ? 'Start upload' : 'Restart upload'}
        </Button>
      </Inline>
    </Stack>
  );
}
