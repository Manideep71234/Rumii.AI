from sqlmodel import create_engine, Session
from .config import settings
import logging

logger = logging.getLogger("uvicorn.error")

def get_engine():
    db_url = settings.DATABASE_URL
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    
    if db_url.startswith("postgresql"):
        try:
            test_engine = create_engine(db_url, echo=False, connect_args={"connect_timeout": 5})
            with test_engine.connect() as conn:
                pass
            return test_engine
        except Exception as e:
            logger.warning(f"PostgreSQL connection failed: {e}. Falling back to SQLite Rumii.db.")
            return create_engine("sqlite:///Rumii.db", echo=False, connect_args={"check_same_thread": False})
            
    return create_engine(db_url, echo=False, connect_args=connect_args)

engine = get_engine()

def get_session():
    with Session(engine) as session:
        yield session
