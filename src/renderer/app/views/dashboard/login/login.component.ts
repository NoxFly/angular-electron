import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ElectronService } from '../../../core/services/electron.service';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { NumpadComponent } from '../../../shared/components/numpad/numpad.component';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NumpadComponent],
})
export class LoginComponent implements OnInit {
    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
    ) {

    }

    protected login(): void {
        this.globalState.connected.set(true);
        this.electron.ipcRenderer.login();
        this.router.navigate(['/dashboard']);
    }

    public ngOnInit(): void {

    }
}
