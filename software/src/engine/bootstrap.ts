import { RootInjector } from "engine/app-injector";
import { ipcMain } from "electron";
import { app, BrowserWindow } from "electron/main";
import { App } from "engine/app";
import { getInjectableMetadata, getModuleMetadata, Type } from "engine/metadata";
import { Request, Response } from "engine/request";
import { Router } from "engine/router";
import { Logger } from "engine/logger";

export async function bootstrapApplication(root: Type<App>, rootModule: Type<any>): Promise<App> {
    if(!getModuleMetadata(rootModule)) {
        throw new Error(`Root module must be decorated with @Module`);
    }

    if(!getInjectableMetadata(root)) {
        throw new Error(`Root application must be decorated with @Injectable`);
    }

    await app.whenReady();

    RootInjector.resolve(Router);
    const application = await init(root, rootModule);

    return application;
}

async function init(root: Type<App>, rootModule: Type<any>): Promise<App> {
    const application = RootInjector.resolve(root);

    ipcMain.on('port', (event) => {
        const [port] = event.ports;
        const router = RootInjector.resolve(Router);

        port?.on('message', event => onClientMessage(application, router, event, port));
    });

    app.once('activate', onAppActivated.bind(null, application));
    app.once('window-all-closed', onAllWindowsClosed.bind(null, application));

    await application.onReady();

    console.log('');

    const router = RootInjector.resolve(Router);

    for(let i=0; i < 3; i++) {
        const request = new Request(application, { data: {}, ports: [] }, {} as any, "GET", "user/profile/" + i, {});
        await router.handle(request);
    }


    return application;
}

// Electron specific message handling.
// Replaces HTTP calls by using Electron's IPC mechanism.
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
        application.onReady();
    }
}

async function onAllWindowsClosed(application: App): Promise<void> {
    if(process.platform !== 'darwin') {
        await application.dispose();
        app.quit();
    }
}
