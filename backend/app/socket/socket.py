import asyncio
import os
import pty
import signal
import traceback

import socketio
from app.socket.workspace import get_workspace

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

client_terminals = {}


async def read_from_pty(sid: str, fd: int):
    loop = asyncio.get_running_loop()

    try:
        while True:
            data = await loop.run_in_executor(None, os.read, fd, 1024)

            if not data:
                print(f"[{sid}] PTY closed")
                break
            output = data.decode("utf-8", errors="ignore")
            print("PTY:", repr(output))
            await sio.emit(
                event="terminal_output",
                data={"output": output},
                namespace="/editor",
                to=sid,
            )

    except Exception:
        traceback.print_exc()

    finally:
        print(f"[{sid}] Reader stopped")


@sio.event(namespace="/editor")
async def connect(sid, environ, auth):
    print(f"Client connected: {sid}")

    workspace = get_workspace()

    print("Workspace:", workspace)

    try:
        pid, fd = pty.fork()

        if pid == 0:
            # Child process
            try:
                os.chdir(str(workspace))

                os.environ["TERM"] = "xterm-256color"

                os.execvp(
                    "bash",
                    [
                        "bash",
                        "--login",
                    ],
                )

            except Exception:
                traceback.print_exc()
                os._exit(1)

        # Parent process
        client_terminals[sid] = {
            "fd": fd,
            "pid": pid,
        }

        client_terminals[sid]["task"] = asyncio.create_task(read_from_pty(sid, fd))

        print(f"PTY started pid={pid}")

    except Exception:
        traceback.print_exc()


@sio.event(namespace="/editor")
async def disconnect(sid):
    info = client_terminals.pop(sid, None)

    if not info:
        return

    info["task"].cancel()

    try:
        os.close(info["fd"])
    except Exception:
        pass

    try:
        os.kill(info["pid"], signal.SIGKILL)
    except Exception:
        pass

    print(f"{sid} disconnected")


@sio.on("terminal_input", namespace="/editor")
async def handle_terminal_input(sid, data):
    print("received:", repr(data))
    info = client_terminals.get(sid)

    if info is None:
        return

    if isinstance(data, dict):
        user_input = data.get("input", "")
    else:
        user_input = str(data)

    try:
        os.write(info["fd"], user_input.encode())

    except OSError:
        print("PTY already closed")
