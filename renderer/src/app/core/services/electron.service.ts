import { Injectable, signal } from "@angular/core";
import { randomId } from "src/app/shared/helpers/utils";
import { IRequest, IResponse } from "@noxfly/noxus";

interface PendingRequestHandlers<T> {
    resolve: (value: IResponse<T>) => void;
    reject: (reason?: IResponse<T>) => void;
    request: IRequest;
}

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private readonly bridge: any;
    private port: MessagePort | undefined;
    private senderId: number | undefined;
    private readonly pendingRequests = new Map<string, PendingRequestHandlers<any>>();

    public hasSecondScreen = signal(false);

    constructor() {
        this.bridge = window as any;

        this.ipc.onSecondScreenDetectionChanged((state: boolean) => {
            this.hasSecondScreen.set(state);
        });

        window.addEventListener('message', (event: MessageEvent) => {
            if(event.data?.type === 'init-port' && event.ports.length > 0) {
                const port = event.ports[0]!;

                this.port = port;
                this.senderId = event.data.senderId;

                if(this.port) {
                    this.port.onmessage = this.onMessage.bind(this);
                }
            }
        }, { once: true });

        this.ipc.hereIsMyPort();
    }

    public get ipc(): any {
        return this.bridge.ipcRenderer || {};
    }

    public get isElectronApp(): boolean {
        return !!window.navigator.userAgent.match(/Electron/);
    }

    private onMessage(event: MessageEvent): void {
        const response: IResponse<unknown> = event.data;

        if(!response || !response.requestId) {
            console.error('Received invalid response:', response);
            return;
        }

        const pending = this.pendingRequests.get(response.requestId);
        
        if(!pending) {
            console.error(`No handler found for request ID: ${response.requestId}`);
            return;
        }
        
        this.pendingRequests.delete(response.requestId);

        let fn: (response: IResponse<unknown>) => void = pending.resolve;

        console.groupCollapsed(`${response.status} ${pending.request.method} /${pending.request.path}`);
        
        if(response.error) {
            console.error('error message:', response.error);
            fn = pending.reject;
        }
        
        console.info('response:', response.body);
        console.info('request:', pending.request);

        console.groupEnd();

        fn(response);
    }

    public request<T>(request: Omit<IRequest, 'requestId' | 'senderId'>): Promise<T> {
        if(!this.isElectronApp)
            return Promise.reject(new Error("Not running in Electron environment"));
        
        return new Promise<T>((resolve, reject) => {
            if(!this.port || !this.senderId) {
                return reject(new Error("MessagePort is not available"));
            }
        
            const req: IRequest = {
                requestId: randomId(),
                senderId: this.senderId,
                ...request,
            };
        
            this.pendingRequests.set(req.requestId, {
                resolve: (response: IResponse<T>) => {
                    if(response.error) {
                        reject(response);
                    }
                    else {
                        resolve(response.body as T);
                    }
                },
                reject: (response?: IResponse<T>) => {
                    reject(response);
                },
                request: req,
            });
        
            this.port.postMessage(req);
        });
    }
}
