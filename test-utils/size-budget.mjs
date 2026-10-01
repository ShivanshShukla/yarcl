import { Buffer } from 'node:buffer';
import { log } from 'node:console';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'library/dist');
const entries = {
  '@yarcl/react': 'index.js',
  '@yarcl/react/define': 'define.js',
  '@yarcl/react/defaults': 'yarcl.config.js',
  '@yarcl/react/vite': 'vite.js',
  '@yarcl/react/webpack': 'webpack.js',
  '@yarcl/react/rspack': 'rspack.js',
  '@yarcl/react/rollup': 'rollup.js',
  '@yarcl/react/esbuild': 'esbuild.js',
  '@yarcl/react/reference': 'reference/index.js',
  '@yarcl/react/demo': 'demo.js',
  '@yarcl/react/themes': 'themes/index.js',
  '@yarcl/react/css': 'apply.js',
  '@yarcl/react/generate': 'css.js',
  'yarcl CLI': 'cli.js',
};
const budgets = {
  '@yarcl/react': { js: 23 * 1024, css: 7 * 1024 },
  '@yarcl/react/define': { js: 0.2 * 1024, css: 0 },
  '@yarcl/react/defaults': { js: 1.5 * 1024, css: 0 },
  '@yarcl/react/vite': { js: 6 * 1024, css: 0 },
  '@yarcl/react/webpack': { js: 6 * 1024, css: 0 },
  '@yarcl/react/rspack': { js: 6 * 1024, css: 0 },
  '@yarcl/react/rollup': { js: 6 * 1024, css: 0 },
  '@yarcl/react/esbuild': { js: 6 * 1024, css: 0 },
  '@yarcl/react/reference': { js: 5 * 1024, css: 0.6 * 1024 },
  '@yarcl/react/demo': { js: 28 * 1024, css: 7 * 1024 },
  '@yarcl/react/themes': { js: 3.5 * 1024, css: 0 },
  '@yarcl/react/css': { js: 3 * 1024, css: 0 },
  '@yarcl/react/generate': { js: 4 * 1024, css: 0 },
  'yarcl CLI': { js: 3.25 * 1024, css: 0 },
  Button: { js: 2.1 * 1024, css: 8.5 * 1024 },
  'Button + Input': { js: 2.25 * 1024, css: 8.5 * 1024 },
};
const externalPackages = [
  '@floating-ui/react',
  '@yarcl/config',
  'date-fns',
  'jsonc-parser',
  'react',
  'react-dom',
  '@yarcl/react/styles.css',
  'jiti',
  'unplugin',
];

function isEntryExternal(id) {
  return (
    id.startsWith('node:') ||
    externalPackages.some((dependency) => id === dependency || id.startsWith(`${dependency}/`))
  );
}

function isConsumerExternal(id) {
  return id === 'react' || id.startsWith('react/') || id === 'react-dom' || id.startsWith('react-dom/');
}

function outputOf(result) {
  const builds = Array.isArray(result) ? result : [result];
  return builds.flatMap((item) => item.output);
}

function measure(output) {
  const sizes = { js: 0, css: 0, jsRaw: 0, cssRaw: 0 };
  const modules = new Set();
  const code = [];

  for (const item of output) {
    if (item.type === 'chunk') {
      const bytes = Buffer.byteLength(item.code);
      sizes.jsRaw += bytes;
      sizes.js += gzipSync(item.code).byteLength;
      code.push(item.code);
      Object.keys(item.modules).forEach((module) => modules.add(module));
      continue;
    }
    if (!item.fileName.endsWith('.css')) continue;
    const source = typeof item.source === 'string' ? item.source : Buffer.from(item.source);
    const bytes = typeof source === 'string' ? Buffer.byteLength(source) : source.byteLength;
    sizes.cssRaw += bytes;
    sizes.css += gzipSync(source).byteLength;
  }

  return { ...sizes, modules, code: code.join('\n') };
}

async function measureEntry(file) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      target: 'es2022',
      minify: 'esbuild',
      write: false,
      lib: { entry: join(dist, file), formats: ['es'] },
      rollupOptions: { external: isEntryExternal },
    },
  });
  return measure(outputOf(result));
}

async function measureConsumer(temporary, name, imports) {
  const input = join(temporary, `${name.toLowerCase().replaceAll(/[^a-z]+/g, '-')}.js`);
  await writeFile(
    input,
    `import { ${imports.join(', ')} } from '@yarcl/react';\nglobalThis.__yarclSize = [${imports.join(', ')}];\n`,
  );
  const { default: yarcl } = await import(pathToFileURL(join(dist, 'vite.js')).href);
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: temporary,
    plugins: [yarcl()],
    build: {
      target: 'es2022',
      minify: 'esbuild',
      write: false,
      rollupOptions: { input, external: isConsumerExternal },
    },
  });
  return measure(outputOf(result));
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

function print(results) {
  log('Bundle sizes');
  log('Entry'.padEnd(27), 'JS gzip'.padStart(10), 'CSS gzip'.padStart(10), 'JS raw'.padStart(10), 'CSS raw'.padStart(10));
  for (const [name, size] of results) {
    log(
      name.padEnd(27),
      format(size.js).padStart(10),
      format(size.css).padStart(10),
      format(size.jsRaw).padStart(10),
      format(size.cssRaw).padStart(10),
    );
  }
}

function check(results) {
  const failures = [];
  for (const [name, size] of results) {
    const budget = budgets[name];
    if (size.js > budget.js) failures.push(`${name} JS is ${format(size.js)}, budget ${format(budget.js)}`);
    if (size.css > budget.css) failures.push(`${name} CSS is ${format(size.css)}, budget ${format(budget.css)}`);
  }
  if (failures.length > 0) throw new Error(`Bundle size budget exceeded:\n${failures.join('\n')}`);
}

const temporary = await mkdtemp(join(root, '.yarcl-size-'));

try {
  await writeFile(
    join(temporary, 'tsconfig.json'),
    `${JSON.stringify({ compilerOptions: { paths: { '@yarcl/config': ['./src/yarcl.config.ts'] } } }, null, 2)}\n`,
  );
  const results = [];
  for (const [name, file] of Object.entries(entries)) results.push([name, await measureEntry(file)]);
  const button = await measureConsumer(temporary, 'Button', ['Button']);
  const floatingModules = [...button.modules].filter((module) => module.includes('@floating-ui'));
  if (floatingModules.length > 0 || button.code.includes('@floating-ui')) {
    throw new Error(`Button pulled in Floating UI:\n${floatingModules.join('\n')}`);
  }
  results.push(['Button', button]);
  results.push(['Button + Input', await measureConsumer(temporary, 'Button + Input', ['Button', 'Input'])]);
  print(results);
  log('\nTree shaking: Button excludes Floating UI');
  check(results);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
