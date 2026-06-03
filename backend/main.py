from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse, JSONResponse
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
import httpx
import os
load_dotenv()

app = FastAPI()
clientSecret = os.getenv("clientSecret")
clientId = os.getenv("clientId")


user_tokens = {} 
selected_repos = {}

@app.get(f"/api/auth/github")
async def gitAuth():
    state = os.urandom(16).hex()
    githubUrl = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={clientId}"
        f"&redirect_uri=http://127.0.0.1:4040"
        f"&scope=repo user"
        f"&state={state}"
    )
    print(githubUrl)
    return RedirectResponse(url=githubUrl)

@app.get("/api/auth/github/callback")
async def github_callback(code: str, state:str = None):
    async with httpx.AsyncClient() as client:
        response = await client.post(
                        "https://github.com/login/oauth/access_token",
                        headers={"Accept": "application/json"},
                        data={
                            "client_id": clientId,
                            "client_secret" : clientSecret,
                            "code" : code
                        },

        )
        token_data = response.json()

        if "error" in token_data:
            raise HTTPException(status_code=400,
                                detail=token_data["error_description"])
        access_token = token_data["access_token"]

        async with httpx.AsyncClient() as client:
             user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
             user_data = user_response.json()
             user_id = user_data["id"]
             username = user_data["login"]

             user_tokens[user_id] = {
        "access_token": access_token,
        "username": username,
        "connected_at": datetime.now().isoformat()
    }
             return RedirectResponse(url=f"http://localhost:3000/dashboard?github_connected=true&user_id={user_id}")



    @app.get("/api/repos")
    async def list_repositories(user_id: int):
        if user_id not in user_tokens:
            raise HTTPException(status_code=400, detail="github not connected")
        access_token = user_tokens[user_id]["access_token"]
        async with httpx.AsyncClient() as client:
            response = await client.get(
                 "https://api.github.com/user/repos",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            },
            params={
                "sort": "updated",
                "per_page": 100,
                "affiliation": "owner,collaborator,organization_member"
            }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repos")
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
            "stars": repo["stargazers_count"]
        }
        for repo in repos
    ]

    return {"respositories" : formatted_repos}
  

@app.post("/api/repos/select")
async def select_repository(user_id:int, repo_full_name: str):
    if user_id not in user_tokens:
        raise HTTPException(status_code=400, detail="github not found")
    
    select_repository[user_id] = {
        "repo_full_name" : repo_full_name,
        "selected_at" : datetime.now().isoformat()
    }

    return {
        "message": f"Respository {repo_full_name} selected",
        "repo" :  repo_full_name
    }

@app.get("/api/repos/contents")
async def get_repo_contents(user_id: int, path: str = ""):
    """Read files and folders from selected repo"""
    
    if user_id not in user_tokens or user_id not in selected_repos:
        raise HTTPException(status_code=400, detail="GitHub not connected or no repo selected")
    
    access_token = user_tokens[user_id]["access_token"]
    repo = selected_repos[user_id]["repo_full_name"]
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{repo}/contents/{path}",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch contents")
    
    contents = response.json()
    
    # Single file vs directory
    if isinstance(contents, dict):  # Single file
        return {
            "type": "file",
            "name": contents["name"],
            "path": contents["path"],
            "content": contents.get("content"),  # Base64 encoded
            "sha": contents["sha"],
            "download_url": contents["download_url"]
        }
    
    # Directory listing
    return {
        "type": "directory",
        "path": path,
        "items": [
            {
                "name": item["name"],
                "type": item["type"],  # "file" or "dir"
                "path": item["path"],
                "size": item.get("size"),
                "sha": item["sha"]
            }
            for item in contents
        ]
    }


# ============ STEP 6: MODIFY FILES ============

@app.put("/api/repos/contents")
async def update_file(user_id: int, path: str, content: str, message: str, sha: str = None):
    """Create or update a file in the selected repo"""
    
    if user_id not in user_tokens or user_id not in selected_repos:
        raise HTTPException(status_code=400, detail="GitHub not connected or no repo selected")
    
    access_token = user_tokens[user_id]["access_token"]
    repo = selected_repos[user_id]["repo_full_name"]
    
    import base64
    encoded_content = base64.b64encode(content.encode()).decode()
    
    payload = {
        "message": message,
        "content": encoded_content,
        "branch": "main"  # or get default branch dynamically
    }
    
    # If sha provided, it's an update (required by GitHub)
    if sha:
        payload["sha"] = sha
    
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"https://api.github.com/repos/{repo}/contents/{path}",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            },
            json=payload
        )
    
    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    
    return {
        "message": "File updated successfully",
        "commit": response.json()["commit"]["sha"]
    }


# ============ STEP 7: CREATE PULL REQUEST ============

@app.post("/api/repos/pulls")
async def create_pull_request(user_id: int, title: str, body: str, head: str, base: str = "main"):
    """Create a pull request"""
    
    if user_id not in user_tokens or user_id not in selected_repos:
        raise HTTPException(status_code=400, detail="GitHub not connected or no repo selected")
    
    access_token = user_tokens[user_id]["access_token"]
    repo = selected_repos[user_id]["repo_full_name"]
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.github.com/repos/{repo}/pulls",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            },
            json={
                "title": title,
                "body": body,
                "head": head,
                "base": base
            }
        )
    
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    
    pr_data = response.json()
    return {
        "pull_request_url": pr_data["html_url"],
        "pr_number": pr_data["number"]
    }


# ============ DISCONNECT ============

@app.post("/api/auth/github/disconnect")
async def disconnect_github(user_id: int):
    """Remove GitHub connection"""
    
    user_tokens.pop(user_id, None)
    selected_repos.pop(user_id, None)
    
    return {"message": "GitHub disconnected"}