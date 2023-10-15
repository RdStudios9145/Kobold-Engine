const electron = require("electron");
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;
const manager = require("../windows/manager");
const ts = require("typescript");

/**
 * @typedef {Object} Obj
 * @property {Number[]} children
 * @property {Object[]} Components
 * @property {Number} id
 * @property {String} name
 */

/**
 * @typedef {Object} Hierarchy
 * @property {Obj[]} children
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
/** @type {Obj} */
let cso = {};

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
					size: [700, 300]
				},
				{
					name: "hierarchy",
					position: [500, 100],
					size: [300, 700]
				},
				{
					name: "inspector",
					position: [700, 100],
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
	/** @type {Object[]} */
	const components = JSON.parse(getAllComponents());
	/** @type {Obj} */
	const obj = {
		children: [],
		Components: [
			new (components.find((val) => val.constructor.name === "Transform")),
		],
		id: id,
		name: name,
	};

	cwp.hierarchy.children.push(obj);

	if (parent === -1) return;
	console.log(parent, name, id);

	cwp.hierarchy.children[parent].children.push(id);
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

const renameObj = (e, id, newName) => {
	if (id === undefined) return;
	cwp.hierarchy.children[id].name = newName;
	manager.sendMessiage("hierarchy", "render");
}

const selectObj = (e, id) => {
	const obj = id === -1 ? {} : cwp.hierarchy.children[id];
	manager.sendMessiage("inspector", "selectobj", obj);
	cso = obj;
}

/** @returns {String[]} :) */
const fsReadDirRecursive = dir =>
	fs.readdirSync(dir).reduce((files, file) => {
		const name = path.join(dir, file);
		const isDirectory = fs.statSync(name).isDirectory();
		return isDirectory ? [...files, ...fsReadDirRecursive(name)] : [...files, name];
	}, []);

/** @param {String} filePath */
const compile = (filePath) => {
	const file = fs.readFileSync(filePath).toString();
	console.log(file, "file");
	const contents = ts.transpileModule(file, { compilerOptions: { module: ts.ModuleKind.Node16 } });
	console.log(contents);
	eval(contents.outputText);
	var name = filePath;
	name[-2] = "j";
	console.log(name);
	name[name.length - 2] = "j";
	console.log(name, name[name.length - 2]);
	name.replace(".comp.ts", ".comp.js");
	console.log(name, name[name.length - 2]);
	name = filePath.replaceAt(filePath.length - 2, "j");
	console.log(name, name[name.length - 2]);
	fs.writeFileSync(name, contents.outputText);
	const include = require(name);
	console.log(include);
	// return global[name];
	// const classCode = eval(contents.outputText);
	// console.log(classCode);
	// return contents;
}

const getAllComponents = () => {
	const components = [];
	const { builtIn, files } = JSON.parse(getAllComponentNames());
	// console.log(files, "hi");

	for (var i = 0; i < builtIn.length; i++) {
		// const file = files[i].split("/")
		// const comp = file[file.length - 1];
		// components.push(comp.slice(0, comp.length - 8));
		components.push(compile(builtIn[i]));
	}

	for (var i = 0; i < files.length; i++) {
		components.push(compile(files[i]));
	}

	// return JSON.stringify(components);
}

const getAllComponentNames = () => {
	/** @type {String[]} */
	const builtIn = fsReadDirRecursive(path.join(__dirname, "includes/"))
		.filter((val) => val.endsWith(".comp.ts"));

	/** @type {String[]} */
	const files = fsReadDirRecursive(path.join(cwp.path, cwp.name, "Assets/"))
		.filter((val) => val.endsWith(".comp.ts"));

	const builtInSliced = [];
	builtIn.forEach((val) => builtInSliced.push(val.split("/").at(-1).slice(0, -8)));
	// console.log(builtInSliced);
	// builtIn.forEach((val) => console.log(val.split("/"), val.split("/").at(-1),
		// val.split("/").at(-1).slice(0, -8)));
	const filesSliced = [];
	files.forEach((val) => filesSliced.push(val.split("/").at(-1).slice(0, -8)));

	return JSON.stringify({ builtIn, files, builtInSliced, filesSliced });
}

const newComponent = (e, id) => {
	const comp = getAllComponents()[id];
	cso.Components.push(new comp());
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
	renameObj: renameObj,
	selectObj: selectObj,
	getAllComponents,
	newComponent,
	fsReadDirRecursive,
	getAllComponentNames,
	compile,
};