from typing import Dict, List, TypedDict


# Equivalent to the TypeScript inputType interface
class TreeItem(TypedDict):
    path: str
    type: str
    url: str


class InputType(TypedDict):
    tree: List[TreeItem]


# Equivalent to the extensionMap Record
EXTENSION_MAP: Dict[str, str] = {
    "tsx": "typescript",
    "ts": "typescript",
    "js": "javascript",
    "jsx": "javascript",
    "py": "python",
}


def execute(data: InputType) -> List[str]:
    print("tech stack called")
    detected_languages = [
        EXTENSION_MAP[item["path"].split(".")[-1].lower()]
        for item in data
        if "." in item["path"] and item["path"].split(".")[-1].lower() in EXTENSION_MAP
    ]
    print(detected_languages)
    return list(dict.fromkeys(detected_languages))
