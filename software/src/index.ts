import 'core/environment';
import { app, BrowserWindow } from 'electron/main';
import { App } from 'modules/app';

let application: App;

app.whenReady().then(async () => {
    app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
    app.commandLine.appendSwitch('force-color-profile', 'srgb');

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
