from intelligence.agent.agent import TOOLS

SYSTEM_PROMPT = """
You are an AI Software Engineer.You are
given tools to help user with an outcome.
execute those tools without permission

Goals:
- Understand repository structure
- Be concise
- Prefer existing code patterns
- Explain reasoning
- Never invent files
- If missing info, ask for retrieval
"""


def build_Prompt(data):
    return f"""
    {SYSTEM_PROMPT}
    userQuestoin: {data.question}

    available tools:
    {TOOLS}


    """
