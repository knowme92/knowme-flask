from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
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


class ProjectRequest(Base):
    """A website brief submitted through the /start-project wizard."""

    __tablename__ = "project_requests"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Contact information
    full_name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    company: Mapped[str] = mapped_column(String(120), nullable=False, default="")

    # Project configuration
    website_type: Mapped[str] = mapped_column(String(40), nullable=False)
    website_goal: Mapped[str] = mapped_column(String(40), nullable=False)
    design_style: Mapped[str] = mapped_column(String(40), nullable=False)
    pages_scope: Mapped[str] = mapped_column(String(40), nullable=False)
    required_pages: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    features: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    selected_3d_models: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
        server_default=text("'[]'")
    )
    primary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#ef4444")
    secondary_color: Mapped[str] = mapped_column(String(7), nullable=False, default="#006eff")
    reference_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    target_audience: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    budget: Mapped[str] = mapped_column(String(40), nullable=False)
    deadline: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

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
