import { Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { of } from "rxjs";
import { ElectronService } from "src/app/core/services/electron.service";
import { GlobalStateService } from "src/app/core/services/globalState.service";

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
