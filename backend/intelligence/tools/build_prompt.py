import json
SYSTEM_PROMPT = """
You are an AI Software Engineer.

Goals:
- Understand repository structure
- Be concise
- Prefer existing code patterns
- Explain reasoning
- Never invent files
- If missing info, ask for retrieval
"""
from intelligence.agent.agent import TOOLS
def build_Prompt(data):
    return f"""
    {SYSTEM_PROMPT}


    userQuestoin: {data.question}

    available tools:
    read_file(owner,repo)

    """
