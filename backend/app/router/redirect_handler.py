from datetime import datetime

import httpx
from app.config import settings
from database.db_init import db
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/github/callback", tags=["lesson"])


@router.get("/")
async def github_callback(code: str, state: str = None):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.clientId,
                "client_secret": settings.clientSecret,
                "code": code,
            },
        )
        token_data = response.json()
        print(token_data)
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data["error_description"])
        access_token = token_data["access_token"]

        async with httpx.AsyncClient() as client:
            user_response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            user_data = user_response.json()
            github_user_id = user_data["id"]
            username = user_data["login"]

        User_Coll = db["users"]
        user_already_exists = User_Coll.find_one({"github_user_id": github_user_id})

        User_info = {
            "username": username,
            "github_user_id": github_user_id,
            "access_token": access_token,
            "last_login": datetime.utcnow().isoformat(),
        }

        if not user_already_exists:
            User_info["created_at"] = (datetime.utcnow().isoformat(),)
            User_Coll.insert_one(User_info)

        else:
            User_Coll.update_one(
                {"github_user_id": github_user_id},
                {
                    "$set": {
                        "access_token": access_token,
                        "last_login": datetime.utcnow().isoformat(),
                    }
                },
            )

        return RedirectResponse(
            url=f"http://localhost:5173?github_connected=true&user_id={github_user_id}"
        )
