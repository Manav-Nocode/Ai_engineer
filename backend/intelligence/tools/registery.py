import json
from typing import Any, Callable, Dict, List

from intelligence.register import Tool_registry

from .fetch_Repo_tree import handler as fetch_repo_tree
from .read_file_content import handler as read_file_content
from .readMemory import handler as readMemory
from .writeMemory import handler as updateMemory


def get_tool_schema() -> List[Dict]:
    """Return all schemas for OpenAI tools parameter."""
    return [
        {"type": "function", "function": meta["schema"]}
        for meta in Tool_registry.values()
    ]


def get_tool_handler(name: str) -> Callable:
    if name not in Tool_registry:
        raise ValueError(f"Unknown tool: {name}")
    return Tool_registry[name]["handler"]


def get_tool_meta(name: str) -> Dict[str, Any]:
    return Tool_registry[name]


TOOLS = {
    "fetch_repo_tree": fetch_repo_tree,
    "read_file_content": read_file_content,
    "update_memory": updateMemory,
    "read_memory": readMemory,
}

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "fetch_repo_tree",
            "description": "Fetches the file repository tree from GitHub for the 'Visual_Repo' repository",
            "parameters": {
                "type": "object",
                "properties": {},  # No arguments needed for this function
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_file_content",
            "description": "Call this SECOND once you have the repository tree. Reads the code/text content of a specific file path found in the repository tree. Just provide the full code output ",
            "parameters": {
                "type": "object",
                "properties": {
                    "repo": {
                        "type": "array",
                        "description": "The repository tree structure containing file items.",
                        # (Optional) You can define the tree structure more deeply if needed,
                        # but keeping it as an object/array works for general mapping.
                    },
                    "path": {
                        "type": "string",
                        "description": "The file path to look up and match.",
                    },
                },
                "required": ["repo", "path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_memory",
            "description": "After reaching to the solution of users question, use this tool to update the writeMemory file. Just write the summary of the everything you did",
            "parameters": {
                "type": "object",
                "properties": {
                    "mem": {
                        "type": "string",
                        "description": "The memory string to update.",
                    }
                },
                "required": ["mem"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_memory",
            "description": "this function helps agent read the memory if it already knows the answer to user's query",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
]
