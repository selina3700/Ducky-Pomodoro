const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded');

contextBridge.exposeInMainWorld("app", {
    window: {
        close: () => ipcRenderer.send("app/close"),
        minimize: () => ipcRenderer.send("app/minimize"),
    },
    cpuUsage: (data) => ipcRenderer.invoke("cpu/get", data),
});

console.log('API exposed to window.app');
