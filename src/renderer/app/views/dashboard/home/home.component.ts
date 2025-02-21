import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { AlertController } from '../../../shared/components/alert/alert.controller';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgIf],
})
export class HomeComponent {
    protected title = 'Electron Angular';

    constructor(
        protected readonly globalState: GlobalStateService,
        private readonly alertCtrl: AlertController,
    ) {}
}
