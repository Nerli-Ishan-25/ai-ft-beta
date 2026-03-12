const db = require("../config/db");

function createAsset(userId, name, type, value) {

    const stmt = db.prepare(`
        INSERT INTO assets (user_id, name, type, value)
        VALUES (?, ?, ?, ?)
    `);

    return stmt.run(userId, name, type, value);
}


function getAssetsByUser(userId) {

    const stmt = db.prepare(`
        SELECT * FROM assets
        WHERE user_id = ?
        ORDER BY created_at DESC
    `);

    return stmt.all(userId);
}


function updateAsset(id, name, type, value) {

    const stmt = db.prepare(`
        UPDATE assets
        SET name = ?, type = ?, value = ?
        WHERE id = ?
    `);

    return stmt.run(name, type, value, id);
}


function deleteAsset(id) {

    const stmt = db.prepare(`
        DELETE FROM assets
        WHERE id = ?
    `);

    return stmt.run(id);
}


module.exports = {
    createAsset,
    getAssetsByUser,
    updateAsset,
    deleteAsset
};