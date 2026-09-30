import { config } from '@yarcl/react';

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check }) {
  const equal = page.getByTestId('grid-equal');
  const geometry = await equal.evaluate((element) => {
    const style = getComputedStyle(element);
    const children = [...element.children].map((child) => child.getBoundingClientRect());
    return {
      display: style.display,
      gap: style.gap,
      widths: children.map((child) => child.width),
      tops: children.map((child) => child.top),
      role: element.getAttribute('role'),
    };
  });
  const expectedGap = await page.evaluate((value) => {
    const probe = document.createElement('div');
    probe.style.width = value;
    document.body.append(probe);
    const width = getComputedStyle(probe).width;
    probe.remove();
    return width;
  }, config.spacing[config.components.Grid.gap]);
  check('grid uses the branded component gap', geometry.gap === expectedGap, geometry.gap);
  check('grid makes equal columns and a second row', geometry.display === 'grid'
    && Math.abs(geometry.widths[0] - geometry.widths[2]) < 1
    && geometry.tops[0] === geometry.tops[2] && geometry.tops[3] > geometry.tops[0]);
  check('layout does not impose an interactive grid role', geometry.role === null);

  const sidebar = await page.getByTestId('grid-sidebar').evaluate((element) => {
    const tracks = getComputedStyle(element).gridTemplateColumns.split(' ').map(parseFloat);
    return { tracks, unit: parseFloat(getComputedStyle(document.documentElement).fontSize) };
  });
  check('explicit tracks preserve the fixed sidebar width', Math.abs(sidebar.tracks[0] - 6 * sidebar.unit) < 1);

  const auto = page.getByTestId('grid-auto');
  const originalStyle = await auto.getAttribute('style');
  try {
    const result = await auto.evaluate((element) => {
      const count = () => getComputedStyle(element).gridTemplateColumns.split(' ').length;
      element.style.width = '660px';
      const wide = count();
      element.style.width = '240px';
      const narrow = count();
      element.style.width = '100px';
      const child = element.firstElementChild.getBoundingClientRect().width;
      return { wide, narrow, child };
    });
    check('auto-fit responds to available container width', result.wide === 3 && result.narrow === 1, JSON.stringify(result));
    check('minimum item width shrinks on small screens', result.child <= 100);
  } finally {
    await auto.evaluate((element, value) => element.setAttribute('style', value ?? ''), originalStyle);
  }
}
