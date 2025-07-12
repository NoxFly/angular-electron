import 'reflect-metadata';
import { Guard } from 'core/engine/guards';
import { Constructor, Injectable, RootInjector } from 'core/engine/appInjector';
import { ResponseException, NotFoundException, UnauthorizedException } from 'core/engine/exceptions';
import { HttpMethod, Request, Response } from 'core/engine/request';

// types & interfaces


export interface RouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guard?: Constructor;
}

export interface ControllerMetadata {
    path: string;
}

export interface RouteDefinition {
    method: string;
    path: string;
    controller: Constructor<any>;
    handler: string;
    guard?: Constructor<Guard>;
}

export type ControllerAction = (request: Request, response: Response) => any;

const CONTROLLER_METADATA_KEY = Symbol('controller_metadata');
const ROUTE_METADATA_KEY = Symbol('route_metadata');

export const controllers: any[] = [];
export const routes: RouteMetadata[] = [];

// decorators

export function Controller(name: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { path: name }, target);
    };
}

function createRouteDecorator(verb: HttpMethod): (path: string) => MethodDecorator {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            const existingRoutes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
            existingRoutes.push({
                method: verb,
                path: path.trim().replace(/^\/|\/$/g, ''),
                handler: propertyKey as string,
            });
            Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor);
        };
    };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Patch = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');

// -- utilities

function getControllerMetadata(target: Constructor): ControllerMetadata | undefined {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}

function getRouteMetadata(target: Constructor): RouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}


// main Router class

@Injectable('singleton')
export class Router {
    private readonly routes = new Map<string, RouteDefinition>();

    public registerController(controllerClass: Constructor): Router {
        const controllerMeta = getControllerMetadata(controllerClass);
        
        if(!controllerMeta)
            throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);

        const routeDefs = getRouteMetadata(controllerClass);
        
        for(const def of routeDefs) {
            const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, '/');
            this.routes.set(fullPath, {
                method: def.method,
                path: fullPath,
                controller: controllerClass,
                handler: def.handler,
                guard: def.guard,
            });
        }

        return this;
    }

    public getRoutes(): Map<string, RouteDefinition> {
        return this.routes;
    }

    public async handle(request: Request): Promise<Response> {
        const routeDef = this.findRoute(request);

        const controllerInstance = await this.resolveController(request, routeDef);

        const response: Response = {
            status: 200,
            body: null,
            error: undefined,
        };

        const action = controllerInstance[routeDef.handler] as ControllerAction;

        try {
            response.body = action.call(controllerInstance, request, response);
        }
        catch(error: unknown) {
            if(error instanceof ResponseException) {
                response.status = error.status;
                response.error = error.message;
            }
            else if(error instanceof Error) {
                response.status = 500;
                response.error = error.message || 'Internal Server Error';
            }
            else {
                response.status = 500;
                response.error = 'Unknown error occurred';
            }
        }

        return response;
    }

    private findRoute(request: Request): RouteDefinition {
        const routeDef = Array
            .from(this.routes.values())
            .find(r => this.matchRoute(request.path, r.path) && r.method === request.method);
        
        if(!routeDef)
            throw new NotFoundException(`No route matches ${request.method} ${request.path}`);

        return routeDef;
    }

    private matchRoute(actual: string, template: string): boolean {
        const aParts = actual.split('/');
        const tParts = template.split('/');
        
        if(aParts.length !== tParts.length)
            return false;
        
        return tParts.every((part, i) => part.startsWith(':') || part === aParts[i]);
    }

    private async resolveController(request: Request, routeDef: RouteDefinition): Promise<any> {
        const scope = RootInjector.createScope();
        const controllerInstance = scope.resolve(routeDef.controller);

        Object.assign(request.params, this.extractParams(request.path, routeDef.path));

        if(routeDef.guard) {
            const guard = scope.resolve(routeDef.guard);
            const allowed = await guard.canActivate(request);

            if(!allowed)
                throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
        }

        return controllerInstance;
    }

    private extractParams(actual: string, template: string): Record<string, string> {
        const aParts = actual.split('/');
        const tParts = template.split('/');
        const params: Record<string, string> = {};
        
        tParts.forEach((part, i) => {
            if(part.startsWith(':')) {
                params[part.slice(1)] = aParts[i] ?? '';
            }
        });
        
        return params;
    }
}