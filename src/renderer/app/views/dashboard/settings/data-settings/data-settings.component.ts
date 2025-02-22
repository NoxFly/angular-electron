import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-data-settings',
    standalone: true,
    templateUrl: './data-settings.component.html',
    styleUrl: './data-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class DataSettingsComponent {
    constructor() {}
}
