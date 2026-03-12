const assetModel = require("../models/assetModel");

function createAsset(req, res) {

    try {

        const userId = req.user.userId;

        const { name, type, value } = req.body;

        assetModel.createAsset(userId, name, type, value);

        res.json({ message: "Asset created" });

    } catch (error) {
        res.status(500).json({ error: "Failed to create asset" });
    }
}


function getAssets(req, res) {

    try {

        const userId = req.user.userId;

        const assets = assetModel.getAssetsByUser(userId);

        res.json(assets);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assets" });
    }
}


function updateAsset(req, res) {

    try {

        const id = req.params.id;

        const { name, type, value } = req.body;

        assetModel.updateAsset(id, name, type, value);

        res.json({ message: "Asset updated" });

    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
}


function deleteAsset(req, res) {

    try {

        const id = req.params.id;

        assetModel.deleteAsset(id);

        res.json({ message: "Asset deleted" });

    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
}


module.exports = {
    createAsset,
    getAssets,
    updateAsset,
    deleteAsset
};