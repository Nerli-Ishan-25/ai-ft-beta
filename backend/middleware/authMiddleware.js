const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            userId: decoded.userId
        };

        next();

    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}

module.exports = authenticateToken;
