require("dotenv").config();

const express = require("express");
const cors = require("cors");

const initDB = require("./database/initDB");

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const assetRoutes = require("./routes/assetRoutes");
const liabilityRoutes = require("./routes/liabilityRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/liabilities", liabilityRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Finance Manager API running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});