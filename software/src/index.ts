import { app, BrowserWindow } from 'electron/main';
import { App } from 'modules/app';
import 'core/environment';

let application: App;

app.whenReady().then(async () => {
    app.once('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            application.window.createMain();
        }
    });

    application = new App();
    await application.window.createMain();
});

app.once('window-all-closed', async () => {
    if(process.platform !== 'darwin') {
        await application.dispose();
        app.quit();
    }
});
