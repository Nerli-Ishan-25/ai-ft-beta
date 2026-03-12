const categoryModel = require("../models/categoryModel");

function createCategory(req, res) {

    try {

        const userId = req.user.userId;

        const { name, type } = req.body;

        categoryModel.createCategory(userId, name, type);

        res.json({ message: "Category created" });

    } catch (error) {
        res.status(500).json({ error: "Failed to create category" });
    }
}

function getCategories(req, res) {

    try {

        const userId = req.user.userId;

        const categories = categoryModel.getCategoriesByUser(userId);

        res.json(categories);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}

function deleteCategory(req, res) {

    try {

        const id = req.params.id;

        categoryModel.deleteCategory(id);

        res.json({ message: "Category deleted" });

    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
}

module.exports = {
    createCategory,
    getCategories,
    deleteCategory
};