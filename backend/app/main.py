import json
import os

from app.config import settings
from app.router.fetch_selected_repos import router as get_allUser_repos
from app.router.getRepoContent import router as getRepoContents
from app.router.getusersRepos import router as list_repositories
from app.router.redirect_handler import router as github_callback
from app.router.selectRepo import router as selectRepo
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from google.genai import types
from intelligence.agent.agent import run_tools

# from intelligence.ai_caller import client
from intelligence.tools.build_prompt import build_Prompt
from intelligence.tools.Evaluate_tech_stack import execute as Evaluate_tech_stack
from intelligence.tools.fetch_Repo_tree import execute as fetch_repo_tree
from intelligence.tools.read_file_content import execute as read_file_content
from intelligence.tools.registery import TOOLS, TOOLS_SCHEMA
from openai import OpenAI
from pydantic import BaseModel

app = FastAPI(title=settings.PROJECT_NAME)
origins = ["http://localhost:5173", "http://127.0.0.1:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(settings.API_KEY)


class AiService(BaseModel):
    question: str


@app.post("/ai_test")
async def func(data: AiService):
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=settings.API_KEY,
    )

    messages = [
        {
            "role": "system",
            "content": "You are a helpful programming assistant. When asked to look at a repository, first call fetch_repo_tree to look at the workspace structure, and then immediately call read_file_content to inspect the contents of any relevant code files.",
        },
        {"role": "user", "content": data.question},
    ]

    max_iter = 5

    for iteration in range(max_iter):
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
        )

        output_message = response.choices[0].message
        tool_calls = output_message.tool_calls
        if not tool_calls:
            return {"final_response": output_message.content}

        messages.append(output_message)

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

            function_to_call = TOOLS.get(function_name)

            if function_to_call:
                print(
                    f"🔄 Agent Loop Iteration {iteration + 1}: Running tool '{function_name}'"
                )
                tool_result = await function_to_call(**function_args)

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


@app.get("/test")
def fun():
    return {"msg": "server up"}


# async def ai_service(data: AiService):
#     prompt = build_Prompt(data)
#     response = client.models.generate_content(
#         model="gemini-3.5-flash",
#         contents=f"""
#         {prompt}

#         """,
#     )
#     print(response)
#     return response

# Point to your local Ollama instance


app.include_router(github_callback, prefix="/api/auth")
app.include_router(get_allUser_repos, prefix="/api")
app.include_router(list_repositories, prefix="/api")
app.include_router(selectRepo, prefix="/api")


app.include_router(getRepoContents, prefix=("/api"))
