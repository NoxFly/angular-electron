import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private readonly bridge: any;

    public hasSecondScreen = signal(false);

    constructor() {
        this.bridge = window as any;

        this.ipcRenderer.onSecondScreenDetectionChanged((state: boolean) => {
            this.hasSecondScreen.set(state);
        });
    }

    public get ipcRenderer(): any {
        return this.bridge.ipcRenderer || {};
    }

    public get isElectronApp(): boolean {
        return !!window.navigator.userAgent.match(/Electron/);
    }
}
