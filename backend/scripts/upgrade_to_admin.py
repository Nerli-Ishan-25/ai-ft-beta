"""
Script to upgrade an existing user to admin role.
Usage: python scripts/upgrade_to_admin.py <user_email>
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user_finance import User, UserRole

def upgrade_user_to_admin(user_email: str):
    db = next(get_db())

    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        print(f"User with email '{user_email}' not found")
        db.close()
        return None

    if user.role == UserRole.ADMIN:
        print(f"User '{user.email}' is already an admin")
        db.close()
        return user

    user.role = UserRole.ADMIN
    db.commit()

    print(f"User '{user.email}' upgraded to admin!")
    print(f"  ID: {user.id}")
    print(f"  Name: {user.name}")
    print(f"  Email: {user.email}")

    db.close()
    return user

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/upgrade_to_admin.py <user_email>")
        print("Example: python scripts/upgrade_to_admin.py john@example.com")
        sys.exit(1)

    upgrade_user_to_admin(sys.argv[1])
