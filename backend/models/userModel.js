const db = require("../config/db");

function createUser(name, email, passwordHash) {
    const stmt = db.prepare(`
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
    `);

    const result = stmt.run(name, email, passwordHash);
    return result.lastInsertRowid;
}

function getUserByEmail(email) {
    const stmt = db.prepare(`
        SELECT * FROM users WHERE email = ?
    `);

    return stmt.get(email);
}

function getUserById(id) {
    const stmt = db.prepare(`
        SELECT id, name, email FROM users WHERE id = ?
    `);

    return stmt.get(id);
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById
};