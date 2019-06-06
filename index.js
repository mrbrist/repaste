'use strict'

// Declare constiables
const path = require('path')
const Positioner = require('electron-positioner')
const {
  app,
  Tray,
  Menu,
  BrowserWindow } = require('electron')

let mainWindow = null
let tray = null

// Hide the icon from the dock if the OS has it.
if (app.dock) {
  app.dock.hide()
}

// When the app is ready
app.on('ready', () => {
  // Declare the main window
  mainWindow = new BrowserWindow({
    frame: false,
    height: 450,
    width: 350,
    backgroundColor: '#303030',
    resizable: false,
    skipTaskbar: true,
    show: false,
    title: 'REpaste',
    icon: path.join(__dirname, 'app', 'img', 'icon_tray.png')
  })

  // Declare the tray
  tray = new Tray(path.join(__dirname, 'app', 'img', 'icon_tray.png'))

  // On window blur, close it
  mainWindow.on('blur', () => {
    // Check for app.hide
    if (app.hide) {
      app.hide()
    } else {
      mainWindow.hide()
    }
  })

  // The trigger used to show/hide the app window.
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      // Check for app.hide
      if (app.hide) {
        // NOTE: to get focus back to the previous window on MacOS we need to
        // hide the app not only the window.
        app.hide()
      } else {
        // NOTE: Windows doesn't have app.hide method, but combination of
        // window.blur and window.hide does the same thing.
        mainWindow.blur()
        mainWindow.hide()
      }
    } else {
      mainWindow.show()
    }
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Settings' },
    { label: 'Exit' }
  ])

  // Set the tray tooltip
  tray.setToolTip('REpaste')

  // Set context menu
  tray.setContextMenu(contextMenu)

  // Load the HTML doc
  mainWindow.loadURL(path.join('file://', __dirname, '/app/index.html'))
  mainWindow.setVisibleOnAllWorkspaces(true)

  // Move the window next to the tray
  const positioner = new Positioner(mainWindow)

  // Moves the window depending on OS
  if (process.platform === 'win32') {
    positioner.move('trayBottomCenter', tray.getBounds())
  } else {
    positioner.move('trayCenter', tray.getBounds())
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On MacOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
