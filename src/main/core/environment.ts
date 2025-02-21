// import { dirname } from 'node:path';

import { resolve } from "node:path";

export const environment = {
    production: process.env.NODE_ENV !== 'development',
    root: resolve(__dirname, '..'),
};


console.info(`[INFO] Running in ${environment.production ? "production" : "development"} mode`);
