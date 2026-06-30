import json

from intelligence.register import register_tool


async def handler(state: dict = None, **kwargs):
    print(state)
    with open(
        "/Users/manav/Desktop/Repositories/AiEngineer/backend/intelligence/memory/remember.md",
        "r",
    ) as file:
        return json.dumps(file.read())


register_tool(
    name="read_memory",
    handler=handler,
    schema={
        "name": "read_memory",
        "description": "Fetches the file repository tree from GitHub for the 'Visual_Repo' repository",
        "parameters": {
            "type": "object",
            "properties": {},  # No arguments needed for this function
            "required": [],
        },
    },
)
