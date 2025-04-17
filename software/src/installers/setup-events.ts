import { app } from "electron/main";
import { spawn } from 'child_process';
import { basename, join, resolve } from 'path';

export function handleSquirrelEvent(): boolean {
    if(process.argv.length === 1) {
        return false;
    }

    const appFolder = resolve(process.execPath, '..');
    const rootFolder = resolve(appFolder, '..');
    const updateDotExe = resolve(join(rootFolder, 'Update.exe'));
    const exeName = basename(process.execPath);

    const spawnCP = (command: string, args: any[]): any => {
        let spawnedProcess;

        try {
            spawnedProcess = spawn(command, args, { detached: true });
        }
        catch(error) {
            console.warn(error);
        }

        return spawnedProcess;
    };

    const spawnUpdate = (args: any[]): any => spawnCP(updateDotExe, args);

    const squirrelEvent = process.argv[1];

    switch(squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            break;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            break;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            break;
    }

    return true;
}
