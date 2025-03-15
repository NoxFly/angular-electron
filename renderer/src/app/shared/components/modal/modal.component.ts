import { NgIf } from '@angular/common';
import { Component, input, OnDestroy, OnInit, Type, viewChild, ViewContainerRef } from '@angular/core';
import { UIComponent } from 'src/app/shared/directives/UIComponent.directive';

@Component({
    selector: 'app-modal',
    standalone: true,
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    imports: [NgIf],
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


    public ngOnDestroy(): void {
        const c = this.injectedComponent();

        if(!c) {
            return;
        }

        c.clear();
        this.appRef.detachView(c.get(0)!);
    }

    public getComponentInstance<T>(): T | undefined {
        return this.componentInstance as T | undefined;
    }

    public ngOnInit(): void {
        const component = this.injectedComponent()?.createComponent(this.component(), {
            environmentInjector: this.appRef.injector,
        });

        if(component?.instance) {
            this.componentInstance = component.instance;

            for(const key in this.componentProps) {
                component.setInput(key, this.componentProps[key]);
            }
        }
    }
}
