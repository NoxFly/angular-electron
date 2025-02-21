import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-desktop',
    standalone: true,
    templateUrl: './not-desktop.component.html',
    styleUrl: './not-desktop.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class NotDesktopComponent {
    constructor() {

    }

}
