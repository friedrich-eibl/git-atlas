function normalizeSVG(svg, padding = 20) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");

  while (clone.firstChild) {
    wrapper.appendChild(clone.firstChild);
  }
  clone.appendChild(wrapper);

  clone.style.position = "absolute";
  clone.style.left = "-99999px";
  clone.style.top = "-99999px";
  clone.style.visibility = "hidden";

  document.body.appendChild(clone);

  const bbox = wrapper.getBBox();

  document.body.removeChild(clone);

  const width = bbox.width + padding * 2;
  const height = bbox.height + padding * 2;

  clone.setAttribute(
    "viewBox",
    `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`,
  );
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  clone.removeAttribute("style");

  return { clone, width, height };
}

function exportSVG() {
  const svg = viz.querySelector("svg");
  if (!svg) return;

  const { clone } = normalizeSVG(svg);

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

function exportPNG() {
  const svg = viz.querySelector("svg");
  if (!svg) return;

  const { clone, width, height } = normalizeSVG(svg);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "fileatlas.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, "image/png");
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    console.error("Failed to load SVG into image");
  };

  img.src = url;
}
