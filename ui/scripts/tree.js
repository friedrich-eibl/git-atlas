function treeListToHierarchy(list) {
	const root = { name: "repo", type: "dir", children: [] };
	const ensure = (p, n) =>
		p.children.find((c) => c.type === "dir" && c.name === n) ||
		(p.children.push({ name: n, type: "dir", children: [] }),
		p.children.at(-1));
	for (const it of list) {
		if (!it.path) continue;
		const parts = it.path.split("/");
		let node = root;
		for (let i = 0; i < parts.length; i++) {
			const last = i === parts.length - 1;
			if (!last) node = ensure(node, parts[i]);
			else if (it.type === "blob") {
				const name = parts[i];
				node.children.push({
					name,
					type: "file",
					size: it.size || 1,
					ext: name.split(".").pop().toLowerCase(),
					path: it.path,
				});
			}
		}
	}
	return root;
}

function pathOf(n) {
	const p = [];
	while (n) {
		if (n.parent) p.push(n.data.name);
		n = n.parent;
	}
	return ["repo"].concat(p.reverse());
}

function navigateDir(fromNode, parts) {
	let cur = fromNode;
	for (const seg of parts) {
		const next = cur.children?.find(
			(c) => c.data.type === "dir" && c.data.name === seg,
		);
		if (!next) return cur;
		cur = next;
	}
	return cur;
}

