import { build } from 'esbuild';
import yarcl from '@yarcl/react/esbuild';

await build({
  absWorkingDir: import.meta.dirname,
  entryPoints: ['./src/index.js'],
  outdir: './dist/esbuild',
  bundle: true,
  external: ['react', 'react-dom'],
  plugins: [yarcl()],
});
