const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budgetController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, budgetController.createBudget);
router.get("/", authenticateToken, budgetController.getBudgets);
router.put("/:id", authenticateToken, budgetController.updateBudget);
router.delete("/:id", authenticateToken, budgetController.deleteBudget);

module.exports = router;