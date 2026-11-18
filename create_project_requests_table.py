"""
Create tables declared in models.py if they do not already exist.
"""

from database import Base, engine
from models import ContactMessage, ProjectRequest


def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables checked and created if missing.")


if __name__ == "__main__":
    create_tables()