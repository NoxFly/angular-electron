import { NgFor, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { UIComponent } from '../../directives/UIComponent.directive';
import { UIAction } from '../../types/ui.types';



@Component({
    selector: 'app-alert',
    standalone: true,
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    imports: [NgFor, NgIf],
})
export class AlertComponent extends UIComponent {
    protected readonly defaultActions: UIAction[] = [
        {
            text: 'Ok',
            role: 'cancel',
            handler: (self) => this.dismiss({ role: self.role })
        }
    ];

    public title    = input<string>();
    public message  = input<string>();
    public actions  = input<UIAction[]>(this.defaultActions);

    protected get hasActions(): boolean {
        return this.actions !== undefined && this.actions.length > 0;
    }
}
