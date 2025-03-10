import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, WebContentsPrintOptions } from 'electron/main';

export class PrintingService {
    constructor() {
        ipcMain.handle('print', () => this.printDocument());
    }

    private async printDocument(): Promise<void> {
        throw new Error("toto");

        const focusedWindow = BrowserWindow.getFocusedWindow();

        const printers = await focusedWindow?.webContents.getPrintersAsync() ?? [];

        if(!printers.some(p => p.isDefault)) {
            throw new Error('No default printer found');
        }

        const win = new BrowserWindow(printingWindowOptions);
        const b64 = `data:application/pdf;base64,${''}`;

        win.loadURL(b64);

        win.webContents.once('did-finish-load', () => {
            setTimeout(() => {
                win.webContents.print(defaultPrintOptions, (success, failureReason) => {
                    if(!success) {
                        win.close();
                        throw new Error(failureReason);
                    }

                    setTimeout(() => {
                        win.close();
                    }, 5000);
                });
            }, 2000);
        });

        win.webContents.once('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
            console.error('Failed to load PDF', errorCode, errorDescription, validatedURL, isMainFrame);
            win.close();
            throw new Error('Failed to load PDF');
        });
    }

}


const printingWindowOptions: BrowserWindowConstructorOptions = {
    show: false,
    webPreferences: {
        devTools: false,
    },
    closable: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    minimizable: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    title: 'PDF Print View',
};


const defaultPrintOptions: WebContentsPrintOptions = {
    silent: true,
    color: true,
    copies: 1,
    pageSize: 'A4',
    printBackground: false,
    collate: true,
    margins: {
        marginType: 'default'
    },
    duplexMode: 'simplex',
    dpi: {
        horizontal: 600,
        vertical: 600
    },
    landscape: false,
    pagesPerSheet: 1,
};
