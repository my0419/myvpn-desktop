'use strict'

import { app, BrowserWindow } from 'electron'
import {version} from './../../package';
app.getVersion = ()=> version;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
const isDev = process.env.NODE_ENV === 'development'
if (!isDev) {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = isDev ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow () {
    /**
     * Initial window optionshttp://localhost:9080/static/img/background.svg
     */
    mainWindow = new BrowserWindow({
        height: 560,
        useContentSize: true,
        // transparent: true,
        // vibrancy: 'light',
        width: isDev ? 1400 : 800,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
