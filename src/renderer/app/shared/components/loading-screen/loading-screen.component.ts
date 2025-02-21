import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-loading-screen',
    standalone: true,
    templateUrl: './loading-screen.component.html',
    styleUrl: './loading-screen.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [SpinnerComponent, NgIf],

})
export class LoadingScreenComponent {
    @Input() public message?: string;

    protected applicationName: string = 'Electron Angular';

    constructor() {}
}
