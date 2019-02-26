const { app, BrowserWindow } = require('electron')

// keep a global reference of the window object, if you don't, the window
// will be closed automatically when the JS object is garbage collected

let win

function createWindow () {
    // Create the browser window
    win = new BrowserWindow({ width: 250, height: 200})

    // and load the index.html of the app
    win.loadFile('index.html')

    // open the dev tools
    win.webContents.openDevTools()

    // Emitted when the window is closed
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    // On macOS it is common for applicaitons and their menu bar
    // to stay active until the user quits explicitly with CMD + q
    if (process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS its common to recreate a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
