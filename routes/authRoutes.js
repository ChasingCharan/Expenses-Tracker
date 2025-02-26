const express = require('express');
require('dotenv').config();

const { signup, login, getUser } = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getUser);

module.exports = router;