import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { ModalController } from 'src/app/shared/components/modal/modal.controller';
import { OnpremiseRegistrationComponent } from './onpremise/onpremise.component';
import { SaasRegistrationComponent } from './saas/saas.component';
import { WelcomeComponent } from './welcome/welcome.component';

type Credentials = {
    username: string;
    password: string;
};

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [WelcomeComponent],
})
export class RegisterComponent {
    protected configType = signal<'onpremise' | 'saas' | undefined>(undefined);
    protected config?: any;

    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
        private readonly modalCtrl: ModalController,
    ) {}

    protected async onConfigImported(e: { isSaas: boolean; config: any; }): Promise<void> {
        this.config = e.config;
        this.configType.set(e.isSaas ? 'saas' : 'onpremise');

        const modal = await this.modalCtrl.create({
            component: this.configType() === 'saas'
                ? SaasRegistrationComponent
                : OnpremiseRegistrationComponent,
            componentProps: {
                config: this.config
            },
            id: 'registration-modal',
        });

        modal.willDismiss.subscribe(({ role, data }) => {
            if(role === 'cancel') {
                this.onImportCancel();
            }
            else {
                this.onPremConfirmed(data as Credentials);
            }
        });
    }

    protected onImportCancel(): void {
        this.config = undefined;
        this.configType.set(undefined);
    }

    protected onPremConfirmed(credentials: Credentials): void {
        this.register();
    }

    private register(): void {
        this.globalState.known.set(true);
        this.electron.ipcRenderer.register();
        this.router.navigate(['/dashboard/login']);
    }
}
