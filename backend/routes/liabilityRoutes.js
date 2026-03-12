const express = require("express");
const router = express.Router();

const liabilityController = require("../controllers/liabilityController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, liabilityController.createLiability);
router.get("/", authenticateToken, liabilityController.getLiabilities);
router.put("/:id", authenticateToken, liabilityController.updateLiability);
router.delete("/:id", authenticateToken, liabilityController.deleteLiability);

module.exports = router;