/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// core/container.ts
import { InternalServerException } from 'core/engine/exceptions';
import 'reflect-metadata';

export type Constructor<T = any> = new (...args: any[]) => T;

export type Lifetime = 'singleton' | 'scope' | 'transient';

// ---

interface Def {
    target: any;
    lifetime: Lifetime;
    instance?: any;
}

interface Binding {
    lifetime: Lifetime;
    implementation: Constructor;
    instance?: any;
}

// --- decorators

export function Injectable(lifetime: Lifetime): ClassDecorator {
    return (target) => {
        registry.set(target, { target, lifetime });
    };
}

// ---

class AppInjector {
    private bindings = new Map<Constructor, Binding>();
    private singletons = new Map<Constructor, any>();

    /**
     * 
     */
    public register(target: Constructor, lifetime: Lifetime): AppInjector {
        this.bindings.set(target, { implementation: target, lifetime });
        return this;
    }

    /**
     * 
     */
    public resolve<T extends Constructor<any>>(target: T): InstanceType<T> {
        const binding = this.bindings.get(target);

        if(!binding)
            throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${target.name}`);

        if(binding.lifetime === 'singleton') {
            if(!this.singletons.has(target)) {
                this.singletons.set(target, this.instantiate(binding.implementation));
            }

            return this.singletons.get(target) as InstanceType<T>;
        }

        return this.instantiate(binding.implementation) as InstanceType<T>;
    }

    /**
     * 
     */
    public createScope(): AppInjector {
        const scope = new AppInjector();
        scope.bindings = this.bindings;
        scope.singletons = this.singletons;
        return scope;
    }

    /**
     * 
     */
    private instantiate<T>(target: Constructor<T>): T {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        const params = paramTypes.map((p: any) => this.resolve(p));
        return new target(...params);
    }
}

export const registry = new Map<Function, Def>();

export const RootInjector = new AppInjector();
