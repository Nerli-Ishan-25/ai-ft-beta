from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FinanceBase(BaseModel):
    amount: float
    date: Optional[datetime] = None

class IncomeCreate(FinanceBase):
    source: str

class IncomeResponse(FinanceBase):
    id: int
    user_id: int
    source: str
    class Config:
        from_attributes = True

class ExpenseCreate(FinanceBase):
    category: str

class ExpenseResponse(FinanceBase):
    id: int
    user_id: int
    category: str
    class Config:
        from_attributes = True

class LoanCreate(BaseModel):
    loan_amount: float
    interest_rate: float
    remaining_amount: float

class LoanResponse(LoanCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class DashboardMetrics(BaseModel):
    netWorth: float
    monthlyIncome: float
    monthlyExpenses: float
    savingsRate: float
    financialHealthScore: float
    insights: List[str]
