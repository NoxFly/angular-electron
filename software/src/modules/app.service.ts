import { ipcMain, screen } from "electron/main";
import { WindowManager } from "core/window";
import { Injectable, IApp } from "@noxfly/noxus";

@Injectable("singleton")
export class Application implements IApp {
    constructor(
        private readonly windowManager: WindowManager,
    ) {}

    public async onReady(): Promise<void> {
        this.setupBridge();
        this.window.createMain();
    }

    public async dispose(): Promise<void> {

    }

    public get window(): WindowManager {
        return this.windowManager;
    }

    private setupBridge(): void {
        ipcMain.handle("load-app", async (e, ...args) => await this.loadApp(e, args));

        this.windowManager.setupBridge();
    }

    private async loadApp(e: Electron.IpcMainInvokeEvent, args: any[]): Promise<any> {
        if(this.window.isMain(e.sender.id)) {
            this.window.main?.webContents.send('second-screen-detection-changed', screen.getAllDisplays().length > 1);

            await (async () => new Promise((resolve) => setTimeout(resolve, 2000)))();

            return {
                windowType: 'primary',
            };
        }

        return {
            windowType: 'secondary',
        };
    }
}
