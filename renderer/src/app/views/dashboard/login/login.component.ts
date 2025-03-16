import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { NumpadComponent } from 'src/app/shared/components/numpad/numpad.component';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NumpadComponent],
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
        this.electron.ipc.login();
        this.router.navigate(['/dashboard']);
    }

    public ngOnInit(): void {

    }
}
