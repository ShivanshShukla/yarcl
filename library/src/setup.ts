import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { parse, type ParseError } from 'jsonc-parser';

export const DEFAULT_CONFIG_PATH = 'src/yarcl.config.ts';
export const CONFIG_MODULE = '@yarcl/config';
const tsconfigNames = ['tsconfig.app.json', 'tsconfig.json'];

export function findTsconfig(root: string): string | undefined {
  return tsconfigNames.map((name) => resolve(root, name)).find((file) => existsSync(file));
}

export function projectPath(from: string, target: string): string {
  const path = relative(from, target).split(sep).join('/');
  return path.startsWith('.') ? path : `./${path}`;
}

export function configMappings(root: string, tsconfig: string, configPath: string): string[] {
  const base = dirname(tsconfig);
  return [
    projectPath(base, resolve(root, configPath)),
    projectPath(base, resolve(root, 'node_modules/@yarcl/react/dist/yarcl.config.d.ts')),
  ];
}

export function assertConfigMapping(root: string, configPath: string, buildTool = 'build tool'): void {
  const tsconfig = findTsconfig(root);
  if (!tsconfig) {
    throw new Error(`yarcl: No tsconfig.app.json or tsconfig.json found in ${root}. Run "yarcl init".`);
  }

  const errors: ParseError[] = [];
  const config = parse(readFileSync(tsconfig, 'utf8'), errors, { allowTrailingComma: true });
  if (errors.length > 0) throw new Error(`yarcl: Could not parse ${projectPath(root, tsconfig)}.`);

  const mapping = config?.compilerOptions?.paths?.[CONFIG_MODULE];
  const expected = resolve(root, configPath);
  const actual = Array.isArray(mapping) && typeof mapping[0] === 'string' ? resolve(dirname(tsconfig), mapping[0]) : undefined;
  if (actual === expected) return;

  const current = actual ? `"${projectPath(root, actual)}"` : 'no path';
  throw new Error(
    `yarcl: Config path mismatch. ${buildTool} uses "${configPath}", but ${projectPath(root, tsconfig)} has ${current} for "${CONFIG_MODULE}". Run "yarcl init --config ${configPath}".`,
  );
}
