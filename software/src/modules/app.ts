import { WindowManager } from "core/window";
import { ipcMain, screen } from "electron/main";
import { AuthenticationService } from "modules/authentication";
import { PrintingService } from "modules/extensions/printing";
import { SyncingService } from "modules/extensions/sync";

export class App {
    private readonly windowManager = new WindowManager();
    private readonly printing = new PrintingService();
    private readonly auth = new AuthenticationService();
    private readonly sync = new SyncingService();

    constructor() {
        this.setupBridge();
    }

    public async dispose(): Promise<void> {

    }

    public get window(): WindowManager {
        return this.windowManager;
    }

    private setupBridge(): void {
        ipcMain.handle("load-app", async (e, ...args) => await this.loadApp(e, args));
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
