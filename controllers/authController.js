const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        console.log("🔹 Signup request received:", req.body)
        const { username, email, password , phoneNumber} = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, email, phoneNumber, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });;
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "user Not Found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username ,id: user.id});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ["id", "username", "email"] });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
