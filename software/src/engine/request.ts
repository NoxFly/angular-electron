import { App } from 'engine/app';
import { RootInjector } from 'engine/app-injector';
import { HttpMethod } from 'engine/router';
import 'reflect-metadata';


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
    ) {
        this.path = path.replace(/^\/|\/$/g, '');
    }
}

export interface Response {
    status: number;
    body?: any;
    error?: string;
}
