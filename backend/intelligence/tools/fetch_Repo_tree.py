import httpx

ignore = [
    ".gitignore",
    "README.md",
    "public",
    "package-lock.json",
    ".env",
    ".vercel",
    "public",
]
to_remove_keys = ["mode", "sha"]


async def execute(**kwargs):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/Manav-Nocode/Visual_Repo/git/trees/main?recursive=1"
        )
        data = response.json()
        fetched_repo_data = data["tree"]
        for item in fetched_repo_data:
            for key in to_remove_keys:
                item.pop(key, None)
        # print(fetched_repo_data)
        for idx in range(len(fetched_repo_data) - 1, -1, -1):
            filepath = fetched_repo_data[idx]["path"]

            if any(ignore_item in filepath for ignore_item in ignore):
                fetched_repo_data.pop(idx)
        # print(f"Modified original count: {len(fetched_repo_data)}")

        print(fetched_repo_data)
        return fetched_repo_data
