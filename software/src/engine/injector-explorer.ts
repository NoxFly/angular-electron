import { Lifetime, RootInjector } from "engine/app-injector";
import { Logger } from "engine/logger";
import { Type, getModuleMetadata, getControllerMetadata, getRouteMetadata, getInjectableMetadata } from "engine/metadata";
import { Router } from "engine/router";

export class InjectorExplorer {
    /**
     * Enregistre la classe comme étant injectable.
     * Lorsqu'une classe sera instanciée, si elle a des dépendances, et que celles-ci
     * figurent dans la liste grâce à cette méthode, elles seront injectées dans le
     * constructeur de la classe.
     */
    public static register(target: Type<unknown>, lifetime: Lifetime): typeof RootInjector {
        if(RootInjector.bindings.has(target)) // already registered
            return RootInjector;

        RootInjector.bindings.set(target, {
            implementation: target,
            lifetime
        });

        if(lifetime === 'singleton') {
            RootInjector.resolve(target);
        }

        if(getModuleMetadata(target)) {
            Logger.log(`${target.name} dependencies initialized`);
            return RootInjector;
        }

        const controllerMeta = getControllerMetadata(target);
        
        if(controllerMeta) {
            const router = RootInjector.singletons.get(Router) as Router;
            router?.registerController(target);
            return RootInjector;
        }

        const routeMeta = getRouteMetadata(target);
        
        if(routeMeta) {
            // for(const route of routeMeta) {
            //     Logger.log(`Mapped {${route.method} /${route.path}} ${route.guard ? '<' + route.guard.name + '>' : ''} route`);
            // }
            return RootInjector;
        }

        if(getInjectableMetadata(target)) {
            Logger.log(`Registered ${target.name} as ${lifetime}`);
            return RootInjector;
        }

        return RootInjector;
    }
}