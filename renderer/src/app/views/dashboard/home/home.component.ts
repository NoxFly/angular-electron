import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { AlertController } from 'src/app/shared/components/alert/alert.controller';
import { ModalController } from 'src/app/shared/components/modal/modal.controller';
import { SyncLoaderComponent } from 'src/app/shared/components/sync-loader/sync-loader.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf],
})
export class HomeComponent {
    protected title = 'Electron Angular';
    protected isSyncing = signal(false);

    protected secondScreenStateMessage = computed(() => {
        return this.electron.hasSecondScreen()
            ? 'Second écran disponible'
            : 'Aucun second écran détecté';
    });

    constructor(
        protected readonly globalState: GlobalStateService,
        protected readonly alertCtrl: AlertController,
        protected readonly modalCtrl: ModalController,
        protected readonly electron: ElectronService,
    ) {}

    protected async sync(withSuccess: boolean): Promise<void> {
        if(this.isSyncing()) {
            return;
        }

        this.isSyncing.set(true);

        const modal = await this.modalCtrl.create({
            component: SyncLoaderComponent,
            backdropClose: false,
            keyboardClose: false,
            showBackdrop: true,
            showDots: true,
            id: 'sync-modal',
            componentProps: {
                resultSuccess: withSuccess,
            }
        });

        modal.willDismiss.subscribe(() => {
            this.isSyncing.set(false);
        });
    }

    protected printPDF(): void {
        this.electron.ipc.print();
    }

    protected openSecondScreen(): void {
        this.electron.ipc.openSecondScreen();
    }

    protected displayError(): void {
        this.alertCtrl.create({
            title: 'Un problème est survenu',
            message: 'Une erreur est survenue lors de la récupération des données',
            actions: [
                {
                    text: 'Ok',
                    role: 'cancel',
                },
            ],
            details: 'The property \'postingDate\' does not exist on type \'Microsoft.NAV.cashRegisterEntry\'. Make sure to only use property names that are defined by the type.  CorrelationId:  a69b4f67-2286-4bef-861a-e8cc8679f667. requestCount:0'
                + ` Une erreur de synchronisation avec Business Central s'est produite avec le message suivant :

The property 'postingDate' does not exist on type 'Microsoft.NAV.cashRegisterEntry'. Make sure to only use property names that are defined by the type.  CorrelationId:  a69b4f67-2286-4bef-861a-e8cc8679f667.
requestCount:0
    apierrorresponse.error.code:BadRequest

{"id":"0","status":400,"headers":{"content-type":"application/json"},"body":{"error":{"code":"BadRequest","message":"The property 'postingDate' does not exist on type 'Microsoft.NAV.cashRegisterEntry'. Make sure to only use property names that are defined by the type.  CorrelationId:  a69b4f67-2286-4bef-861a-e8cc8679f667."}}}

{"requests":[{"method":"POST","id":"0","url":"companies(3f64192b-eadf-ef11-9345-6045bdfb5847)/cashRegisterEntries?tenant=dev13","headers":{"content-type":"application/json"},"body":{"postingGroup":"OUVERTURE","postingDate":"2025-03-07","postingTime":"17:22:59","cashRegisterCode":"DTHI","amount":-200.0,"salespersonCode":"BL","entryType":"Opening","paymentMethodCode":"BANQUE","clientAppVersion":"1.2410.30474.1","deviceId":"067b28d4-ef8b-b393-a860-6297af9f0a62"}},{"method":"POST","id":"1","url":"companies(3f64192b-eadf-ef11-9345-6045bdfb5847)/cashRegisterEntries?tenant=dev13","headers":{"content-type":"application/json"},"body":{"postingGroup":"CLÔTURE","postingDate":"2025-03-07","postingTime":"23:59:59","cashRegisterCode":"DTHI","amount":0.0,"salespersonCode":"BL","entryType":"Closing","paymentMethodCode":"BANQUE","description":"Horodatage forcé, opération réalisée le 2025-03-10 à 11:05:58","clientAppVersion":"1.2410.30474.1","deviceId":"067b28d4-ef8b-b393-a860-6297af9f0a62"},"dependsOn":["0"]},{"method":"POST","id":"2","url":"companies(3f64192b-eadf-ef11-9345-6045bdfb5847)/cashRegisterEntries?tenant=dev13","headers":{"content-type":"application/json"},"body":{"postingGroup":"OUVERTURE","postingDate":"2025-03-10","postingTime":"11:06:04","cashRegisterCode":"DTHI","amount":0.0,"salespersonCode":"BL","entryType":"Opening","paymentMethodCode":"BANQUE","clientAppVersion":"1.2410.30474.1","deviceId":"067b28d4-ef8b-b393-a860-6297af9f0a62"},"dependsOn":["1","0"]}]}

Une erreur s'est produite lors de l'appel d'API.

Type d'appel : Batch
Identifiant de l'erreur : 0
Statut : 400.`

        });
    }
}
