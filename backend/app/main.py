import json
import os
import signal
from contextlib import asynccontextmanager

import socketio
from app.config import settings
from app.router.fetch_selected_repos import router as get_allUser_repos
from app.router.fetch_selected_repos import router as gitauth
from app.router.getRepoContent import router as getRepoContents
from app.router.getusersRepos import router as list_repositories
from app.router.redirect_handler import router as github_callback
from app.router.selectRepo import router as selectRepo
from app.socket.socket import client_terminals, sio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google.genai import types
from intelligence.tools.build_prompt import SYSTEM_PROMPT, build_Prompt

# from intelligence.tools.Evaluate_tech_stack import execute as Evaluate_tech_stack
# from intelligence.tools.fetch_Repo_tree import execute as fetch_repo_tree
# from intelligence.tools.read_file_content import execute as read_file_content
from intelligence.tools.registery import get_tool_handler, get_tool_schema
from openai import OpenAI
from pydantic import BaseModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    print("shutting down. cleaning terminal processes")
    for sid, info in list(client_terminals.items()):
        try:
            info["task"].cancel()
            os.close(info("fd"))
            os.kill(info["pid"], signal.SIGKILL)
        except Exception:
            pass
    print("cleanup finished")


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AiService(BaseModel):
    question: str


@app.post("/ai_test")
async def func(data: AiService):
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=settings.API_KEY,
    )

    state = {}
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": data.question},
    ]

    max_iter = 5

    for iteration in range(max_iter):
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=get_tool_schema(),
            tool_choice="auto",
        )

        output_message = response.choices[0].message
        tool_calls = output_message.tool_calls
        if not tool_calls:
            return {"final_response": output_message.content}

        messages.append(output_message)
        print(messages)
        for tool_call in tool_calls:
            function_name = tool_call.function.name

            # Safe parser check for empty/missing arguments
            raw_args = tool_call.function.arguments
            if raw_args and isinstance(raw_args, str) and raw_args.strip():
                function_args = json.loads(raw_args)
            else:
                function_args = {}

            if function_args is None:
                function_args = {}

            handler = get_tool_handler(function_name)

            if handler:
                print(
                    f"🔄 Agent Loop Iteration {iteration + 1}: Running tool '{function_name}'"
                )
                tool_result = await handler(state=state, **function_args)

                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": function_name,
                        "content": json.dumps(tool_result),
                    }
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Function '{function_name}' requested by LLM not found",
                )
        print(response)
        # print(messages)
    return {"error": "Agent loop exceeded maximum allowable cycles."}


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


# app.include_router(gitauth, prefix=("/api"))
app.include_router(github_callback, prefix="/api/auth")
app.include_router(get_allUser_repos, prefix="/api")
app.include_router(list_repositories, prefix="/api")
app.include_router(selectRepo, prefix="/api")
app.include_router(getRepoContents, prefix=("/api"))


@app.get("/test-api")
def test_api():
    return {"status": "HTTP routes are working completely fine!"}


socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="socket.io")
