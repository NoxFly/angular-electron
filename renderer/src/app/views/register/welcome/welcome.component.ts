import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, output, signal, viewChild, viewChildren } from '@angular/core';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { ToastController } from 'src/app/shared/components/toast/toast.controller';
import { readJsonFileAsync } from 'src/app/shared/helpers/global.helper';
import { ToastConfig } from 'src/app/shared/types/ui.types';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [NgIf, NgFor],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit, AfterViewInit {
    public readonly configImported = output<{ isSaas: boolean; config: any; }>();

    protected steps = viewChildren<ElementRef<HTMLElement>>('step');
    protected slider = viewChild<ElementRef<HTMLElement>>('slider');
    protected configInput = viewChild<ElementRef<HTMLElement>>('configInput');
    protected container = viewChild.required<ElementRef<HTMLElement>>('container');

    protected helpLinkSaas = "https://google.fr";
    protected helpLinkDoc = "https://google.fr";
    protected currentStep: number = 0;
    protected draggingOver = signal(false);
    protected showPart = signal(0);
    protected viewLoaded = signal(false);

    constructor(
        private readonly globalState: GlobalStateService,
        private readonly toastCtrl: ToastController,
    ) {}

    protected clickOnInput(): void {
        this.configInput()?.nativeElement.click();
    }

    protected onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.readImportedConfig(file);
    }

    protected nextStep(): void {
        if(this.currentStep === this.steps.length - 1) {
            return;
        }

        this.scrollToCurrentStep(1);
    }

    protected previousStep(): void {
        if(this.currentStep === 0) {
            return;
        }

        this.scrollToCurrentStep(-1);
    }

    protected onDragOver(event: DragEvent): void {
        if(event.dataTransfer?.items[0]?.type !== 'application/json') {
            return;
        }

        event.preventDefault();

        this.globalState.current.update(c => ({
            ...c,
            showTitlebar: false,
        }));
        this.draggingOver.set(true);
    }

    protected onDragLeave(): void {
        this.globalState.current.update(c => ({
            ...c,
            showTitlebar: true,
        }));
        this.draggingOver.set(false);
    }

    protected onDrop(event: DragEvent): void {
        event.preventDefault();

        const file = event.dataTransfer?.files[0];

        this.onDragLeave();
        this.readImportedConfig(file);
    }

    private scrollToCurrentStep(v: -1 | 1): void {
        this.steps()[this.currentStep]?.nativeElement.classList.remove('active');
        this.currentStep += v;
        this.steps()[this.currentStep]?.nativeElement.classList.add('active');
        this.slider()!.nativeElement.style.transform = `translateX(calc(-${this.currentStep}00% - ${this.currentStep * 10}px))`;
    }

    private async readImportedConfig(file?: File): Promise<void> {
        if(!file) {
            return;
        }

        const config = await readJsonFileAsync(file);

        if(!config['id']) {
            this.onFileImportError(0);
            throw new Error('Invalid file content');
        }

        this.configImported.emit({ isSaas: false, config });
    }

    private onFileImportError(code: number): void {
        const getToastConfig = (): ToastConfig | undefined => {
            switch(code) {
                case 0:
                    return {
                        message: 'Invalid file content',
                    };
            }

            return undefined;
        };

        const config = getToastConfig();

        if(config) {
            config.duration = 3000;
            config.color = 'error';

            this.toastCtrl.create(config);
        }
    }

    public ngAfterViewInit(): void {
        this.viewLoaded.set(true);
        this.steps()[this.currentStep]?.nativeElement.classList.add('active');
    }

    public ngOnInit(): void {
        this.container().nativeElement.addEventListener('dragover', this.onDragOver.bind(this), { capture: true });
        this.container().nativeElement.addEventListener('dragleave', this.onDragLeave.bind(this), { capture: true });
    }
}
