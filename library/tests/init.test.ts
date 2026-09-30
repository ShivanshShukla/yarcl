import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'jsonc-parser';
import { afterEach, describe, expect, it } from 'vitest';
import { initProject, type BuildTool } from '../src/init.ts';
import { assertConfigMapping } from '../src/setup.ts';

const directories: string[] = [];

async function project(buildConfig: string, tsconfig: string, file = 'vite.config.ts'): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'yarcl-init-'));
  directories.push(root);
  await Promise.all([
    writeFile(join(root, 'package.json'), '{"name":"fixture","private":true,"dependencies":{"react":"^19.0.0"}}\n'),
    writeFile(join(root, file), buildConfig),
    writeFile(join(root, 'tsconfig.app.json'), tsconfig),
  ]);
  return root;
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('yarcl init', () => {
  it('configures a fresh Vite React project and is idempotent', async () => {
    const root = await project(
      "import react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [react()],\n});\n",
      '{\n  // application compiler options\n  "compilerOptions": {\n    "strict": true\n  }\n}\n',
    );

    await initProject({ root, install: false, version: '0.1.0' });

    const viteConfig = await readFile(join(root, 'vite.config.ts'), 'utf8');
    const tsconfigSource = await readFile(join(root, 'tsconfig.app.json'), 'utf8');
    const tsconfig = parse(tsconfigSource);
    const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    expect(viteConfig).toContain("import yarcl from '@yarcl/react/vite';");
    expect(viteConfig).toContain("plugins: [react(), yarcl({ config: 'src/yarcl.config.ts' })]");
    expect(tsconfigSource).toContain('// application compiler options');
    expect(tsconfig.compilerOptions.paths['@yarcl/config']).toEqual([
      './src/yarcl.config.ts',
      './node_modules/@yarcl/react/dist/yarcl.config.d.ts',
    ]);
    expect(manifest.dependencies['@yarcl/react']).toBe('^0.1.0');
    expect(await readFile(join(root, 'src/yarcl.config.ts'), 'utf8')).toContain('defineConfig');
    expect(() => assertConfigMapping(root, 'src/yarcl.config.ts')).not.toThrow();

    const snapshot = await Promise.all([
      readFile(join(root, 'vite.config.ts'), 'utf8'),
      readFile(join(root, 'tsconfig.app.json'), 'utf8'),
      readFile(join(root, 'src/yarcl.config.ts'), 'utf8'),
      readFile(join(root, 'package.json'), 'utf8'),
    ]);
    await initProject({ root, install: false, version: '0.1.0' });
    expect(
      await Promise.all([
        readFile(join(root, 'vite.config.ts'), 'utf8'),
        readFile(join(root, 'tsconfig.app.json'), 'utf8'),
        readFile(join(root, 'src/yarcl.config.ts'), 'utf8'),
        readFile(join(root, 'package.json'), 'utf8'),
      ]),
    ).toEqual(snapshot);
  });

  it('uses an existing custom plugin path to repair TypeScript', async () => {
    const root = await project(
      "import { defineConfig } from 'vite';\nimport { yarcl } from '@yarcl/react/plugin';\n\nexport default defineConfig({ plugins: [yarcl({ config: 'src/theme.ts' })] });\n",
      '{"compilerOptions":{"paths":{"@yarcl/config":["./src/wrong.ts"]}}}\n',
    );

    await initProject({ root, install: false, version: '0.1.0' });

    expect(await readFile(join(root, 'vite.config.ts'), 'utf8')).toContain("import yarcl from '@yarcl/react/vite';");
    const tsconfig = parse(await readFile(join(root, 'tsconfig.app.json'), 'utf8'));
    expect(tsconfig.compilerOptions.paths['@yarcl/config'][0]).toBe('./src/theme.ts');
    expect(await readFile(join(root, 'src/theme.ts'), 'utf8')).toContain('defineConfig');
  });

  it('reports a clear mismatch between Vite and TypeScript', async () => {
    const root = await project(
      "import { defineConfig } from 'vite';\nexport default defineConfig({ plugins: [] });\n",
      '{"compilerOptions":{"paths":{"@yarcl/config":["./src/other.ts"]}}}\n',
    );

    expect(() => assertConfigMapping(root, 'src/yarcl.config.ts')).toThrow(
      'yarcl: Config path mismatch. build tool uses "src/yarcl.config.ts", but ./tsconfig.app.json has "./src/other.ts"',
    );
  });

  it.each([
    ['webpack', 'webpack.config.cjs', "module.exports = { plugins: [] };\n", "const yarcl = require('@yarcl/react/webpack');"],
    ['rspack', 'rspack.config.ts', 'export default { plugins: [] };\n', "import yarcl from '@yarcl/react/rspack';"],
    ['rollup', 'rollup.config.mjs', 'export default { plugins: [] };\n', "import yarcl from '@yarcl/react/rollup';"],
    [
      'esbuild',
      'esbuild.config.js',
      "import { build } from 'esbuild';\nbuild({ plugins: [] });\n",
      "import yarcl from '@yarcl/react/esbuild';",
    ],
  ] satisfies [BuildTool, string, string, string][])('configures %s projects', async (tool, file, source, expectedImport) => {
    const root = await project(source, '{"compilerOptions":{}}\n', file);

    const result = await initProject({ root, install: false, version: '0.1.0' });

    const updated = await readFile(join(root, file), 'utf8');
    expect(result.buildTool).toBe(tool);
    expect(updated).toContain(expectedImport);
    expect(updated).toContain("yarcl({ config: 'src/yarcl.config.ts' })");
  });

  it('uses --bundler to select a build config when several exist', async () => {
    const root = await project('export default { plugins: [] };\n', '{"compilerOptions":{}}\n');
    await writeFile(join(root, 'webpack.config.mjs'), 'export default { plugins: [] };\n');

    const result = await initProject({ root, buildTool: 'webpack', install: false, version: '0.1.0' });

    expect(result.buildTool).toBe('webpack');
    expect(await readFile(join(root, 'webpack.config.mjs'), 'utf8')).toContain('@yarcl/react/webpack');
    expect(await readFile(join(root, 'vite.config.ts'), 'utf8')).not.toContain('yarcl');
  });
});
