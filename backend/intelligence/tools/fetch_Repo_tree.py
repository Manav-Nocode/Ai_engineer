import asyncio

import httpx
from intelligence.register import register_tool

ignore = [
    ".gitignore",
    "README.md",
    "public",
    "package-lock.json",
    ".env",
    ".vercel",
    "public",
]
to_remove_keys = ["mode", "sha", "size"]


async def handler(state: dict = None, **kwargs):
    print("fetch repo was called")
    # if state["repo_tree"]:
    #     data = state["repo_tree"]
    #     print("data already exists")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/Manav-Nocode/Visual_Repo/git/trees/main?recursive=1"
        )
        data = response.json()
        fetched_repo_data = data["tree"]
        for item in fetched_repo_data:
            for key in to_remove_keys:
                item.pop(key, None)
        for idx in range(len(fetched_repo_data) - 1, -1, -1):
            filepath = fetched_repo_data[idx]["path"]

            if any(ignore_item in filepath for ignore_item in ignore):
                fetched_repo_data.pop(idx)
            if state is not None:
                state["repo_tree"] = fetched_repo_data
        return fetched_repo_data


register_tool(
    name="fetch_repo_tree",
    handler=handler,
    schema={
        "name": "fetch_repo_tree",
        "description": "Fetches the file repository tree from GitHub",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
)

# asyncio.run(execute())
