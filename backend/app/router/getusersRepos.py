import httpx
from database.db_init import db
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/repos", tags=["repos"])


@router.get("/")
async def list_repositories(user_id: int):
    User_Coll = db["users"]

    Check_User = User_Coll.find_one({"github_user_id": user_id})

    if not Check_User:
        raise HTTPException(status_code=400, detail="github not connected")
    access_token = Check_User.get("access_token")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user/repos",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
            params={
                "sort": "updated",
                "per_page": 100,
                "affiliation": "owner,collaborator,organization_member",
            },
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch repos"
            )
        repos = response.json()

    formatted_repos = [
        {
            "id": repo["id"],
            "name": repo["name"],
            "full_name": repo["full_name"],  # "owner/repo"
            "description": repo["description"],
            "private": repo["private"],
            "url": repo["html_url"],
            "clone_url": repo["clone_url"],
            "default_branch": repo["default_branch"],
            "language": repo["language"],
            "updated_at": repo["updated_at"],
            "stars": repo["stargazers_count"],
        }
        for repo in repos
    ]

    return {"success": "ok", "respositories": formatted_repos}
