import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectOptionComponent } from 'src/app/shared/components/select/select-option/select-option.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';

@Component({
    selector: 'app-about-settings',
    standalone: true,
    templateUrl: './about-settings.component.html',
    styleUrls: ['./about-settings.component.scss', '../settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SelectComponent, SelectOptionComponent],
})
export class AboutSettingsComponent {
    constructor() {}
}
