import base64
from typing import List, TypedDict, Union

import httpx


class TreeItem(TypedDict):
    path: str
    type: str
    url: str


class InputType(TypedDict):
    data: List[TreeItem]


async def execute(path: str = None, repo: Union[dict, list] = None, **kwargs):
    # 1. Catch missing mandatory arguments gracefully to prevent system crash
    print("i was called")
    if not path:
        return {
            "error": "The 'path' argument is required but was not provided by the model."
        }

    # 2. Check kwargs for hallucinated repo variable names
    if repo is None:
        for alternative_key in ["repo_data", "repository", "tree", "repo_tree", "data"]:
            if alternative_key in kwargs:
                repo = kwargs[alternative_key]
                break

    if repo is None:
        return {
            "error": "The model failed to provide the repository tree history data."
        }

    # 3. Handle structure adjustments dynamically
    if isinstance(repo, dict):
        # Extract list if wrapped inside a dict key (e.g., {"data": [...]}, {"tree": [...]})
        file_list = repo.get("data", repo.get("tree", repo.get("repo", [])))
        if not file_list and isinstance(repo, dict):
            file_list = list(repo.values())  # Complete fallback
    else:
        file_list = repo

    # 4. Search loop with safety checkpoints
    target_item = None
    for item in file_list:
        if isinstance(item, dict) and "path" in item:
            if path in item["path"]:
                target_item = item
                break

    if not target_item or "url" not in target_item:
        return {
            "error": f"Could not map a valid download URL for the file path: '{path}'."
        }

    url = target_item["url"]

    # 5. Fetch and decode raw base64 data stream
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        contents = response.json()

        # Guard clause for empty or missing content attributes
        if "content" not in contents:
            return {
                "error": f"The GitHub API did not return standard text blob content for URL: {url}"
            }

        raw_base64 = contents["content"].replace("\n", "")
        decoded_text = base64.b64decode(raw_base64).decode("utf-8")

        return {"code": decoded_text}
