import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  IconButton,
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
import { PlusIcon } from './icons';

const colors = Object.keys(config.colors) as Color[];
const variants = Object.keys(config.variants) as Variant[];
const sizes = Object.keys(config.sizes) as Size[];
const avatarImage = '/avatar-demo.svg';

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function FeedbackDemo() {
  const [tags, setTags] = useState(['react', 'typescript', 'vite', 'css']);
  const [alertOpen, setAlertOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [upload, setUpload] = useState<number | null>(null);

  useEffect(() => {
    if (upload == null || upload >= 100) return;
    const timer = setTimeout(() => setUpload(Math.min(upload + 25, 100)), 200);
    return () => clearTimeout(timer);
  }, [upload]);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  }

  return (
    <Stack gap="loose">
      <Stack gap="tight">
        {variants.map((variant) => (
          <Inline key={variant} gap="tight">
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
        <Inline gap="tight">
          {tags.map((tag) => (
            <Badge key={tag} color="neutral" onRemove={() => setTags(tags.filter((t) => t !== tag))} removeLabel={`Remove ${tag}`}>
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && <Text muted>All tags removed</Text>}
        </Inline>
        <Inline gap="tight">
          {sizes.map((size) => (
            <Badge key={size} size={size}>
              size {size}
            </Badge>
          ))}
        </Inline>
      </Stack>

      <Stack gap="tight" data-testid="avatar-demo">
        <Inline gap="tight">
          <Avatar name="Ada Lovelace" src={avatarImage} />
          <Avatar name="Grace Hopper" color="success" />
          <Avatar name="Alan Turing" fallback="AT" color="warning" variant="outline" />
        </Inline>
        <AvatarGroup max={3} total={5} aria-label="Project members">
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" color="success" />
          <Avatar name="Alan Turing" color="warning" />
          <Avatar name="Katherine Johnson" color="danger" />
        </AvatarGroup>
      </Stack>

      <Stack gap="tight">
        {alertOpen && (
          <Alert
            color="warning"
            title="Trial ends in 3 days"
            icon={<InfoIcon />}
            action={
              <Button size="sm" color="warning">
                Upgrade
              </Button>
            }
            onDismiss={() => setAlertOpen(false)}
          >
            Add a payment method to keep your projects.
          </Alert>
        )}
        {colors.map((color) => (
          <Alert key={color} color={color} icon={<InfoIcon />}>
            A <strong>{color}</strong> alert using the soft variant.
          </Alert>
        ))}
        <Alert color="danger" variant="solid" title="Payment failed">
          The card was declined.
        </Alert>
        <Alert color="brand" variant="outline" title="Outline variant" />
      </Stack>

      <Inline>
        {sizes.map((size) => (
          <Spinner key={size} size={size} color="brand" />
        ))}
        <Button loading={saving} onClick={save}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <IconButton aria-label="Add" variant="outline" loading={saving}>
          <PlusIcon />
        </IconButton>
      </Inline>

      <Stack gap="tight" className="progress-demo">
        <Progress value={upload ?? 0} label="Uploading photos" showValue />
        <Progress value={82} label="Storage used" showValue color="warning" />
        <Progress value={3} max={8} label="Steps completed" showValue formatValue={(v, max) => `${v} of ${max}`} color="success" />
        <Progress label="Syncing" />
        <Progress value={40} aria-label="Failed checks" color="danger" />
        <Progress value={40} aria-label="Paused sync" color="neutral" />
        {sizes.map((size) => (
          <Progress key={size} value={60} size={size} aria-label={`Size ${size}`} />
        ))}
        <Inline>
          <Button variant="outline" color="neutral" onClick={() => setUpload(0)}>
            Start upload
          </Button>
        </Inline>
      </Stack>

      <Inline align="start">
        <Card className="skeleton-card" aria-busy={!loaded}>
          {loaded ? (
            <Stack gap="tight">
              <Text textStyle="title">Ada Lovelace</Text>
              <Text as="p">Mathematician and writer, known for her work on the Analytical Engine.</Text>
              <Inline gap="tight">
                <Button size="sm">Follow</Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </Inline>
            </Stack>
          ) : (
            <Stack gap="tight">
              <Skeleton textStyle="title" width="50%" />
              <Skeleton lines={2} />
              <Inline gap="tight">
                <Skeleton shape="control" size="sm" width="4.5rem" />
                <Skeleton shape="control" size="sm" width="5.5rem" />
              </Inline>
            </Stack>
          )}
        </Card>
        <Stack gap="tight">
          <Button variant="outline" color="neutral" onClick={() => setLoaded(!loaded)}>
            {loaded ? 'Show skeleton' : 'Show content'}
          </Button>
          <Inline gap="tight">
            <Skeleton shape="circle" size="lg" />
            <Skeleton shape="rect" width="6rem" height="3rem" radius="xl" />
          </Inline>
        </Stack>
      </Inline>
    </Stack>
  );
}
