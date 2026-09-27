import { build } from 'esbuild';

await build({
  absWorkingDir: import.meta.dirname,
  entryPoints: ['./src/main.js'],
  outdir: './dist',
  bundle: true,
  plugins: [],
});
