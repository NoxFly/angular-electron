/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Lifetime } from "engine/app-injector";
import { Guard } from "engine/guards";
import { HttpMethod } from "engine/router";

declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (...args: any[]): T;
}

export const MODULE_METADATA_KEY = Symbol('MODULE_METADATA_KEY');
export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_METADATA_KEY');
export const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');
export const ROUTE_METADATA_KEY = Symbol('ROUTE_METADATA_KEY');

export interface ModuleMetadata {
    imports?: Type<unknown>[];
    providers?: Type<unknown>[];
    controllers?: Type<unknown>[];
    exports?: Type<unknown>[];
}

export interface RouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<Guard>[];
}

export interface ControllerMetadata {
    path: string;
    guards: Type<Guard>[];
}


export function getControllerMetadata(target: Type<unknown>): ControllerMetadata | undefined {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}

export function getRouteMetadata(target: Type<unknown>): RouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}

export function getModuleMetadata(target: Function): ModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}

export function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}