import { App } from 'core/app';
import { RootInjector } from 'core/engine/appInjector';
import 'reflect-metadata';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

//

export class Request {
    public readonly context = RootInjector.createScope();

    public readonly params: Record<string, string> = {};

    constructor(
        public readonly app: App,
        public readonly event: Electron.MessageEvent,
        public readonly port: Electron.MessagePortMain,
        public readonly method: HttpMethod,
        public readonly path: string,
        public readonly body: any,
    ) {}
}

export interface Response {
    status: number;
    body?: any;
    error?: string;
}
