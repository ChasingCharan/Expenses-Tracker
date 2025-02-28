const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/pay",authMiddleware, paymentController.processPayment);
router.get("/payment-status/:paymentSessionId", paymentController.getPaymentStatus);
router.get("/user/:customerID",authMiddleware, paymentController.getUserPayments);

module.exports = router;
