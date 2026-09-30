import { nodeResolve } from '@rollup/plugin-node-resolve';
import yarcl from '@yarcl/react/rollup';

export default {
  input: './src/index.js',
  output: { dir: './dist/rollup', format: 'esm' },
  external: (id) => id === 'react' || id.startsWith('react/') || id === 'react-dom' || id.startsWith('react-dom/'),
  plugins: [nodeResolve(), yarcl()],
};
