import { audit } from './a11y.mjs';

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function (ctx) {
  const { page } = ctx;
  await page.evaluate(() => document.fonts.ready);
  await audit(ctx, 'shop page');
  await audit(ctx, 'grid layouts', '.yarcl-grid');
  await audit(ctx, 'avatar group', '[aria-label="Design team"]');
  await audit(ctx, 'empty state', '[data-testid="brand-b-empty-state"]');
  await audit(ctx, 'pagination', '.yarcl-pagination');

  await page.getByRole('button', { name: 'Delivery date' }).click();
  await audit(ctx, 'date picker open', '.yarcl-floating');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Show all breadcrumbs' }).click();
  await audit(ctx, 'breadcrumb expanded', '.yarcl-breadcrumb');

  await page.getByRole('button', { name: 'Materials' }).click();
  await audit(ctx, 'accordion expanded', '.yarcl-accordion');

  await page.getByRole('button', { name: 'Size guide' }).click();
  await audit(ctx, 'size guide dialog', 'dialog[open]');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Search' }).click();
  await audit(ctx, 'command palette open', 'dialog[open]');
  await page.keyboard.press('Escape');

  const referenceLink = page.getByRole('link', { name: 'Design reference' });
  ctx.check('design reference link points to the reference page', (await referenceLink.getAttribute('href')) === '?page=reference');
  await page.goto('?page=reference');
  await audit(ctx, 'design reference page');
}
