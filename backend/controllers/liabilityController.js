const liabilityModel = require("../models/liabilityModel");

function createLiability(req, res) {

    try {

        const userId = req.user.userId;

        const { name, type, amount, interest_rate } = req.body;

        liabilityModel.createLiability(
            userId,
            name,
            type,
            amount,
            interest_rate
        );

        res.json({ message: "Liability created" });

    } catch (error) {
        res.status(500).json({ error: "Failed to create liability" });
    }
}

function getLiabilities(req, res) {

    try {

        const userId = req.user.userId;

        const liabilities = liabilityModel.getLiabilitiesByUser(userId);

        res.json(liabilities);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch liabilities" });
    }
}

function updateLiability(req, res) {

    try {

        const id = req.params.id;

        const { name, type, amount, interest_rate } = req.body;

        liabilityModel.updateLiability(
            id,
            name,
            type,
            amount,
            interest_rate
        );

        res.json({ message: "Liability updated" });

    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
}

function deleteLiability(req, res) {

    try {

        const id = req.params.id;

        liabilityModel.deleteLiability(id);

        res.json({ message: "Liability deleted" });

    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
}

module.exports = {
    createLiability,
    getLiabilities,
    updateLiability,
    deleteLiability
};