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
	mkdir: (dir, config) => electron.ipcRenderer.invoke("fs:mkdir", dir, config),
	writeFile: (dir, contents) => electron.ipcRenderer.invoke("fs:writefile", dir, contents),
	openFile: (dir) => electron.ipcRenderer.send("assets:openfile", dir),
	newobj: (parent, name, id) => electron.ipcRenderer.send("hierarchy:new", parent, name, id),
	getHierarchy: () => electron.ipcRenderer.invoke("hierarchy:get"),
	renameobj: (id, newname) => electron.ipcRenderer.send("hierarchy:rename", id, newname),
	handleRender: (callback) => electron.ipcRenderer.on("render", callback),
	inspectHierarchyElement: (id) => electron.ipcRenderer.send("hierarchy:select", id),
	handleObjSelect: (callback) => electron.ipcRenderer.on("selectobj", callback),
	getAllComponents: () => electron.ipcRenderer.invoke("components:get"),
	getAllComponentNames: () => electron.ipcRenderer.invoke("components:get:name"),
	addComponent: (id) => electron.ipcRenderer.send("components:add", id),
});