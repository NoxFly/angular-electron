import { ipcMain } from "electron";
import { app, BrowserWindow, MessageChannelMain } from "electron/main";
import { App } from "engine/app";
import { RootInjector } from "engine/app-injector";
import { getInjectableMetadata, getModuleMetadata, Type } from "engine/metadata";
import { Request, Response } from "engine/request";
import { Router } from "engine/router";

/**
 * 
 */
export async function bootstrapApplication(root: Type<App>, rootModule: Type<any>): Promise<App> {
    if(!getModuleMetadata(rootModule)) {
        throw new Error(`Root module must be decorated with @Module`);
    }

    if(!getInjectableMetadata(root)) {
        throw new Error(`Root application must be decorated with @Injectable`);
    }

    await app.whenReady();

    RootInjector.resolve(Router);

    const noxEngine = new Nox(root, rootModule);

    const application = await noxEngine.init();

    return application;
}


class Nox {
    private messagePort: Electron.MessageChannelMain | undefined;

    constructor(
        public readonly root: Type<App>,
        public readonly rootModule: Type<any>
    ) {}

    /**
     * 
     */
    public async init(): Promise<App> {
        const application = RootInjector.resolve(this.root);

        ipcMain.on('gimme-my-port', (event) => {
            if(!this.messagePort) {
                this.messagePort = new MessageChannelMain();

                this.messagePort.port1.on('message', event => this.onClientMessage(application, event));
                this.messagePort.port1.start();
            }

            event.sender.postMessage('port', null, [this.messagePort.port2]);
        });

        app.once('activate', this.onAppActivated.bind(this, application));
        app.once('window-all-closed', this.onAllWindowsClosed.bind(this, application));

        await application.onReady();

        console.log(''); // create a new line in the console to separate setup logs from the future logs

        return application;
    }

    /**
     * Electron specific message handling.
     * Replaces HTTP calls by using Electron's IPC mechanism.
     */
    private async onClientMessage(application: App, event: Electron.MessageEvent): Promise<void> {
        try {
            const { path, method, body } = event.data;
            
            const request = new Request(application, event, method, path, body);
            const router = RootInjector.resolve(Router);

            const response = await router.handle(request);
            
            this.messagePort?.port1.postMessage(response);
        }
        catch(err: any) {
            const response: Response = {
                status: 500,
                body: null,
                error: err.message || 'Internal Server Error',
            };

            this.messagePort?.port1.postMessage(response);
        }
    }

    /**
     * 
     */
    private onAppActivated(application: App): void {
        if(BrowserWindow.getAllWindows().length === 0) {
            application.onReady();
        }
    }

    /**
     * 
     */
    private async onAllWindowsClosed(application: App): Promise<void> {
        this.messagePort?.port1.close();
        await application.dispose();

        if(process.platform !== 'darwin') {
            app.quit();
        }
    }
}

