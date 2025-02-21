import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalStateService } from '../../../core/services/globalState.service';
import { ElectronService } from '../../services/electron.service';

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
        this.electron.ipcRenderer.close();
    }

    public reduceApp(): void {
        this.electron.ipcRenderer.reduce();
    }

    public toggleFullscreen(): void {
        this.electron.ipcRenderer.toggleFullscreen();
    }
}
