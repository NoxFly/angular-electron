import { resolve } from "node:path";

const env = process.env.NODE_ENV;
const isDebug = env === 'debug';
const isDevelopment = env === 'development';
const isProduction = env === 'production';

const rootDir = resolve(__dirname, isProduction ? '.' : '..');
let rendererDir = '';

switch(env) {
    case 'development': // angular live reload localhost:4200
        rendererDir = resolve(rootDir, '..', '..', 'renderer');
        break;

    case 'debug': // angular build dist
        rendererDir = resolve(rootDir, '..', '..', 'renderer', 'build', 'browser');
        break;

    case 'production': // same dist folder
        rendererDir = resolve(rootDir, 'browser');
        break;

    default:
        throw new Error(`Unknown environment: ${env}`);
}

const publicDir = (env === 'development')
    ? resolve(rendererDir, 'public')
    : rendererDir;

export const environment = {
    production: isProduction,
    debug: isDebug,
    development: isDevelopment,
    env,
    // paths
    rootDir,
    publicDir,
    rendererDir,
};

console.info(`[INFO] Running in ${environment.env} mode`);
console.debug(environment);
