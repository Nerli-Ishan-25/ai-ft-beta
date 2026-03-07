from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List
from app.models.user_finance import Income, Expense, Loan, Transaction
from app.schemas.finance_schema import IncomeCreate, ExpenseCreate, LoanCreate

def get_user_incomes(db: Session, user_id: int):
    return db.query(Income).filter(Income.user_id == user_id).all()

def create_user_income(db: Session, user_id: int, income_in: IncomeCreate):
    db_income = Income(user_id=user_id, **income_in.dict())
    db.add(db_income)
    
    # Also record as a transaction
    transaction = Transaction(
        user_id=user_id,
        type="income",
        category="Income",
        amount=income_in.amount,
        description=income_in.source,
        date=income_in.date or datetime.now()
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(db_income)
    return db_income

def get_user_expenses(db: Session, user_id: int):
    return db.query(Expense).filter(Expense.user_id == user_id).all()

def create_user_expense(db: Session, user_id: int, expense_in: ExpenseCreate):
    db_expense = Expense(user_id=user_id, **expense_in.dict())
    db.add(db_expense)
    
    # Also record as a transaction
    transaction = Transaction(
        user_id=user_id,
        type="expense",
        category=expense_in.category,
        amount=expense_in.amount,
        description=f"Expense: {expense_in.category}",
        date=expense_in.date or datetime.now()
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_user_loans(db: Session, user_id: int):
    return db.query(Loan).filter(Loan.user_id == user_id).all()

def create_user_loan(db: Session, user_id: int, loan_in: LoanCreate):
    db_loan = Loan(user_id=user_id, **loan_in.dict())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def get_dashboard_metrics(db: Session, user_id: int):
    # Calculate Total Income for the current month
    month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    total_income = db.query(func.sum(Income.amount)).filter(
        Income.user_id == user_id, Income.date >= month_start
    ).scalar() or 0.0
    
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == user_id, Expense.date >= month_start
    ).scalar() or 0.0
    
    total_loans = db.query(func.sum(Loan.remaining_amount)).filter(
        Loan.user_id == user_id
    ).scalar() or 0.0
    
    # Net Worth calculation (simplified: total income - total expenses - total loans)
    # real net worth involves assets we don't track fully yet, but for now:
    all_time_income = db.query(func.sum(Income.amount)).filter(Income.user_id == user_id).scalar() or 0.0
    all_time_expenses = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0.0
    net_worth = all_time_income - all_time_expenses - total_loans
    
    savings_rate = 0.0
    if total_income > 0:
        savings_rate = ((total_income - total_expenses) / total_income) * 100
    
    return {
        "netWorth": net_worth,
        "monthlyIncome": total_income,
        "monthlyExpenses": total_expenses,
        "savingsRate": savings_rate,
        # Placeholders for AI Layer
        "financialHealthScore": 7.5, 
        "insights": ["Complete your profile for more accurate insights"]
    }
