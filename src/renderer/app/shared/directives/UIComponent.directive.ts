import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentRef, createComponent, Directive, ElementRef, EventEmitter, HostBinding, Inject, Injectable, Input, Output, Type } from '@angular/core';
import { UIAction, UIConfig, UIDismissData } from '../types/ui.types';


@Directive({
    standalone: true,
})
export abstract class UIComponent {
    @Input()
    public classes: string = '';

    @Input()
    public id: string = '';

    @Output()
    public willDismiss = new EventEmitter<UIDismissData>();

    @Output()
    public didDismiss = new EventEmitter<UIDismissData>();

    @HostBinding('class.disappearing')
    protected disappearing: boolean = false;

    @HostBinding('class')
    protected get hostClasses(): string {
        return `${this.classes}`;
    }

    @HostBinding('attr.id')
    protected get hostId(): string {
        return this.id;
    }

    constructor(
        @Inject(DOCUMENT)
        protected readonly document: Document,
        protected readonly ref: ElementRef<HTMLElement>,
    ) {}

    public dismiss(e?: Partial<UIDismissData>): void {
        const defaultData: UIDismissData = { role: 'none', data: undefined };
        const d = Object.assign(defaultData, e);

        this.willDismiss.emit(d);

        const onAnimationEnd = (): void => {
            this.document.body.removeChild(this.ref.nativeElement);
            this.didDismiss.emit(d);
        };

        this.disappearing = true;
        this.ref.nativeElement.addEventListener('animationend', onAnimationEnd, { once: true });
    }

    protected onActionClicked(action: UIAction): void {
        action.handler?.(action);

        if(action.role === 'cancel') {
            this.dismiss({ role: action.role });
        }
    }

    protected getButtonRoleClass(action: UIAction): string {
        switch(action.role) {
            case 'cancel': return 'cancel';
            case 'confirm': return 'primary';
            case 'destructive': return 'danger';
            default: return 'classic';
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export abstract class UIController<T extends UIComponent, C extends UIConfig> {
    constructor(
        @Inject(DOCUMENT)
        private readonly document: Document,
        private readonly appRef: ApplicationRef,
    ) {}

    protected instanciate(component: Type<T>, config: UIConfig, instanceFeedFn: (instance: T) => void): T {
        const componentRef: ComponentRef<T> = createComponent(component, {
            environmentInjector: this.appRef.injector,
        });

        componentRef.instance.id = config.id || '';
        componentRef.instance.classes = config.classes || '';

        instanceFeedFn(componentRef.instance);
        this.appRef.attachView(componentRef.hostView);

        const uiEl = (componentRef.hostView as any).rootNodes[0];

        this.document.body.appendChild(uiEl);
        uiEl.dataset.uiName = this.constructor.name.replace(/Controller|_/g, '').toLowerCase();
        uiEl.dismiss = componentRef.instance.dismiss.bind(componentRef.instance);

        return componentRef.instance;
    }

    public abstract create(config: C): T;

    /**
     * Dissmisses the top-most current UIComponent
     */
    public dismiss(e?: Partial<UIDismissData>): void {
        const componentName = this.constructor.name.replace(/Controller|_/g, '').toLowerCase();
        const children = this.document.body.querySelectorAll(`[data-ui-name="${componentName}"]`);
        const lastChild = children[children.length - 1] as any;
        lastChild?.dismiss(e);
    }
}
