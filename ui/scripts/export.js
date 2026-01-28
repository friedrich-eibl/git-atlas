function exportSVG() {
	const svg = viz.querySelector("svg");
	if (!svg) return;

	const clone = svg.cloneNode(true);
	clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

	const serializer = new XMLSerializer();
	const src = serializer.serializeToString(clone);
	const blob = new Blob([src], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "fileatlas.svg";
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

