const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Transactions route working");
});

module.exports = router;