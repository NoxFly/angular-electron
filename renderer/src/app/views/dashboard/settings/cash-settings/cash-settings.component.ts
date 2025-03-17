import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';

@Component({
    selector: 'app-cash-settings',
    standalone: true,
    templateUrl: './cash-settings.component.html',
    styleUrls: ['./cash-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
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
        this.electron.ipc.logout();
        this.electron.ipc.unregister();
        this.router.navigateByUrl('/');
    }
}
