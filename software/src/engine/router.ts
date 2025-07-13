import 'reflect-metadata';
import { Injectable } from 'engine/app';
import { MethodNotAllowedException, NotFoundException, ResponseException, UnauthorizedException } from 'engine/exceptions';
import { Guard } from 'engine/guards';
import { Request, Response } from 'engine/request';
import { CONTROLLER_METADATA_KEY, getControllerMetadata, getRouteMetadata, ROUTE_METADATA_KEY, RouteMetadata, Type } from 'engine/metadata';
import { RadixTree } from 'engine/radix-tree';
import { Logger } from 'engine/logger';

// types & interfaces

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guard?: Type<Guard>;
}

export type ControllerAction = (request: Request, response: Response) => any;

export function Controller(name: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { path: name }, target);
        Injectable('scope')(target);
    };
}

function createRouteDecorator(verb: HttpMethod): (path: string) => MethodDecorator {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            const existingRoutes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];

            const metadata: RouteMetadata = {
                method: verb,
                path: path.trim().replace(/^\/|\/$/g, ''),
                handler: propertyKey as string,
            };

            existingRoutes.push(metadata);

            Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor);
        };
    };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Patch = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');

@Injectable('singleton')
export class Router {
    private readonly routes = new RadixTree<RouteDefinition>();

    public registerController(controllerClass: Type<unknown>): Router {
        const controllerMeta = getControllerMetadata(controllerClass);
        
        if(!controllerMeta)
            throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);

        const routeDefs = getRouteMetadata(controllerClass);

        for(const def of routeDefs) {
            const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, '/');
            
            this.routes.insert(fullPath + '/' + def.method, {
                method: def.method,
                path: fullPath,
                controller: controllerClass,
                handler: def.handler,
                guard: def.guard,
            });

            Logger.log(`Mapped {${def.method} /${fullPath}}${def.guard ? '<' + def.guard.name + '>' : ''} route`);
        }

        Logger.log(`Mapped ${controllerClass.name} controller's routes`);

        return this;
    }

    public async handle(request: Request): Promise<Response> {
        Logger.log(`> Received request: {${request.method} /${request.path}}`);

        const t0 = performance.now();
        
        const response: Response = {
            status: 200,
            body: null,
            error: undefined,
        };

        try {
            const routeDef = this.findRoute(request);
            const controllerInstance = await this.resolveController(request, routeDef);

            const action = controllerInstance[routeDef.handler] as ControllerAction;

            this.verifyRequestBody(request, action);

            

            response.body = await action.call(controllerInstance, request, response);
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
        finally {
            const t1 = performance.now();

            const message = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(t1 - t0)}ms${Logger.colors.initial}`;

            if(response.status < 400)
                Logger.log(message);
            else if(response.status < 500)
                Logger.warn(message);
            else
                Logger.error(message);

            if(response.error !== undefined) {
                Logger.error(response.error);
            }

            return response;
        }
    }

    private findRoute(request: Request): RouteDefinition {
        const matchedRoutes = this.routes.search(request.path);

        if(matchedRoutes?.node === undefined || matchedRoutes.node.children.length === 0) {
            throw new NotFoundException(`No route matches ${request.method} ${request.path}`);
        }

        const routeDef = matchedRoutes.node.findExactChild(request.method);

        if(routeDef?.value === undefined) {
            throw new MethodNotAllowedException(`Method Not Allowed for ${request.method} ${request.path}`);
        }

        return routeDef.value;
    }

    private async resolveController(request: Request, routeDef: RouteDefinition): Promise<any> {
        const controllerInstance = request.context.resolve(routeDef.controller);

        Object.assign(request.params, this.extractParams(request.path, routeDef.path));

        if(routeDef.guard) {
            const guard = request.context.resolve(routeDef.guard);
            const allowed = await guard.canActivate(request);

            if(!allowed)
                throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
        }

        return controllerInstance;
    }

    private verifyRequestBody(request: Request, action: ControllerAction): void {
        const requiredParams = Reflect.getMetadata('design:paramtypes', action) || [];
        // peut être à faire plus tard. problème du TS, c'est qu'en JS pas de typage.
        // donc il faudrait passer par des décorateurs mais pas sûr que ce soit bien.
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
