import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoYarcl } from '@yarcl/react/demo';

const root = globalThis.document.createElement('div');
globalThis.document.body.append(root);
createRoot(root).render(createElement(DemoYarcl, { title: 'esbuild yarcl demo' }));
