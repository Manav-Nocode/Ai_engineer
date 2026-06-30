from typing import Any, Callable, Dict

Tool_registry: Dict[str, Dict[str, Any]] = {}


def register_tool(name: str, handler: Callable, schema: Dict):
    Tool_registry[name] = {"handler": handler, "schema": schema}
