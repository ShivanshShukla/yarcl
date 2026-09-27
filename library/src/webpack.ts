import { yarclPlugin } from './plugin';

/** Connects yarcl to webpack. */
const yarcl = yarclPlugin.webpack;

export type { YarclPluginOptions } from './plugin';
export default yarcl;
