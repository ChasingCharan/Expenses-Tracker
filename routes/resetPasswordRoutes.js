const express = require("express");
const resetPasswordController = require("../controllers/resetPasswordController");
const router = express.Router();

router.post("/forgotpassword", resetPasswordController.forgotPassword);
router.get("/resetpassword/:id", resetPasswordController.resetPassword);
router.get("/updatepassword/:resetpasswordid", resetPasswordController.updatePassword);

module.exports = router;