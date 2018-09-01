"use strict";
const { app, BrowserWindow } = require("electron");
const path = require("path");

const defaultOptions = { width: 1024, height: 768, show: false };

let windows = [];

function onWindowOpen(ev, url, frameName, disposition, options) {
    // The code below mirrors electrons default behavior, with the following differences:
    // - New windows are not registered as guests so that closing the original window does not also automatically close
    //   the new window.
    // - Overwrite some properties of options with the ones of defaultOptions.
    ev.preventDefault();
    const window = addNewWindow(new BrowserWindow({ ...options, ...defaultOptions }), url);

    if (disposition !== "new-window") {
        ev.newGuest = window;
    }
}

function removeClosedWindow(window) {
    const index = windows.findIndex((w) => w === window);

    if (index < 0) {
        throw new Error("Window not found!");
    }

    windows.splice(index, 1);
}

function addNewWindow(window, url) {
    windows.push(window);
    window.setMenu(null);
    window.loadURL(url);

    // TODO: This works as it should for windows loading normal URLs, it doesn't seem to work for redirects, i.e. when
    // window.location.replace is called.
    window.once("ready-to-show", () => window.show());
    // This event is fired whenever the application calls window.open.
    window.webContents.on("new-window", onWindowOpen);
    window.on("closed", () => removeClosedWindow(window));
    return window;
}

function createFirstWindow() {
    const firstWindowOptions = {
        ...defaultOptions,
        backgroundColor: "#25272A",
        icon: path.join(__dirname, "../../public/icon-192x192.png"),
        webPreferences: { nodeIntegration: false }
    };

    addNewWindow(new BrowserWindow(firstWindowOptions), "https://andreashuber69.github.io/net-worth/");
}

app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
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
