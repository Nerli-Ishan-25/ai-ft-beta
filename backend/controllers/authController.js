const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";


async function signup(req, res) {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existingUser = userModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = userModel.createUser(name, email, passwordHash);

        res.json({
            message: "User created",
            userId: userId
        });

    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
}



async function login(req, res) {

    try {

        const { email, password } = req.body;

        const user = userModel.getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
}

module.exports = {
    signup,
    login
};