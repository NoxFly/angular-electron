import { Logger } from 'engine/logger';
import { Type } from 'engine/metadata';
import { MaybeAsync } from 'engine/misc';
import { Request } from 'engine/request';

export interface Guard {
    canActivate(request: Request): MaybeAsync<boolean>;
}

const authorizations = new Map<string, Type<Guard>[]>();

/**
 * Peut être utilisé pour protéger les routes d'un contrôleur.
 * Peut être utilisé sur une classe controleur, ou sur une méthode de contrôleur.
 */
export function Authorize(...guardClasses: Type<Guard>[]): MethodDecorator & ClassDecorator {
    return (target: any, propertyKey?: string | symbol) => {
        let key: string;

        // Method decorator
        if(propertyKey) {
            const ctrlName = target.constructor.name;
            const actionName = propertyKey as string;
            key = `${ctrlName}.${actionName}`;
        }
        // Class decorator
        else {
            const ctrlName = (target as Type<unknown>).name;
            key = `${ctrlName}`;
        }

        if(authorizations.has(key)) {
            throw new Error(`Guard(s) already registered for ${key}`);
        }

        Logger.debug(`Registering guards for ${key}: ${guardClasses.map(c => c.name).join(', ')}`);

        authorizations.set(key, guardClasses);
    };
}


export function getGuardForController(controllerName: string): Type<Guard>[] {
    const key = `${controllerName}`;
    return authorizations.get(key) ?? [];
}

export function getGuardForControllerAction(controllerName: string, actionName: string): Type<Guard>[] {
    const key = `${controllerName}.${actionName}`;
    return authorizations.get(key) ?? [];
}
