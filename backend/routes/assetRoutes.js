const express = require("express");
const router = express.Router();

const assetController = require("../controllers/assetController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, assetController.createAsset);
router.get("/", authenticateToken, assetController.getAssets);
router.put("/:id", authenticateToken, assetController.updateAsset);
router.delete("/:id", authenticateToken, assetController.deleteAsset);

module.exports = router;