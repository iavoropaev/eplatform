import asyncio
import sys

from aiogram import Bot, Dispatcher
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from config_data.config import Config, set_bot_commands
from config_data.config import load_config
from database.base import Base
from handlers import base_handlers
from middlewares.session import DbSessionMiddleware
from middlewares.track_all_users import TrackAllUsersMiddleware

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    config: Config = load_config()

    bot = Bot(token=config.tg_bot.token)
    engine = create_async_engine(
        url=str(config.db.dsn),
        echo=True
    )

    await set_bot_commands(bot)


    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)
    #     await conn.run_sync(Base.metadata.create_all)


    dp = Dispatcher()
    dp['domain'] = config.urls.domain

    dp.include_router(base_handlers.router)

    Sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    dp.update.outer_middleware(DbSessionMiddleware(Sessionmaker))
    dp.message.outer_middleware(TrackAllUsersMiddleware())

    await bot.delete_webhook(drop_pending_updates=True)
    print('Бот запущен')
    await dp.start_polling(bot)


asyncio.run(main())
