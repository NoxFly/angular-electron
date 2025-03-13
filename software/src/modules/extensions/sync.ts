import { BrowserWindow, ipcMain } from 'electron/main';
import http from 'node:http';

export class SyncingService {
    constructor() {
        ipcMain.handle('sync', () => this.sync());
    }

    private async sync(): Promise<void> {
        // request http://localhost:3000
        // when headers are received, send 'sync-init' event with total length
        // when data is received, send 'sync-progress' event with current length
        // when request is completed, send 'sync-complete

        const focusedWindow = BrowserWindow.getFocusedWindow();

        return new Promise((resolve, reject) => {
            const req = http.request('http://localhost:3000', (res) => {
                console.log(res.headers);
                console.log('total length:', res.headers['content-length']);
                const total = parseInt(res.headers['content-length'] || '0', 10);
                let data = '';
                let current = 0;

                res.on('data', (chunk) => {
                    data += chunk;
                    current += chunk.length;
                    focusedWindow?.webContents.send('sync-progress', current, total);
                });

                res.on('end', () => {
                    focusedWindow?.webContents.send('sync-complete', data);
                    resolve();
                });

                res.on('error', (err) => {
                    console.error(err);
                    reject(err);
                });

                focusedWindow?.webContents.send('sync-init', total);
            });

            req.end();
        });
    }
}
