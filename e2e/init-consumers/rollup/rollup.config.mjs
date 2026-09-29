import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/main.js',
  output: { dir: './dist', format: 'esm' },
  external: (id) => id === 'react' || id.startsWith('react/') || id === 'react-dom' || id.startsWith('react-dom/'),
  plugins: [nodeResolve()],
};
