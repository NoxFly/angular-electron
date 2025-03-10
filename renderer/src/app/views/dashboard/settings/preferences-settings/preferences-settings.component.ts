import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectOptionComponent } from 'src/app/shared/components/select/select-option/select-option.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';

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
