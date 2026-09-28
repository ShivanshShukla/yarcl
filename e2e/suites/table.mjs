import { audit } from './a11y.mjs';

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function (ctx) {
  const { page, check, focused } = ctx;
  const tableWrap = page.locator('.yarcl-table-wrap').first();
  await tableWrap.scrollIntoViewIfNeeded();

  const table = page.locator('table.yarcl-table').first();
  check('table is rendered', await table.isVisible());

  // 1. Virtualization: renders only a bounded window of rows in DOM
  const rows = table.locator('tbody tr:not(.yarcl-table-virtual-spacer)');
  const initialRowCount = await rows.count();
  check(
    'virtualization: renders only a subset of total rows in DOM (< 35 rows)',
    initialRowCount > 0 && initialRowCount < 35,
    `rendered ${initialRowCount} rows`,
  );

  const firstInvoice = table.locator('tbody tr:not(.yarcl-table-virtual-spacer)').first();
  check('virtualization: initial first row is INV-1042', (await firstInvoice.textContent()).includes('INV-1042'));

  // 2. Initial selection check (1 row selected)
  const selectAllCheckbox = table.locator('th.yarcl-table-selection-cell input[type="checkbox"]');
  const isIndeterminate = async (locator) => locator.evaluate((el) => el.indeterminate);
  const isChecked = async (locator) => locator.evaluate((el) => el.checked);

  check('selection: select-all is indeterminate initially with 1 row selected', await isIndeterminate(selectAllCheckbox));
  const initialSelectedRow = table.locator('tbody tr[aria-selected="true"]');
  check('selection: initial selected row has aria-selected="true"', await initialSelectedRow.first().isVisible());

  // 3. Sorting & aria-sort
  const customerHeader = table.locator('th', { hasText: 'Customer' });
  const amountHeader = table.locator('th', { hasText: 'Amount' });
  const invoiceHeader = table.locator('th', { hasText: 'Invoice' });

  check('non-sortable header does not have aria-sort', !(await invoiceHeader.getAttribute('aria-sort')));
  check('sortable header has aria-sort="none" initially', (await customerHeader.getAttribute('aria-sort')) === 'none');

  const customerSortBtn = customerHeader.locator('button.yarcl-table-sort-button');
  await customerSortBtn.click();
  check('sortable header has aria-sort="ascending" on first click', (await customerHeader.getAttribute('aria-sort')) === 'ascending');

  const firstCustomer = await table.locator('tbody tr:not(.yarcl-table-virtual-spacer)').first().textContent();
  check('sorting: first customer is Ada Lovelace after ascending sort', firstCustomer.includes('Ada Lovelace'));

  await customerSortBtn.click();
  check('sortable header has aria-sort="descending" on second click', (await customerHeader.getAttribute('aria-sort')) === 'descending');
  const firstCustomerDesc = await table.locator('tbody tr:not(.yarcl-table-virtual-spacer)').first().textContent();
  check('sorting: first customer is Tim Berners-Lee after descending sort', firstCustomerDesc.includes('Tim Berners-Lee'));

  // Keyboard sorting on Amount header
  const amountSortBtn = amountHeader.locator('button.yarcl-table-sort-button');
  await amountSortBtn.focus();
  check('amount sort button is focusable', await focused(amountSortBtn));
  await page.keyboard.press('Enter');
  check('keyboard sorting: Enter activates sort and sets aria-sort="ascending"', (await amountHeader.getAttribute('aria-sort')) === 'ascending');

  // 4. Select All interaction
  await selectAllCheckbox.click();
  check('selection: select-all is checked after clicking', await isChecked(selectAllCheckbox));
  check('selection: select-all is not indeterminate after full selection', !(await isIndeterminate(selectAllCheckbox)));
  check('selection: label shows 1000 of 1000 selected', (await page.locator('main').textContent()).includes('1000 of 1000 selected'));

  // 5. Virtualization scroll & selection persistence
  await tableWrap.evaluate((el) => {
    el.scrollTop = 15000;
  });
  await page.waitForFunction(() => {
    const wrap = document.querySelector('.yarcl-table-wrap');
    return wrap && wrap.scrollTop > 5000;
  });

  const scrolledRows = table.locator('tbody tr:not(.yarcl-table-virtual-spacer)');
  const scrolledCount = await scrolledRows.count();
  check(
    'virtualization: row count remains bounded after scroll (< 35 rows)',
    scrolledCount > 0 && scrolledCount < 35,
    `rendered ${scrolledCount} rows`,
  );

  // Verify scrolled row is selected
  const scrolledRow = scrolledRows.first();
  check('selection state is preserved on scrolled virtual rows (aria-selected="true")', (await scrolledRow.getAttribute('aria-selected')) === 'true');
  const scrolledRowCheckbox = scrolledRow.locator('input[type="checkbox"]');
  check('selection checkbox is checked on scrolled virtual row', await isChecked(scrolledRowCheckbox));

  // Scroll back to top
  await tableWrap.evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.waitForFunction(() => {
    const wrap = document.querySelector('.yarcl-table-wrap');
    return wrap && wrap.scrollTop === 0;
  });

  // Deselect all
  await selectAllCheckbox.click();
  check('selection: select-all is unchecked after deselecting all', !(await isChecked(selectAllCheckbox)));
  check('selection: label shows 0 of 1000 selected', (await page.locator('main').textContent()).includes('0 of 1000 selected'));

  // Select single row
  const firstRowCheckbox = table.locator('tbody tr:not(.yarcl-table-virtual-spacer)').first().locator('input[type="checkbox"]');
  await firstRowCheckbox.click();
  check('selection: single row checkbox becomes checked', await isChecked(firstRowCheckbox));
  check('selection: select-all returns to indeterminate after single row selection', await isIndeterminate(selectAllCheckbox));

  // 6. Density config
  const densitySelect = page.getByRole('combobox', { name: 'Density' });
  if (await densitySelect.isVisible()) {
    await densitySelect.click();
    const denseOption = page.getByRole('option', { name: 'dense' });
    if (await denseOption.isVisible()) {
      await denseOption.click();
      check('density: table receives yarcl-density-dense class', (await table.getAttribute('class')).includes('yarcl-density-dense'));
    }
  }

  // 7. Axe audit
  await audit(ctx, 'table in virtualized state', '.yarcl-table-wrap');
}
