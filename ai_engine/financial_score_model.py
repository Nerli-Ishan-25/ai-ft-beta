def calculate_financial_health(savings_rate, debt_to_income, emergency_fund_ratio):
    """
    Score = 
    40% savings rate (target 20%+)
    30% debt ratio (target <30%)
    20% emergency fund (target 3-6 months)
    10% expense stability
    """
    score = 0
    
    # Savings Rate Contribution (Max 4)
    if savings_rate >= 20:
        score += 4
    elif savings_rate > 0:
        score += (savings_rate / 20) * 4
        
    # Debt to Income Contribution (Max 3)
    # Higher is worse
    if debt_to_income <= 30:
        score += 3
    elif debt_to_income < 100:
        score += (1 - (debt_to_income / 100)) * 3
        
    # Emergency Fund Contribution (Max 2)
    # months of expenses covered
    if emergency_fund_ratio >= 6:
        score += 2
    elif emergency_fund_ratio > 0:
        score += (emergency_fund_ratio / 6) * 2
        
    # Stability (Max 1) - Placeholder
    score += 0.8
    
    return min(10.0, round(score, 1))

def generate_recommendations(metrics):
    insights = []
    if metrics['savingsRate'] < 10:
        insights.append("Your savings rate is below the recommended 20%. Consider auditing your monthly subscriptions.")
    if metrics['monthlyExpenses'] > metrics['monthlyIncome'] * 0.5:
        insights.append("Your housing and living expenses are quite high relative to your income.")
    if metrics['savingsRate'] > 30:
        insights.append("Great job! You have a high savings rate. Consider investing your surplus into a diversified portfolio.")
    
    if len(insights) == 0:
        insights.append("Your finances are looking stable. Keep tracking your daily transactions!")
        
    return insights
