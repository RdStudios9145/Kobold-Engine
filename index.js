const electron = require("electron");
const path = require("path");
const projects = require("./src/projects");
const window_manager = require("./windows/manager");
const fs = require("fs");

const createWindow = () => {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "src/preload.js"),
		}
	});

	electron.ipcMain.on("new-project", projects.newProject);
	electron.ipcMain.on("open-project", projects.open)

	win.loadFile("pages/startup.html");
}

electron.app.whenReady().then(() => {
	window_manager.setup();

	electron.ipcMain.handle("startup:getprojects", projects.getProjects);
	electron.ipcMain.handle("loading:createwindow", window_manager.createWindow);
	electron.ipcMain.handle("loading:project", projects.loadingProject);
	electron.ipcMain.handle("new:getpath", projects.getPath);

	electron.ipcMain.handle("fs:readdirsync", fs.readdirSync);
	electron.ipcMain.handle("fs:readprojdirsync", projects.readProjDirSync);
	electron.ipcMain.handle("fs:mkdir", projects.mkdir);
	electron.ipcMain.handle("fs:writefile", projects.writeFile);
	electron.ipcMain.on("assets:openfile", projects.openFile);
	electron.ipcMain.on("hierarchy:new", projects.newobj);
	electron.ipcMain.handle("hierarchy:get", projects.getHierarchy);

	createWindow();

	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});