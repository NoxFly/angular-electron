import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-about-settings',
    standalone: true,
    templateUrl: './about-settings.component.html',
    styleUrl: './about-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class AboutSettingsComponent {
    constructor() {}
}
