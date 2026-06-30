from ..register import register_tool


async def handler(mem: object, state: dict = None):
    # print(mem)
    with open(
        "/Users/manav/Desktop/Repositories/AiEngineer/backend/intelligence/memory/remember.md",
        "a",
    ) as file:
        file.write(f"\n{mem}")


register_tool(
    name="update_memory",
    handler=handler,
    schema={
        "name": "update_memory",
        "parameters": {
            "type": "object",
            "properties": {
                "mem": {
                    "type": "string",
                    "description": "the string that is written in the memory",
                },
            },
            "required": ["mem"],
        },
    },
)
