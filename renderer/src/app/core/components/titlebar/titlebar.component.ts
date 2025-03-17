import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalStateService } from 'src/app/core/services/globalState.service';
import { ElectronService } from 'src/app/core/services/electron.service';

@Component({
    selector: 'app-titlebar',
    standalone: true,
    templateUrl: './titlebar.component.html',
    styleUrl: './titlebar.component.scss',
    imports: [NgIf],
})
export class TitlebarComponent {
    protected applicationName: string = 'Electron Angular';

    constructor(
        private readonly electron: ElectronService,
        protected readonly globalState: GlobalStateService,
    ) {}

    public closeApp(): void {
        this.electron.ipc.close();
    }

    public reduceApp(): void {
        this.electron.ipc.reduce();
    }

    public toggleFullscreen(): void {
        this.electron.ipc.toggleFullscreen();
    }
}
