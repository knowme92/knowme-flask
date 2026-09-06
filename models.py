from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Text,
    DateTime,
    Boolean,
    text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from database import Base


class ContactMessage(Base):

    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(120),
        nullable=False
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )