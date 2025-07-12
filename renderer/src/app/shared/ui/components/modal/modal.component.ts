/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @copyright Dorian Thivolle
 * @license MIT
 * @see https://github.com/NoxFly
 */

import { ChangeDetectionStrategy, Component, HostBinding, input, OnDestroy, OnInit, Type, viewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { UIComponent } from 'src/app/shared/ui/UIComponent.directive';

@Component({
    selector: 'ui-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ModalComponent extends UIComponent implements OnInit, OnDestroy {
    public component        = input.required<Type<(new () => any)>>();
    public componentProps   = input<Record<string, any>>({});
    public showBackdrop     = input<boolean>(true);
    public showDots         = input<boolean>(true);
    public backdropClose    = input<boolean>(true);
    public keyboardClose    = input<boolean>(true);

    public injectedComponent = viewChild('injectedComponent', { read: ViewContainerRef });

    private componentInstance?: Type<(new () => any)>;

    @HostBinding('class.show-dots')
    public get showDotsClass(): boolean {
        return this.showDots();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if(event.key === 'Escape') {
            this.dismiss();
        }
    }

    protected backdropClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if(this.backdropClose() && (target.classList.contains('modal') || target.classList.contains('modal-backdrop'))) {
            this.dismiss();
        }
    }

    public getComponentInstance<T>(): T | undefined {
        return this.componentInstance as T | undefined;
    }

    public ngOnDestroy(): void {
        document.body.classList.remove('modal-open');

        if(this.keyboardClose()) {
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        }

        const c = this.injectedComponent();
        c?.clear();
    }

    public ngOnInit(): void {
        const component = this.injectedComponent()?.createComponent(this.component(), {
            environmentInjector: this.appRef.injector,
        });

        if(component?.instance) {
            this.componentInstance = component.instance;

            for(const key in this.componentProps()) {
                component.setInput(key, this.componentProps()[key]);
            }
        }

        if(this.keyboardClose()) {
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        }

        document.body.classList.add('modal-open');
    }
}
