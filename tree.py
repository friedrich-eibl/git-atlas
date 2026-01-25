import os
import json

def walk(dir_path):
    result = []
    for root, dirs, files in os.walk(dir_path):
        for d in dirs:
            result.append({
                "path": os.path.relpath(os.path.join(root, d), dir_path).replace("\\", "/"),
                "type": "tree"
            })
        for f in files:
            full = os.path.join(root, f)
            result.append({
                "path": os.path.relpath(full, dir_path).replace("\\", "/"),
                "type": "blob",
                "size": os.path.getsize(full)
            })
    return result

if __name__ == "__main__":
    import sys
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    data = { "tree": walk(folder), "truncated": False }
    with open("tree.json", "w") as f:
        json.dump(data, f, indent=2)

