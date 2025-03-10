import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-not-desktop',
    standalone: true,
    templateUrl: './not-desktop.component.html',
    styleUrl: './not-desktop.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class NotDesktopComponent {
    constructor() {

    }

}
