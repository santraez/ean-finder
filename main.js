const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { searchAmazon } = require("./searchAmazon");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 550,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: path.join(__dirname, 'start.png'),
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setIcon(image);
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.key === 'I' && (input.meta || input.control))) {
      event.preventDefault();
    };
  });
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });
  mainWindow.loadFile('index.html');
};

app.setAppUserModelId(process.execPath);

const nativeImage = require('electron').nativeImage;
let image = nativeImage.createFromPath(path.join(__dirname, 'start.png'));
image = image.resize({ width: 512, height: 512, });

app.whenReady().then(() => {
  ipcMain.on('new-task', async (event, args) => {
    try {
      const pricesList = await searchAmazon(args);
      return event.reply('new-task-reply', pricesList);
    } catch (err) {
      console.log(err);
      return event.reply('new-task-reply', []);
    };
  });
  createWindow();
});
