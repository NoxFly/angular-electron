import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { ElectronService } from "../services/electron.service";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { GlobalStateService } from "../services/globalState.service";

@Injectable({
    providedIn: 'root'
})
export class AppGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly electron: ElectronService,
        private readonly globalState: GlobalStateService,
    ) {}

    public canActivate(): MaybeAsync<GuardResult> {
        const isElectronApp = this.electron.isElectronApp;
        this.globalState.current.showTitlebar = isElectronApp;

        if(!isElectronApp) {
            this.router.navigateByUrl('/not-desktop');
        }

        return of(isElectronApp);
    }
}
