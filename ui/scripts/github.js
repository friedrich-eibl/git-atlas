function parseGitHubUrl(url) {
	try {
		const u = new URL(url);
		const p = u.pathname.split("/").filter(Boolean);
		return p.length >= 2
			? { owner: p[0], repo: p[1].replace(/\.git$/, "") }
			: null;
	} catch {
		return null;
	}
}

function extColor(ext) {
	const map = LINGUIST_COLORS.ext;
	return map[ext] || "#9ca3af";
}

async function gh(url) {
	const r = await fetch(url, {
		headers: { Accept: "application/vnd.github+json" },
	});
	if (!r.ok) throw new Error(await r.text());
	return r.json();
}

