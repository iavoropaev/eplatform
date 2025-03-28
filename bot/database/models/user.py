from database.base import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import BIGINT
from datetime import datetime
from sqlalchemy import DateTime, func


class User(Base):
    __tablename__ = 'users'

    telegram_id: Mapped[int] = mapped_column(BIGINT, primary_key=True)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str | None] = mapped_column(String)
    access_token: Mapped[str | None] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
