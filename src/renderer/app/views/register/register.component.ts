import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ElectronService } from '../../core/services/electron.service';
import { GlobalStateService } from '../../core/services/globalState.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalController } from '../../shared/components/modal/modal.controller';
import { SubscriptionManager } from '../../shared/directives/SubscriptionManager.directive';
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
    imports: [NgSwitch, NgSwitchCase, NgIf, WelcomeComponent, OnpremiseRegistrationComponent, SaasRegistrationComponent, ModalComponent],
})
export class RegisterComponent extends SubscriptionManager {
    protected configType = signal<'onpremise' | 'saas' | undefined>(undefined);
    protected config?: any;

    constructor(
        private readonly globalState: GlobalStateService,
        private readonly electron: ElectronService,
        private readonly router: Router,
        private readonly modalCtrl: ModalController,
    ) {
        super();
    }

    protected onConfigImported(e: { isSaas: boolean; config: any; }): void {
        this.config = e.config;
        this.configType.set(e.isSaas ? 'saas' : 'onpremise');

        const modal = this.modalCtrl.create({
            component: this.configType() === 'saas'
                ? SaasRegistrationComponent
                : OnpremiseRegistrationComponent,
            componentProps: {
                config: this.config
            },
            id: 'registration-modal',
        });

        this.watch$ = modal.willDismiss.pipe(
            tap(({ role, data }) => {
                if(role === 'cancel') {
                    this.onImportCancel();
                }
                else {
                    this.onPremConfirmed(data as Credentials);
                }
            })
        );
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
        this.router.navigate(['/dashboard/login']).then(console.log).catch(console.error);
    }
}
