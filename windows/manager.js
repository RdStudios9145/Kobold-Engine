const electron = require("electron");
const fs = require("fs");
const path = require("path");

const windows = {};
const renderers = {};

const createWindow = (event, window) => {
	const winds = electron.BrowserWindow.getAllWindows();
	const wind = new electron.BrowserWindow({
		parent: winds[winds.length - 1],
		width: window.size[0],
		height: window.size[1],
		x: window.position[0],
		y: window.position[1],
		webPreferences: {
			preload: path.join(__dirname, "../src/preload.js"),
		}
	});
	wind.loadFile(windows[window.name + ".html"]);
	// wind.webContents.send("window-info", renderers[window.name + ".js"].render());
	return '{}';
}

const setup = () => {
	// console.log(__dirname);
	// const dirpath = path.join(__dirname, "/renderers");
	// const files = fs.readdirSync(dirpath).filter(file => file.endsWith(".js"));

	// for (const file of files) {
		// const filepath = path.join(dirpath, file);
		// const renderer = require(filepath);

		// renderers[file] = renderer;
	// }

	const pages = fs.readdirSync(__dirname).filter(file => file.endsWith(".html"));

	for (const page of pages) {
		// const filepath = path.join(__dirname, page);
		windows[page] = "windows/" + page;
	}
}

module.exports = {
	createWindow: createWindow,
	setup: setup,
}