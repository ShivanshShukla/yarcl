import { yarclPlugin } from './plugin';

/** Connects yarcl to Rspack. */
const yarcl = yarclPlugin.rspack;

export type { YarclPluginOptions } from './plugin';
export default yarcl;
