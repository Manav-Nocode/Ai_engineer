import httpx


async def execute(
    owner: str,
    repo: str,
    branch: str = "main"
):

    async with httpx.AsyncClient() as client:
        print("i was called agint")
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
        )
        # print(response.json())
        return response.json()