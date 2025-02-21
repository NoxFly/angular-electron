import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UIComponent } from '../../directives/UIComponent.directive';
import { ToastPosition, UIAction, UIColor } from '../../types/ui.types';



@Component({
    selector: 'app-toast',
    standalone: true,
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    imports: [NgFor, NgIf],
    encapsulation: ViewEncapsulation.Emulated,
})
export class ToastComponent extends UIComponent implements OnInit {
    @Input({ required: true })
    public message!: string;

    @Input()
    public duration?: number;

    @Input()
    public color?: UIColor;

    @Input()
    public closable?: boolean;

    @Input()
    public position?: ToastPosition;

    @Input()
    public actions?: UIAction[];


    @HostBinding('attr.data-toast-type')
    public get colorClass(): string {
        return this.color || 'medium';
    }

    @HostBinding('attr.data-toast-position')
    public get positionClass(): string {
        return this.position || 'top-center';
    }


    protected get hasActions(): boolean {
        return this.actions !== undefined && this.actions.length > 0;
    }

    protected get hasDuration(): boolean {
        return this.duration !== undefined;
    }

    public ngOnInit(): void {
        if(this.hasDuration) {
            this.ref.nativeElement.style.setProperty('--toast-duration', `${this.duration}ms`);
            this.ref.nativeElement.classList.add('ephemeral');

            this.ref.nativeElement.addEventListener('animationend', () => {
                this.dismiss();
            }, { once: true });
        }
    }
}
