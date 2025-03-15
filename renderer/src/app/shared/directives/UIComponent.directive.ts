import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, ComponentRef, createComponent, Directive, ElementRef, HostBinding, Inject, Injectable, input, output, Type } from '@angular/core';
import { UIAction, UIConfig, UIDismissData } from 'src/app/shared/types/ui.types';


@Directive({
    standalone: true,
})
export abstract class UIComponent {
    public classes = input<string>('');
    public id = input<string>('');

    public willDismiss = output<UIDismissData>();
    public didDismiss = output<UIDismissData>();

    public componentRef!: ComponentRef<UIComponent>;

    @HostBinding('class.disappearing')
    protected disappearing: boolean = false;

    @HostBinding('class')
    protected get hostClasses(): string {
        return `${this.classes()}`;
    }

    @HostBinding('attr.id')
    protected get hostId(): string {
        return this.id();
    }

    constructor(
        @Inject(DOCUMENT)
        protected readonly document: Document,
        protected readonly appRef: ApplicationRef,
        protected readonly ref: ElementRef<HTMLElement>,
        protected readonly cdr: ChangeDetectorRef,
    ) {}

    public dismiss(e?: Partial<UIDismissData>): void {
        const defaultData: UIDismissData = { role: 'none', data: undefined };
        const d = Object.assign(defaultData, e);

        this.willDismiss.emit(d);

        const onAnimationEnd = (): void => {
            this.document.body.removeChild(this.ref.nativeElement);
            this.appRef.detachView(this.componentRef.hostView);
            this.didDismiss.emit(d);
            console.log('dismissed');
        };
        console.log('dismiss');
        this.disappearing = true;
        this.cdr.detectChanges();
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

    protected async instanciate(component: Type<T>, config: C): Promise<T> {
        const componentRef: ComponentRef<T> = createComponent(component, {
            environmentInjector: this.appRef.injector,
        });

        for(const key in config) {
            if(config[key] !== undefined) {
                componentRef.setInput(key, config[key]);
            }
        }

        this.appRef.attachView(componentRef.hostView);

        const uiEl = (componentRef.hostView as any).rootNodes[0];

        this.document.body.appendChild(uiEl);
        uiEl.dataset.uiName = this.constructor.name.replace(/Controller|_/g, '').toLowerCase();
        uiEl.dismiss = componentRef.instance.dismiss.bind(componentRef.instance);

        (componentRef.instance as UIComponent).componentRef = componentRef;

        await (() => new Promise<void>((resolve) => setTimeout(resolve, 2)))();

        return componentRef.instance;
    }

    public abstract create(config: C): Promise<T>;

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
