import os

from config import settings
from fastapi import APIRouter
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/auth/github", tags=["auth"])


@router.get("/")
async def gitauth():
    state = os.urandom(16).hex()
    githubUrl = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={settings.clientId}"
        f"&redirect_uri=http://127.0.0.1:8000/api/auth/github/callback"
        f"&scope=repo user"
        f"&state={state}"
    )
    return RedirectResponse(url=githubUrl)
