import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ElectronService } from '../../../core/services/electron.service';
import { GlobalStateService } from '../../../core/services/globalState.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class LogoutComponent implements OnInit {
    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
    ) {

    }

    public ngOnInit(): void {
        this.globalState.connected.set(false);
        this.electron.ipcRenderer.logout();
        this.router.navigate(['/']);
    }
}
