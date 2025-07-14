import { contextBridge, ipcRenderer } from 'electron/renderer';

// .invoke -> front sends to back
// .on -> back sends to front

type fn = (...args: any[]) => void;

contextBridge.exposeInMainWorld('ipcRenderer', {
    // window
    close: () => ipcRenderer.invoke('close-app'),
    reduce: () => ipcRenderer.invoke('reduce-app'),
    toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
    getTitlebarState: () => ipcRenderer.invoke('get-titlebar-state'),
    openSecondScreen: () => ipcRenderer.invoke('open-second-screen'),

    onSecondScreenDetectionChanged: (cb: fn) => ipcRenderer.on('second-screen-detection-changed', (e, ...args) => cb(...args)),

    // app
    requestPort: () => ipcRenderer.send('gimme-my-port'),
    hereIsMyPort: () => ipcRenderer.once('port', (e, message) => {
        e.ports[0]?.start();
        window.postMessage({ type: 'init-port', senderId: message.senderId }, '*', [e.ports[0]!]);
    }),
    loadApp: () => ipcRenderer.invoke('load-app'),
    onNavigationRequested: (cb: fn) => ipcRenderer.on('navigate-to', (e, ...args) => cb(...args)),
});

