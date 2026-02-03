const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// POST /api/otp/send - Send OTP to email
router.post('/send', otpController.sendOTP);

// POST /api/otp/verify - Verify OTP
router.post('/verify', otpController.verifyOTP);

// POST /api/otp/resend - Resend OTP
router.post('/resend', otpController.resendOTP);

module.exports = router;
