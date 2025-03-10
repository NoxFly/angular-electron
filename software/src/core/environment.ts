// import { dirname } from 'node:path';

import { resolve } from "node:path";

const production = process.env.NODE_ENV !== 'development';
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, '..', 'public');

export const environment = {
    production,
    rootDir,
    publicDir,
};


console.info(`[INFO] Running in ${environment.production ? "production" : "development"} mode`);
