const menu = document.getElementById("menu");
const container = document.getElementById("container")
var elements = 0;
var selected = -1;

const render = async () => {
	const heiarchy = JSON.parse(await window.electronAPI.getHierarchy());
	// console.log(heiarchy)
	elements = heiarchy.elements;
	container.innerHTML = "";
	renderElem(container, heiarchy, 0);
};

const renderElem = (parent, elem, depth) => {
	// console.log(elem.children, elem, elem["children"])
	for (const element of elem.children) {
		const div = document.createElement("div");
		div.classList.add("element");
		div.innerText = element.name;
		div.style.transform = "translate(" + depth * 15 + "px, 0px)";
		div.style.zIndex = "3";

		div.oncontextmenu = (e) => {
			// window.electronAPI.newobj(element.id, "New Obj", elements);
			selected = element.id;
		};

		parent.append(div);
		if (element.children.length !== 0)
			renderElem(div, element, depth + 1);
	}
};

render();

document.getElementById("container").addEventListener("contextmenu", (e) => {
	console.log("hi");
	menu.style.transform = "translate(" + e.pageX + "px, " + e.pageY + "px)";
	menu.style.display = "flex";
});

addEventListener("click", () => {
	menu.style.display = "none";
})

document.getElementById("newobj").addEventListener("click", (e) => {
	window.electronAPI.newobj(selected, "New Obj");
	selected = -1;
	render();
})