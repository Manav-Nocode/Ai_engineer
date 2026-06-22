import httpx
from database.db_init import db
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/repos/contents", tags=["repos"])


@router.get("/")
async def get_repo_contents(user_id: int, repo: str, path: str = ""):
    """Read files and folders from selected repo"""
    User_Coll = db["users"]
    check_user = User_Coll.find_one({"github_user_id": user_id})

    if not check_user:  # add a check if the repo is selected or not
        raise HTTPException(
            status_code=400, detail="GitHub not connected or no repo selected"
        )

    access_token = check_user["access_token"]

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{repo}/contents",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch contents"
        )

    contents = response.json()
    # Single file vs directory
    if isinstance(contents, dict):  # Single file
        return {
            "type": "file",
            "name": contents["name"],
            "path": contents["path"],
            "content": contents.get("content"),  # Base64 encoded
            "encoding": contents.get("encoding"),  # "base64"
            "sha": contents["sha"],
            "size": contents.get("size"),
            "html_url": contents.get("html_url"),
            "url": contents.get("url"),
            "download_url": contents.get("download_url"),
        }

    # Directory listing
    return {
        "type": "directory",
        "path": path or "",
        "items": [
            {
                "name": item["name"],
                "type": item["type"],
                "path": item["path"],
                "size": item.get("size"),
                "sha": item["sha"],
                "html_url": item.get("html_url"),  # ✅ Add this
                "download_url": item.get("download_url"),  # API URL for this item
                "url": item.get("url"),
                "content": item.get("content"),
                "encoding": item.get("encoding"),
            }
            for item in contents
        ],
    }
