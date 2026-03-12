const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", (req, res) => {
    res.send("Auth route working");
});
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;