const express = require("express");
const { signupController, signinController, otpVerifyController, resendOtpController, forgotPasswordController, resetPasswordController } = require("../../controllers/auth.controller");
const router = express.Router()

router.post("/signup", signupController)
router.post("/signin", signinController)
router.post("/otp-verify", otpVerifyController)
router.post("/otp-resend", resendOtpController)
router.post("/forgetPassword", forgotPasswordController)
router.post("/resetPassword", resetPasswordController)

module.exports = router;