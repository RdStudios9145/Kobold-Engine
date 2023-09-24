const electron = require("electron");
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

/**
 * @typedef {Object} Obj
 * @property {Obj[]} children
 * @property {Number} id
 * @property {String} name
 */

/**
 * @typedef {Object} Hierarchy
 * @property {Obj[]} children
 * @property {Number} elements 
 * @property {-1} id
 */

/** 
 * @typedef {Object} CWP
 * @property {String} name
 * @property {String} path
 * @property {Hierarchy} hierarchy
 */
/** @type {CWP} */
let cwp = {};

const getProjects = () => {
	const dataPath = electron.app.getPath("userData");
	if (!fs.existsSync(path.join(dataPath, "projects.json"))) {
		fs.writeFileSync(path.join(dataPath, "projects.json"), JSON.stringify({ projects: [] }));
		return { projects: [] };
	}

	return JSON.parse(fs.readFileSync(path.join(dataPath, "projects.json")));
}

const newProject = (event, name, projPath) => {
	const dataPath = electron.app.getPath("userData");

	if (!fs.existsSync(path.join(dataPath, "projects.json"))) {
		fs.writeFileSync(path.join(dataPath, "projects.json"), JSON.stringify({ projects: [] }));
	}

	const current = JSON.parse(fs.readFileSync(path.join(dataPath, "projects.json")));
	current.projects.push({
		name: name,
		path: projPath
	});
	fs.writeFileSync(path.join(dataPath, "projects.json"), JSON.stringify(current));

	/** @type {Hierarchy} */
	const hierarchy = {
		id: -1,
		elements: 0,
		children: [],
	};

	const proj = (str) => path.join(projPath, "/" + name, str);
	console.log(proj(""), proj("Assets"), proj("ProjectSettings/.json"));
	fs.mkdirSync(proj(""));
	fs.writeFileSync(proj("Proj.kbld"), JSON.stringify({
		name: name,
		settings: {
			windows: [
				{
					name: "assets",
					position: [0, 0],
					size: [300, 700]
				},
				{
					name: "hierarchy",
					position: [500, 100],
					size: [300, 700]
				}
			]
		},
		hierarchy: hierarchy
	}));
	fs.mkdirSync(proj("Assets"));
	fs.mkdirSync(proj("Plugins"));

	open(event, { name: name, path: projPath });
}

const open = (event, project) => {
	electron.BrowserWindow.getAllWindows()[0].loadFile("pages/workspace.html");
	const hierarchy = JSON.parse(fs.readFileSync(path.join(
		project.path,
		project.name,
		"/Proj.kbld"
	))).hierarchy;
	cwp = { name: project.name, path: project.path, hierarchy: hierarchy };
	console.log(cwp);
}

const loadingProject = () => {
	const settings = fs.readFileSync(path.join(cwp.path, cwp.name, "Proj.kbld"));
	return {
		project: cwp,
		settings: JSON.parse(settings).settings,
	};
}

const getPath = () => {
	const dialog = electron.dialog.showOpenDialogSync(electron.BrowserWindow.getAllWindows()[0], {
		properties: ["openDirectory"]
	});

	const { canceled } = dialog;

	if (canceled) return;
	return dialog[0];
}

const readProjDirSync = (event, dir, config) => {
	const cdir = path.join(cwp.path, cwp.name, dir);
	const files = fs.readdirSync(cdir, config);
	const retVal = [];

	for (const file of files) {
		const type = path.extname(path.join(cdir, file));
		retVal.push([file, type]);
	}

	return retVal;
}

const mkdir = (event, dir, config) => {
	return fs.mkdirSync(path.join(cwp.path, cwp.name, dir), config);
}

const writeFile = (event, dir, contents) => {
	return fs.writeFileSync(path.join(cwp.path, cwp.name, dir), contents);
}

const getCommandLine = () => {
	switch (process.platform) {
		case 'darwin': return "open";
		case 'win32':
		case "win64": return "start";
		default: return "xdg-open";
	}
}

const openFile = (event, dir) => {
	exec(getCommandLine() + " " + path.join(cwp.path, cwp.name, dir));
}

const getHierarchy = (event) => {
	return JSON.stringify(cwp.hierarchy);
}

const newobj = (event, parent, name, id) => {
	cwp.hierarchy.elements++;

	/** @type {Obj} */
	const obj = {
		children: [],
		id: cwp.hierarchy.elements - 1,
		name: name,
	};
	
	if (parent === -1) {
		cwp.hierarchy.children.push(obj);
		return;
	}

	traverseHierarchy(cwp.hierarchy, parent, obj);
}

/**
 * @param {Obj} current 
 * @param {Number} parent 
 * @param {Obj} obj 
 */
const traverseHierarchy = (current, parent, obj) => {
	if (current.children.length === 0) {
		if (current.id === parent)
			current.children.push(obj);

		return;
	}

	for (var child of current.children) {
		traverseHierarchy(child, parent, obj);
	}
}

module.exports = {
	getProjects: getProjects,
	newProject: newProject,
	open: open,
	getPath: getPath,
	loadingProject: loadingProject,
	readProjDirSync: readProjDirSync,
	mkdir: mkdir,
	writeFile: writeFile,
	getCommandLine: getCommandLine,
	openFile: openFile,
	newobj: newobj,
	getHierarchy: getHierarchy,
	traverseHierarchy: traverseHierarchy,
};