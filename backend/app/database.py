from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# This reads the URL from the environment variable (or docker-compose)
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Ensure .env file or deployment environment is configured correctly.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()