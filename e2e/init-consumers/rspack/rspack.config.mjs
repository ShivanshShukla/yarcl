import { fileURLToPath, URL } from 'node:url';

export default {
  mode: 'production',
  entry: './src/main.js',
  output: { path: fileURLToPath(new URL('./dist', import.meta.url)), clean: true },
  experiments: { css: true },
  module: { rules: [{ test: /\.css$/i, type: 'css' }] },
  plugins: [],
};
