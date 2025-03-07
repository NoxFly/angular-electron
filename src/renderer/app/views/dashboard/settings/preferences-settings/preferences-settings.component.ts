import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { SelectOptionComponent } from '../../../../shared/components/select/select-option/select-option.component';

@Component({
    selector: 'app-preferences-settings',
    standalone: true,
    templateUrl: './preferences-settings.component.html',
    styleUrls: ['./preferences-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SelectComponent, SelectOptionComponent],
})
export class PreferencesSettingsComponent {
    constructor() {}
}
