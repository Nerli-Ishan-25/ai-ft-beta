import sys
import os
from sqlalchemy.orm import Session
from app.services import finance_service

# Add the project root to path to import ai_engine
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))
from ai_engine import financial_score_model, forecasting_model
from app.models.user_finance import Expense

def get_ai_insights(db: Session, user_id: int, skip_finance_call: bool = False, raw_metrics: dict = None):
    if skip_finance_call and raw_metrics:
        metrics = raw_metrics
    else:
        metrics = finance_service.get_dashboard_metrics(db, user_id)
    
    # Calculate more detailed metrics for AI
    total_loans = metrics.get('totalRemainingLoan', metrics['netWorth'] * 0) # Use actual loan data if available
    
    # In a real app, we'd calculate emergency fund ratio
    emergency_fund_ratio = 3.0 # Placeholder
    
    debt_to_income = 0.0
    if metrics['monthlyIncome'] > 0:
        # Simplified debt to income ratio
        debt_to_income = (metrics['monthlyIncome'] * 0.1) 
        
    health_score = financial_score_model.calculate_financial_health(
        metrics['savingsRate'], 
        debt_to_income,
        emergency_fund_ratio
    )
    
    recommendations = financial_score_model.generate_recommendations(metrics)
    
    # Get expense forecasting
    expenses = db.query(Expense.date, Expense.amount).filter(Expense.user_id == user_id).all()
    forecast = 0.0
    if expenses:
        forecast = forecasting_model.forecast_expenses(expenses)
        
    return {
        "score": health_score,
        "recommendations": recommendations,
        "forecastedNextMonth": forecast,
        "metrics": metrics
    }
