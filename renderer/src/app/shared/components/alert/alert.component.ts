import { NgFor, NgIf } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { UIComponent } from 'src/app/shared/directives/UIComponent.directive';
import { UIAction } from 'src/app/shared/types/ui.types';

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

    protected hasActions = computed(() => this.actions().length > 0);
}
