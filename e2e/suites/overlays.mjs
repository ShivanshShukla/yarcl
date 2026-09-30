/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check, focused, htmlOverflow }) {
  // Dialog (uncontrolled, trigger)
  const openBtn = page.getByRole('button', { name: 'Open dialog' });
  await openBtn.scrollIntoViewIfNeeded();
  await openBtn.click();
  const invite = page.getByRole('dialog', { name: 'Invite a teammate' });
  check('dialog opens with accessible name', await invite.isVisible());
  check('dialog has description', (await invite.getAttribute('aria-describedby')) !== null);
  check('focus moves into dialog', await focused(invite));
  check('page scroll locked', (await htmlOverflow()) === 'hidden');
  const backdrop = (locator) => locator.evaluate((el) => getComputedStyle(el, '::backdrop').backgroundColor);
  await invite.getByRole('button', { name: 'Open nested dialog' }).click();
  const nested = page.getByRole('dialog', { name: 'Nested dialog' });
  check('nested dialog opens', await nested.isVisible());
  const [under, top] = [await backdrop(invite), await backdrop(nested)];
  check('only the top dialog shows a backdrop', under === 'rgba(0, 0, 0, 0)' && top !== 'rgba(0, 0, 0, 0)', `${under} / ${top}`);
  await page.keyboard.press('Escape');
  check('Esc closes only the top dialog', !(await nested.isVisible()) && (await invite.isVisible()));
  let restored = '';
  for (let i = 0; i < 20 && (restored = await backdrop(invite)) === 'rgba(0, 0, 0, 0)'; i++) await page.waitForTimeout(50);
  check('lower dialog backdrop restored', restored !== 'rgba(0, 0, 0, 0)', restored);
  await page.getByRole('button', { name: 'Toast from dialog' }).click();
  const inner = page.getByRole('status').filter({ hasText: 'From inside the dialog' });
  check('toast shows above modal dialog', await inner.isVisible());
  const topmost = await inner.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return el.contains(hit);
  });
  check('toast is topmost at its position', topmost);
  await inner.getByRole('button', { name: 'Dismiss' }).click({ timeout: 2000 }).then(
    () => check('toast clickable while dialog open', true),
    (e) => check('toast clickable while dialog open', false, e.message.split('\n')[0]),
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  if (await invite.isVisible()) await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  check('Esc closes dialog', !(await invite.isVisible()));
  check('focus returns to trigger', await focused(openBtn));
  check('scroll unlocked', (await htmlOverflow()) !== 'hidden');
  await openBtn.click();
  await page.mouse.click(5, 5);
  check('backdrop click closes', !(await invite.isVisible()));
  await openBtn.click();
  await invite.getByRole('button', { name: 'Close' }).click();
  check('close button closes', !(await invite.isVisible()));

  // Controlled dialog + toast action
  await page.getByRole('button', { name: 'Controlled dialog' }).click();
  const confirm = page.getByRole('dialog', { name: 'Delete project?' });
  check('controlled dialog opens', await confirm.isVisible());
  await page.addStyleTag({ content: '* { margin: 0 }' });
  const dialogBox = await confirm.boundingBox();
  const viewport = page.viewportSize();
  const centered =
    Math.abs(dialogBox.x - (viewport.width - dialogBox.x - dialogBox.width)) < 2 &&
    Math.abs(dialogBox.y - (viewport.height - dialogBox.y - dialogBox.height)) < 2;
  check('dialog stays centered under a CSS reset', centered, JSON.stringify(dialogBox));
  const width = (await confirm.boundingBox()).width;
  check('size prop applied (sm = 24rem)', Math.abs(width - 24 * 16) < 2, String(width));
  await confirm.getByRole('button', { name: 'Delete' }).click();
  check('controlled dialog closes', !(await confirm.isVisible()));
  const deleted = page.getByRole('status').filter({ hasText: 'Project deleted' });
  check('toast after close', await deleted.isVisible());
  await deleted.getByRole('button', { name: 'Undo' }).click();
  check('toast action runs and dismisses', (await page.getByRole('status').filter({ hasText: 'Restored' }).isVisible()) && !(await deleted.isVisible()));
  await page.evaluate(() => document.querySelectorAll('.yarcl-toast-close').forEach((b) => b.click()));

  // Drawers
  await page.getByRole('button', { name: 'Right drawer' }).click();
  const filters = page.getByRole('dialog', { name: 'Filters' });
  const box = await filters.boundingBox();
  check('right drawer attached to right edge', Math.abs(box.x + box.width - 1100) < 2 && box.height >= 799, JSON.stringify(box));
  const scrolls = await filters.locator('.yarcl-modal-body').evaluate((el) => el.scrollHeight > el.clientHeight);
  check('drawer body scrolls, footer visible', scrolls && (await filters.getByRole('button', { name: 'Apply' }).isVisible()));
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Left drawer' }).click();
  const nav = page.getByRole('dialog', { name: 'Navigation' });
  check('left drawer attached to left edge', (await nav.boundingBox()).x < 1);
  await page.keyboard.press('Escape');

  // Toast auto-dismiss + limit
  await page.clock.install();
  await page.getByRole('button', { name: 'Toast success' }).click();
  const ok = page.getByRole('status').filter({ hasText: 'success toast' });
  check('toast appears', await ok.isVisible());
  const toastStyle = await ok.evaluate((el) => {
    const style = getComputedStyle(el);
    return { radius: style.borderRadius, gap: style.gap, padding: style.padding, fontSize: style.fontSize };
  });
  check(
    'toast uses component radius, spacing and text defaults',
    toastStyle.radius === '8px' && toastStyle.gap === '12px' && toastStyle.padding === '12px 8px 12px 16px' && toastStyle.fontSize === '14px',
    JSON.stringify(toastStyle),
  );
  for (const c of ['brand', 'neutral', 'warning', 'danger']) await page.getByRole('button', { name: `Toast ${c}` }).click();
  check('toast limit 4, oldest dismissed', (await page.locator('.yarcl-toast').count()) === 4 && !(await ok.isVisible()));
  await page.clock.runFor(5400);
  check('toasts auto-dismiss', (await page.locator('.yarcl-toast').count()) === 0, String(await page.locator('.yarcl-toast').count()));
  await page.getByRole('button', { name: 'Sticky toast' }).click();
  await page.clock.runFor(5400);
  check('sticky toast stays', await page.getByRole('status').filter({ hasText: 'Sticky' }).isVisible());
  await page.getByRole('status').filter({ hasText: 'Sticky' }).getByRole('button', { name: 'Dismiss' }).click();
  check('toaster hidden when empty', !(await page.locator('.yarcl-toaster').isVisible()));
  await page.clock.uninstall();

  // Tabs
  const overview = page.getByRole('tab', { name: 'Overview' });
  await overview.scrollIntoViewIfNeeded();
  await overview.click();
  await page.keyboard.press('ArrowRight');
  check('ArrowRight selects next tab', (await page.getByRole('tab', { name: 'Activity' }).getAttribute('aria-selected')) === 'true' && (await page.getByRole('tabpanel', { name: 'Activity' }).isVisible()));
  await page.keyboard.press('ArrowRight');
  check('skips disabled tab', await focused(page.getByRole('tab', { name: 'Settings' })));
  await page.keyboard.press('ArrowRight');
  check('wraps to first', await focused(overview));
  await page.keyboard.press('End');
  check('End jumps to last', await focused(page.getByRole('tab', { name: 'Settings' })));
  check('only one panel visible', (await page.getByRole('tabpanel').count()) === 1);
  check('roving tabindex', (await page.locator('[role=tab][tabindex="0"]').count()) === 1);

  // Table density
  const row = page.getByRole('row', { name: /INV-1042/ });
  await row.scrollIntoViewIfNeeded();
  const h1 = (await row.boundingBox()).height;
  await page.getByRole('combobox', { name: 'Density' }).click();
  await page.getByRole('option', { name: 'relaxed' }).click();
  const h2 = (await row.boundingBox()).height;
  check('density changes row height', h2 > h1, `${h1} -> ${h2}`);
  check('table has caption name', await page.getByRole('table', { name: 'Invoices' }).isVisible());
}
