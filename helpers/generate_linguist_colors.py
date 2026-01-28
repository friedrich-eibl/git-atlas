import yaml
import json

with open("languages.yml", "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

ext_colors = {}
name_colors = {}

for lang in data.values():
    color = lang.get("color")
    if not color:
        continue

    # extensions: ".js" -> "js"
    for ext in lang.get("extensions", []):
        key = ext.lstrip(".").lower()
        ext_colors[key] = color

    # filenames: "Dockerfile"
    for name in lang.get("filenames", []):
        name_colors[name.lower()] = color

output = {
    "ext": ext_colors,
    "name": name_colors
}

# Option A: write JSON
with open("linguist-colors.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

# Option B: write JS module
with open("linguist-colors.js", "w", encoding="utf-8") as f:
    f.write("export const LINGUIST_COLORS = ")
    json.dump(output, f, indent=2)
    f.write(";")

print(
    f"Generated {len(ext_colors)} extensions and "
    f"{len(name_colors)} filenames"
)

