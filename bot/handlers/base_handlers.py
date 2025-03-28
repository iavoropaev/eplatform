from aiogram import Router
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession
from handlers.utils import link_unlink_account, logout
from lexicon.lexicon import COMMAND_START_TEXT

router = Router()


@router.message(Command(commands=["start", "help"]))
async def command_start_process(message: Message, session: AsyncSession, domain: str):
    args = message.text.split(maxsplit=1)

    if len(args) >= 2:
        await link_unlink_account(session=session, message=message, args=args, domain=domain)
    else:
        await message.answer(COMMAND_START_TEXT)


@router.message(Command(commands=["logout"]))
async def command_start_process(message: Message, session: AsyncSession, domain: str):
    await logout(session=session, message=message, domain=domain)
