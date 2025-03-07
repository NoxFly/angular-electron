import { NgIf } from '@angular/common';
import { Component, input, OnDestroy, OnInit, Type, viewChild, ViewContainerRef } from '@angular/core';
import { UIComponent } from '../../directives/UIComponent.directive';

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


    public ngOnDestroy(): void {
        const c = this.injectedComponent();

        if(!c) {
            return;
        }

        c.clear();
        this.appRef.detachView(c.get(0)!);
    }

    public ngOnInit(): void {
        console.log(this.injectedComponent());
        const component = this.injectedComponent()?.createComponent(this.component(), {
            environmentInjector: this.appRef.injector,
        });

        if(component?.instance) {
            Object.assign(component.instance, this.componentProps);
        }
    }
}
