async function loadLocalTree() {
	const res = await fetch("tree.json");
	const tree = await res.json();

	FULL_ROOT = d3.hierarchy(treeListToHierarchy(tree.tree));
	CURRENT = FULL_ROOT;
	render();
}

async function loadLocal() {
	btn.disabled = true;
	localBtn.disabled = true;
	setStatus("Loading local project…");
	setMessage("");

	try {
		const res = await fetch("tree.json");
		if (!res.ok) {
			throw new Error(
				"Could not find tree.json. Did you run export_tree.py?",
			);
		}

		const tree = await res.json();

		FULL_ROOT = d3.hierarchy(treeListToHierarchy(tree.tree || []));
		CURRENT = FULL_ROOT;
		render();

		setStatus("Local project loaded");
	} catch (e) {
		setMessage(e.message, true);
		setStatus("Error");
	} finally {
		btn.disabled = false;
		localBtn.disabled = false;
	}
}

