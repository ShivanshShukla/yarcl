import { yarclPlugin } from './plugin';

/** Connects yarcl to Vite. */
const yarcl = yarclPlugin.vite;

export type { YarclPluginOptions } from './plugin';
export default yarcl;
