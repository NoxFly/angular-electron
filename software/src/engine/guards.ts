import { Type } from 'engine/metadata';
import { Request } from 'engine/request';

export interface Guard {
    canActivate(request: Request): Promise<boolean> | boolean;
}

const authorizations = new Map<string, Type<Guard>>();

/**
 * Peut être utilisé pour protéger les routes d'un contrôleur.
 * Peut être utilisé sur une classe controleur, ou sur une méthode de contrôleur.
 */
export function Authorize(guardClass: Type<Guard>): MethodDecorator {
    return (target, propertyKey) => {
        const ctrlName = (target.constructor as any).__controllerName;
        const actionName = propertyKey as string;

        const key = `${ctrlName}.${actionName}`;

        if(authorizations.has(key)) {
            throw new Error(`Guard already registered for ${key}`);
        }
        
        authorizations.set(key, guardClass);
    };
}

export function getGuardForControllerAction(controllerName: string, actionName: string): Type<Guard> | undefined {
    const key = `${controllerName}.${actionName}`;
    return authorizations.get(key);
}