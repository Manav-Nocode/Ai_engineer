from .fetch_Repo_tree import execute as fetch_repo_tree
from .read_file_content import execute as read_file_content

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
            "description": "Call this SECOND once you have the repository tree. Reads the code/text content of a specific file path found in the repository tree.",
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
    # Add your schema for 'fetch_repo_tree' here as well...
]

TOOLS = {
    "fetch_repo_tree": fetch_repo_tree,
    "read_file_content": read_file_content,
}
