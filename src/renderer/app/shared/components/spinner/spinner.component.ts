import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-spinner',
    standalone: true,
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class SpinnerComponent {
    public color = input<string>('');

    constructor() {}
}
