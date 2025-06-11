const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 320,
        height: 460,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

