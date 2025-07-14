// import { dirname } from 'node:path';

import { Logger } from "@noxfly/noxus";
import { resolve } from "node:path";

const production = process.env.NODE_ENV !== 'development';
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, '..', 'public');

export const environment = {
    production,
    rootDir,
    publicDir,
};


Logger.info(`Running in ${environment.production ? "production" : "development"} mode`);
