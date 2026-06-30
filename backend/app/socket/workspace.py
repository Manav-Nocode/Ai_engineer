from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[2] / "workspace" / "ai-swe-project"


def get_workspace() -> Path:
    WORKSPACE.mkdir(parents=True, exist_ok=True)
    return WORKSPACE
