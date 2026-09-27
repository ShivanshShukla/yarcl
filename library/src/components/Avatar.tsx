import { Children, cloneElement, isValidElement, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { colorClass, cx, radiusClass, sizeClass, softVariantClass } from '../classes';
import { useDefaults } from '../runtime';
import type { Color, Radius, Size, Variant } from '../types';

function initials(name: string | undefined): string {
  return name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join('') ?? '';
}

/** Props for {@link Avatar}. */
export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children' | 'color'> {
  /** Image URL. When it cannot load, the fallback is shown. */
  src?: string;
  /**
   * Person's name. Used for the fallback initials and accessible name when `alt` is omitted.
   * @example
   * ```tsx
   * <Avatar name="Ada Lovelace" />
   * ```
   */
  name?: string;
  /** Alternative text for the avatar. Pass an empty string for a decorative avatar. */
  alt?: string;
  /** Content shown instead of initials when no image is available. */
  fallback?: ReactNode;
  /** Called after the image fails to load. */
  onImageError?: () => void;
  /**
   * Diameter from the `sizes` config.
   * @default config.defaults.size
   */
  size?: Size;
  /**
   * Corner radius from the `radii` config.
   * @default 'rounded'
   */
  radius?: Radius | 'size';
  /**
   * Fallback color from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Fallback style recipe from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
}

/**
 * A person image with initials or custom fallback content when an image is unavailable.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src="/ada.jpg" />
 * <Avatar name="Grace Hopper" color="success" />
 * ```
 */
export function Avatar({
  src,
  name,
  alt,
  fallback,
  onImageError,
  size,
  radius,
  color,
  variant,
  className,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: AvatarProps) {
  const own = useDefaults('Avatar');
  const [failedSrc, setFailedSrc] = useState<string>();
  const decorative = alt === '' && ariaLabel == null && ariaLabelledBy == null && role == null;
  const label = ariaLabel ?? (alt === '' ? undefined : alt ?? name);
  const labelled = label != null || ariaLabelledBy != null;

  return (
    <span
      {...props}
      role={role ?? (labelled ? 'img' : undefined)}
      aria-label={ariaLabelledBy == null ? label : undefined}
      aria-labelledby={ariaLabelledBy}
      className={cx(
        'yarcl-avatar',
        sizeClass(size ?? own.size),
        radiusClass(radius ?? own.radius, size ?? own.size),
        colorClass(color ?? own.color),
        softVariantClass(variant ?? own.variant),
        className,
      )}
    >
      {src && failedSrc !== src ? (
        <img
          className="yarcl-avatar-image"
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => {
            setFailedSrc(src);
            onImageError?.();
          }}
        />
      ) : (
        <span className="yarcl-avatar-fallback" aria-hidden={labelled || decorative || undefined}>
          {fallback ?? initials(name)}
        </span>
      )}
    </span>
  );
}

/** Props for {@link AvatarGroup}. */
export interface AvatarGroupProps extends Omit<ComponentProps<'div'>, 'color'> {
  /** Direct `Avatar` children to arrange in an overlapping row. */
  children?: ReactNode;
  /**
   * Maximum number of avatars to show before an overflow count.
   * @example
   * ```tsx
   * <AvatarGroup max={3}>…</AvatarGroup>
   * ```
   */
  max?: number;
  /** Total number of people when not every avatar is rendered. Used with `max`. */
  total?: number;
  /** Accessible label for the overflow count. Receives the number of hidden avatars. */
  overflowLabel?: (count: number) => string;
  /**
   * Avatar diameter from the `sizes` config.
   * @default config.defaults.size
   */
  size?: Size;
  /**
   * Avatar corner radius from the `radii` config.
   * @default config.defaults.radius
   */
  radius?: Radius | 'size';
  /**
   * Fallback color from the `colors` config.
   * @default config.defaults.color
   */
  color?: Color;
  /**
   * Fallback style recipe from the `variants` config.
   * @default config.defaults.softVariant
   */
  variant?: Variant;
}

/**
 * An overlapping row of avatars. Group token props apply to avatars that do not set their own values.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3} aria-label="Project members">
 *   <Avatar name="Ada Lovelace" />
 *   <Avatar name="Grace Hopper" />
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({
  children,
  max,
  total,
  overflowLabel = (count) => `${count} more`,
  size,
  radius,
  color,
  variant,
  className,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: AvatarGroupProps) {
  const own = useDefaults('AvatarGroup');
  const avatarOwn = useDefaults('Avatar');
  const avatars = Children.toArray(children).filter(
    (child): child is ReactElement<AvatarProps> => isValidElement<AvatarProps>(child) && child.type === Avatar,
  );
  const limit = max == null ? avatars.length : Math.max(0, Math.floor(max));
  const visible = avatars.slice(0, limit);
  const hidden = Math.max((total ?? avatars.length) - visible.length, 0);
  const groupSize = size ?? own.size ?? avatarOwn.size;
  const groupRadius = radius ?? own.radius ?? avatarOwn.radius;
  const groupColor = color ?? own.color ?? avatarOwn.color;
  const groupVariant = variant ?? own.variant ?? avatarOwn.variant;
  const labelled = ariaLabel != null || ariaLabelledBy != null;

  return (
    <div
      {...props}
      role={role ?? (labelled ? 'group' : undefined)}
      aria-label={ariaLabelledBy == null ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      className={cx(
        'yarcl-avatar-group',
        sizeClass(groupSize),
        radiusClass(groupRadius, groupSize),
        colorClass(groupColor),
        softVariantClass(groupVariant),
        className,
      )}
    >
      {visible.map((avatar) =>
        cloneElement(avatar, {
          size: avatar.props.size ?? groupSize,
          radius: avatar.props.radius ?? groupRadius,
          color: avatar.props.color ?? groupColor,
          variant: avatar.props.variant ?? groupVariant,
        }),
      )}
      {hidden > 0 && (
        <span className="yarcl-avatar yarcl-avatar-overflow" role="img" aria-label={overflowLabel(hidden)}>
          +{hidden}
        </span>
      )}
    </div>
  );
}
