import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
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
