import { RootInjector } from "core/engine/appInjector";
import { Request, Response } from "core/engine/request";
import { Router } from "core/engine/router";
import { ipcMain } from "electron";
import { app, BrowserWindow } from "electron/main";
import { App } from "core/app";
import { environment } from "core/environment";
import { UserController } from "modules/user/user.controller";

export function bootstrapApplication(): void {
    if(!environment.production)
        logSetup();


    app.whenReady().then(init);
}

function logSetup(): void {
    // Enregistrer les contrôleurs
    const router: Router = RootInjector.resolve(Router);
    router.registerController(UserController);

    // Affichage du plan de routage
    console.debug('\n===== ROUTING MAP =====');

    for(const [route, info] of router.getRoutes()) {
        const guardInfo: string = info.guard
            ? ` (guard: ${info.guard.name})`
            : '';

        const now = new Date().toISOString().replace('T', ' ').replace('Z', '');

        console.debug(`[Main] ${process.pid} - ${now} LOG [RouterExplorer] Mapped {${info.method} ${route}} => ${info.controller.name}.${info.handler} | [guard: ${guardInfo}]`);
    }

    console.debug('========================\n');
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