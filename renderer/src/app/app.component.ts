import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { fadeInOutAnimation } from './core/animations/fade.animation';
import { sidebarAnimation } from './core/animations/sidebar.animation';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { TitlebarComponent } from './core/components/titlebar/titlebar.component';
import { ElectronService } from './core/services/electron.service';
import { GlobalStateService } from './core/services/globalState.service';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, NgIf, TitlebarComponent, LoadingScreenComponent, SidebarComponent],
    animations: [fadeInOutAnimation, sidebarAnimation]
})
export class AppComponent {
    protected title = 'Electron Angular';
    protected isReady = false;

    constructor(
        protected readonly globalState: GlobalStateService,
        private readonly router: Router,
        private readonly electron: ElectronService,
        private readonly cdr: ChangeDetectorRef,
    ) {
        if(!this.electron.isElectronApp) {
            this.isReady = true;
            this.router.navigateByUrl('/not-desktop');
            return;
        }

        this.electron.ipc.onNavigationRequested('navigate-to', (_: any, url: string) => {
            this.router.navigateByUrl(url);
        });

        this.cdr.markForCheck();
        this.load();
    }

    private async load(): Promise<void> {
        if(this.isReady) {
            return;
        }

        const e = await this.electron.ipc.loadApp();

        
        const isSecondary = e.windowType === 'secondary';
        
        this.globalState.default.update(d => ({
            ...d,
            windowType: e.windowType,
            maximizable: !isSecondary,
            minimizable: !isSecondary,
        }));

        this.globalState.resetSettings();

        const authState = await this.electron.ipc.getAuthState(); // { registered: boolean; loggedIn: boolean }

        this.globalState.known.set(authState.registered);
        this.globalState.connected.set(authState.loggedIn);

        this.isReady = true;
        this.cdr.markForCheck();

        if(!authState.registered) {
            this.router.navigateByUrl('/register');
        }
        else if(!authState.loggedIn) {
            this.router.navigateByUrl('/dashboard/login');
        }
        else {
            this.router.navigateByUrl('/dashboard');
        }
    }
}
