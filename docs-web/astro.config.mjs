// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import yarcl from '@yarcl/react/vite';

const componentSections = [
  ['Buttons', 'buttons'],
  ['Forms', 'forms'],
  ['Typography', 'typography'],
  ['Layout', 'layout'],
  ['Overlays', 'overlays'],
  ['Data display', 'data'],
  ['Feedback', 'feedback'],
];

export default defineConfig({
  site: 'https://yarcl.dev',
  integrations: [
    starlight({
      title: 'yarcl',
      description: 'A React component library where your config file is the design system.',
      logo: { src: './src/assets/yarcl.svg' },
      favicon: '/yarcl.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/eugenioenko/yarcl' }],
      expressiveCode: { styleOverrides: { codeFontSize: '1rem' } },
      customCss: ['@fontsource-variable/inter', '@fontsource/ubuntu-mono/400.css', '@fontsource/ubuntu-mono/700.css', './src/styles/custom.css'],
      sidebar: [
        { label: 'Getting Started', items: [{ autogenerate: { directory: 'getting-started' } }] },
        { label: 'Configuration', items: [{ autogenerate: { directory: 'configuration' } }] },
        { label: 'Theming', items: [{ autogenerate: { directory: 'theming' } }] },
        {
          label: 'Components',
          items: [
            { label: 'Overview', link: '/components/' },
            ...componentSections.flatMap(([label, directory]) => [
              { label, link: `/components/#${label.toLowerCase().replace(/ /g, '-')}`, attrs: { class: 'sidebar-divider' } },
              { autogenerate: { directory: `components/${directory}` } },
            ]),
          ],
        },
        {
          label: 'Reference',
          items: [
            { autogenerate: { directory: 'reference' } },
            { label: 'llms.txt', link: '/llms.txt', attrs: { target: '_blank' } },
          ],
        },
      ],
    }),
    react(),
  ],
  vite: {
    plugins: [yarcl({ config: 'src/yarcl.config.ts' })],
  },
});
