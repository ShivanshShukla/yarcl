import { yarclPlugin } from './plugin';

/** Connects yarcl to Rollup. */
const yarcl = yarclPlugin.rollup;

export type { YarclPluginOptions } from './plugin';
export default yarcl;
