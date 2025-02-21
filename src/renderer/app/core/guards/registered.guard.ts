import { Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { GlobalStateService } from "../services/globalState.service";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegisteredGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly globalState: GlobalStateService,
    ) {}

    public canActivate(): MaybeAsync<GuardResult> {
        if(!this.globalState.known()) {
            this.router.navigateByUrl('/register');
            return of(false);
        }

        return of(true);
    }
}
