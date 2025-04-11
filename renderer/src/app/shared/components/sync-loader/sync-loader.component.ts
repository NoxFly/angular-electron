import { DOCUMENT, NgIf } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, computed, ElementRef, Inject, input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ElectronService } from 'src/app/core/services/electron.service';
import { ModalController } from 'src/app/shared/components/modal/modal.controller';
import { UIComponent } from 'src/app/shared/directives/UIComponent.directive';
import { SpinnerComponent } from "../spinner/spinner.component";
import { GlobalStateService } from 'src/app/core/services/globalState.service';

@Component({
    selector: 'app-sync-loader',
    standalone: true,
    templateUrl: './sync-loader.component.html',
    styleUrls: ['./sync-loader.component.scss'],
    imports: [SpinnerComponent, NgIf],
    encapsulation: ViewEncapsulation.None,
})
export class SyncLoaderComponent extends UIComponent implements OnInit {
    public resultSuccess = input.required<boolean>();

    public readonly progress = signal<number>(0);
    public readonly message = signal<string>('');
    
    protected readonly syncState = signal<boolean | undefined>(undefined);

    protected total: number = 0;

    constructor(
        @Inject(DOCUMENT)
        document: Document,
        appRef: ApplicationRef,
        ref: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        private readonly electron: ElectronService,
        private readonly modalCtrl: ModalController,
        private readonly globalState: GlobalStateService,
    ) {
        super(document, appRef, ref, cdr);
    }

    protected syncStateMessage = computed(() => {
        if(this.syncState() === undefined) {
            return '';
        }

        return this.syncState()
            ? 'Synchronisation succeeded'
            : 'Synchronisation failed';
    });

    private onInitialized(total: number): void {
        this.message.set('Initialization of the synchronization...');
        this.progress.set(0);
    }

    private onProgress(progress: number, total: number, message?: string): void {
        if(message) {
            this.message.set(message);
        }

        this.progress.set(progress / total * 100);
    }

    private async onComplete(data: string | null, error: Error | null): Promise<void> {
        this.globalState.current.update(c => ({
            ...c,
            closable: true,
            maximizable: true,
            minimizable: true,
        }));

        this.syncState.set(this.resultSuccess() /* error === null */);
        this.message.set('Synchronisation finished');

        await (new Promise((resolve) => setTimeout(resolve, 1000)));
        this.modalCtrl.dismiss({  role: 'destructive', data: 'toto' });
    }

    public ngOnInit(): void {
        this.progress.set(0);
        this.message.set('Beginning of the synchronization...');

        this.globalState.current.update(c => ({
            ...c,
            closable: false,
            maximizable: false,
            minimizable: false,
        }));

        this.electron.ipc.sync(this.onInitialized.bind(this), this.onProgress.bind(this), this.onComplete.bind(this));
    }
}
