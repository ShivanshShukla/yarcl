import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoYarcl } from '@yarcl/react/reference';

createRoot(globalThis.document.getElementById('root')).render(createElement(DemoYarcl, { title: 'Vite yarcl demo' }));
