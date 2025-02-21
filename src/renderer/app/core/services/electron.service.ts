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

    // process ?
    /* public get isMacOS(): boolean {
        return this.isElectronApp && process.platform === 'darwin';
    }

    public get isWindows(): boolean {
        return this.isElectronApp && process.platform === 'win32';
    }

    public get isLinux(): boolean {
        return this.isElectronApp && process.platform === 'linux';
    }

    public get isX86(): boolean {
        return this.isElectronApp && process.arch === 'ia32';
    }

    public get isX64(): boolean {
        return this.isElectronApp && process.arch === 'x64';
    }

    public get isArm(): boolean {
        return this.isElectronApp && process.arch === 'arm';
    } */

    public get desktopCapturer(): any {
        return this.bridge.desktopCapturer;
    }

    public get remote(): any {
        return this.bridge.remote;
    }

    public get webFrame(): any {
        return this.bridge.webFrame;
    }

    public get clipboard(): any {
        return this.bridge.clipboard;
    }

    public get crashReporter(): any {
        return this.bridge.crashReporter;
    }

    public get process(): any {
        return this.bridge.process;
    }

    public get nativeImage(): any {
        return this.bridge.nativeImage;
    }

    public get screen(): any {
        return this.bridge.screen;
    }

    public get shell(): any {
        return this.bridge.shell;
    }
}
