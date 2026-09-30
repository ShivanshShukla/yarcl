#!/usr/bin/env node

import { error, log } from 'node:console';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { initProject, type BuildTool } from './init.ts';

const buildTools = new Set<BuildTool>(['vite', 'webpack', 'rspack', 'rollup', 'esbuild']);

function usage(): void {
  log('Usage: yarcl init [--config <path>] [--root <path>] [--bundler <name>] [--skip-install]');
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`yarcl: ${name} requires a value.`);
  return value;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    usage();
    return;
  }
  if (args[0] !== 'init') {
    usage();
    process.exitCode = 1;
    return;
  }

  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const manifest = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));
  const configPath = option(args, '--config');
  const requestedBuildTool = option(args, '--bundler');
  if (requestedBuildTool && !buildTools.has(requestedBuildTool as BuildTool)) {
    throw new Error(`yarcl: Unsupported bundler "${requestedBuildTool}". Use vite, webpack, rspack, rollup or esbuild.`);
  }
  const root = resolve(option(args, '--root') ?? process.cwd());
  const result = await initProject({
    root,
    configPath,
    configProvided: configPath !== undefined,
    buildTool: requestedBuildTool as BuildTool | undefined,
    install: !args.includes('--skip-install'),
    version: manifest.version,
  });
  log(`yarcl configured ${result.configPath}`);
  log(`Updated ${result.buildConfig.slice(root.length + 1)} and ${result.tsconfig.slice(root.length + 1)}`);
}

main().catch((cause) => {
  error(cause instanceof Error ? cause.message : cause);
  process.exitCode = 1;
});
