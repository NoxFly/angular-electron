import { DOCUMENT, NgIf } from '@angular/common';
import { ApplicationRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { UIComponent } from '../../directives/UIComponent.directive';

@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    imports: [NgIf],
})
export class ModalComponent extends UIComponent implements OnInit, OnDestroy {
    @Input({ required: true })
    public component!: Type<(new () => any)>;

    @Input()
    public componentProps: Record<string, any> = {};

    @Input()
    public showBackdrop: boolean = true;

    @Input()
    public showDots: boolean = true;

    @Input()
    public backdropClose: boolean = true;

    @Input()
    public keyboardClose: boolean = true;


    @ViewChild("injectedComponent", { read: ViewContainerRef, static: true })
    public injectedComponent!: ViewContainerRef;

    constructor(
        @Inject(DOCUMENT)
        document: Document,
        ref: ElementRef<HTMLElement>,

        protected readonly appRef: ApplicationRef,
    ) {
        super(document, ref);
    }

    public ngOnDestroy(): void {

    }

    public ngOnInit(): void {
        const component = this.injectedComponent.createComponent(this.component, {
            environmentInjector: this.appRef.injector,
        });

        if(component.instance) {
            Object.assign(component.instance, this.componentProps);
        }
    }
}
