"use strict";
const { app, BrowserWindow } = require('electron')

let windows = [];
const defaultOptions = { width: 1024, height: 768 };

function onWindowOpen(ev, url, frameName, disposition, options) {
    // The following mirrors electrons default behavior, with the following differences:
    // - New windows are not registered as guests so that closing the original window does not also automatically close
    //   the new window.
    // - Overwrite some properties of options with the ones of defaultOptions.
    ev.preventDefault();
    const window = new BrowserWindow({ ...options, ...defaultOptions });
    window.loadURL(url);

    if (disposition !== "new-window") {
        ev.newGuest = window;
    }
}

function windowCreated(ev, window) {
    windows.push(window);
    window.setMenu(null);
    window.on("closed", () => {
        const index = windows.findIndex((w) => w === window);

        if (index < 0) {
            console.error("Window not found!");
        }

        windows.splice(index, 1);
    });

    // This event is fired whenever the application calls window.open.
    window.webContents.on("new-window", onWindowOpen);
}

app.on("browser-window-created", windowCreated);

function createFirstWindow() {
    const window = new BrowserWindow({
        ...defaultOptions,
        icon: __dirname + "/../../public/icon-192x192.png",
        webPreferences: { nodeIntegration: false }
    });

    window.loadURL('https://andreashuber69.github.io/net-worth/');
}

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.length === 0) {
        createFirstWindow();
    }
});

app.on("ready", createFirstWindow);
