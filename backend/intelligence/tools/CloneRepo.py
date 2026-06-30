import asyncio


async def clone(ownerRepo: str):
    cloneUrl = f"https://github.com/{ownerRepo}.git"
    toExecute = f"git clone {cloneUrl}"
    exec(toExecute)


asyncio.run(clone("Manav-Nocode/Ai_engineer"))
