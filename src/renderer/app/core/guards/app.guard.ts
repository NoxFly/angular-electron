import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { ElectronService } from "../services/electron.service";
import { Injectable } from "@angular/core";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly electron: ElectronService,
    ) {}

    public canActivate(): MaybeAsync<GuardResult> {
        if(!this.electron.isElectronApp) {
            this.router.navigateByUrl('/not-desktop');
            return of(false);
        }

        return of(true);
    }
}
