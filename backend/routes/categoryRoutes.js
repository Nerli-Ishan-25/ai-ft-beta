const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, categoryController.createCategory);
router.get("/", authenticateToken, categoryController.getCategories);
router.delete("/:id", authenticateToken, categoryController.deleteCategory);

module.exports = router;
