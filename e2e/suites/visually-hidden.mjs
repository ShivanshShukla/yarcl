/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check }) {
  const button = page.getByRole('button', { name: 'Search projects' });
  const hidden = button.locator('.yarcl-visually-hidden');
  const style = await hidden.evaluate((element) => {
    const computed = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    return {
      position: computed.position,
      overflow: computed.overflow,
      whiteSpace: computed.whiteSpace,
      width: bounds.width,
      height: bounds.height,
    };
  });

  check('hidden text provides the button name', (await button.count()) === 1);
  check(
    'hidden text is removed from the visual layout',
    style.position === 'absolute' && style.overflow === 'hidden' && style.whiteSpace === 'nowrap' && style.width <= 1 && style.height <= 1,
    JSON.stringify(style),
  );
}
