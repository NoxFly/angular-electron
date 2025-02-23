import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-data-settings',
    standalone: true,
    templateUrl: './data-settings.component.html',
    styleUrls: ['./data-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class DataSettingsComponent {
    constructor() {}
}
