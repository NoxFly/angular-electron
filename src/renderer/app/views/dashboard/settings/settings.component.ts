import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { ElectronService } from '../../../core/services/electron.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class SettingsComponent {
    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
    ) {

    }

    public disconnectFromServer(): void {
        this.globalState.connected.set(false);
        this.globalState.known.set(false);
        this.electron.ipcRenderer.logout();
        this.electron.ipcRenderer.unregister();
        this.router.navigateByUrl('/');
    }
}
