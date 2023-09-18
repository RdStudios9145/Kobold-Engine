const windows = {};
console.log("hi")

const a = async () => {
	const data = await window.electronAPI.loadedProject();

	for (const cwindow of data.settings.windows) {
		console.log(cwindow);
		const wind = await window.electronAPI.createWindow(cwindow);
		windows[cwindow.name] = wind;
	}
};

a();

// handleLoad(async (event, project, settings) => {
// 	console.log("hi");
// 	for (const window of settings.windows) {
// 		const wind = await window.electronAPI.createWindow(window);
// 		windows[window.name] = wind;
// 	}
// });