import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, extname, resolve } from 'node:path';
import { createJiti } from 'jiti';
import { createUnplugin } from 'unplugin';
import { generateCss } from './css';
import type { YarclShape } from './define';
import { assertConfigMapping, DEFAULT_CONFIG_PATH } from './setup.ts';

/** Options shared by every yarcl build-tool plugin. */
export interface YarclPluginOptions {
  /**
   * Path to the consumer's config file, relative to the project root.
   * If the file does not exist, the library's default config is used.
   * @default 'src/yarcl.config.ts'
   */
  config?: string;
  /**
   * Project root used to resolve the config and TypeScript mapping.
   * Build-tool adapters normally detect it automatically.
   * @default process.cwd()
   */
  root?: string;
}

const VIRTUAL_CSS = '@yarcl/react/styles.css';
const RESOLVED_CSS = `\0${VIRTUAL_CSS}`;
const CONFIG_MODULE = '@yarcl/config';
const PACKAGE = '@yarcl/react';
const selfRequire = createRequire(typeof __filename === 'string' ? __filename : import.meta.url);
const extensions = ['', '.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const importPattern = /(?:\bimport\s*(?:[\s\S]*?\sfrom\s*)?|\bexport\s*[\s\S]*?\sfrom\s*|\bimport\s*\()(['"])(\.{1,2}\/[^'"]+)\1/g;

function localDependency(importer: string, specifier: string): string | undefined {
  const candidate = resolve(dirname(importer), specifier);
  for (const extension of extensions) {
    const file = `${candidate}${extension}`;
    if (existsSync(file)) return file;
  }
  for (const extension of extensions.slice(1)) {
    const file = resolve(candidate, `index${extension}`);
    if (existsSync(file)) return file;
  }
}

async function configDependencies(entry: string): Promise<Set<string>> {
  const dependencies = new Set<string>();
  const visit = async (file: string): Promise<void> => {
    if (dependencies.has(file)) return;
    dependencies.add(file);
    if (extname(file) === '.json') return;
    const source = await readFile(file, 'utf8');
    const imports = [...source.matchAll(importPattern)]
      .map((match) => localDependency(file, match[2]))
      .filter((dependency): dependency is string => dependency !== undefined);
    await Promise.all(imports.map(visit));
  };
  await visit(entry);
  return dependencies;
}

function defaultConfig(): string {
  return selfRequire.resolve('@yarcl/react/defaults');
}

/** Shared yarcl plugin implementation used by every build-tool adapter. */
export const yarclPlugin = createUnplugin<YarclPluginOptions | undefined>((options = {}, meta) => {
  const configPath = options.config ?? DEFAULT_CONFIG_PATH;
  let root = resolve(options.root ?? process.cwd());
  let target = '';
  let componentStyles = '';
  let generatedStyles = '';
  let staticStyles = '';
  let watched = new Set<string>();

  const prepare = (): void => {
    assertConfigMapping(root, configPath, meta.framework);
    const consumerConfig = resolve(root, configPath);
    const fallback = defaultConfig();
    target = existsSync(consumerConfig) ? consumerConfig : fallback;
    staticStyles = resolve(dirname(fallback), 'styles.css');
  };

  return {
    name: 'yarcl',
    enforce: 'pre',

    buildStart() {
      prepare();
    },

    resolveId: {
      filter: { id: /^(?:@yarcl\/config|@yarcl\/react\/styles\.css)$/ },
      handler(id) {
        if (id === CONFIG_MODULE) return meta.framework === 'esbuild' ? undefined : target;
        if (id === VIRTUAL_CSS) return RESOLVED_CSS;
      },
    },

    load: {
      filter: { id: /(?:@yarcl\/react\/styles\.css|\/styles\.css)$/ },
      async handler(id) {
        if (meta.framework === 'rollup' && id === staticStyles) {
          componentStyles = await readFile(id, 'utf8');
          return '';
        }
        if (id !== RESOLVED_CSS) return;
        const jiti = createJiti(resolve(root, 'package.json'), { moduleCache: false });
        const config = await jiti.import<YarclShape>(target, { default: true });
        watched = existsSync(target) ? await configDependencies(target) : new Set([target]);
        watched.forEach((file) => this.addWatchFile(file));
        const css = generateCss(config, (message) => this.warn(message));
        if (meta.framework === 'rollup') {
          generatedStyles = css;
          return '';
        }
        return css;
      },
    },

    rollup: {
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'yarcl.css', source: `${generatedStyles}\n${componentStyles}` });
      },
    },

    vite: {
      config(userConfig) {
        root = resolve(options.root ?? userConfig.root ?? process.cwd());
        return {
          optimizeDeps: {
            exclude: [PACKAGE],
            include: ['@floating-ui/react', 'date-fns', 'date-fns/locale', 'date-fns/locale/en-US'].map((dependency) =>
              `${PACKAGE} > ${dependency}`,
            ),
          },
          ssr: { noExternal: [PACKAGE] },
        };
      },
      handleHotUpdate({ file, server, modules }) {
        if (!watched.has(file)) return;
        const css = server.moduleGraph.getModuleById(RESOLVED_CSS);
        if (!css) return;
        server.moduleGraph.invalidateModule(css);
        return [...modules, css];
      },
    },

    webpack(compiler) {
      root = resolve(options.root ?? compiler.context);
    },

    rspack(compiler) {
      root = resolve(options.root ?? compiler.context);
    },

    esbuild: {
      config(buildOptions) {
        root = resolve(options.root ?? buildOptions.absWorkingDir ?? process.cwd());
        prepare();
      },
      setup(build) {
        build.onResolve({ filter: /^@yarcl\/config$/ }, () => ({ path: target }));
      },
      loader: 'css',
    },
  };
});
