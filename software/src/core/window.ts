import { shell } from "electron/common";
import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen } from "electron/main";
import { join } from 'node:path';
import { environment } from "core/environment";
import { Maybe } from "core/types/misc";


const defaultWindowOptions: BrowserWindowConstructorOptions = {
    webPreferences: {
        devTools: !environment.production,
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(environment.rootDir, 'core/preload.js'),
    },
    center: true,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    frame: false,
    icon: join(environment.publicDir, 'favicon.ico'),
    minHeight: 750,
    minWidth: 950,
    resizable: false,
};


export class WindowManager {
    private mainWindow: Maybe<BrowserWindow> = null;
    private secondaryWindow: Maybe<BrowserWindow> = null;

    constructor() {
        this.setupBridge();
    }

    private setupBridge(): void {
        ipcMain.handle("close-app", () => {
            const win = BrowserWindow.getFocusedWindow();

            if(!win) {
                return;
            }

            if(win.id === this.mainWindow?.id) {
                this.closeMain();
                app.quit();
                return;
            }

            else if(win.id === this.secondaryWindow?.id) {
                this.closeSecondary();
                return;
            }

            win.close();
        });

        ipcMain.handle('reduce-app', () => {
            const win = BrowserWindow.getFocusedWindow();
            win?.minimize();
        });

        ipcMain.handle('toggle-fullscreen', () => {
            const win = BrowserWindow.getFocusedWindow();
            win?.setFullScreen(!win.isFullScreen());
        });

        ipcMain.handle('open-second-screen', () => {
            this.createSecondary();
        });

        ipcMain.handle('get-titlebar-state', () => {
            const win = BrowserWindow.getFocusedWindow();

            return {
                minimizable: win?.isMinimizable(),
                maximizable: win?.isMaximizable(),
                closable: win?.isClosable(),
            };
        });
    }

    private async loadWindow(window: BrowserWindow, cb?: (() => void) | null, launchPage?: string): Promise<void> {
        launchPage ||= '';

        window.once('ready-to-show', () => {
            cb?.();
            window?.show();
        });

        // ouvre les liens _target="blank" (externes) dans le navigateur par défaut
        window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });

        const url = environment.production
            ? `file://${join(environment.rootDir, 'browser/index.html')}`
            : 'http://localhost:4200/' + launchPage;

        await window.loadURL(url);

        if(environment.production && launchPage) {
            window.webContents.send('navigate-to', launchPage);
        }
    }


    public get main(): Maybe<BrowserWindow> {
        return this.mainWindow;
    }

    public get secondary(): Maybe<BrowserWindow> {
        return this.secondaryWindow;
    }

    public isMain(webContentsId: number): boolean {
        return this.mainWindow?.webContents.id === webContentsId;
    }

    public isSecondary(webContentsId: number): boolean {
        return this.secondaryWindow?.webContents.id === webContentsId;
    }

    public async createMain(): Promise<void> {
        if(this.mainWindow) {
            return;
        }

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;

        const win = new BrowserWindow({
            ...defaultWindowOptions,
            width: Math.min(width, defaultWindowOptions.minWidth!),
            height: Math.min(height, defaultWindowOptions.minHeight!),
        });

        this.mainWindow = win;

        await this.loadWindow(win);
        this.mainWindow?.webContents.openDevTools();
    }

    public async createSecondary(): Promise<void> {
        if(!this.mainWindow || this.secondaryWindow) {
            return;
        }

        const displays = screen.getAllDisplays();
        const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0);

        if(!externalDisplay) {
            return;
        }

        const win = new BrowserWindow({
            ...defaultWindowOptions,
            parent: this.mainWindow,
            center: false,
            fullscreen: true,
            movable: false,
            width: externalDisplay.workAreaSize.width,
            height: externalDisplay.workAreaSize.height,
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
        });

        this.secondaryWindow = win;

        await this.loadWindow(win, null, 'login');
    }

    public closeMain(): void {
        this.mainWindow?.close();
        this.mainWindow = null;
    }

    public closeSecondary(): void {
        this.secondaryWindow?.close();
        this.secondaryWindow = null;
    }
}
