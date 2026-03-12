const db = require("../config/db");

function createLiability(userId, name, type, amount, interestRate) {

    const stmt = db.prepare(`
        INSERT INTO liabilities (user_id, name, type, amount, interest_rate)
        VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(userId, name, type, amount, interestRate);
}

function getLiabilitiesByUser(userId) {

    const stmt = db.prepare(`
        SELECT * FROM liabilities
        WHERE user_id = ?
        ORDER BY created_at DESC
    `);

    return stmt.all(userId);
}

function updateLiability(id, name, type, amount, interestRate) {

    const stmt = db.prepare(`
        UPDATE liabilities
        SET name = ?, type = ?, amount = ?, interest_rate = ?
        WHERE id = ?
    `);

    return stmt.run(name, type, amount, interestRate, id);
}

function deleteLiability(id) {

    const stmt = db.prepare(`
        DELETE FROM liabilities
        WHERE id = ?
    `);

    return stmt.run(id);
}

module.exports = {
    createLiability,
    getLiabilitiesByUser,
    updateLiability,
    deleteLiability
};