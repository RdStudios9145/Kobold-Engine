const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electronAPI", {
	getProjects: () => electron.ipcRenderer.invoke("startup:getprojects"),
	newProject: (name, path) => electron.ipcRenderer.send("new-project", name, path),
	open: (proj) => electron.ipcRenderer.send("open-project", proj),
	loadedProject: () => electron.ipcRenderer.invoke("loading:project"),
	createWindow: (window) => electron.ipcRenderer.invoke("loading:createwindow", window),
	getPath: () => electron.ipcRenderer.invoke("new:getpath"),
	readDirSync: (dir, config) => electron.ipcRenderer.invoke("fs:readdirsync", dir, config),
	readProjDirSync: (dir, config) => electron.ipcRenderer.invoke("fs:readprojdirsync", dir, config),
});