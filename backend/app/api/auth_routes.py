from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database.connection import get_db
from app.schemas.auth_schema import Token, UserCreate, UserInDB
from app.services import auth_service
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserInDB, include_in_schema=False)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = auth_service.get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )
    return auth_service.create_user(db, user_in)

@router.post("/login", response_model=Token)
def login_user(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, role=user.role.value, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
