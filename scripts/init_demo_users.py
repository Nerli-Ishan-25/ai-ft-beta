import sys
import os
sys.path.append(os.path.join(os.getcwd(), "backend"))

from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine, Base
from app.models.user_finance import User
from app.schemas.auth_schema import UserRole
import bcrypt

def get_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Create Admin
    admin_email = "admin@finwise.com"
    if not db.query(User).filter(User.email == admin_email).first():
        admin = User(
            name="System Admin",
            email=admin_email,
            password_hash=get_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        print(f"Created Admin: {admin_email} / admin123")
    
    # Create User
    user_email = "user@finwise.com"
    if not db.query(User).filter(User.email == user_email).first():
        user = User(
            name="Demo User",
            email=user_email,
            password_hash=get_hash("user123"),
            role=UserRole.USER
        )
        db.add(user)
        print(f"Created User: {user_email} / user123")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    init_db()
