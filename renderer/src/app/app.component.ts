import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { fadeInOutAnimation } from './core/animations/fade.animation';
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
    imports: [RouterOutlet, TitlebarComponent, LoadingScreenComponent],
    animations: [fadeInOutAnimation]
})
export class AppComponent {
    protected title = 'Electron Angular';
    protected isReady = signal<boolean>(false);

    constructor(
        protected readonly globalState: GlobalStateService,
        private readonly router: Router,
        private readonly electron: ElectronService,
    ) {
        if(!this.electron.isElectronApp) {
            this.isReady.set(true);
            this.router.navigateByUrl('/not-desktop');
            return;
        }

        this.electron.ipc.onNavigationRequested('navigate-to', (_: any, url: string) => {
            this.router.navigateByUrl(url);
        });

        this.load();
    }

    private async load(): Promise<void> {
        if(this.isReady()) {
            return;
        }

        console.log('AppComponent initialized');

        this.isReady.set(true);
        this.router.navigateByUrl('/home');

        this.electron.ipc.requestPort();
    }
}
