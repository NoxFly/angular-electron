import { RootInjector } from "core/engine/appInjector";
import { Request, Response } from "core/engine/request";
import { Router } from "core/engine/router";
import { ipcMain } from "electron";
import { app, BrowserWindow } from "electron/main";
import { App } from "core/app";

export function bootstrapApplication(): void {
    app.whenReady().then(init);
}

async function init(): Promise<void> {
    const application: App = RootInjector.resolve(App);

    ipcMain.on('port', (event) => {
        const [port] = event.ports;
        const router = RootInjector.resolve(Router);

        port?.on('message', event => onClientMessage(application, router, event, port));
    });

    app.once('activate', onAppActivated.bind(null, application));
    app.once('window-all-closed', onAllWindowsClosed.bind(null, application));

    await application.window.createMain();
}

async function onClientMessage(application: App, router: Router, event: Electron.MessageEvent, port: Electron.MessagePortMain): Promise<void> {
    const { path, method, body } = event.data;

    const request = new Request(application, event, port, method, path, body);
    
    try {
        const response = await router.handle(request);
        port.postMessage(response);
    }
    catch(err: any) {
        const response: Response = {
            status: 500,
            body: null,
            error: err.message || 'Internal Server Error',
        };

        port.postMessage(response);
    }
}

function onAppActivated(application: App): void {
    if(BrowserWindow.getAllWindows().length === 0) {
        application.window.createMain();
    }
}

async function onAllWindowsClosed(application: App): Promise<void> {
    if(process.platform !== 'darwin') {
        await application.dispose();
        app.quit();
    }
}