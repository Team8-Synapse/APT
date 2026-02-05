const nodemailer = require('nodemailer');

// Store OTPs temporarily in memory (use Redis in production)
const otpStore = new Map();

// Email transporter configuration
// For demo purposes, using a test account. Replace with actual SMTP credentials in production.
let transporter;

const initializeTransporter = async () => {
    // For development/demo, create a test account
    // In production, use environment variables for SMTP config
    if (process.env.EMAIL_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Create a test account for demo purposes
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('📧 Demo email account created:', testAccount.user);
        console.log('📧 View sent emails at: https://ethereal.email/login');
    }
};

// Initialize transporter on startup
initializeTransporter().catch(console.error);

// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
const sendOTP = async (email) => {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), {
        otp,
        expiresAt,
        attempts: 0
    });

    // Extract username from email for personalization
    const username = email.split('@')[0].toUpperCase().replace(/\./g, '.');

    const mailOptions = {
        from: '"Amrita Placement Tracker" <noreply@amrita.edu>',
        to: email,
        subject: '🔐 Your Verification Code - Amrita Placement Tracker',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; }
                    .header p { color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px; }
                    .content { padding: 40px 30px; text-align: center; }
                    .otp-box { background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 30px; border-radius: 16px; margin: 30px 0; }
                    .otp-code { font-size: 42px; font-weight: 900; color: white; letter-spacing: 10px; font-family: 'Courier New', monospace; }
                    .info { color: #666; font-size: 14px; line-height: 1.6; }
                    .username { background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0; font-weight: 600; color: #333; }
                    .timer { color: #8B0000; font-weight: 700; }
                    .footer { padding: 20px 30px; background: #f8f9fa; text-align: center; font-size: 12px; color: #999; }
                    .footer a { color: #8B0000; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎓 Amrita Placement Tracker</h1>
                        <p>Email Verification</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #333; margin-bottom: 10px;">Verify Your Email</h2>
                        <p class="info">Hello <strong>${username}</strong>,</p>
                        <p class="info">Use the verification code below to complete your registration:</p>
                        
                        <div class="otp-box">
                            <div class="otp-code">${otp}</div>
                        </div>
                        
                        <div class="username">
                            <strong>Your Username:</strong> ${username}
                        </div>
                        
                        <p class="info">
                            This code expires in <span class="timer">5 minutes</span>.<br>
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Amrita Vishwa Vidyapeetham. All rights reserved.</p>
                        <p><a href="https://www.amrita.edu">www.amrita.edu</a></p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Amrita Placement Tracker - Email Verification
            
            Hello ${username},
            
            Your verification code is: ${otp}
            
            Your Username: ${username}
            
            This code expires in 5 minutes.
            
            If you didn't request this, please ignore this email.
        `
    };

    try {
        if (!transporter) {
            await initializeTransporter();
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 OTP Email sent:', email);
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info) || 'N/A');

        return {
            success: true,
            message: 'OTP sent successfully',
            username: username,
            // Include preview URL for demo/testing
            previewUrl: nodemailer.getTestMessageUrl(info) || null
        };
    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Failed to send verification email');
    }
};

// Verify OTP
const verifyOTP = (email, userOTP) => {
    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
        return { valid: false, error: 'OTP not found. Please request a new code.' };
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return { valid: false, error: 'OTP has expired. Please request a new code.' };
    }

    if (stored.attempts >= 3) {
        otpStore.delete(email.toLowerCase());
        return { valid: false, error: 'Too many failed attempts. Please request a new code.' };
    }

    if (stored.otp !== userOTP) {
        stored.attempts += 1;
        return { valid: false, error: `Invalid OTP. ${3 - stored.attempts} attempts remaining.` };
    }

    // OTP is valid, remove from store
    otpStore.delete(email.toLowerCase());
    return { valid: true, username: email.split('@')[0].toUpperCase() };
};

// Resend OTP
const resendOTP = async (email) => {
    // Check if there's a recent OTP (prevent spam)
    const existing = otpStore.get(email.toLowerCase());
    if (existing && Date.now() - (existing.expiresAt - 5 * 60 * 1000) < 60000) {
        return { success: false, error: 'Please wait 1 minute before requesting a new OTP' };
    }

    return await sendOTP(email);
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP
};
