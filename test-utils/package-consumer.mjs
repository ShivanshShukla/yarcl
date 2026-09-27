import { execFileSync } from 'node:child_process';
import { access, cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { platform, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixture = join(root, 'e2e/package-consumer');
const temporary = await mkdtemp(join(tmpdir(), 'yarcl-package-'));
const packs = join(temporary, 'packs');
const consumer = join(temporary, 'consumer');
const pnpm = platform() === 'win32' ? 'pnpm.cmd' : 'pnpm';

function run(args, cwd = root) {
  execFileSync(pnpm, args, { cwd, stdio: 'inherit' });
}

try {
  await mkdir(packs);
  run(['-C', 'library', 'pack', '--pack-destination', packs]);

  const archive = (await readdir(packs)).find((file) => file.endsWith('.tgz'));
  if (!archive) throw new Error('pnpm pack did not create a tarball');

  await cp(fixture, consumer, { recursive: true });
  const manifestPath = join(consumer, 'package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.dependencies['@yarcl/react'] = pathToFileURL(join(packs, archive)).href;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  run(['install', '--ignore-workspace'], consumer);

  const installed = join(consumer, 'node_modules/@yarcl/react');
  await Promise.all([
    access(join(installed, 'dist/index.js')),
    access(join(installed, 'dist/index.d.ts')),
    access(join(installed, 'dist/cli.js')),
    access(join(installed, 'dist/vite.js')),
    access(join(installed, 'dist/webpack.cjs')),
    access(join(installed, 'dist/styles.css')),
    access(join(installed, 'dist/yarcl.config.js')),
    access(join(installed, 'dist/yarcl.config.d.ts')),
  ]);

  const installedReal = await realpath(installed);
  const { default: yarcl } = await import(pathToFileURL(join(installedReal, 'dist/vite.js')).href);
  const fallbackConsumer = join(temporary, 'fallback');
  await mkdir(fallbackConsumer);
  await writeFile(
    join(fallbackConsumer, 'tsconfig.json'),
    '{"compilerOptions":{"paths":{"@yarcl/config":["./src/missing.config.ts"]}}}\n',
  );
  const plugin = yarcl({ config: 'src/missing.config.ts' });
  if (typeof plugin.config !== 'function') throw new Error('The packed plugin has no config hook');
  plugin.config({ root: fallbackConsumer });
  await plugin.buildStart.call({ addWatchFile() {}, emitFile() {}, getWatchFiles() { return []; }, parse() {} });
  const resolveId = typeof plugin.resolveId === 'function' ? plugin.resolveId : plugin.resolveId.handler;
  const fallback = await resolveId.call({}, '@yarcl/config', undefined, { isEntry: false });
  if (fallback !== join(installedReal, 'dist/yarcl.config.js')) {
    throw new Error('The packed plugin did not resolve its compiled default config');
  }

  const require = createRequire(import.meta.url);
  const webpackPlugin = require(join(installedReal, 'dist/webpack.cjs'));
  if (typeof webpackPlugin !== 'function') throw new Error('The CommonJS webpack adapter is not callable');

  const initialized = join(temporary, 'initialized');
  await mkdir(initialized);
  await Promise.all([
    writeFile(join(initialized, 'package.json'), '{"name":"yarcl-init-fixture","private":true}\n'),
    writeFile(
      join(initialized, 'vite.config.ts'),
      "import react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({ plugins: [react()] });\n",
    ),
    writeFile(join(initialized, 'tsconfig.app.json'), '{"compilerOptions":{"strict":true}}\n'),
  ]);
  const yarclBin = join(consumer, 'node_modules/.bin', platform() === 'win32' ? 'yarcl.cmd' : 'yarcl');
  execFileSync(yarclBin, ['init', '--root', initialized, '--skip-install'], {
    stdio: 'inherit',
  });
  const initializedVite = await readFile(join(initialized, 'vite.config.ts'), 'utf8');
  const initializedTsconfig = JSON.parse(await readFile(join(initialized, 'tsconfig.app.json'), 'utf8'));
  if (!initializedVite.includes("yarcl({ config: 'src/yarcl.config.ts' })")) {
    throw new Error('The packed CLI did not configure Vite');
  }
  if (initializedTsconfig.compilerOptions.paths['@yarcl/config'][0] !== './src/yarcl.config.ts') {
    throw new Error('The packed CLI did not configure TypeScript');
  }
  await access(join(initialized, 'src/yarcl.config.ts'));

  try {
    await access(join(installed, 'src'));
    throw new Error('The packed package contains TypeScript source');
  } catch (error) {
    if (error instanceof Error && !('code' in error && error.code === 'ENOENT')) throw error;
  }

  run(['build'], consumer);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
