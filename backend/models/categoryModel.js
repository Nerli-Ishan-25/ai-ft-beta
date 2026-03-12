const db = require("../config/db");

function createCategory(userId, name, type) {

    const stmt = db.prepare(`
        INSERT INTO categories (user_id, name, type)
        VALUES (?, ?, ?)
    `);

    return stmt.run(userId, name, type);
}

function getCategoriesByUser(userId) {

    const stmt = db.prepare(`
        SELECT * FROM categories
        WHERE user_id = ?
        ORDER BY name ASC
    `);

    return stmt.all(userId);
}

function deleteCategory(id) {

    const stmt = db.prepare(`
        DELETE FROM categories
        WHERE id = ?
    `);

    return stmt.run(id);
}

module.exports = {
    createCategory,
    getCategoriesByUser,
    deleteCategory
};