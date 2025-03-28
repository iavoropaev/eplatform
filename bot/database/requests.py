from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as upsert

from database.models.user import User


async def upsert_user(
        session: AsyncSession,
        telegram_id: int,
        first_name: str,
        last_name: str | None = None,
):
    stmt = upsert(User).values(
        {
            "telegram_id": telegram_id,
            "first_name": first_name,
            "last_name": last_name,
        }
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=['telegram_id'],
        set_=dict(
            first_name=first_name,
            last_name=last_name,
        ),
    )
    await session.execute(stmt)
    await session.commit()


async def get_user(
        session: AsyncSession,
        telegram_id: int,
):
    user = await session.get(
        User, {"telegram_id": telegram_id},

    )
    return user


async def set_access_token(
        session: AsyncSession,
        telegram_id: int,
        access_token: str | None
):
    result = await session.execute(
        select(User).where(User.telegram_id == telegram_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        return None

    user.access_token = access_token
    await session.commit()

    return user
