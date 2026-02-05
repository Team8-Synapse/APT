const emailService = require('../services/emailService');

// Send OTP to email
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Validate Amrita email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-z]{2,4}\.)?students\.amrita\.edu$|^[a-zA-Z0-9._%+-]+@amrita\.edu$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Please use a valid Amrita institutional email'
            });
        }

        const result = await emailService.sendOTP(email);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            username: result.username,
            previewUrl: result.previewUrl // For demo/testing purposes
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to send OTP' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const result = emailService.verifyOTP(email, otp);

        if (!result.valid) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            message: 'Email verified successfully',
            username: result.username
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to verify OTP' });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await emailService.resendOTP(email);

        if (!result.success) {
            return res.status(429).json({ error: result.error });
        }

        res.json({
            success: true,
            message: 'OTP resent successfully',
            username: result.username,
            previewUrl: result.previewUrl
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to resend OTP' });
    }
};
