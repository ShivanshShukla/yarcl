import { afterEach, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Grid } from '@yarcl/react';
import { applyTheme, resetTheme } from '@yarcl/react/css';
import { bloom, editorial } from '@yarcl/react/themes';

afterEach(resetTheme);

it('preserves list semantics, refs, and consumer styles', async () => {
  const ref = { current: null as HTMLDivElement | null };
  await render(<Grid as="ul" ref={ref} columns={2} style={{ width: '200px' }} className="custom-grid"><li>First</li><li>Second</li></Grid>);
  expect(ref.current?.tagName).toBe('UL');
  expect(ref.current?.classList.contains('custom-grid')).toBe(true);
  expect(ref.current?.querySelectorAll('li')).toHaveLength(2);
  expect(getComputedStyle(ref.current!).width).toBe('200px');
});

it('normalizes numeric columns and gives auto-fit precedence', async () => {
  for (const [columns, count] of [[0, 1], [-2, 1], [NaN, 1], [Infinity, 1], [2.9, 2]]) {
    const ref = { current: null as HTMLDivElement | null };
    const screen = await render(<Grid ref={ref} columns={columns}><span>First</span><span>Second</span></Grid>);
    expect(ref.current!.style.getPropertyValue('--yarcl-grid-columns')).toBe(`repeat(${count}, minmax(0, 1fr))`);
    await screen.unmount();
  }
  const ref = { current: null as HTMLDivElement | null };
  await render(<Grid ref={ref} columns={3} minItemWidth="12rem" style={{ width: '100px' }}><span>First</span><span>Second</span></Grid>);
  expect(getComputedStyle(ref.current!).gridTemplateColumns).toBe('100px');
});

it('updates component and global gap defaults when themes change', async () => {
  const ref = { current: null as HTMLDivElement | null };
  await render(<Grid ref={ref}><span>First</span><span>Second</span></Grid>);
  for (const theme of [bloom, editorial]) {
    applyTheme({ ...theme, components: { ...theme.components, Grid: { gap: 'xs' } } });
    await expect.poll(() => ref.current?.classList.contains('yarcl-gap-xs')).toBe(true);
    expect(getComputedStyle(ref.current!).gap).toBe('6px');
    applyTheme(theme);
    await expect.poll(() => ref.current?.classList.contains(`yarcl-gap-${theme.defaults.gap}`)).toBe(true);
    expect(getComputedStyle(ref.current!).gap).toBe('20px');
  }
});
