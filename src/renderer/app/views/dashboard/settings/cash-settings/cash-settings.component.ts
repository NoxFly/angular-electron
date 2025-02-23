import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ElectronService } from '../../../../core/services/electron.service';
import { GlobalStateService } from '../../../../core/services/globalState.service';

@Component({
    selector: 'app-cash-settings',
    standalone: true,
    templateUrl: './cash-settings.component.html',
    styleUrls: ['./cash-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class CashSettingsComponent {
    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
    ) {}

    public disconnectFromServer(): void {
        this.globalState.connected.set(false);
        this.globalState.known.set(false);
        this.electron.ipcRenderer.logout();
        this.electron.ipcRenderer.unregister();
        this.router.navigateByUrl('/');
    }
}
