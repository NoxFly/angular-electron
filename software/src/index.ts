import 'core/environment';
import { app, BrowserWindow } from 'electron/main';
import { App } from 'modules/app';
import squirrel from 'electron-squirrel-startup';
import * as setupEvents from './installers/setup-events';


// Installer events

if(squirrel) {
    app.quit();
}


if(setupEvents.handleSquirrelEvent()) {
    process.exit();
}



// Application

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
