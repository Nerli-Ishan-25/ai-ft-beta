const budgetModel = require("../models/budgetModel");

function createBudget(req, res) {

    try {

        const userId = req.user.userId;

        const { category_id, budget_amount, month, year } = req.body;

        budgetModel.createBudget(
            userId,
            category_id,
            budget_amount,
            month,
            year
        );

        res.json({ message: "Budget created" });

    } catch (error) {
        res.status(500).json({ error: "Failed to create budget" });
    }
}

function getBudgets(req, res) {

    try {

        const userId = req.user.userId;

        const budgets = budgetModel.getBudgetsByUser(userId);

        res.json(budgets);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch budgets" });
    }
}

function updateBudget(req, res) {

    try {

        const id = req.params.id;

        const { budget_amount } = req.body;

        budgetModel.updateBudget(id, budget_amount);

        res.json({ message: "Budget updated" });

    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
}

function deleteBudget(req, res) {

    try {

        const id = req.params.id;

        budgetModel.deleteBudget(id);

        res.json({ message: "Budget deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};