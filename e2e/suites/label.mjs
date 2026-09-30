/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check, focused }) {
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Labels', exact: true }) });
  await section.scrollIntoViewIfNeeded();

  const city = section.getByRole('textbox', { name: 'City', exact: true });
  check('htmlFor names the control (marker not announced)', (await city.count()) === 1);
  const cityLabel = section.locator('label', { hasText: 'City' });
  check('required marker hidden from screen readers', (await cityLabel.locator('[aria-hidden="true"]').textContent()) === ' *');
  await cityLabel.click();
  check('clicking the label focuses its control', await focused(city));
  await page.keyboard.press('Shift+Tab');
  check('label is not a tab stop', !(await focused(cityLabel)));

  const birth = section.getByRole('group', { name: 'Date of birth' });
  check('one label names a group of controls', (await birth.getByRole('textbox').count()) === 3);

  const frequency = section.getByRole('group', { name: 'Digest frequency' });
  check('labels a custom control with aria-labelledby', (await frequency.getByRole('button').count()) === 3);

  const color = (locator) => locator.evaluate((el) => getComputedStyle(el).color);
  const probe = (css) =>
    page.evaluate((css) => {
      const el = document.createElement('span');
      el.style.color = css;
      document.body.append(el);
      const value = getComputedStyle(el).color;
      el.remove();
      return value;
    }, css);
  check('default color is the neutral text', (await color(cityLabel)) === (await probe('var(--yarcl-neutral-text)')));
  check('required marker uses the error color', (await color(cityLabel.locator('span'))) === (await probe('var(--yarcl-error)')));
  const brand = section.locator('label', { hasText: 'Digest frequency' });
  check('color prop uses the color text shade', (await color(brand)) === (await probe('var(--yarcl-color-brand-text)')));
  const nickname = section.locator('label', { hasText: 'Nickname' });
  check('disabled label is muted', (await color(nickname)) === (await probe('var(--yarcl-neutral-muted)')));

  const font = (locator) => locator.evaluate((el) => `${getComputedStyle(el).fontSize} ${getComputedStyle(el).fontWeight}`);
  const fieldLabel = page.locator('.yarcl-field label').first();
  check('uses defaults.labelStyle (label: 14px 500)', (await font(cityLabel)) === '14px 500', await font(cityLabel));
  check('Field renders the same Label', (await font(fieldLabel)) === '14px 500' && (await fieldLabel.getAttribute('class')).includes('yarcl-label'));
  check('Field label names its control', (await page.getByRole('textbox', { name: 'Name', exact: true }).count()) === 1);

  check('size scales font size', (await brand.evaluate((el) => getComputedStyle(el).fontSize)) === '16px');
  check('variant fills the background', (await brand.evaluate((el) => getComputedStyle(el).backgroundColor)) !== 'rgba(0, 0, 0, 0)');
  check(
    'radius rounds the filled label',
    (await brand.evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius))) > 100,
  );
}
