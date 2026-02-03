import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Mail, Lock, ShieldCheck, UserCircle, ArrowRight, ArrowLeft,
    CheckCircle, AlertCircle, Copy, Check, RefreshCw, Clock,
    ShieldPlus, Fingerprint, MailCheck, Hash, LockKeyhole
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from "emailjs-com";

// ============= MAROON-WHITE THEME =============
const theme = {
    maroon: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        light: '#C04040',
        dark: '#5A0000',
        gradient: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
    },
    white: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        dark: '#F0F2F5',
    }
};

// ============= ANIMATED BACKGROUND =============
const AnimatedBackground = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: theme.maroon.gradient,
        zIndex: 0,
        overflow: 'hidden'
    }}>
        <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '80%',
            height: '150%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-20%',
            width: '60%',
            height: '100%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse'
        }} />
        <style>{`
            @keyframes float {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(30px, -30px) rotate(5deg); }
            }
        `}</style>
    </div>
);

// ============= OTP INPUT COMPONENT =============
const OTPInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, length);
            const newOtp = [...otp];
            pastedData.split('').forEach((char, idx) => {
                if (index + idx < length && /^\d$/.test(char)) {
                    newOtp[index + idx] = char;
                }
            });
            setOtp(newOtp);

            // Focus next empty input
            const nextEmpty = newOtp.findIndex((val, idx) => idx >= index && val === '');
            if (nextEmpty !== -1) {
                inputRefs.current[nextEmpty]?.focus();
            } else {
                inputRefs.current[length - 1]?.blur();
            }

            if (newOtp.every(val => val !== '')) {
                onComplete(newOtp.join(''));
            }
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(val => val !== '')) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '30px'
        }}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.borderColor = theme.white.primary;
                    }}
                    onBlur={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.12)';
                        e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    style={{
                        width: '55px',
                        height: '65px',
                        textAlign: 'center',
                        fontSize: '28px',
                        fontWeight: '800',
                        background: 'rgba(255,255,255,0.12)',
                        border: '3px solid rgba(255,255,255,0.2)',
                        borderRadius: '16px',
                        color: theme.white.primary,
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'monospace'
                    }}
                />
            ))}
        </div>
    );
};

