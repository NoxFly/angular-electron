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
    loadApp: () => ipcRenderer.invoke('load-app'),
    onNavigationRequested: (cb: fn) => ipcRenderer.on('navigate-to', (e, ...args) => cb(...args)),

    // auth
    getAuthState: () => ipcRenderer.invoke("get-auth-state"),
    register: () => ipcRenderer.invoke("register"),
    unregister: () => ipcRenderer.invoke("unregister"),
    login: () => ipcRenderer.invoke("login"),
    logout: () => ipcRenderer.invoke("logout"),

    // printing
    print: () => ipcRenderer.invoke('print'),

    sync: () => ipcRenderer.invoke('sync'),
    onSyncInit: (cb: fn) => ipcRenderer.on('sync-init', (e, ...args) => cb(...args)),
    onSyncProgress: (cb: fn) => ipcRenderer.on('sync-progress', (e, ...args) => cb(...args)),
    onSyncComplete: (cb: fn) => ipcRenderer.on('sync-complete', (e, ...args) => cb(...args)),
});

