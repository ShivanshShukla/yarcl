import { progressContrast } from './feedback.mjs';
import { resolveColor } from './command-palette.mjs';

/** @param {import('../../test-utils/suite.ts').SuiteContext} ctx */
export default async function ({ page, check }) {
  await page.evaluate(() => document.fonts.ready);
  check('web font from fontFaces loaded', await page.evaluate(() => document.fonts.check('500 44px Fraunces')));
  const h1 = page.getByRole('heading', { level: 1 });
  check('h1 uses the serif family', (await h1.evaluate((el) => getComputedStyle(el).fontFamily)).startsWith('Fraunces'));

  const team = page.getByRole('group', { name: 'Design team' });
  const groupAvatar = team.getByRole('img', { name: 'Ada Lovelace' });
  const groupAvatarStyle = await groupAvatar.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    radius: getComputedStyle(el).borderRadius,
    color: getComputedStyle(el).color,
  }));
  check(
    'avatar group uses Maison Talla component defaults',
    groupAvatarStyle.height === 36 && groupAvatarStyle.radius === '0px' && groupAvatarStyle.color === (await resolveColor(page, 'var(--yarcl-color-moss-text)')),
    JSON.stringify(groupAvatarStyle),
  );
  check('avatar group shows the omitted member count', (await team.getByRole('img', { name: '2 more' }).count()) === 1);
  const curator = page.getByRole('img', { name: 'Lena Ortiz' });
  const curatorStyle = await curator.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    radius: getComputedStyle(el).borderRadius,
    color: getComputedStyle(el).color,
  }));
  check(
    'avatar uses Maison Talla component defaults',
    curatorStyle.height === 36 && curatorStyle.radius === '2px' && curatorStyle.color === (await resolveColor(page, 'var(--yarcl-color-clay-text)')),
    JSON.stringify(curatorStyle),
  );

  const emptyState = page.getByTestId('brand-b-empty-state');
  const emptyStateStyle = await emptyState.evaluate((el) => {
    const style = getComputedStyle(el);
    const description = getComputedStyle(el.querySelector('.yarcl-empty-state-description'));
    const icon = getComputedStyle(el.querySelector('.yarcl-empty-state-icon'));
    return { gap: style.gap, padding: style.padding, fontSize: description.fontSize, iconColor: icon.color };
  });
  check(
    'empty state uses Maison Talla component defaults',
    emptyStateStyle.gap === '12px' &&
      emptyStateStyle.padding === '24px' &&
      emptyStateStyle.fontSize === '12px' &&
      emptyStateStyle.iconColor === (await resolveColor(page, 'var(--yarcl-color-clay)')),
    JSON.stringify(emptyStateStyle),
  );
  check('empty state keeps its heading in the page outline', (await emptyState.getByRole('heading', { name: 'No reviews yet' }).evaluate((el) => el.tagName)) === 'H2');

  const trail = page.getByRole('navigation', { name: 'Breadcrumb' });
  check('component default: breadcrumb uses fine text (12px)', (await trail.evaluate((el) => getComputedStyle(el).fontSize)) === '12px');
  check('breadcrumb collapses to first and last two', (await trail.locator('> ol > li').count()) === 4 && (await trail.getByRole('link', { name: 'Women' }).count()) === 0);
  check('breadcrumb marks the current page', (await trail.locator('[aria-current="page"]').textContent()) === 'Linen overshirt');

  const labelEl = page.locator('.yarcl-label').first();
  check('label renders a <label> element', (await labelEl.evaluate((el) => el.tagName)) === 'LABEL');
  const linen = page.getByText('Linen', { exact: true });
  check('label uses talla-s font (12px)', (await linen.evaluate((el) => getComputedStyle(el).fontSize)) === '12px');
  check('label uses hairline radius', (await linen.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)) === '2px');
  check('label wash variant fills the background', (await linen.evaluate((el) => getComputedStyle(el).backgroundColor)) !== 'rgba(0, 0, 0, 0)');
  const required = page.locator('.yarcl-label-required');
  check('label required marker hidden from screen readers', (await required.count()) === 1 && (await required.getAttribute('aria-hidden')) === 'true');

  const add = page.getByRole('button', { name: 'Add to bag' });
  const save = page.getByRole('button', { name: 'Save' });
  check('talla-l buttons share height', (await add.boundingBox()).height === (await save.boundingBox()).height);
  check('talla-l buttons use their component padding override', (await add.evaluate((el) => getComputedStyle(el).paddingLeft)) === '32px');
  check('component default: buttons square', (await add.evaluate((el) => getComputedStyle(el).borderRadius)) === '0px');
  const shade = page.getByRole('combobox', { name: 'Shade' });
  const quantity = page.getByRole('spinbutton', { name: 'Quantity' });
  check('component default: number input square', (await quantity.evaluate((el) => getComputedStyle(el).borderRadius)) === '0px');
  check('number input matches select height (talla-m)', (await quantity.boundingBox()).height === (await page.getByRole('combobox', { name: 'Shade' }).boundingBox()).height);
  await quantity.locator('xpath=..').getByRole('button', { name: 'Increase' }).click();
  check('number input steps within max', (await quantity.inputValue()) === '2');
  await quantity.focus();
  await page.keyboard.press('End');
  check('number input End jumps to max', (await quantity.inputValue()) === '5');
  check('global default: other controls hairline', (await shade.evaluate((el) => getComputedStyle(el).borderRadius)) === '2px');

  const occasions = page.locator('.yarcl-combobox-control', { has: page.getByRole('combobox', { name: 'Occasions' }) });
  const chip = await occasions.locator('.yarcl-badge').evaluate((el) => {
    const probe = document.createElement('span');
    probe.className = 'yarcl-badge yarcl-color-ink yarcl-variant-wash yarcl-size-talla-m';
    document.body.append(probe);
    const expected = getComputedStyle(probe);
    const s = getComputedStyle(el);
    const result = { bg: s.backgroundColor === expected.backgroundColor, fg: s.color === expected.color, fs: s.fontSize === expected.fontSize };
    probe.remove();
    return result;
  });
  check('multiple combobox: chips use the soft variant and control size', chip.bg && chip.fg && chip.fs, JSON.stringify(chip));
  check('multiple combobox: height matches talla-m controls', Math.abs((await occasions.boundingBox()).height - (await shade.boundingBox()).height) < 0.5);
  check('multiple combobox: global radius hairline', (await occasions.evaluate((el) => getComputedStyle(el).borderRadius)) === '2px');

  const sleeve = page.getByRole('slider', { name: 'SLEEVE LENGTH Minimum' });
  check('slider: labelled by aria-labelledby plus thumb name', (await sleeve.count()) === 1);
  await sleeve.focus();
  await page.keyboard.press('ArrowRight');
  check('slider: step and formatValue', (await sleeve.getAttribute('aria-valuetext')) === '60 cm');
  check('slider: global default radius hairline', (await sleeve.evaluate((el) => getComputedStyle(el).borderRadius)) === '2px');
  const [fill, ink] = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.color = 'var(--yarcl-color-ink)';
    document.body.append(probe);
    const ink = getComputedStyle(probe).color;
    probe.remove();
    return [getComputedStyle(document.querySelector('.yarcl-slider-range')).backgroundColor, ink];
  });
  check('slider: default color ink', fill === ink, `${fill} vs ${ink}`);
  const fitThumb = page.getByRole('slider', { name: 'Fit range Minimum' });
  check('Slider.Range renders two thumbs', (await fitThumb.count()) === 1 && (await page.getByRole('slider', { name: 'Fit range Maximum' }).count()) === 1);
  check('Slider.Range uses its color', (await fitThumb.evaluate((el) => getComputedStyle(el).getPropertyValue('--yarcl-c'))) === 'light-dark(#a4441f, #f0a07a)');
  const delivery = page.getByRole('button', { name: 'Delivery date', includeHidden: true });
  check('date picker matches Select height', (await delivery.boundingBox()).height === (await shade.boundingBox()).height);
  check('component default: date picker square', (await delivery.evaluate((el) => getComputedStyle(el).borderRadius)) === '0px');
  const bgOf = (el) => getComputedStyle(el).backgroundColor;
  const addFill = await add.evaluate(bgOf);
  await delivery.click();
  const picked = page.getByRole('gridcell', { name: 'Monday, October 5th, 2026' });
  check("picked day uses the consumer's default variant and color", (await picked.evaluate(bgOf)) === addFill);
  check('month before min disabled', (await page.getByRole('button', { name: 'Previous month' }).getAttribute('aria-disabled')) === 'true');
  await page.keyboard.press('Escape');

  await add.click();
  check('size required before adding', await page.getByRole('alert').filter({ hasText: 'Choose a size first.' }).isVisible());
  const sizes = page.getByRole('group', { name: 'SIZE' });
  const sizeLabel = page.locator('label#size-label');
  const labelLook = await sizeLabel.evaluate((el) => {
    const s = getComputedStyle(el);
    const probe = document.createElement('span');
    probe.style.color = 'var(--yarcl-color-clay-text)';
    document.body.append(probe);
    const clay = getComputedStyle(probe).color;
    probe.remove();
    return { size: s.fontSize, spacing: s.letterSpacing, match: s.color === clay };
  });
  check('Label uses labelStyle (11px, 0.12em)', labelLook.size === '11px' && labelLook.spacing === '1.32px', JSON.stringify(labelLook));
  check('component default: Label color clay', labelLook.match);
  await sizes.getByRole('button', { name: 'M', exact: true }).click();
  check('size error clears', (await page.getByRole('alert').filter({ hasText: 'Choose a size first.' }).count()) === 0);
  await add.click();
  check('toast confirms', await page.getByRole('status').filter({ hasText: 'Added to bag' }).isVisible());
  const noticeStyles = await page.locator('.yarcl-alert').first().evaluate((el) => {
    const style = getComputedStyle(el);
    return { radius: style.borderRadius, gap: style.gap, padding: style.padding, fontSize: style.fontSize };
  });
  check(
    'alert uses Maison Talla component tokens',
    noticeStyles.radius === '2px' && noticeStyles.gap === '12px' && noticeStyles.padding === '14px 16px' && noticeStyles.fontSize === '15px',
    JSON.stringify(noticeStyles),
  );
  const toastStyles = await page.getByRole('status').filter({ hasText: 'Added to bag' }).evaluate((el) => {
    const style = getComputedStyle(el);
    return { radius: style.borderRadius, gap: style.gap, padding: style.padding, fontSize: style.fontSize };
  });
  check(
    'toast uses Maison Talla component tokens',
    toastStyles.radius === '2px' && toastStyles.gap === '12px' && toastStyles.padding === '12px 8px 12px 16px' && toastStyles.fontSize === '15px',
    JSON.stringify(toastStyles),
  );

  const shipping = page.getByRole('progressbar', { name: '€ 15 away from free express shipping' });
  const progress = await shipping.evaluate((el) => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--yarcl-color-moss)';
    el.append(probe);
    const moss = getComputedStyle(probe).color;
    probe.remove();
    const track = el.querySelector('.yarcl-progress-track');
    const bar = el.querySelector('.yarcl-progress-bar');
    return {
      moss,
      bar: getComputedStyle(bar).backgroundColor,
      radius: getComputedStyle(track).borderRadius,
      height: track.getBoundingClientRect().height,
      ratio: bar.getBoundingClientRect().width / track.getBoundingClientRect().width,
    };
  });
  check('component default: progress bar is moss', progress.bar === progress.moss, `${progress.bar} vs ${progress.moss}`);
  check('progress uses global radius (hairline)', progress.radius === '2px', progress.radius);
  check('progress track from talla-m icon size', Math.abs(progress.height - 8) < 0.5, String(progress.height));
  check('progress bar at 185 of 200', Math.abs(progress.ratio - 0.925) < 0.01, String(progress.ratio));
  await progressContrast({ check }, page.locator('body'));
  const fit = page.getByRole('button', { name: 'Fit' });
  const accordion = page.locator('.yarcl-accordion');
  check('accordion: component default size (talla-s = 2.25rem)', (await fit.boundingBox()).height === 36, String((await fit.boundingBox()).height));
  check('accordion: component default radius square', (await accordion.evaluate((el) => getComputedStyle(el).borderRadius)) === '0px');
  check(
    "accordion: open indicator in the consumer's color",
    (await fit.locator('svg').evaluate((el) => getComputedStyle(el).color)) === (await resolveColor(page, 'var(--yarcl-color-moss)')),
  );
  await page.getByRole('button', { name: 'Materials' }).click();
  check('accordion: multiple items open', (await accordion.getByRole('region').count()) === 2);

  await page.getByRole('button', { name: 'Size guide' }).click();
  const guide = page.getByRole('dialog', { name: 'Size guide' });
  check('size guide dialog with table', await guide.getByRole('table', { name: 'Chest and length' }).isVisible());
  check("dialog uses the consumer's modal size (regular = 34rem)", Math.abs((await guide.boundingBox()).width - 34 * 16) < 2, String((await guide.boundingBox()).width));
  await page.keyboard.press('Escape');

  const reviews = page.getByRole('navigation', { name: 'Reviews' });
  const reviewPage = reviews.getByRole('button', { name: 'Page 4' });
  const reviewCurrent = reviews.getByRole('button', { name: 'Page 5' });
  const style = (locator) => locator.evaluate((el) => ({ h: el.getBoundingClientRect().height, r: getComputedStyle(el).borderRadius, bg: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopColor }));
  const [other, active] = [await style(reviewPage), await style(reviewCurrent)];
  check('pagination: component default size (talla-s = 36px)', other.h === 36, String(other.h));
  check('pagination: component default radius square', other.r === '0px' && active.r === '0px', `${other.r} / ${active.r}`);
  check('pagination: component default variants (text, line)', other.bg === 'rgba(0, 0, 0, 0)' && other.border === 'rgba(0, 0, 0, 0)' && active.border !== 'rgba(0, 0, 0, 0)', JSON.stringify({ other, active }));
  check('pagination: current page marked', (await reviewCurrent.getAttribute('aria-current')) === 'page');
  await page.keyboard.press('Control+k');
  const palette = page.getByRole('dialog', { name: 'Command palette' });
  check('command palette opens with the shortcut', await palette.isVisible());
  const look = await palette.evaluate((el) => ({
    radius: getComputedStyle(el).borderTopLeftRadius,
    width: el.getBoundingClientRect().width,
    fontSize: getComputedStyle(el.querySelector('input')).fontSize,
    activeBg: getComputedStyle(el.querySelector('.yarcl-option[data-active]')).backgroundColor,
  }));
  check('component default: palette square', look.radius === '0px', look.radius);
  check('component default: palette uses clay', look.activeBg === (await resolveColor(page, 'var(--yarcl-color-clay)')), look.activeBg);
  check("palette uses the consumer's size scale (talla-m = 13px)", look.fontSize === '13px', look.fontSize);
  check("palette uses the consumer's modal size (regular = 34rem)", Math.abs(look.width - 34 * 16) < 2, String(look.width));
  await palette.getByRole('combobox').fill('wish');
  await page.keyboard.press('Enter');
  check('palette command runs', await page.getByRole('status').filter({ hasText: 'Saved to wishlist' }).last().isVisible());

  const referenceLink = page.getByRole('link', { name: 'Design reference' });
  check('design reference link points to the reference page', (await referenceLink.getAttribute('href')) === '?page=reference');
  await page.goto('?page=reference');
  check('reference page renders from config', await page.getByRole('heading', { name: 'Maison Talla design system' }).isVisible());
  check('reference lists consumer sizes', await page.getByRole('rowheader', { name: 'talla-l' }).isVisible());
}
