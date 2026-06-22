from intelligence.tools.registery import TOOLS

async def run_tools(tool_name,args):
    if tool_name not in TOOLS:
        return "tool not found"
    return await TOOLS[tool_name](**args)