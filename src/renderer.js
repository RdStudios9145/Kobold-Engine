(async () => {
	const projects = await window.electronAPI.getProjects();
	const list = document.getElementById("projects");

	for (const project of projects.projects) {
		const elem = document.createElement("li");
		elem.innerText = project.name;
		const button = document.createElement("button");
		button.onclick = () => { window.electronAPI.open(project) };
		button.innerText = "Open";
		elem.append(button);
		if (list.firstChild !== null)
			list.insertBefore(elem, list.firstChild)
		else
			list.append(elem);
	}

	console.log("hiii")
})()

document.getElementById("new").addEventListener("click", async () => {
	window.electronAPI.newProject(document.getElementById("name").value, await window.electronAPI.getPath());
})