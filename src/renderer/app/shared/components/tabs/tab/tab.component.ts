import { Component, input, Type } from '@angular/core';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrl: './tab.component.scss',
    standalone: true,
    imports: [],
})
export class TabComponent {
    public component    = input.required<Type<any>>();
    public disabled     = input<boolean>(false);
    public label        = input<string>('');
    public icon         = input<string>('');
    public badge        = input<string>('');
    public badgeColor   = input<string>('');
    public default      = input<boolean>(false);
}
