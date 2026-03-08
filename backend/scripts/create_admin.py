"""
Script to create an admin user for testing admin APIs.
Run this once to create an admin account.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database.connection import get_db
from app.models.user_finance import User, UserRole

pwd_context = CryptContext(schemes=["bcrypt"])

def create_admin_user():
    db = next(get_db())

    # Check if admin already exists
    existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if existing_admin:
        print(f"Admin user already exists: {existing_admin.email}")
        return existing_admin

    # Check if user with admin email exists
    existing_user = db.query(User).filter(User.email == "admin@example.com").first()
    if existing_user:
        # Upgrade existing user to admin
        existing_user.role = UserRole.ADMIN
        db.commit()
        print(f"Upgraded user {existing_user.email} to admin")
        return existing_user

    # Create new admin user
    admin = User(
        name="Admin User",
        email="admin@example.com",
        password_hash=pwd_context.hash("admin123"),
        role=UserRole.ADMIN
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    print(f"Admin user created successfully!")
    print(f"  Email: admin@example.com")
    print(f"  Password: admin123")
    print(f"  ID: {admin.id}")

    return admin

if __name__ == "__main__":
    create_admin_user()
