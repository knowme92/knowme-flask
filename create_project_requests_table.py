"""Create tables declared in models.py if they do not already exist.

Run once after adding ProjectRequest:
    python create_project_requests_table.py
"""

from database import Base, engine


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database table check completed. Missing tables were created if needed.")
