import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-preferences-settings',
    standalone: true,
    templateUrl: './preferences-settings.component.html',
    styleUrls: ['./preferences-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class PreferencesSettingsComponent {
    constructor() {}
}
