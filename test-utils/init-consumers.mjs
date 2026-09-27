import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { platform, tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixtureRoot = join(root, 'e2e/init-consumers');
const temporary = await mkdtemp(join(tmpdir(), 'yarcl-init-consumers-'));
const packs = join(temporary, 'packs');
const consumers = join(temporary, 'consumers');
const pnpm = platform() === 'win32' ? 'pnpm.cmd' : 'pnpm';
const bundlers = ['vite', 'webpack', 'rspack', 'rollup', 'esbuild'];

function run(args, cwd = root) {
  execFileSync(pnpm, args, { cwd, stdio: 'inherit' });
}

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? files(path) : [path];
    }),
  );
  return nested.flat();
}

const config = `import { defineConfig } from '@yarcl/react/define';
import defaults from '@yarcl/react/defaults';

export default defineConfig({
  ...defaults,
  colors: {
    ...defaults.colors,
    brand: { light: '#175cd3', dark: '#84adff' },
  },
  defaults: { ...defaults.defaults, color: 'brand' },
});
`;

try {
  await mkdir(packs);
  await cp(fixtureRoot, consumers, { recursive: true });
  run(['-C', 'library', 'pack', '--pack-destination', packs]);

  const archiveName = (await readdir(packs)).find((file) => file.endsWith('.tgz'));
  if (!archiveName) throw new Error('pnpm pack did not create a tarball');
  const archive = join(packs, archiveName);
  const archiveUrl = pathToFileURL(archive).href;

  for (const bundler of bundlers) {
    const consumer = join(consumers, bundler);
    const manifestPath = join(consumer, 'package.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (manifest.dependencies?.['@yarcl/react'] || manifest.devDependencies?.['@yarcl/react']) {
      throw new Error(`${bundler} fixture must start without @yarcl/react`);
    }
    manifest.pnpm = { overrides: { '@yarcl/react': archiveUrl } };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    run(['install', '--ignore-workspace'], consumer);
    run(['dlx', archiveUrl, 'init', '--bundler', bundler, '--root', '.'], consumer);

    const initializedManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    if (!initializedManifest.dependencies?.['@yarcl/react']) {
      throw new Error(`${bundler} init did not add @yarcl/react`);
    }

    const tsconfig = JSON.parse(await readFile(join(consumer, 'tsconfig.json'), 'utf8'));
    if (tsconfig.compilerOptions.paths['@yarcl/config'][0] !== './src/yarcl.config.ts') {
      throw new Error(`${bundler} init did not configure TypeScript`);
    }

    const buildConfig = (await files(consumer)).find((file) => file.includes(`${bundler}.config.`));
    if (!buildConfig) throw new Error(`${bundler} config was not found`);
    const buildSource = await readFile(buildConfig, 'utf8');
    if (!buildSource.includes(`@yarcl/react/${bundler}`) || !buildSource.includes('yarcl({')) {
      throw new Error(`${bundler} init did not configure its build plugin`);
    }

    await writeFile(join(consumer, 'src/yarcl.config.ts'), config);
    run(['build'], consumer);

    const outputs = await files(join(consumer, 'dist'));
    const css = await Promise.all(outputs.filter((file) => extname(file) === '.css').map((file) => readFile(file, 'utf8')));
    const javascript = await Promise.all(
      outputs.filter((file) => ['.js', '.mjs', '.cjs'].includes(extname(file))).map((file) => readFile(file, 'utf8')),
    );
    if (!css.some((source) => source.includes('--yarcl-color-brand') && source.includes('.yarcl-button'))) {
      throw new Error(`${bundler} build did not emit generated and component styles`);
    }
    if (!css.some((source) => source.includes('.yarcl-ref-'))) {
      throw new Error(`${bundler} build did not emit DemoYarcl reference styles`);
    }
    if (!javascript.some((source) => source.includes('data-yarcl-components'))) {
      throw new Error(`${bundler} build did not include DemoYarcl`);
    }
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
