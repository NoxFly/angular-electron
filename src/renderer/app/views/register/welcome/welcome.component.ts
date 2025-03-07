import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, output, signal, viewChild, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { ToastController } from '../../../shared/components/toast/toast.controller';
import { readJsonFileAsync } from '../../../shared/helpers/global.helper';
import { ToastConfig } from '../../../shared/types/ui.types';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [NgIf, NgFor, RouterLink],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements AfterViewInit {
    public readonly configImported = output<{ isSaas: boolean; config: any; }>();

    protected steps = viewChildren<ElementRef<HTMLElement>>('step');
    protected slider = viewChild<ElementRef<HTMLElement>>('slider');
    protected configInput = viewChild<ElementRef<HTMLElement>>('configInput');

    protected helpLinkSaas = "https://businesscentral.dynamics.com/?page=70344953";
    protected helpLinkDoc = "https://docs.capvision-cloud.fr/fr-FR/cherrycommerce/user-guide-bc-cash-registers.html";
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

        this.globalState.current.showTitlebar = false;
        this.draggingOver.set(true);
    }

    protected onDragLeave(): void {
        this.globalState.current.showTitlebar = true;
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
        const isSaas = "tenantId" in config;

        if(isSaas) {
            if(!config['tenantId'] || !config['environment'] || !config['company'] || !config['cashRegisterCode']) {
                this.onFileImportError(0);
                throw new Error('Invalid file content');
            }
        }
        // saas
        else {
            if(!config['tenant'] || !config['instance'] || !config['company'] || !config['server'] || !config['port'] || !config['cashRegisterCode']) {
                this.onFileImportError(0);
                throw new Error('Invalid file content');
            }
        }

        this.configImported.emit({ isSaas, config });
    }

    private onFileImportError(code: number): void {
        const getToastConfig = (): ToastConfig | undefined => {
            switch(code) {
                case 0:
                    return {
                        message: 'Le contenu du fichier est invalide',
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
}
