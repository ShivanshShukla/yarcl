import { poll } from './poll.mjs';

const barContrast = (locator) =>
  locator.evaluateAll((els) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const paint = (...layers) => {
      ctx.clearRect(0, 0, 1, 1);
      for (const color of layers) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      }
      return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
    };
    const backdrop = (el) => {
      for (let node = el.parentElement; node; node = node.parentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg !== 'rgba(0, 0, 0, 0)') return bg;
      }
      return getComputedStyle(document.documentElement).backgroundColor;
    };
    const luminance = (rgb) => {
      const [r, g, b] = rgb.map((c) => c / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return els.map((el) => {
      const track = el.querySelector('.yarcl-progress-track');
      const bar = el.querySelector('.yarcl-progress-bar');
      const under = backdrop(track);
      const a = luminance(paint(under, getComputedStyle(track).backgroundColor));
      const b = luminance(paint(under, getComputedStyle(bar).backgroundColor));
      return { name: el.getAttribute('aria-label') || el.textContent, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
    });
  });

/** Checks every determinate progress bar in `scope` keeps 3:1 against its track. */
export async function progressContrast({ check }, scope) {
  const results = await barContrast(scope.locator('.yarcl-progress:not([data-indeterminate])'));
  const low = results.filter((r) => r.ratio < 3).map((r) => `${r.name} ${r.ratio.toFixed(2)}:1`);
  check(`progress bars contrast with track (≥ 3:1, ${results.length} bars)`, results.length > 0 && low.length === 0, low.join(', '));
}

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function (ctx) {
  const { page, check } = ctx;
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Feedback' }) });
  await section.scrollIntoViewIfNeeded();

  await section.getByRole('button', { name: 'Remove vite' }).click();
  const tags = await section.locator('.yarcl-badge:has(.yarcl-badge-remove)').allInnerTexts();
  check('tag removed', JSON.stringify(tags.map((t) => t.trim())) === JSON.stringify(['react', 'typescript', 'css']), JSON.stringify(tags));

  const avatars = section.getByTestId('avatar-demo');
  const ada = avatars.locator('.yarcl-avatar').nth(0);
  check('avatar image is named by the person', (await ada.getAttribute('aria-label')) === 'Ada Lovelace' && (await ada.locator('.yarcl-avatar-image').count()) === 1);
  await ada.locator('.yarcl-avatar-image').evaluate((image) => image.dispatchEvent(new Event('error')));
  check('avatar falls back to initials after image error', await poll(() => ada.textContent().then((text) => text === 'AL')));
  const grace = avatars.locator('.yarcl-avatar').nth(1);
  const avatarStyle = await grace.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    radius: getComputedStyle(el).borderRadius,
    color: getComputedStyle(el).color,
  }));
  check('avatar uses the size scale and rounded component default', avatarStyle.height === 40 && avatarStyle.radius === '9999px', JSON.stringify(avatarStyle));
  const group = avatars.getByRole('group', { name: 'Project members' });
  check(
    'avatar group limits children and names the overflow count',
    (await group.getByRole('img').count()) === 4 && (await group.getByRole('img', { name: '2 more' }).count()) === 1,
  );

  const trial = section.getByText('Trial ends in 3 days');
  const alertStyle = await trial.locator('xpath=..').locator('xpath=..').evaluate((el) => {
    const style = getComputedStyle(el);
    return { radius: style.borderRadius, gap: style.gap, padding: style.padding, fontSize: style.fontSize };
  });
  check(
    'alert uses component radius, spacing and text defaults',
    alertStyle.radius === '6px' && alertStyle.gap === '12px' && alertStyle.padding === '14px 16px' && alertStyle.fontSize === '14px',
    JSON.stringify(alertStyle),
  );
  await section.getByRole('button', { name: 'Dismiss' }).click();
  check('alert dismissed', !(await trial.isVisible()));
  check('static alerts have no live role', (await section.locator('.yarcl-alert[role]').count()) === 0);

  const save = section.getByRole('button', { name: 'Save' });
  await page.clock.install();
  await save.click();
  const saving = section.getByRole('button', { name: 'Saving…' });
  check('loading button disabled and busy', (await saving.isDisabled()) && (await saving.getAttribute('aria-busy')) === 'true');
  check('loading spinner inside button', (await saving.locator('.yarcl-spinner').count()) === 1);
  const add = section.getByRole('button', { name: 'Add' });
  check('icon button swaps icon for spinner', (await add.locator('svg').count()) === 0 && (await add.locator('.yarcl-spinner').count()) === 1);
  const hBusy = (await saving.boundingBox()).height;
  await page.clock.runFor(1500);
  check('loading ends', await poll(() => save.isEnabled()));
  check('button height unchanged while loading', Math.abs((await save.boundingBox()).height - hBusy) < 0.5);
  await page.clock.uninstall();

  check('spinners labelled', (await section.getByRole('status', { name: 'Loading' }).count()) === Object.keys({ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }).length);

  const card = section.locator('.skeleton-card');
  check('loading region aria-busy', (await card.getAttribute('aria-busy')) === 'true');
  check('skeleton hidden from a11y', (await card.locator('[aria-hidden="true"]').count()) >= 4);
  const skel = card.locator('.yarcl-skeleton-control').first();
  const skelH = (await skel.boundingBox()).height;
  const lines = await card.locator('.yarcl-skeleton-line').count();
  check('skeleton text lines', lines === 3, String(lines));
  await section.getByRole('button', { name: 'Show content' }).click();
  const follow = card.getByRole('button', { name: 'Follow' });
  const btnH = (await follow.boundingBox()).height;
  check('control skeleton matches button height', Math.abs(skelH - btnH) < 0.5, `${skelH} vs ${btnH}`);

  const storage = section.getByRole('progressbar', { name: 'Storage used' });
  check(
    'progress values',
    (await storage.getAttribute('aria-valuenow')) === '82' &&
      (await storage.getAttribute('aria-valuemin')) === '0' &&
      (await storage.getAttribute('aria-valuemax')) === '100',
  );
  check('progress visible value', (await storage.locator('.yarcl-progress-value').innerText()) === '82%');
  const storageBar = await storage.evaluate((el) => {
    const track = el.querySelector('.yarcl-progress-track').getBoundingClientRect();
    return el.querySelector('.yarcl-progress-bar').getBoundingClientRect().width / track.width;
  });
  check('progress bar width matches value', Math.abs(storageBar - 0.82) < 0.01, String(storageBar));

  const steps = section.getByRole('progressbar', { name: 'Steps completed' });
  check(
    'progress formatted value text',
    (await steps.getAttribute('aria-valuetext')) === '3 of 8' && (await steps.getAttribute('aria-valuemax')) === '8',
  );

  const syncing = section.getByRole('progressbar', { name: 'Syncing' });
  const attrs = await syncing.evaluate((el) => ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'].map((a) => el.getAttribute(a)));
  check('indeterminate progress omits values', attrs.every((a) => a === null), JSON.stringify(attrs));
  check(
    'indeterminate progress respects reduced motion',
    (await syncing.locator('.yarcl-progress-bar').evaluate((el) => getComputedStyle(el).animationName)) === 'yarcl-pulse',
  );

  const heights = await section.getByRole('progressbar', { name: /^Size / }).evaluateAll((els) =>
    els.map((el) => el.querySelector('.yarcl-progress-track').getBoundingClientRect().height),
  );
  check('progress track grows with size', heights.length > 1 && heights.every((h, i) => i === 0 || h > heights[i - 1]), JSON.stringify(heights));

  const upload = section.getByRole('progressbar', { name: 'Uploading photos' });
  await section.getByRole('button', { name: 'Start upload' }).click();
  for (let i = 0; i < 40 && (await upload.getAttribute('aria-valuenow')) !== '100'; i++) await page.waitForTimeout(100);
  check('progress updates to complete', (await upload.getAttribute('aria-valuenow')) === '100');

  await progressContrast(ctx, section);
}
