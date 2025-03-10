import { NgIf } from '@angular/common';
import { Component, input, ViewEncapsulation } from '@angular/core';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
    selector: 'app-loading-screen',
    standalone: true,
    templateUrl: './loading-screen.component.html',
    styleUrl: './loading-screen.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [SpinnerComponent, NgIf],

})
export class LoadingScreenComponent {
    public message = input<string>();

    protected applicationName: string = 'Electron Angular';

    constructor() {}
}
