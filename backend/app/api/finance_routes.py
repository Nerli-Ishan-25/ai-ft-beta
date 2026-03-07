from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.finance_schema import IncomeCreate, IncomeResponse, ExpenseCreate, ExpenseResponse, LoanCreate, LoanResponse, DashboardMetrics
from app.services import finance_service
from app.api.dependencies import get_current_active_user
from app.models.user_finance import User

router = APIRouter()

@router.get("/dashboard", response_model=DashboardMetrics)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.get_dashboard_metrics(db, current_user.id)

@router.get("/income", response_model=List[IncomeResponse])
def list_income(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.get_user_incomes(db, current_user.id)

@router.post("/income", response_model=IncomeResponse)
def add_income(income_in: IncomeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.create_user_income(db, current_user.id, income_in)

@router.get("/expenses", response_model=List[ExpenseResponse])
def list_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.get_user_expenses(db, current_user.id)

@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.create_user_expense(db, current_user.id, expense_in)

@router.get("/loans", response_model=List[LoanResponse])
def list_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.get_user_loans(db, current_user.id)

@router.post("/loans", response_model=LoanResponse)
def add_loan(loan_in: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return finance_service.create_user_loan(db, current_user.id, loan_in)
