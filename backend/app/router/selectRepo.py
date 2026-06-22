from datetime import datetime

from database.db_init import db
from fastapi import APIRouter, Body, HTTPException

router = APIRouter(prefix="/repos/select", tags=["repos"])


@router.post("/")
async def select_repository(user_id: int, repo: dict = Body(...)):
    User_Coll = db["users"]
    check_user = User_Coll.find_one({"github_user_id": user_id})

    if not check_user:
        raise HTTPException(status_code=400, detail="github not found")

    Repo_Coll = db["Connected_repos"]
    existing_repo = Repo_Coll.find_one(
        {"github_user_id": user_id, "repo_id": repo["id"]}
    )
    if existing_repo:
        Repo_Coll.update_one(
            {"github_user_id": user_id}, {"$set": {"last_opened": datetime.utcnow()}}
        )
        return {"message": "Repo already imported", "repo": repo["full_name"]}
    Repo_Coll.insert_one(
        {
            "github_user_id": user_id,
            "repo_id": repo["id"],
            "repo_name": repo["name"],
            "repo_full_name": repo["full_name"],
            "default_branch": repo["default_branch"],
            "imported_at": datetime.utcnow(),
            "last_opened": datetime.utcnow(),
        }
    )
    return {"message": "Respository imported", "repo": repo["full_name"]}
