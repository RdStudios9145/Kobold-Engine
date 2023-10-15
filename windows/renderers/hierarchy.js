const menu = document.getElementById("menu");
const container = document.getElementById("container")
var elements = 0;
var selected = -1;
var inspector = -1;
var justClicked = false;

const dontrender = [];

const render = async () => {
	const heiarchy = JSON.parse(await window.electronAPI.getHierarchy());
	// console.log(heiarchy)
	elements = heiarchy.children.length;
	container.innerHTML = "";
	renderElem(container, heiarchy);
};

const newElem = (elem) => {
	const div = document.createElement("div");
	div.id = elem.id;
	div.classList.add("element");
	div.innerText = elem.name;
	// div.style.transform = "translate(" + depth * 15 + "px, 0px)";
	div.style.zIndex = "3";
	// if (i % 2) div.classList.add("odd");

	if (elem.id === inspector) div.classList.add("selected");

	div.oncontextmenu = (e) => {
		// window.electronAPI.newobj(element.id, "New Obj", elements);
		selected = elem.id;
	};

	div.addEventListener("click", (e) => {
		justClicked = true;
		inspector = elem.id;
		div.classList.add("selected");
		window.electronAPI.inspectHierarchyElement(inspector);
	});

	return div;
}

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
 * @param {HTMLDivElement} parent the parent div
 * @param {Hierarchy} elem the hierarchy
 */
const renderElem = (parent, elem) => {
	// console.log(elem.children, elem, elem["children"])
	for (var i = 0; i < elem.children.length; i++) {
		if (dontrender.find((val) => val === i)) {
			//renderChildren(i);
			continue;
		}

		const element = elem.children[i];
		const div = newElem(element);

		parent.append(div);

		if (element.children.length !== 0) {
			for (const child of element.children) {
				dontrender.push(child);
			}

			renderChildren(parent, i, elem, 1);
		}
	}
};

/**
 * @param {Number} id
 * @param {Hierarchy} elem
 */
const renderChildren = (parent, id, elem, depth) => {
	const element = elem.children[id];

	for (const childid of element.children) {
		const child = elem.children[childid];
		const div = newElem(child);
		div.style.transform = "translate(" + depth * 15 + "px, 0px)";
		div.style.width = "calc(100% - " + depth * 15 + "px)";
		parent.append(div);
		dontrender.push(childid);

		console.log(depth, childid, child, parent);

		if (child.children.length !== 0) {
			renderChildren(parent, childid, elem, depth + 1);
		}
	}
}

render();

container.addEventListener("contextmenu", (e) => {
	menu.style.transform = "translate(" + e.pageX + "px, " + e.pageY + "px)";
	menu.style.display = "flex";
});

addEventListener("click", () => menu.style.display = "none");

container.addEventListener("click", () => {
	// if (justClicked) {
		// justClicked = false;
		// return;
	// }

	if (!justClicked) {
		inspector = -1;
		window.electronAPI.inspectHierarchyElement(-1);
	}

	for (const element of document.getElementsByClassName("selected")) {
		if (parseInt(element.id) === inspector) continue;
		element.classList.remove("selected");
	}

	justClicked = false;
})

document.getElementById("newobj").addEventListener("click", (e) => {
	const parent = selected === -1 ? (inspector === -1 ? -1 : inspector) : selected
	window.electronAPI.newobj(parent, "New Obj", elements);
	selected = -1;
	render();
})

window.electronAPI.handleRender(render);