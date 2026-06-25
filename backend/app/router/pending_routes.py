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
