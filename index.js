const { app, BrowserWindow, clipboard, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Обработчик для сохранения RTF
ipcMain.on("save-rtf", (event) => {
  const rtfContent = clipboard.readRTF();

  if (rtfContent) {
    const filePath = path.join(__dirname, "clipboard.rtf");
    fs.writeFileSync(filePath, rtfContent);
    event.reply("rtf-saved", "RTF-файл успешно сохранен!");
  } else {
    event.reply("rtf-saved", "Буфер обмена не содержит RTF-данных.");
  }
});
