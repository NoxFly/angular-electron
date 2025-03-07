import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalStateService } from '../../../core/services/globalState.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf],
})
export class HomeComponent {
    protected title = 'Electron Angular';

    constructor(
        protected readonly globalState: GlobalStateService,
    ) {}
}
