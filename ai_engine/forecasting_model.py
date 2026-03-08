import pandas as pd
from datetime import datetime, timedelta

def forecast_expenses(expense_data):
    """
    Very simplified forecasting using moving average.
    Real implementation would use Prophet or ARIMA.
    """
    if len(expense_data) < 2:
        return 0.0
    
    # Assuming expense_data is a list of (date, amount)
    df = pd.DataFrame(expense_data, columns=['ds', 'y'])
    df['ds'] = pd.to_datetime(df['ds'])
    
    # Simple average daily spend
    total_days = (df['ds'].max() - df['ds'].min()).days or 1
    daily_avg = df['y'].sum() / total_days
    
    # Forecast for next 30 days
    return daily_avg * 30

def detect_anomalies(expense_data):
    """
    Detect unusual spikes in spending.
    """
    if len(expense_data) < 5:
        return []
        
    df = pd.DataFrame(expense_data, columns=['ds', 'y'])
    mean = df['y'].mean()
    std = df['y'].std()
    
    anomalies = df[df['y'] > mean + 2 * std]
    return anomalies.to_dict('records')
