import os
from datetime import datetime

import httpx
from database.db_init import db
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from intelligence.agent.agent import run_tools
from intelligence.ai_caller import client
from intelligence.tools.build_prompt import build_Prompt
from pydantic import BaseModel

load_dotenv()

app = FastAPI()
clientSecret = os.getenv("clientSecret")
clientId = os.getenv("clientId")

origins = ["http://localhost:5173", "http://127.0.0.1:8000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allowed domains
    allow_credentials=True,  # Allow cookies and auth headers
    allow_methods=["*"],  # Allow all HTTP verbs (GET, POST, etc.)
    allow_headers=["*"],  # Allow all custom request headers
)


@app.get("/api/auth/github")
async def gitAuth():
    state = os.urandom(16).hex()
    githubUrl = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={clientId}"
        f"&redirect_uri=http://127.0.0.1:8000/api/auth/github/callback"
        f"&scope=repo user"
        f"&state={state}"
    )

    return RedirectResponse(url=githubUrl)


class AiService(BaseModel):
    question: str
    repo: list[dict] | str


@app.post("/ai_resp")
async def ai_service(data: AiService):
    tools_output = await run_tools(
        "repo_tree", {"owner": "Manav-Nocode", "repo": "Ai_engineer"}
    )

    prompt = build_Prompt(data)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=f"""
{prompt}

Tool Output:
{tools_output}
""",
    )
    print(response)
    return {"answer": response.text}


@app.get("/api/auth/github/callback")
async def github_callback(code: str, state: str = None):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={"client_id": clientId, "client_secret": clientSecret, "code": code},
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


@app.get("/api/repos")
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


@app.post("/api/repos/select")
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


@app.get("/api/userRepos")
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


@app.get("/api/repos/contents")
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


# ============ STEP 6: MODIFY FILES ============


# @app.put("/api/repos/contents")
# async def update_file(
#     user_id: int, path: str, content: str, message: str, sha: str = None
# # ):
#     """Create or update a file in the selected repo"""

#     if user_id not in user_tokens or user_id not in selected_repos:
#         raise HTTPException(
#             status_code=400, detail="GitHub not connected or no repo selected"
#         )

#     access_token = user_tokens[user_id]["access_token"]
#     repo = selected_repos[user_id]["repo_full_name"]

#     import base64

#     encoded_content = base64.b64encode(content.encode()).decode()

#     payload = {
#         "message": message,
#         "content": encoded_content,
#         "branch": "main",  # or get default branch dynamically
#     }

#     # If sha provided, it's an update (required by GitHub)
#     if sha:
#         payload["sha"] = sha

#     async with httpx.AsyncClient() as client:
#         response = await client.put(
#             f"https://api.github.com/repos/{repo}/contents/{path}",
#             headers={
#                 "Authorization": f"Bearer {access_token}",
#                 "Accept": "application/vnd.github.v3+json",
#             },
#             json=payload,
#         )

#     if response.status_code not in [200, 201]:
#         raise HTTPException(status_code=response.status_code, detail=response.json())

#     return {
#         "message": "File updated successfully",
#         "commit": response.json()["commit"]["sha"],
#     }


# ============ STEP 7: CREATE PULL REQUEST ============


# @app.post("/api/repos/pulls")
# async def create_pull_request(
#     user_id: int, title: str, body: str, head: str, base: str = "main"
# ):
#     """Create a pull request"""

#     if user_id not in user_tokens or user_id not in selected_repos:
#         raise HTTPException(
#             status_code=400, detail="GitHub not connected or no repo selected"
#         )

#     access_token = user_tokens[user_id]["access_token"]
#     repo = selected_repos[user_id]["repo_full_name"]

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"https://api.github.com/repos/{repo}/pulls",
#             headers={
#                 "Authorization": f"Bearer {access_token}",
#                 "Accept": "application/vnd.github.v3+json",
#             },
#             json={"title": title, "body": body, "head": head, "base": base},
#         )

#     if response.status_code != 201:
#         raise HTTPException(status_code=response.status_code, detail=response.json())

#     pr_data = response.json()
#     return {"pull_request_url": pr_data["html_url"], "pr_number": pr_data["number"]}


# # ============ DISCONNECT ============


# @app.post("/api/auth/github/disconnect")
# async def disconnect_github(user_id: int):
#     """Remove GitHub connection"""

#     user_tokens.pop(user_id, None)
#     selected_repos.pop(user_id, None)

#     return {"message": "GitHub disconnected"}
