const { app, BrowserWindow } = require('electron');
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

let splashScreen;

function createSplash() {
  splashScreen = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });

  splashScreen.loadFile(path.join(__dirname, 'src', 'splashScreen.html'));
  splashScreen.center();

}



const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: path.join(__dirname, 'assets/favicon.ico')
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();


  mainWindow.once('ready-to-show', () => {
    splashScreen.close();
    mainWindow.show()

    // if (process.env.NODE_ENV === "development") {
    //   mainWindow.webContents.openDevTools();

    // }
  });


};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)

    .then((name) => {
      createWindow();
    })
    .catch((err) => console.log('An error occurred: ', err));
  createSplash();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
