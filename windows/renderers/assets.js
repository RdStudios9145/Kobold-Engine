var cwd = "";
/** @type {HTMLDivElement} */
var target = null;
const container = document.getElementById("container");
const contextMenu = document.getElementById("contextmenu");

const render = async () => {
	container.innerHTML = "";
	const assets = await window.electronAPI.readProjDirSync("Assets" + cwd);

	if (cwd !== "") {
		const casset = document.createElement("div");
		casset.style.display = 'flex';
		casset.style.flexDirection = "column";
		const img = document.createElement("img");
		img.src = "../imgs/folder-up.svg";
		img.style.width = '80px';
		img.style.height = '80px';
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
		
		if (asset[0].endsWith(".comp"))
			img.src = "../imgs/component.svg";
		else if (asset[0].endsWith(".js"))
			img.src = "../imgs/system.svg";
		else if (asset[0].endsWith(".res"))
			img.src = "../imgs/res.svg"
		else
			img.src = "../imgs/folder.svg";

		img.style.width = '80px';
		img.style.height = '80px';

		const text = document.createElement("p");
		text.innerText = asset[0];
		text.style.widows = '80px';

		casset.append(img, text);
		casset.dataset.filetype = asset[1];
		container.append(casset);

		casset.addEventListener("dblclick", (e) => {
			target = e.currentTarget;
			const name = target.childNodes[1].innerText;

			if (target.dataset.filetype !== "") {
				window.electronAPI.openFile("Assets" + cwd + "/" + name);
				return;
			}

			cwd += "/" + name;
			render();
		});
	}
}

const rename = () => {
	if (target == null) return;

	target.childNodes[1].style.display = "none";
	const input = document.createElement("input");
	input.type = "text";
	input.id = "renameinput";
	input.value = target.childNodes[1].innerText;
}

const unrename = () => {

}

const resize = () => {
	const amount = Math.floor(window.innerWidth / 50);
	container.style.gridTemplateColumns = `repeat(${amount}, 80px)`;
};

resize();

render();
// window.electronAPI.fswatch("Assets");
// window.electronAPI.onfswatch((event) => render);

addEventListener("contextmenu", (e) => {
	contextMenu.style.transform = "translate(" + e.pageX + "px, " + e.pageY + "px)";
	contextMenu.style.display = 'flex';
});

addEventListener("click", (e) => {
	contextMenu.style.display = 'none';
	// target = null;
});

document.getElementById("newfolder").addEventListener("click", (e) => {
	window.electronAPI.mkdir("Assets" + cwd + "/New Folder");
	render();
});

document.getElementById("newcomponent").addEventListener("click", () => {
	window.electronAPI.writeFile("Assets" + cwd + "/CompName.comp", `Struct CompName {\n\t\n}`);
	render();
});

document.getElementById("newcontroller").addEventListener("click", (e) => {
	window.electronAPI.writeFile("Assets" + cwd + "/ContName.js", "function ContName {\n\t\n}");
	render();
});

document.getElementById("newresource"),addEventListener("click", (e) => {
	window.electronAPI.writeFile("Assets" + cwd + "/ResName.res", "Struct ResName {\n\t\n}");
});

document.getElementById("rename").addEventListener("click", (e) => {
	//rename();
})

window.addEventListener("resize", resize);