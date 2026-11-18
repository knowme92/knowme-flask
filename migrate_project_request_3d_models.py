"""Add selected_3d_models to project_requests without dropping existing rows.

Run once after updating models.py:
    python migrate_project_request_3d_models.py
"""

from sqlalchemy import inspect, text

from database import engine
from models import ContactMessage, ProjectRequest  # Register all current models.


def main() -> None:
    # Creates only missing tables. Existing tables and rows are not replaced.
    from database import Base
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    if not inspector.has_table("project_requests"):
        raise RuntimeError("project_requests table was not created or could not be found")

    columns = {column["name"] for column in inspector.get_columns("project_requests")}
    if "selected_3d_models" in columns:
        print("selected_3d_models column already exists; no changes made.")
        return

    dialect = engine.dialect.name
    if dialect == "postgresql":
        statement = "ALTER TABLE project_requests ADD COLUMN selected_3d_models JSON NOT NULL DEFAULT '[]'::json"
    elif dialect == "sqlite":
        statement = "ALTER TABLE project_requests ADD COLUMN selected_3d_models JSON NOT NULL DEFAULT '[]'"
    else:
        raise RuntimeError(f"Unsupported database dialect for this migration: {dialect}")

    with engine.begin() as connection:
        connection.execute(text(statement))

    print("Added project_requests.selected_3d_models. Existing records were preserved.")


if __name__ == "__main__":
    main()
