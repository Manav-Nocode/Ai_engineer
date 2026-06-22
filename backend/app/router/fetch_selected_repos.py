from database.db_init import db
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/userRepos", tags=["repos"])


@router.get("/")
async def get_allUser_repos(user_id: int):
    User_Coll = db["users"]
    check_user = User_Coll.find_one({"github_user_id": user_id})
    if not check_user:
        raise HTTPException(status_code=400, detail="Github not connected")

    Repo_Coll = db["Connected_repos"]
    existing_repos = Repo_Coll.find({"github_user_id": user_id})
    repos = [
        {"repo_name": repo["repo_name"], "repo_full_name": repo["repo_full_name"]}
        for repo in existing_repos
    ]
    return {"repos": repos}
