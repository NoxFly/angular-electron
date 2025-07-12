import { Request } from 'core/engine/request';

export interface Guard {
    canActivate(request: Request): Promise<boolean> | boolean;
}

interface AuthorizeMeta {
    controllerName: string;
    actionName: string;
    guard: new () => Guard;
}

export const authorizations: AuthorizeMeta[] = [];

export function Authorize(guardClass: new () => Guard): MethodDecorator {
    return (target, propertyKey) => {
        const ctrlName = (target.constructor as any).__controllerName;
        const actionName = propertyKey as string;
        authorizations.push({ controllerName: ctrlName, actionName, guard: guardClass });
    };
}
