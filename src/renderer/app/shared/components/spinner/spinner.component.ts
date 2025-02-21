import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-spinner',
    standalone: true,
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class SpinnerComponent {
    @Input()
    public color?: string = '';

    constructor() {}
}
