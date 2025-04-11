import { BrowserWindow, ipcMain } from 'electron/main';
import http from 'node:http';

export class SyncingService {
    constructor() {
        ipcMain.handle('sync', this.sync.bind(this));
    }

    private async sync(): Promise<void> {
        // request http://localhost:3000
        // when headers are received, send 'sync-init' event with total length
        // when data is received, send 'sync-progress' event with current length
        // when request is completed, send 'sync-complete

        const focusedWindow = BrowserWindow.getFocusedWindow();

        return new Promise((resolve, reject) => {
            const req = http.request('http://localhost:3000', (res) => {
                const total = parseInt(res.headers['content-length'] || '0', 10);
                let data = '';
                let current = 0;

                focusedWindow?.setClosable(false);

                res.on('data', (chunk) => {
                    data += chunk;
                    current += chunk.length;
                    const msg = ['Sending data', 'Getting data', 'Treating data', undefined][Math.floor(Math.random() * 4)];
                    focusedWindow?.webContents.send('sync-progress', current, total, msg);
                });

                res.on('end', () => {
                    focusedWindow?.webContents.send('sync-complete', data, null);
                    focusedWindow?.setClosable(true);
                    resolve();
                });

                res.on('error', (err) => {
                    focusedWindow?.webContents.send('sync-complete', null, err);
                    focusedWindow?.setClosable(true);
                    reject(err);
                });

                focusedWindow?.webContents.send('sync-init', total);
            });

            req.end();
        });
    }
}
