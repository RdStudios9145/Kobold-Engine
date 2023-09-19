const electron = require("electron");
const fs = require("fs");
const path = require("path");

let cwp = null;

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
	})
	fs.writeFileSync(path.join(dataPath, "projects.json"), JSON.stringify(current));

	const proj = (str) => path.join(projPath, "/" + name, str);
	console.log(proj(""), proj("Assets"), proj("ProjectSettings/.json"));
	fs.mkdirSync(proj(""));
	fs.writeFileSync(proj("Proj.kbld"), JSON.stringify({ name: name }));
	fs.mkdirSync(proj("Assets"));
	fs.mkdirSync(proj("Plugins"));
	fs.mkdirSync(proj("ProjectSettings"));

	fs.writeFileSync(proj("ProjectSettings/.json"), JSON.stringify({
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
	}))

	open(event, { name: name, path: projPath });
}

const open = (event, project) => {
	electron.BrowserWindow.getAllWindows()[0].loadFile("pages/workspace.html");
	cwp = project;
}

const loadingProject = () => {
	const settings = fs.readFileSync(path.join(cwp.path, cwp.name, "ProjectSettings/.json"));
	return {
		project: cwp,
		settings: JSON.parse(settings),
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
	return fs.readdirSync(cdir, config);
}

module.exports = {
	getProjects: getProjects,
	newProject: newProject,
	open: open,
	getPath: getPath,
	loadingProject: loadingProject,
	readProjDirSync: readProjDirSync,
}