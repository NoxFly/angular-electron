import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { readJsonFileAsync } from '../../../shared/helpers/global.helper';
import { ToastController } from '../../../shared/components/toast/toast.controller';
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
    protected helpLinkSaas = "https://businesscentral.dynamics.com/?page=70344953";
    protected helpLinkDoc = "https://docs.capvision-cloud.fr/fr-FR/cherrycommerce/user-guide-bc-cash-registers.html";
    protected currentStep: number = 0;
    protected draggingOver = signal(false);
    protected showPart = signal(0);

    @Output()
    private readonly configImported = new EventEmitter<{ isSaas: boolean; config: any; }>();

    @ViewChildren('step')
    protected steps!: QueryList<ElementRef<HTMLElement>>;
    protected viewLoaded = signal(false);

    @ViewChild('slider')
    protected slider!: ElementRef<HTMLElement>;

    @ViewChild('configInput')
    protected configInput!: ElementRef<HTMLInputElement>;

    constructor(
        private readonly globalState: GlobalStateService,
        private readonly toastCtrl: ToastController,
    ) {
        this.globalState.current.maximizable = false;
        this.globalState.current.minimizable = false;
    }

    protected clickOnInput(): void {
        this.configInput.nativeElement.click();
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
        this.steps.get(this.currentStep)?.nativeElement.classList.remove('active');
        this.currentStep += v;
        this.steps.get(this.currentStep)?.nativeElement.classList.add('active');
        this.slider.nativeElement.style.transform = `translateX(calc(-${this.currentStep}00% - ${this.currentStep * 10}px))`;
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
        this.steps.get(this.currentStep)?.nativeElement.classList.add('active');
    }
}
