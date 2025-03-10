import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private readonly bridge: any;

    constructor() {
        this.bridge = window as any;
    }

    public get ipcRenderer(): any {
        return this.bridge.ipcRenderer || {};
    }

    public get isElectronApp(): boolean {
        return !!window.navigator.userAgent.match(/Electron/);
    }
}
