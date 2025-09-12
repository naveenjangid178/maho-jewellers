import { Admin } from "../models/admin.model.js"
import jwt from "jsonwebtoken";

// Use an environment variable in real apps
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare passwords directly (since not hashed)
        if (password !== admin.password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            JWT_SECRET,
            { expiresIn: "10d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error during login." });
    }
};

export { loginAdmin }
