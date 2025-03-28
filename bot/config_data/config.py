from aiogram import Bot
from aiogram.types import BotCommand

from dataclasses import dataclass
from environs import Env


@dataclass
class DatabaseConfig:
    dsn: str


@dataclass
class TgBot:
    token: str
    admin_ids: list[int]


@dataclass
class Urls:
    domain: str


@dataclass
class Config:
    tg_bot: TgBot
    db: DatabaseConfig
    urls: Urls


def load_config(path: str | None = None) -> Config:
    env: Env = Env()
    env.read_env()
    return Config(
        tg_bot=TgBot(
            token=env('BOT_TOKEN'),
            admin_ids=list(map(int, env.list('ADMIN_IDS')))
        ),
        db=DatabaseConfig(
            dsn=env('DSN')
        ),
        urls=Urls(
            domain=env('DOMAIN'),
        ),
    )


async def set_bot_commands(bot: Bot):
    commands = [
        BotCommand(command="start", description="Запустить бота"),
        BotCommand(command="logout", description="Отвязать аккаунт"),
        BotCommand(command="help", description="Помощь"),
    ]
    await bot.set_my_commands(commands)
