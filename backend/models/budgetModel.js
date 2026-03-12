const db = require("../config/db");

function createBudget(userId, categoryId, budgetAmount, month, year) {

    const stmt = db.prepare(`
        INSERT INTO budgets (user_id, category_id, budget_amount, month, year)
        VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(userId, categoryId, budgetAmount, month, year);
}

function getBudgetsByUser(userId) {

    const stmt = db.prepare(`
        SELECT b.*, c.name as category_name
        FROM budgets b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.user_id = ?
        ORDER BY year DESC, month DESC
    `);

    return stmt.all(userId);
}

function updateBudget(id, budgetAmount) {

    const stmt = db.prepare(`
        UPDATE budgets
        SET budget_amount = ?
        WHERE id = ?
    `);

    return stmt.run(budgetAmount, id);
}

function deleteBudget(id) {

    const stmt = db.prepare(`
        DELETE FROM budgets
        WHERE id = ?
    `);

    return stmt.run(id);
}

module.exports = {
    createBudget,
    getBudgetsByUser,
    updateBudget,
    deleteBudget
};