import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabComponent } from 'src/app/shared/components/tabs/tab/tab.component';
import { TabsComponent } from 'src/app/shared/components/tabs/tabs.component';
import { AboutSettingsComponent } from './about-settings/about-settings.component';
import { CashSettingsComponent } from './cash-settings/cash-settings.component';
import { DataSettingsComponent } from './data-settings/data-settings.component';
import { PreferencesSettingsComponent } from './preferences-settings/preferences-settings.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TabComponent, TabsComponent],
})
export class SettingsComponent {
    protected aboutComponent = AboutSettingsComponent;
    protected cashComponent = CashSettingsComponent;
    protected dataComponent = DataSettingsComponent;
    protected prefComponent = PreferencesSettingsComponent;

    constructor() {}
}
