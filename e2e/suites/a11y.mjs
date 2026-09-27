import axe from 'axe-core';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Runs axe on the page, or only on `include`, and records one check with a readable summary of violations. */
export async function audit({ check }, name, include) {
  const { violations } = await axe.run(include ?? document, { runOnly: { type: 'tag', values: tags } });
  const summary = violations
    .map((v) => {
      const node = v.nodes[0];
      const extra = node.any?.[0]?.data?.contrastRatio ? ` ${node.any[0].data.contrastRatio}:1` : '';
      return `${v.id} ×${v.nodes.length} (${node.target.join(' ')}${extra})`;
    })
    .join('; ');
  check(`axe: ${name}`, violations.length === 0, summary);
}

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function (ctx) {
  const { page } = ctx;
  const floating = page.locator('section', { has: page.getByRole('heading', { name: 'Floating', exact: true }) });

  await audit(ctx, 'whole demo page');
  await audit(ctx, 'avatars', '[data-testid="avatar-demo"]');
  await audit(ctx, 'visually hidden accessible name', '[data-testid="visually-hidden-demo"]');

  await page.getByRole('slider', { name: 'Price range Maximum' }).focus();
  await page.keyboard.press('Home');
  await audit(ctx, 'sliders after keyboard input', '.yarcl-slider');
  const labels = page.locator('section', { has: page.getByRole('heading', { name: 'Labels', exact: true }) });
  await labels.locator('input').first().focus();
  await audit(ctx, 'labels with focused control', 'section:has(#label-city)');
  await page.getByRole('button', { name: 'Start upload' }).click();
  await audit(ctx, 'progress bars', '.progress-demo');
  const invoices = page.getByRole('navigation', { name: 'Invoice pages' });
  await invoices.getByRole('button', { name: 'Page 12' }).click();
  await audit(ctx, 'pagination on last page', '.yarcl-pagination');
  await page.getByRole('button', { name: 'Show all breadcrumbs' }).click();
  await audit(ctx, 'breadcrumb expanded', '.yarcl-breadcrumb');
  const guests = page.getByRole('spinbutton', { name: 'Guests' });
  await guests.focus();
  await page.keyboard.press('End');
  await audit(ctx, 'number input at max', '.yarcl-number-input');
  await page.keyboard.press('Home');

  await page.getByRole('button', { name: 'Actions' }).click();
  await audit(ctx, 'menu open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  await page.getByRole('combobox', { name: 'Plan' }).click();
  await audit(ctx, 'select open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  const country = page.getByRole('combobox', { name: 'Country' });
  await country.click();
  await country.fill('sw');
  await audit(ctx, 'combobox open');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Appointment' }).click();
  await audit(ctx, 'date picker open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Stay' }).click();
  await audit(ctx, 'date range picker open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Delivery day' }).click();
  await audit(ctx, 'date picker with disabled days open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  const visited = page.getByRole('combobox', { name: 'Countries visited' });
  await visited.click();
  await visited.fill('nor');
  await page.keyboard.press('Enter');
  await audit(ctx, 'multiple combobox open with chips');
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowLeft');
  await audit(ctx, 'multiple combobox chip focused', '.yarcl-combobox-control');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Filters' }).click();
  await audit(ctx, 'popover open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  await floating.getByRole('button', { name: 'Search' }).hover();
  await page.locator('.yarcl-tooltip').waitFor();
  await audit(ctx, 'tooltip open', '.yarcl-tooltip');
  await page.mouse.move(0, 0);

  await page.getByRole('link', { name: '@ada' }).hover();
  await page.locator('.yarcl-hover-card').waitFor();
  await audit(ctx, 'hover card open', '.yarcl-hover-card');
  await page.mouse.move(0, 0);

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await audit(ctx, 'dialog open', 'dialog[open]');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Command palette' }).click();
  await audit(ctx, 'command palette open', 'dialog[open]');
  await page.getByRole('combobox', { name: 'Command palette' }).fill('project');
  await audit(ctx, 'command palette filtered, with a disabled command', 'dialog[open]');
  await page.getByRole('combobox', { name: 'Command palette' }).fill('zzz');
  await audit(ctx, 'command palette empty', 'dialog[open]');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Right drawer' }).click();
  await audit(ctx, 'drawer open', 'dialog[open]');
  await page.keyboard.press('Escape');

  const settings = page.getByTestId('settings');
  await settings.getByRole('button', { name: 'Notifications' }).click();
  await page.getByTestId('faq').getByRole('button', { name: 'Shipping' }).click();
  await audit(ctx, 'accordion expanded and collapsed', '.yarcl-accordion');

  await page.getByRole('button', { name: 'Toast success' }).click();
  await audit(ctx, 'toast visible', '.yarcl-toaster');
}
