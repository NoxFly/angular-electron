import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Service qui permet de facilement écouter des observables
 * en arrêtant d'écouter une fois que l'on n'en a plus besoin.
 * Cela permet de faciliter l'utilisation des subscribes sans devoir
 * penser à gérer les unsubscribe, et évitant les memory leaks.
 *
 * Toute classe utilisant des observables et qui subscribe à ces observables
 * doit étendre cette classe et faire ceci :
 *
 * this.watch$ = observable.pipe(...);
 *
 * au lieu de :
 *
 * observable.pipe(...).subscribe(...);
 *
 * De plus, observable.subscribe(...) ne doit pas être utilisé.
 *
 * Un évènement qui doit être écouté toute la durée de vie de la classe ou de l'application
 * n'a pas besoin de faire this.watch$ = observable.pipe(...);
 */
@Directive()
export class SubscriptionManager implements OnDestroy {
    protected readonly closedSubject = new Subject<void>();

    public get closed$(): Observable<void> {
        return this.closedSubject.asObservable();
    }

    public get untilDestroyed() {
        return <U>(source: Observable<U>) => source.pipe(takeUntil<U>(this.closed$));
    }

    /**
     * subcribe to an observable until ngOnDestroy is called
     */
    protected set watch$(observable: Observable<any>) {
        observable.pipe(this.untilDestroyed).subscribe();
    }

    /**
     * Implémentation à garder pour que le untilDestroyed fonctionne
     */
    public ngOnDestroy(): void {
        this.closedSubject.next();
        this.closedSubject.complete();
    }
}
