import { poll } from './poll.mjs';

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check, focused, htmlOverflow, setTiming }) {
  // Tooltip
  await page.getByRole('heading', { name: 'Floating' }).scrollIntoViewIfNeeded();
  const floatingSearch = page.locator('section', { has: page.getByRole('heading', { name: 'Floating' }) }).getByRole('button', { name: 'Search' });
  await floatingSearch.hover();
  await page.getByRole('tooltip').waitFor();
  const tooltip = page.getByRole('tooltip');
  check('tooltip opens on hover', await tooltip.isVisible());
  check('tooltip describes trigger', (await floatingSearch.getAttribute('aria-describedby')) !== null);
  const tooltipStyle = await tooltip.evaluate((el) => {
    const style = getComputedStyle(el);
    return { radius: style.borderRadius, padding: style.padding, fontSize: style.fontSize };
  });
  check(
    'tooltip uses component radius, spacing and text defaults',
    tooltipStyle.radius === '6px' && tooltipStyle.padding === '6px 8px' && tooltipStyle.fontSize === '13px',
    JSON.stringify(tooltipStyle),
  );
  await page.mouse.move(0, 0);
  await page.getByRole('tooltip').waitFor({ state: 'hidden' });
  check('tooltip closes on leave', !(await page.getByRole('tooltip').isVisible()));
  setTiming({ tooltipDelay: 400 });
  await page.clock.install();
  await floatingSearch.hover();
  await page.clock.runFor(399);
  check('tooltip waits for timing.tooltipDelay', !(await page.getByRole('tooltip').isVisible()));
  await page.clock.runFor(1);
  check('tooltip opens after timing.tooltipDelay', await poll(() => page.getByRole('tooltip').isVisible()));
  await page.mouse.move(0, 0);
  await page.clock.uninstall();
  setTiming();
  await page.getByRole('tooltip').waitFor({ state: 'hidden' });

  // Menu
  const actions = page.getByRole('button', { name: 'Actions' });
  await actions.click();
  const menu = page.getByRole('menu');
  check('menu opens on click', await menu.isVisible());
  check('menu uses its sm size override', (await menu.evaluate((el) => getComputedStyle(el).getPropertyValue('--yarcl-px'))) === '0.625rem');
  check('menu trigger aria-expanded', (await actions.getAttribute('aria-expanded')) === 'true');
  await page.keyboard.press('Escape');
  await actions.focus();
  await page.keyboard.press('Enter');
  check('keyboard open focuses first item', await page.getByRole('menuitem', { name: 'Rename' }).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  check('arrow keys skip disabled item', await page.getByRole('menuitem', { name: 'Delete' }).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('Enter');
  check('Enter selects and closes', !(await menu.isVisible()) && (await page.getByTestId('menu-log').innerText()).includes('Delete'));
  check('focus returns to trigger', await actions.evaluate((el) => el === document.activeElement));
  await actions.click();
  await page.keyboard.type('du');
  check('typeahead jumps to Duplicate', await poll(() => page.getByRole('menuitem', { name: 'Duplicate' }).evaluate((el) => el === document.activeElement)));
  await page.keyboard.press('Escape');
  check('Esc closes menu', !(await menu.isVisible()));

  // Popover
  const filters = page.getByRole('button', { name: 'Filters' });
  await filters.click();
  check('popover opens', await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  check('Esc closes popover', !(await page.getByRole('dialog').isVisible()));

  // HoverCard
  const ada = page.getByRole('link', { name: '@ada' });
  await ada.hover();
  const card = page.locator('.yarcl-hover-card').getByText('Ada Lovelace');
  await card.waitFor();
  check('hover card opens', await card.isVisible());
  await card.hover();
  await page.waitForTimeout(50);
  check('hover card stays open when pointer moves in', await card.isVisible());
  await page.mouse.move(0, 0);
  await card.waitFor({ state: 'hidden' });

  // Select
  const plan = page.getByRole('combobox', { name: 'Plan' });
  check('select labelled by Field', (await plan.count()) === 1);
  check('select shows value', (await plan.innerText()).includes('Pro'));
  await plan.click();
  const listbox = page.getByRole('listbox');
  check('select opens listbox', await listbox.isVisible());
  check('selected option focused', await poll(() => page.getByRole('option', { name: 'Pro' }).evaluate((el) => el === document.activeElement)));
  await page.keyboard.press('ArrowDown');
  check('select ArrowDown moves', await page.getByRole('option', { name: 'Team' }).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('ArrowDown');
  check('select skips disabled and loops', await page.getByRole('option', { name: 'Free' }).evaluate((el) => el === document.activeElement));
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  check('select Enter chooses', (await plan.innerText()).includes('Team') && (await page.getByText('Value: team').isVisible()));
  await plan.focus();
  await page.keyboard.type('f');
  check('closed typeahead selects', await poll(async () => (await plan.innerText()).includes('Free')));

  // Combobox (searchable select)
  const country = page.getByRole('combobox', { name: 'Country' });
  await country.click();
  await country.fill('sw');
  const opts = await page.getByRole('option').allInnerTexts();
  check('combobox filters', JSON.stringify(opts) === JSON.stringify(['Sweden', 'Switzerland']), JSON.stringify(opts));
  check('first match active', (await country.getAttribute('aria-activedescendant')) !== null);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  check('combobox Enter chooses', (await country.inputValue()) === 'Switzerland' && (await page.getByText('Value: switzerland').isVisible()));
  await country.fill('xyz');
  check('empty message', await page.getByText('No results').isVisible());
  await page.keyboard.press('Tab');
  check('blur restores label', (await country.inputValue()) === 'Switzerland', await country.inputValue());
  await country.click();
  await country.fill('can');
  await page.getByRole('option', { name: 'Canada' }).click();
  check('click chooses option', (await country.inputValue()) === 'Canada');

  // Combobox (free text)
  const fw = page.getByRole('combobox', { name: 'Framework' });
  await fw.click();
  await fw.fill('Lit');
  await page.keyboard.press('Tab');
  check('custom value kept', (await fw.inputValue()) === 'Lit' && (await page.getByText('Value: Lit').isVisible()));

  // Combobox (async)
  const remote = page.getByRole('combobox', { name: 'Async search' });
  await remote.click();
  check('async shows nothing before typing', (await page.getByRole('listbox').count()) === 0);
  await remote.fill('ar');
  check('async loading', await page.getByText('Loading…').isVisible());
  check('async results', await poll(async () => (await page.getByRole('option').allInnerTexts()).join() === 'Argentina', 40));
  await page.keyboard.press('Escape');

  // Combobox (multiple)
  const visited = page.getByRole('combobox', { name: 'Countries visited' });
  const control = page.locator('.yarcl-combobox-control', { has: visited });
  const chips = control.getByRole('list', { name: 'Selected' });
  const chipTexts = () => chips.getByRole('listitem').allInnerTexts().catch(() => []);
  const hidden = () => control.locator('input[type="hidden"][name="visited"]').evaluateAll((els) => els.map((el) => el.value).join());
  const inputHeight = (await country.boundingBox()).height;
  check('multiple: starts with default chip', (await chipTexts()).join() === 'Sweden');
  check('multiple: one line matches Input height', Math.abs((await control.boundingBox()).height - inputHeight) < 0.5, `${(await control.boundingBox()).height} vs ${inputHeight}`);
  await visited.click();
  check('multiple: listbox is multiselectable', (await page.getByRole('listbox').getAttribute('aria-multiselectable')) === 'true');
  check('multiple: selected option marked', (await page.getByRole('option', { name: 'Sweden' }).getAttribute('aria-selected')) === 'true');
  await visited.fill('nor');
  await page.keyboard.press('Enter');
  check('multiple: Enter adds a chip and clears the input', (await chipTexts()).join() === 'Sweden,Norway' && (await visited.inputValue()) === '');
  check('multiple: list stays open', await page.getByRole('listbox').isVisible());
  check('multiple: value reported', await page.getByText('Value: sweden, norway').isVisible());
  check('multiple: one hidden input per value', (await hidden()) === 'sweden,norway');
  await page.getByRole('option', { name: 'Sweden' }).click();
  check('multiple: choosing a selected option removes it', (await chipTexts()).join() === 'Norway');
  for (const name of ['Chile', 'Peru', 'Spain']) await page.getByRole('option', { name }).click();
  check('multiple: chips wrap and the control grows', (await control.boundingBox()).height > inputHeight + 1);
  check('multiple: maxSelected disables other options', (await page.getByRole('option', { name: 'Italy' }).getAttribute('aria-disabled')) === 'true');
  await page.getByRole('option', { name: 'Italy' }).click({ force: true });
  check('multiple: disabled option not added', (await chipTexts()).length === 4);
  await page.keyboard.press('Escape');
  check('multiple: Esc closes the list', (await page.getByRole('listbox').count()) === 0);
  await page.keyboard.press('Backspace');
  check('multiple: Backspace removes the last chip', (await chipTexts()).join() === 'Norway,Chile,Peru');
  await page.keyboard.press('ArrowLeft');
  check('multiple: ArrowLeft focuses the last chip', await focused(page.getByRole('button', { name: 'Remove Peru' })));
  await page.keyboard.press('ArrowLeft');
  check('multiple: ArrowLeft moves across chips', await focused(page.getByRole('button', { name: 'Remove Chile' })));
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  check('multiple: ArrowRight returns to the input', await focused(visited));
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Backspace');
  check('multiple: Backspace on a chip removes it', (await chipTexts()).join() === 'Norway,Chile');
  check('multiple: focus returns to the input', await focused(visited));
  await page.getByRole('button', { name: 'Remove Norway' }).click();
  check('multiple: remove button removes its chip', (await chipTexts()).join() === 'Chile' && (await focused(visited)));
  check('multiple: chips are not tab stops', (await page.getByRole('button', { name: 'Remove Chile' }).getAttribute('tabindex')) === '-1');

  const skills = page.getByRole('combobox', { name: 'Skills' });
  const skillChips = page.locator('.yarcl-combobox-control', { has: skills }).getByRole('listitem');
  await skills.click();
  await skills.fill('Lit');
  await page.keyboard.press('Enter');
  check('multiple custom: Enter adds typed text', (await skillChips.allInnerTexts()).join() === 'React,Lit' && (await skills.inputValue()) === '');
  await skills.fill('sol');
  await page.keyboard.press('Enter');
  check('multiple custom: Enter picks the highlighted match', (await skillChips.allInnerTexts()).join() === 'React,Lit,Solid');
  await page.keyboard.press('Escape');
}
