import { ApplicationRef, ChangeDetectorRef, Component, computed, effect, ElementRef, Inject, signal, ViewEncapsulation } from '@angular/core';
import { UIComponent } from 'src/app/shared/directives/UIComponent.directive';
import { SpinnerComponent } from "../spinner/spinner.component";
import { DOCUMENT, NgIf } from '@angular/common';
import { ModalController } from 'src/app/shared/components/modal/modal.controller';

@Component({
    selector: 'app-sync-loader',
    standalone: true,
    templateUrl: './sync-loader.component.html',
    styleUrls: ['./sync-loader.component.scss'],
    imports: [SpinnerComponent, NgIf],
    encapsulation: ViewEncapsulation.None,
})
export class SyncLoaderComponent extends UIComponent {
    public readonly progress = signal<number>(0);
    public readonly message = signal<string>('');
    
    protected readonly syncState = signal<boolean | undefined>(undefined);

    constructor(
        @Inject(DOCUMENT)
        document: Document,
        appRef: ApplicationRef,
        ref: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        private readonly modalCtrl: ModalController,
    ) {
        super(document, appRef, ref, cdr);
    }

    public async setState(state: boolean): Promise<void> {
        this.syncState.set(state);
        await (new Promise((resolve) => setTimeout(resolve, 1000)));     
        this.modalCtrl.dismiss({  role: 'destructive', data: 'toto' });
    }

    protected syncStateMessage = computed(() => {
        if(this.syncState() === undefined) {
            return '';
        }

        return this.syncState()
            ? 'Synchronisation terminée'
            : 'Erreur lors de la synchronisation';
    });
}
