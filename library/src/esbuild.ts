import { yarclPlugin } from './plugin';

/** Connects yarcl to esbuild. */
const yarcl = yarclPlugin.esbuild;

export type { YarclPluginOptions } from './plugin';
export default yarcl;
