import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ElectronService, HttpMethod } from 'src/app/core/services/electron.service';
import { ButtonComponent } from 'src/app/shared/ui/components/button/button.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent],
})
export class HomeComponent {
    constructor(
        private readonly electron: ElectronService,
    ) {
        console.log('HomeComponent initialized');
    }

    protected async onButtonClick(method: HttpMethod, path: string): Promise<void> {
        // Send a message to the main process via the port
        const response = await this.electron.request({
            path,
            method,
            body: {}
        });

        console.log(response);
    }
}
