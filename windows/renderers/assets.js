var cwd = "";
const container = document.getElementById("container");

const render = async () => {
	container.innerHTML = "";
	const assets = await window.electronAPI.readProjDirSync("Assets" + cwd);

	if (cwd !== "") {
		const casset = document.createElement("div");
		casset.style.display = 'flex';
		casset.style.flexDirection = "column";
		const img = document.createElement("img");
		img.src = "../imgs/folder-up.svg";
		img.style.width = '50px';
		img.style.height = '50px';
		casset.append(img);
		container.append(casset);

		casset.addEventListener("dblclick", (e) => {
			const lcwd = cwd.split("/");
			lcwd.pop();
			cwd = lcwd.join("/");
			render();
		});
	}

	for (const asset of assets) {
		const casset = document.createElement("div");
		casset.style.display = 'flex';
		casset.style.flexDirection = "column";
		const img = document.createElement("img");
		img.src = "../imgs/folder.svg";
		img.style.width = '50px';
		img.style.height = '50px';
		casset.append(img, asset);
		container.append(casset);

		casset.addEventListener("dblclick", (e) => {
			const target = e.currentTarget;
			cwd += "/" + target.childNodes[1].data;
			render();
		});
	}
}

render();
window.electronAPI.fswatch('')