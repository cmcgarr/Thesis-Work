const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')

// keep a global reference of the window object, if you don't, the window
// will be closed automatically when the JS object is garbage collected

let win
let childWin

function createWindow (filename) {
    // Create the browser window
    win = new BrowserWindow({ width: 300, height: 300, resizable: false})
    // and load the html file of the app
    win.loadFile(filename)
    win.setMenuBarVisibility(true)

    // Emitted when the window is closed
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element
        win = null
    })
}

function createChildWindow(filename){
    childWin = new BrowserWindow({width:600, height: 300, resizable: true, parent: win})

    childWin.loadFile(filename)
    childWin.setMenuBarVisibility(true)
    childWin.setAlwaysOnTop(false)

    //Emitted when the window is closed
    childWin.on('closed', () =>{
        // Dereference the window object
        childWin = null
    })
}

app.on('ready', () => {
    createWindow('index.html')
})

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with CMD + q
    if (process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS its common to recreate a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (win === null) {
        createWindow('index.html')
    }
})

ipcMain.on('infoClick', (event, arg) =>{
    console.log('Info button clicked: opening info window')
    createChildWindow('info.html')
    event.sender.send('childID', childWin.webContents.id)
})
