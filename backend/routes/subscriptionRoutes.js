const express = require("express");
const router = express.Router();

const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, subscriptionController.createSubscription);
router.get("/", authenticateToken, subscriptionController.getSubscriptions);
router.delete("/:id", authenticateToken, subscriptionController.deleteSubscription);

module.exports = router;