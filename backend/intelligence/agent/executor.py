from typing import Any, Dict

from intelligence.tools.registery import get_tool_handler, get_tool_meta


async def executeTool(
    tool_name: str,
    tool_args: Dict[str, Any],
    state: Dict[str, Any],
) -> Dict[str, any]:
    """
    Execute a single tool with automatic state injection and persistence.
    """
    meta = get_tool_meta[tool_name]
    handler = meta["handler"]
