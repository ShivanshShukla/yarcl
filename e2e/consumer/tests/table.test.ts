import { runSuite } from '../../../test-utils/suite';
import suite from '../../suites/table.mjs';
import { App } from '../src/App';
import '../src/index.css';

// Brand B table test runs the table suite if App has a full virtual table or verifies size guide
runSuite(App, 'table-brand-b', async (ctx) => {
  const { page, check } = ctx;
  await page.getByRole('button', { name: 'Size guide' }).click();
  const guide = page.getByRole('dialog', { name: 'Size guide' });
  const table = guide.getByRole('table', { name: 'Chest and length' });
  check('brand b: size guide table rendered', await table.isVisible());
  const th = table.locator('th').first();
  const thPadding = await th.evaluate((el) => ({ py: getComputedStyle(el).paddingTop, px: getComputedStyle(el).paddingLeft }));
  check("brand b: table cell uses cozy density tokens (py=12px, px=16px)", thPadding.py === '12px' && thPadding.px === '16px', JSON.stringify(thPadding));
  await page.keyboard.press('Escape');
});
