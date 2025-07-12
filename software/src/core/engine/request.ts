/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { App } from 'core/app';
import { registry } from 'core/engine/appInjector';
import 'reflect-metadata';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

//

export class Request {
    private readonly scoped = new Map<Function, any>();

    public readonly params: Record<string, string> = {};

    constructor(
        public readonly app: App,
        public readonly event: Electron.MessageEvent,
        public readonly port: Electron.MessagePortMain,
        public readonly method: HttpMethod,
        public readonly path: string,
        public readonly body: any,
    ) {}

    public resolve<T>(cls: new (...args: any[]) => T): T {
        const def = registry.get(cls);
        
        if(!def)
            throw new Error(`No provider for ${cls.name}`);

        if(def.lifetime === 'singleton') {
            if(!def.instance)
                def.instance = this.construct(cls);
            
            return def.instance;
        }

        if(def.lifetime === 'scope') {
            if(!this.scoped.has(cls))
                this.scoped.set(cls, this.construct(cls));

            return this.scoped.get(cls);
        }

        return this.construct(cls);
    }

    private construct<T>(cls: new (...args: any[]) => T): T {
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', cls) || [];
        const params = paramTypes.map(pt => this.resolve(pt));
        return new cls(...params);
    }
}

export interface Response {
    status: number;
    body?: any;
    error?: string;
}
