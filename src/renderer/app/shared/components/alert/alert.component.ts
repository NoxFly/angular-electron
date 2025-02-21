import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UIComponent } from '../../directives/UIComponent.directive';
import { UIAction } from '../../types/ui.types';



@Component({
    selector: 'app-alert',
    standalone: true,
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    imports: [NgFor, NgIf],
    encapsulation: ViewEncapsulation.Emulated,
})
export class AlertComponent extends UIComponent implements OnInit {
    @Input()
    public title?: string;

    @Input()
    public message?: string;

    @Input()
    public actions?: UIAction[];

    protected get hasActions(): boolean {
        return this.actions !== undefined && this.actions.length > 0;
    }

    public ngOnInit(): void {
        if(this.actions === undefined) {
            this.actions = [
                {
                    text: 'Ok',
                    role: 'cancel',
                    handler: (self) => this.dismiss({ role: self.role })
                }
            ];
        }
    }
}
