const db = require("../config/db");

function createSubscription(userId, name, amount, billingCycle, nextPaymentDate) {

    const stmt = db.prepare(`
        INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_payment_date)
        VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(userId, name, amount, billingCycle, nextPaymentDate);
}

function getSubscriptionsByUser(userId) {

    const stmt = db.prepare(`
        SELECT * FROM subscriptions
        WHERE user_id = ?
        ORDER BY next_payment_date ASC
    `);

    return stmt.all(userId);
}

function deleteSubscription(id) {

    const stmt = db.prepare(`
        DELETE FROM subscriptions
        WHERE id = ?
    `);

    return stmt.run(id);
}

module.exports = {
    createSubscription,
    getSubscriptionsByUser,
    deleteSubscription
};