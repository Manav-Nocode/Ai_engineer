import os

from app.config import settings
from app.router.fetch_selected_repos import router as get_allUser_repos
from app.router.getRepoContent import router as getRepoContents
from app.router.getusersRepos import router as list_repositories
from app.router.redirect_handler import router as github_callback
from app.router.selectRepo import router as selectRepo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

app = FastAPI(title=settings.PROJECT_NAME)
origins = ["http://localhost:5173", "http://127.0.0.1:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/auth/github")
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


app.include_router(github_callback, prefix="/api/auth")
app.include_router(get_allUser_repos, prefix="/api")
app.include_router(list_repositories, prefix="/api")
app.include_router(selectRepo, prefix="/api")
app.include_router(getRepoContents, prefix=("/api"))
