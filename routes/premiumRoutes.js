const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const premiumController = require("../controllers/premiumController");
const router = express.Router();

router.get("/users", authMiddleware, premiumController.getUserWithTotalExpenses);

module.exports = router;


