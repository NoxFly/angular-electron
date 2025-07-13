import { Injectable, signal } from "@angular/core";
import { randomId } from "src/app/shared/helpers/utils";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Request {
    path: string;
    method: HttpMethod;
    body?: any;
}

export interface Response<T> {
    requestId: string;
    status: number;
    body?: T;
    error?: string;
}

interface PendingRequestHandlers<T> {
    resolve: (value: Response<T>) => void;
    reject: (reason?: Response<T>) => void;
}

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private readonly bridge: any;
    private port: MessagePort | undefined;
    private readonly pendingRequests = new Map<string, PendingRequestHandlers<any>>();

    public hasSecondScreen = signal(false);

    constructor() {
        this.bridge = window as any;

        this.ipc.onSecondScreenDetectionChanged((state: boolean) => {
            this.hasSecondScreen.set(state);
        });

        this.ipc.hereIsMyPort((port: MessagePort, a: any, b: any) => {
            console.log(port, a, b);
            this.port = port;
            this.port.onmessage = this.onMessage.bind(this);
            this.port.start();
        });
    }

    public get ipc(): any {
        return this.bridge.ipcRenderer || {};
    }

    public get isElectronApp(): boolean {
        return !!window.navigator.userAgent.match(/Electron/);
    }

    private onMessage(event: MessageEvent): void {
        const response: Response<unknown> = event.data;

        if(!response || !response.requestId) {
            console.error('Received invalid response:', response);
            return;
        }

        const handlers = this.pendingRequests.get(response.requestId);
        
        if(!handlers) {
            console.error(`No handler found for request ID: ${response.requestId}`);
            return;
        }
        
        this.pendingRequests.delete(response.requestId);
        
        if(response.error) {
            return handlers.reject(response);
        }
        
        handlers.resolve(response);
    }

    public request<T>(request: Request): Promise<T> {
        if(!this.isElectronApp)
            return Promise.reject(new Error("Not running in Electron environment"));
        
        return new Promise<T>((resolve, reject) => {
            if(!this.port) {
                return reject(new Error("MessagePort is not available"));
            }
        
            const req = {
                requestId: randomId(),
                ...request,
            };
        
            this.pendingRequests.set(req.requestId, {
                resolve: (response: Response<T>) => {
                    if(response.error) {
                        reject(response);
                    }
                    else {
                        resolve(response.body as T);
                    }
                },
                reject: (response?: Response<T>) => {
                    reject(response);
                }
            });
        
            this.port.postMessage(req);
        });
    }
}
