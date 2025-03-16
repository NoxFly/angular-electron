import { Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { of } from "rxjs";
import { GlobalStateService } from "src/app/core/services/globalState.service";

@Injectable({
    providedIn: 'root'
})
export class RegisteredGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly globalState: GlobalStateService,
    ) {}

    public canActivate(): MaybeAsync<GuardResult> {
        const isKnown = this.globalState.known();

        this.globalState.current.update(c => ({
            ...c,
            minimizable: isKnown,
            maximizable: isKnown,
            closable: true,
        }));

        if(!isKnown) {
            this.router.navigateByUrl('/register');
        }

        return of(isKnown);
    }
}
