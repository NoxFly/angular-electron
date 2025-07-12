// core/container.ts
import { InternalServerException } from 'core/engine/exceptions';
import 'reflect-metadata';

export type Constructor<T = any> = new (...args: any[]) => T;

export type Lifetime = 'singleton' | 'scope' | 'transient';

// ---

interface Binding {
    lifetime: Lifetime;
    implementation: Constructor;
    instance?: any;
}

// --- decorators

export function Injectable(lifetime: Lifetime): ClassDecorator {
    return (target) => {
        if(typeof target !== 'function' || !target.prototype) {
            throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
        }

        // RootInjector.register(target as unknown as Constructor<any>, lifetime);
        Reflect.defineMetadata('injectable', true, target);
    };
}

// ---

class AppInjector {
    public bindings = new Map<Constructor, Binding>();
    public singletons = new Map<Constructor, any>();
    public scoped = new Map<Constructor, any>();

    constructor(
        public readonly name: string | null = null,
    ) {}

    /**
     * Utilisé généralement pour créer un scope d'injection de dépendances
     * au niveau "scope" (donc durée de vie d'une requête)
     */
    public createScope(): AppInjector {
        const scope = new AppInjector();
        scope.bindings = this.bindings; // transmet les déclarations d'injectables
        scope.singletons = this.singletons; // on passe les singletons du parent à l'enfant pour éviter de les recréer
        // on ne garde pas les scoped du parent
        return scope;
    }

    /**
     * Enregistre la classe comme étant injectable.
     * Lorsqu'une classe sera instanciée, si elle a des dépendances, et que celles-ci
     * figurent dans la liste grâce à cette méthode, elles seront injectées dans le
     * constructeur de la classe.
     */
    public register(target: Constructor, lifetime: Lifetime): AppInjector {
        this.bindings.set(target, {
            implementation: target,
            lifetime
        });

        return this;
    }

    /**
     * Appelé lorsqu'on souhaite résoudre une dépendance,
     * c'est-à-dire récupérer l'instance d'une classe donnée.
     */
    public resolve<T extends Constructor<any>>(target: T): InstanceType<T> {
        const binding = this.bindings.get(target);

        if(!binding)
            throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${target.name}`);

        switch(binding.lifetime) {
            case 'transient':
                return this.instantiate(binding.implementation) as InstanceType<T>;

            case 'scope': {
                if(this.scoped.has(target)) {
                    return this.scoped.get(target) as InstanceType<T>;
                }

                const instance = this.instantiate(binding.implementation);
                this.scoped.set(target, instance);

                return instance as InstanceType<T>;
            }

            case 'singleton': {
                if(binding.instance === undefined && this.name === 'root') {
                    binding.instance = this.instantiate(binding.implementation);
                }

                return binding.instance as InstanceType<T>;
            }
        }
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

class InjectorExplorer {
    public static explore(injector: AppInjector): void {
        // search all @Injector in the project and register them to the passed injector
        const injectableClasses: string[] = [];

        
    }
}

export const RootInjector = new AppInjector('root');

InjectorExplorer.explore(RootInjector);