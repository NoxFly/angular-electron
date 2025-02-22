import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-preferences-settings',
    standalone: true,
    templateUrl: './preferences-settings.component.html',
    styleUrl: './preferences-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class PreferencesSettingsComponent {
    constructor() {}
}