// ============= PASSWORD STRENGTH CHECKER =============
const PasswordStrengthIndicator = ({ password }) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;

    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['#ff4444', '#ff8800', '#ffcc00', '#88cc00', '#00cc44', '#00aa33'];

    return (
        <div style={{ marginTop: '15px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
            }}>
                <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: strengthColors[score] || 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    {strengthLabels[score]}
                </span>
                <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.4)'
                }}>
                    {score}/6
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: '3px',
                marginBottom: '15px'
            }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: '5px',
                        borderRadius: '3px',
                        background: i < score ? strengthColors[score] : 'rgba(255,255,255,0.15)',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
            }}>
                {[
                    { key: 'length', label: '8+ characters', icon: '📏' },
                    { key: 'uppercase', label: 'Uppercase', icon: '🔠' },
                    { key: 'lowercase', label: 'Lowercase', icon: '🔡' },
                    { key: 'number', label: 'Number', icon: '🔢' },
                    { key: 'special', label: 'Special', icon: '🔣' },
                ].map(({ key, label, icon }) => (
                    <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '10px',
                        color: checks[key] ? '#00cc44' : 'rgba(255,255,255,0.4)',
                        fontWeight: '600',
                        padding: '6px 8px',
                        background: checks[key] ? 'rgba(0,204,68,0.1)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '8px'
                    }}>
                        <span style={{ fontSize: '12px' }}>{icon}</span>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============= TOTP SETUP COMPONENT =============
const TOTPSetup = ({ userEmail, onComplete, onSkip }) => {
    const [step, setStep] = useState('intro'); // intro, scan, verify
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const inputRefs = useRef([]);

    // Generate TOTP secret
    const [totpSecret] = useState(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        return Array.from({ length: 16 }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
    });

    // OTP Timer
    useEffect(() => {
        if (step === 'verify') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step]);

    const handleCodeChange = (index, value) => {
        if (!/^\d$/.test(value) && value !== '') return;

        const newCode = [...otpCode];
        newCode[index] = value;
        setOtpCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newCode.every(c => c !== '')) {
            handleVerify(newCode.join(''));
        }
    };

    const handleVerify = (code) => {
        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        // In real app, verify with backend
        // For demo, accept any 6-digit code
        onComplete(totpSecret);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const otpauthUri = `otpauth://totp/Amrita%20Placement:${encodeURIComponent(userEmail || 'student@amrita.edu')}?secret=${totpSecret}&issuer=Amrita%20Placement&algorithm=SHA1&digits=6&period=30`;

    if (step === 'intro') {
        return (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    border: '2px solid rgba(255,255,255,0.2)'
                }}>
                    <ShieldPlus size={40} style={{ color: theme.white.primary }} />
                </div>

                <h2 style={{
                    color: theme.white.primary,
                    fontSize: '24px',
                    fontWeight: '900',
                    marginBottom: '12px'
                }}>
                    Enable Two-Factor Authentication
                </h2>

                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '30px'
                }}>
                    Add an extra layer of security to your account. Required for placement cell access.
                </p>

                <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '25px'
                }}>
                    <h3 style={{
                        color: theme.white.primary,
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Smartphone size={18} /> Supported Apps
                    </h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        {[
                            { name: 'Google Authenticator', color: '#4285F4' },
                            { name: 'Microsoft Authenticator', color: '#00A4EF' },
                            { name: 'Authy', color: '#EC6C37' },
                            { name: 'Duo Mobile', color: '#68C200' }
                        ].map(app => (
                            <div key={app.name} style={{
                                textAlign: 'center',
                                padding: '10px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                minWidth: '100px'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: app.color,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 8px',
                                    color: theme.white.primary,
                                    fontSize: '18px'
                                }}>
                                    {app.name.charAt(0)}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontWeight: '600'
                                }}>
                                    {app.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setStep('scan')}
                        style={{
                            flex: 2,
                            padding: '16px',
                            background: theme.white.primary,
                            color: theme.maroon.primary,
                            border: 'none',
                            borderRadius: '16px',
                            fontWeight: '800',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <Key size={18} /> Set Up Now
                    </button>
                    <button
                        onClick={onSkip}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '16px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'scan') {
        return (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                <div style={{
                    background: theme.white.primary,
                    borderRadius: '20px',
                    padding: '25px',
                    margin: '0 auto 25px',
                    display: 'inline-block',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <QRCodeSVG
                        value={otpauthUri}
                        size={180}
                        level="M"
                        includeMargin={false}
                        fgColor={theme.maroon.primary}
                        bgColor={theme.white.primary}
                    />
                </div>

                <h2 style={{
                    color: theme.white.primary,
                    fontSize: '20px',
                    fontWeight: '900',
                    marginBottom: '8px'
                }}>
                    Scan QR Code
                </h2>

                <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                    marginBottom: '25px'
                }}>
                    Open your authenticator app and scan this code
                </p>

                <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '25px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }}>
                        <span style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            fontWeight: '600'
                        }}>
                            Manual Entry Code:
                        </span>
                        <button
                            onClick={() => copyToClipboard(totpSecret)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: theme.white.primary,
                                fontSize: '11px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <code style={{
                        display: 'block',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: theme.white.primary,
                        letterSpacing: '1px',
                        wordBreak: 'break-all'
                    }}>
                        {totpSecret.match(/.{1,4}/g)?.join(' ') || totpSecret}
                    </code>
                </div>

                <button
                    onClick={() => setStep('verify')}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: theme.white.primary,
                        color: theme.maroon.primary,
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '800',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    I've Scanned the Code <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{
                width: '70px',
                height: '70px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '2px solid rgba(255,255,255,0.2)',
                position: 'relative'
            }}>
                <Fingerprint size={32} style={{ color: theme.white.primary }} />
                <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '25px',
                    height: '25px',
                    background: '#00cc44',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.white.primary,
                    fontSize: '10px',
                    fontWeight: '900'
                }}>
                    ✓
                </div>
            </div>

            <h2 style={{
                color: theme.white.primary,
                fontSize: '22px',
                fontWeight: '900',
                marginBottom: '8px'
            }}>
                Verify Authenticator
            </h2>

            <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                marginBottom: '25px'
            }}>
                Enter the 6-digit code from your authenticator app
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px'
            }}>
                {otpCode.map((digit, i) => (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onFocus={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                            e.target.style.borderColor = theme.white.primary;
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.12)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                        style={{
                            width: '48px',
                            height: '58px',
                            textAlign: 'center',
                            fontSize: '26px',
                            fontWeight: '800',
                            background: 'rgba(255,255,255,0.12)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderRadius: '14px',
                            color: theme.white.primary,
                            outline: 'none',
                            transition: 'all 0.2s',
                            fontFamily: 'monospace'
                        }}
                    />
                ))}
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '25px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '12px'
            }}>
                <Clock size={14} />
                <span>Code expires in: </span>
                <span style={{
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    color: timeLeft < 10 ? '#ff4444' : theme.white.primary
                }}>
                    {String(Math.floor(timeLeft / 10)).padStart(2, '0')}:{String(timeLeft % 10).padStart(2, '0')}
                </span>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(255,68,68,0.2)',
                    border: '1px solid rgba(255,68,68,0.4)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#ff6666',
                    fontSize: '12px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={() => setStep('scan')}
                    style={{
                        flex: 1,
                        padding: '14px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '14px',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={() => handleVerify(otpCode.join(''))}
                    style={{
                        flex: 2,
                        padding: '16px',
                        background: theme.white.primary,
                        color: theme.maroon.primary,
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '800',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <ShieldCheck size={18} /> Verify & Complete
                </button>
            </div>
        </div>
    );
};

// ============= MAIN REGISTER COMPONENT =============
const Register = () => {
    const [step, setStep] = useState(0); // 0: Email, 1: OTP, 2: Username, 3: Password, 4: 2FA
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const navigate = useNavigate();

    // Form data
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        username: '',
        password: '',
        confirmPassword: '',
        totpSecret: '',
        agreeTerms: false
    });

    // Email validation regex for Amrita emails
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-z]{2,4}\.)?students\.amrita\.edu$|^[a-zA-Z0-9._%+-]+@amrita\.edu$/i;

    // Extract username from email - format: CB.SC.U4CSE23621
    const extractUsername = (email) => {
        if (!email) return '';
        const atIndex = email.indexOf('@');
        if (atIndex === -1) return email;
        // Return uppercase version: cb.sc.u4cse23621 -> CB.SC.U4CSE23621
        return email.substring(0, atIndex).toUpperCase();
    };

    // Handle email submission
    const handleEmailSubmit = async () => {
        if (!emailRegex.test(formData.email)) {
            setError('Please use your Amrita institutional email (e.g., cb.sc.u4cse21001@cb.students.amrita.edu)');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Call backend API to send OTP
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/otp/send`,
                { email: formData.email }
            );

            // Set OTP timer (2 minutes)
            setOtpTimer(120);
            setStep(1);

            // Auto-fill username from response or extract from email
            const username = response.data.username || extractUsername(formData.email);
            setFormData(prev => ({
                ...prev,
                username: username
            }));

            // Log preview URL for demo (ethereal.email)
            if (response.data.previewUrl) {
                console.log('📧 View email at:', response.data.previewUrl);
                // Show user-friendly message with preview link in development
                setError(`OTP sent! Check your email or view demo at: ${response.data.previewUrl}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleOTPVerify = async (otp) => {
        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        setFormData(prev => ({ ...prev, otp }));
        try {
            // Call backend API to verify OTP
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/otp/verify`,
                { email: formData.email, otp }
            );

            if (response.data.success) {
                // Update username from response if available
                if (response.data.username) {
                    setFormData(prev => ({
                        ...prev,
                        username: response.data.username
                    }));
                }
                setStep(2);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle username submission (username is auto-generated, just validate it exists)
    const handleUsernameSubmit = () => {
        if (!formData.username) {
            setError('Username could not be generated. Please try again.');
            return;
        }
        setStep(3);
        setError('');
    };

    // Handle password submission
    const handlePasswordSubmit = () => {
        const password = formData.password;

        // Password strength check
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        const score = Object.values(checks).filter(Boolean).length;

        if (score < 3) {
            setError('Password is too weak. Please follow the requirements.');
            return;
        }

        if (password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy');
            return;
        }

        setStep(4);
        setError('');
    };

    // Handle TOTP completion
    const handleTOTPComplete = (secret) => {
        setFormData(prev => ({ ...prev, totpSecret: secret }));
        handleRegistration(secret);
    };

    // Handle TOTP skip
    const handleTOTPSkip = () => {
        handleRegistration('');
    };

    // Final registration
    const handleRegistration = async (totpSecret) => {
        setLoading(true);
        try {
            // TODO: Replace simulated API call with actual registration endpoint
            // Registration data: email, username, password, otp, totpEnabled, totpSecret
            void totpSecret; // Mark as intentionally unused during simulation

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // OTP timer effect
    useEffect(() => {
        let timer;
        if (otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpTimer]);

    // Format timer
    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOtpTimer(120);
            setError('OTP resent successfully!');
        } catch {
            setError('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.maroon.gradient,
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: theme.white.primary,
                    animation: 'fadeIn 0.5s ease',
                    maxWidth: '500px'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px',
                        border: '3px solid rgba(255,255,255,0.2)'
                    }}>
                        <CheckCircle size={48} style={{ color: '#00cc44' }} />
                    </div>

                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        marginBottom: '15px',
                        background: theme.white.primary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Registration Complete!
                    </h1>

                    <p style={{
                        opacity: 0.8,
                        marginBottom: '30px',
                        fontSize: '16px',
                        lineHeight: '1.6'
                    }}>
                        Your account has been created successfully. You'll be redirected to login shortly.
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '30px'
                    }}>
                        <div style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            minWidth: '120px'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '5px' }}>
                                ✓
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                Email Verified
                            </div>
                        </div>

                        <div style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            minWidth: '120px'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '5px' }}>
                                ✓
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                Account Created
                            </div>
                        </div>

                        <div style={{
                            padding: '15px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            minWidth: '120px'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '5px' }}>
                                →
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                Redirecting...
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeIn { 
                        from { opacity: 0; transform: translateY(20px); } 
                        to { opacity: 1; transform: translateY(0); } 
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative'
        }}>
            <AnimatedBackground />

            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                zIndex: 1
            }}>
                {/* Back Link */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '24px',
                        transition: 'color 0.3s'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                {/* Main Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '32px',
                    padding: '40px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            background: theme.white.primary,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            transform: 'rotate(-5deg)',
                            transition: 'transform 0.3s'
                        }}>
                            {step === 0 && <Mail size={36} style={{ color: theme.maroon.primary }} />}
                            {step === 1 && <Hash size={36} style={{ color: theme.maroon.primary }} />}
                            {step === 2 && <UserCircle size={36} style={{ color: theme.maroon.primary }} />}
                            {step === 3 && <LockKeyhole size={36} style={{ color: theme.maroon.primary }} />}
                            {step === 4 && <ShieldPlus size={36} style={{ color: theme.maroon.primary }} />}
                        </div>

                        <h1 style={{
                            color: theme.white.primary,
                            fontSize: '28px',
                            fontWeight: '900',
                            marginBottom: '8px'
                        }}>
                            {[
                                'Verify Institutional Email',
                                'Enter OTP Verification',
                                'Set Your Username',
                                'Create Secure Password',
                                'Enable 2FA (Recommended)'
                            ][step]}
                        </h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '13px'
                        }}>
                            {[
                                'Enter your Amrita email to begin registration',
                                'Check your email for the 6-digit code',
                                'Choose how you\'ll appear on the platform',
                                'Create a strong password for your account',
                                'Add an extra layer of security'
                            ][step]}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '30px'
                    }}>
                        {[1, 2, 3, 4, 5].map((stepNumber) => (
                            <div key={stepNumber} style={{
                                width: step === stepNumber - 1 ? '40px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: step >= stepNumber - 1 ? theme.white.primary : 'rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div style={{
                            background: 'rgba(255,68,68,0.15)',
                            border: '1px solid rgba(255,68,68,0.4)',
                            borderRadius: '14px',
                            padding: '14px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: '#ff7777',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {/* Step 0: Email Input */}
                    {step === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.5)'
                                }} />
                                <input
                                    type="email"
                                    placeholder="cb.sc.u4cse21001@cb.students.amrita.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 50px',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        outline: 'none',
                                        color: theme.white.primary,
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = theme.white.primary}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                />
                            </div>


                            <button
                                onClick={handleEmailSubmit}
                                disabled={loading || !formData.email}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: loading ? 'rgba(255,255,255,0.3)' : theme.white.primary,
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: loading ? 'rgba(139,0,0,0.5)' : theme.maroon.primary,
                                    fontWeight: '800',
                                    fontSize: '14px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send OTP <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 1: OTP Verification */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginBottom: '15px',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '14px'
                                }}>
                                    <MailCheck size={18} />
                                    <span>OTP sent to: <strong>{formData.email}</strong></span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginBottom: '25px',
                                    fontSize: '12px',
                                    color: otpTimer < 30 ? '#ff4444' : 'rgba(255,255,255,0.6)'
                                }}>
                                    <Clock size={14} />
                                    <span>Expires in: </span>
                                    <span style={{
                                        fontFamily: 'monospace',
                                        fontWeight: '800',
                                        fontSize: '16px'
                                    }}>
                                        {formatTimer(otpTimer)}
                                    </span>
                                </div>
                            </div>

                            <OTPInput
                                length={6}
                                onComplete={handleOTPVerify}
                            />

                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '10px'
                            }}>
                                <button
                                    onClick={() => setStep(0)}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ArrowLeft size={16} /> Change Email
                                </button>

                                <button
                                    onClick={handleResendOTP}
                                    disabled={loading || otpTimer > 0}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: loading || otpTimer > 0 ? 'rgba(255,255,255,0.1)' : theme.white.primary,
                                        color: loading || otpTimer > 0 ? 'rgba(255,255,255,0.5)' : theme.maroon.primary,
                                        border: 'none',
                                        borderRadius: '14px',
                                        fontWeight: '800',
                                        fontSize: '13px',
                                        cursor: loading || otpTimer > 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <RefreshCw size={16} /> Resend OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Username Setup */}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <UserCircle size={20} style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#00cc44'
                                }} />
                                <input
                                    type="text"
                                    placeholder="Your Username"
                                    value={formData.username}
                                    readOnly
                                    disabled
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 50px',
                                        background: 'rgba(0,204,68,0.1)',
                                        border: '2px solid #00cc44',
                                        borderRadius: '14px',
                                        outline: 'none',
                                        color: theme.white.primary,
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        letterSpacing: '0.5px',
                                        cursor: 'not-allowed'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#00cc44',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <CheckCircle size={14} /> Auto-generated
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(0,204,68,0.1)',
                                borderRadius: '12px',
                                padding: '15px',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.5',
                                border: '1px solid rgba(0,204,68,0.3)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <CheckCircle size={14} style={{ color: '#00cc44' }} />
                                    <span style={{ fontWeight: '700', color: '#00cc44' }}>Username is auto-generated from your email</span>
                                </div>
                                <div style={{ marginLeft: '22px', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                                    • This username cannot be modified<br />
                                    • Used for login and profile identification<br />
                                    • Format: CB.SC.U4CSE23621
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>

                                <button
                                    onClick={handleUsernameSubmit}
                                    disabled={loading || !formData.username}
                                    style={{
                                        flex: 2,
                                        padding: '16px',
                                        background: loading ? 'rgba(255,255,255,0.3)' : theme.white.primary,
                                        border: 'none',
                                        borderRadius: '16px',
                                        color: loading ? 'rgba(139,0,0,0.5)' : theme.maroon.primary,
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Password Creation */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.5)'
                                }} />
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 50px',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        outline: 'none',
                                        color: theme.white.primary,
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = theme.white.primary}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                />
                            </div>

                            {formData.password && <PasswordStrengthIndicator password={formData.password} />}

                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.5)'
                                }} />
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 50px',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        outline: 'none',
                                        color: theme.white.primary,
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        borderColor: formData.confirmPassword ?
                                            (formData.password === formData.confirmPassword ? '#00cc44' : '#ff4444') :
                                            'rgba(255,255,255,0.2)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = theme.white.primary}
                                    onBlur={(e) => e.target.style.borderColor = formData.confirmPassword ?
                                        (formData.password === formData.confirmPassword ? '#00cc44' : '#ff4444') :
                                        'rgba(255,255,255,0.2)'}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '10px'
                            }}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        accentColor: theme.maroon.primary
                                    }}
                                />
                                <label htmlFor="terms" style={{
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.7)',
                                    cursor: 'pointer'
                                }}>
                                    I agree to the <a href="#" style={{ color: theme.white.primary, textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: theme.white.primary, textDecoration: 'underline' }}>Privacy Policy</a>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setStep(2)}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.8)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '14px',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>

                                <button
                                    onClick={handlePasswordSubmit}
                                    disabled={loading || !formData.password || !formData.confirmPassword || !formData.agreeTerms}
                                    style={{
                                        flex: 2,
                                        padding: '16px',
                                        background: loading || !formData.password || !formData.confirmPassword || !formData.agreeTerms ?
                                            'rgba(255,255,255,0.3)' : theme.white.primary,
                                        border: 'none',
                                        borderRadius: '16px',
                                        color: loading || !formData.password || !formData.confirmPassword || !formData.agreeTerms ?
                                            'rgba(139,0,0,0.5)' : theme.maroon.primary,
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        cursor: loading || !formData.password || !formData.confirmPassword || !formData.agreeTerms ?
                                            'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: TOTP Setup */}
                    {step === 4 && (
                        <TOTPSetup
                            userEmail={formData.email}
                            onComplete={handleTOTPComplete}
                            onSkip={handleTOTPSkip}
                        />
                    )}

                    {/* Login Link */}
                    {step < 4 && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '25px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Link
                                to="/login"
                                style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}
                            >
                                Already registered? <span style={{ color: theme.white.primary, textDecoration: 'underline' }}>Sign In</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Security Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '24px',
                    opacity: 0.6
                }}>
                    <ShieldCheck size={18} style={{ color: theme.white.primary }} />
                    <span style={{
                        fontSize: '10px',
                        color: theme.white.primary,
                        fontWeight: '700',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase'
                    }}>
                        End-to-End Encrypted • Institutional Secure Protocol
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input:focus {
                    border-color: ${theme.white.primary} !important;
                    background: rgba(255,255,255,0.15) !important;
                }
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
};

export default Register;