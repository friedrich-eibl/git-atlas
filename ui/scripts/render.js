/**
 * Render the bubble visualization
 *
 * @param {HTMLElement} viz
 * @param {Object} current       - current d3 hierarchy node
 * @param {Object} fullRoot      - root hierarchy node
 * @param {HTMLElement} pathEl
 * @param {HTMLButtonElement} backBtn
 * @param {HTMLButtonElement} rootBtn
 * @param {HTMLElement} tooltip
 * @param {Function} navigateDir
 * @param {Function} pathOf
 * @param {Function} extColor
 * @param {Function} setCurrent  - setter: (node) => void
 */
function render(
	viz,
	current,
	fullRoot,
	pathEl,
	backBtn,
	rootBtn,
	tooltip,
	navigateDir,
	pathOf,
	extColor,
	setCurrent,
) {
	// clear canvas
	viz.innerHTML = "";

	const width = viz.clientWidth;
	const height = viz.clientHeight;

	// update UI
	pathEl.textContent = pathOf(current).join(" / ");
	backBtn.disabled = !current.parent;
	rootBtn.disabled = current === fullRoot;

	// build hierarchy
	const root = d3
		.hierarchy(current.data)
		.sum((d) => (d.type === "file" ? d.size : 0))
		.sort((a, b) => (b.value || 0) - (a.value || 0));

	d3.pack().size([width, height]).padding(4)(root);

	// svg
	const svg = d3
		.select(viz)
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%");

	// nodes
	const nodes = svg
		.selectAll("g.node")
		.data(root.descendants())
		.join("g")
		.attr("class", "node")
		.attr("transform", (d) => `translate(${d.x},${d.y})`)
		.style("cursor", (d) =>
			d.data.type === "dir" && d.depth > 0 ? "pointer" : "default",
		)
		.on("click", (e, d) => {
			if (d.data.type !== "dir" || d.depth === 0) return;

			const parts = d
				.ancestors()
				.reverse()
				.slice(1)
				.map((a) => a.data.name);

			const next = navigateDir(current, parts);
			setCurrent(next);

			render(
				viz,
				next,
				fullRoot,
				pathEl,
				backBtn,
				rootBtn,
				tooltip,
				navigateDir,
				pathOf,
				extColor,
				setCurrent,
			);
		})
		.on("mousemove", (e, d) => {
			tooltip.style.display = "block";
			tooltip.textContent =
				d.data.type === "file"
					? `${d.data.path} (${Math.round((d.value || 0) / 1024)} KB)`
					: d.data.name + "/";
			tooltip.style.left = e.clientX + 12 + "px";
			tooltip.style.top = e.clientY + 12 + "px";
		})
		.on("mouseleave", () => {
			tooltip.style.display = "none";
		});

	// circles
	nodes
		.append("circle")
		.attr("r", (d) => d.r)
		.attr("fill", (d) =>
			d.data.type === "dir" ? "#f3f4f6" : extColor(d.data.ext),
		)
		.attr("stroke", "#e5e7eb");

	// labels (only direct children)
	svg.append("g")
		.selectAll("text")
		.data(root.descendants().filter((d) => d.depth === 1 && d.r > 18))
		.join("text")
		.attr("x", (d) => d.x)
		.attr("y", (d) => d.y)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "middle")
		.style("pointer-events", "none")
		.style("font-weight", "700")
		.style("fill", "#111827")
		.style("paint-order", "stroke")
		.style("stroke", "#ffffff")
		.style("stroke-width", "3px")
		.style("font-size", (d) => {
			const size = d.r * 0.35;
			return Math.max(12, Math.min(26, size)) + "px";
		})
		.text((d) =>
			d.data.name.length > 18
				? d.data.name.slice(0, 18) + "…"
				: d.data.name,
		);
}

