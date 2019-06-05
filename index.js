'use strict';

const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  globalShortcut,
  ipcMain } = require('electron');

const path = require('path');

let mainWindow    = null;
let tray          = null;

// Hide the icon from the dock if the OS has it.
if (app.dock) {
  app.dock.hide();
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    frame: false,
    height: 400,
    width: 300,
    resizable: false,
    center: true,
    skipTaskbar: true,
    show: false,
    title: 'REpaste',
    icon: path.join(__dirname, 'img', 'logo.png')
  });

  // The trigger used to show/hide the app window.
  // TODO: allow user to set a custom shortcut.
  globalShortcut.register('Alt+Space', () => {
    if (mainWindow.isVisible()) {
      if (app.hide) {
        // NOTE: to get focus back to the previous window on MacOS we need to
        // hide the app not only the window.
        app.hide();
      } else {
        // NOTE: Windows doesn't have app.hide method, but combination of
        // window.blur and window.hide does the same thing.
        mainWindow.blur();
        mainWindow.hide()
      }
    } else {
      mainWindow.show();
    }
  });

  if (process.platform === 'darwin') {
    tray = new Tray(path.join(__dirname, 'img', 'logo.png'));
  } else if (process.platform === 'linux') {
    tray = new Tray(path.join(__dirname, 'img', 'logo.png'));
  } else {
    tray = new Tray(path.join(__dirname, 'img', 'logo.png'));
  }

  tray.setToolTip('REpaste')

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');
  mainWindow.setVisibleOnAllWorkspaces(true);

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  ipcMain.on('hideWindow', (event) => {
    if (app.hide) {
        app.hide();
      } else {
        mainWindow.blur();
        mainWindow.hide()
      }
  });

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On MacOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
