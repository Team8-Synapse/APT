/**
 * Mobile: Frontend / Pages
 * Description: Registration Page Component.
 * - Multi-step registration process: Email Verification -> OTP -> Password Setup.
 * - Real-time validation for email and password strength.
 * - Integration with EmailJS for OTP delivery.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from "emailjs-com";
import {
    Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft,
    CheckCircle2, GraduationCap, Award, TrendingUp, Users,
    Building2, RefreshCw, Loader2, CheckCircle, Shield, User, Calendar, BarChart3, Target, Briefcase
} from 'lucide-react';

import campusBg from '../assets/AB1_cbe.png';

// ============= THEME DEFINITION =============
const theme = {
    maroon: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        light: '#C04040',
        dark: '#5A0000',
        gradient: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
        subtle: 'rgba(139, 0, 0, 0.08)',
        medium: 'rgba(139, 0, 0, 0.15)',
        strong: 'rgba(139, 0, 0, 0.25)'
    },
    beige: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        light: '#FFFFFF',
        dark: '#F0F2F5',
        gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(248, 249, 250, 0.1) 100%)',
        subtle: 'rgba(255, 255, 255, 0.2)'
    }
};

// ============= ANIMATION COMPONENTS =============
// Component for the animated background visuals
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${campusBg})`,
                    filter: 'brightness(0.9)'
                }}
            />
            <div className="absolute inset-0 bg-maroon-dark/10" />

            <div className="animated-bg opacity-30">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>
        </div>
    );
};

// Wrapper for floating animation effects
const FloatingElement = ({ children, delay = 0 }) => {
    return (
        <div
            className="animate-float"
            style={{ animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

// ============= MAIN REGISTER COMPONENT =============
const Register = () => {
    // State for multi-step form navigation
    const [step, setStep] = useState(0);
    // Form input states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    // UI status states
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Regex to enforce institutional email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*amrita\.edu$/;

    const features = [
        { icon: <Target size={20} />, title: 'Smart Job Matching', description: 'AI-powered placement recommendations' },
        { icon: <BarChart3 size={20} />, title: 'Real-Time Analytics', description: 'Live placement statistics and trends' },
        { icon: <Calendar size={20} />, title: 'Drive Management', description: 'Never miss placement opportunities' },
        { icon: <Briefcase size={20} />, title: 'Career Guidance', description: 'Expert mentorship and support' }
    ];

    // Timer effect for OTP resend countdown
    useEffect(() => {
        let timer;
        if (otpTimer > 0) {
            timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [otpTimer]);

    // Helper to extract username from email
    const extractUsername = (email) => {
        const partBeforeAt = email.split('@')[0];
        return partBeforeAt.toUpperCase();
    };

    // Helper to calculate password strength score
    const getPasswordStrength = (pass) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    // Step 1: Handle Email Submission and OTP Generation
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(email)) {
            setError('Please use your Amrita institutional email (@amrita.edu). Other domains are not permitted.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    otp_code: newOtp,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setOtpTimer(120);
            setUsername(extractUsername(email));
            setStep(1);
        } catch (err) {
            console.error('Email submission error:', err);
            setError('Failed to send verification code. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify User-entered OTP
    const handleOTPSubmit = (e) => {
        e.preventDefault();
        if (otp !== generatedOtp) {
            setError('The code you entered is incorrect. Please try again.');
            return;
        }
        setError('');
        setStep(2);
    };

    // Step 3: Complete Registration with Password
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const strength = getPasswordStrength(password);
        if (strength < 2) {
            setError('Please use a stronger password (mix of letters, numbers, and symbols).');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please verify.');
            return;
        }
        if (!agreeTerms) {
            setError('You must accept the terms to continue.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                email,
                password,
                role: 'student'
            });

            if (response.data) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (err) {
            console.error('Registration error detailing:', err);
            const msg = err.response?.data?.error || 'Registration failed. This account may already exist.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen font-sans bg-white">
                <style>{`
                    :root {
                        --maroon-primary: ${theme.maroon.primary};
                        --maroon-gradient: ${theme.maroon.gradient};
                    }
                    .text-maroon { color: var(--maroon-primary); }
                    .gradient-maroon { background: var(--maroon-gradient); }
                `}</style>
                <AnimatedBackground />
                <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                    <div className="text-center space-y-8 max-w-lg glass-effect p-16 rounded-[2.5rem]">
                        <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 animate-bounce">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-maroon tracking-tight">Account <span className="text-green-500">Ready!</span></h2>
                            <p className="text-maroon/60 text-xl font-medium">Your credentials are secured. Redirecting you to the portal...</p>
                        </div>
                        <div className="w-full bg-maroon/10 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full animate-[progress_2.5s_linear]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-white">
            <style>{`
                :root {
                    --maroon-primary: ${theme.maroon.primary};
                    --maroon-secondary: ${theme.maroon.secondary};
                    --maroon-light: ${theme.maroon.light};
                    --maroon-dark: ${theme.maroon.dark};
                    --maroon-gradient: ${theme.maroon.gradient};
                    --maroon-subtle: ${theme.maroon.subtle};
                    --maroon-medium: ${theme.maroon.medium};
                    --maroon-strong: ${theme.maroon.strong};
                    
                    --beige-primary: ${theme.beige.primary};
                    --beige-secondary: ${theme.beige.secondary};
                    --beige-light: ${theme.beige.light};
                    --beige-dark: ${theme.beige.dark};
                    --beige-gradient: ${theme.beige.gradient};
                    --beige-subtle: ${theme.beige.subtle};
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }

                .animated-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: float-orb 25s ease-in-out infinite;
                }

                .orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, var(--maroon-primary) 0%, transparent 70%);
                    top: -200px;
                    right: -200px;
                }

                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--maroon-secondary) 0%, transparent 70%);
                    bottom: -150px;
                    left: -150px;
                    animation-delay: -8s;
                }

                @keyframes float-orb {
                    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    33% { transform: translate(40px, -40px) scale(1.05) rotate(120deg); }
                    66% { transform: translate(-40px, 40px) scale(0.95) rotate(240deg); }
                }

                .text-maroon { color: var(--maroon-primary); }
                .bg-maroon { background-color: var(--maroon-primary); }
                .border-maroon { border-color: var(--maroon-primary); }
                .bg-maroon-subtle { background-color: var(--maroon-subtle); }
                .gradient-maroon { background: var(--maroon-gradient); }
                .gradient-white { background: var(--beige-gradient); }
                .glass-effect {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(0px) saturate(150%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <AnimatedBackground />

            <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative z-10">
                {/* Universal Glass Pane */}
                <div className="w-full max-w-7xl min-h-[85vh] glass-effect rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-white/20">
                    {/* Left Panel - Branding & Information */}
                    <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden border-r border-white/10">
                        <div className="absolute inset-0 gradient-white" />

                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="1" cy="1" r="1" fill="var(--maroon-primary)" />
                                </pattern>
                                <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        {/* Floating Orbs */}
                        <FloatingElement>
                            <div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-maroon-subtle border border-maroon/10" />
                        </FloatingElement>
                        <FloatingElement delay={1}>
                            <div className="absolute bottom-40 left-20 w-6 h-6 rounded-full bg-maroon-subtle border border-maroon/10" />
                        </FloatingElement>

                        {/* Main Content */}
                        <div className="relative z-10 flex-1 p-12 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl gradient-maroon flex items-center justify-center shadow-lg">
                                        <GraduationCap className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-maroon tracking-tight">Amrita Vishwa Vidyapeetham</h1>
                                        <p className="text-maroon/60 text-sm font-medium">Official Placement Intelligence System</p>
                                    </div>
                                </div>

                                <div className="max-w-lg">
                                    <h2 className="text-4xl font-bold text-maroon leading-tight mb-8">
                                        Join the <span className="text-maroon/90">Elite</span> Network
                                    </h2>
                                    <p className="text-maroon/70 text-base leading-relaxed">
                                        Register to access the unified placement system. Verified Amritian students get exclusive access to industry giants.
                                    </p>
                                </div>

                                {/* Platform Features */}
                                <div className="flex flex-col gap-8">
                                    {features.map((feature, i) => (
                                        <div key={i} className="p-5 bg-white/60 backdrop-blur-sm rounded-xl border border-maroon/10 shadow-sm flex items-center gap-5 group hover:border-maroon/30 transition-all">
                                            <div className="w-14 h-14 rounded-lg bg-maroon-subtle flex items-center justify-center flex-shrink-0 group-hover:bg-maroon/10 transition-colors">
                                                {React.cloneElement(feature.icon, { size: 28, className: "text-maroon" })}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-maroon text-lg">{feature.title}</h3>
                                                <p className="text-maroon/40 text-base leading-snug">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Registration Form */}
                    <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-16 relative z-10 bg-white/5 backdrop-blur-[2px]">
                        <div className="w-full max-w-md">
                            {/* Mobile Header */}
                            <div className="lg:hidden mb-12">
                                <div className="flex items-center justify-between mb-8">
                                    <Link to="/" className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg gradient-maroon flex items-center justify-center shadow-md">
                                            <GraduationCap className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold text-maroon">Amrita Placement</h1>
                                            <p className="text-maroon/60 text-xs">Intelligence System</p>
                                        </div>
                                    </Link>
                                </div>
                                <h2 className="text-4xl font-black text-maroon">Create Account</h2>
                                <p className="text-maroon/60 text-base mt-2">Register for exclusive placement access</p>
                            </div>

                            {/* Back Link - Desktop */}
                            <div className="hidden lg:block mb-6">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 text-maroon/40 hover:text-maroon text-xs font-bold uppercase tracking-widest transition-all hover:gap-3"
                                >
                                    <ArrowLeft size={14} /> Return to Home
                                </Link>
                            </div>

                            {/* Registration Content Area */}
                            <div className="rounded-3xl overflow-hidden">
                                {/* Card Header */}
                                <div className="p-6 lg:p-8 pb-0">
                                    <div className="text-center mb-1">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-maroon-subtle mb-2 transform rotate-3 hover:rotate-0 transition-transform">
                                            <User className="text-maroon" size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-maroon mb-0 tracking-tight">Build Profile</h2>
                                        <p className="text-maroon/60 text-base leading-tight">
                                            Step {step + 1} of 3: {step === 0 ? 'Email Verification' : step === 1 ? 'OTP Confirmation' : 'Set Password'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                <div className="p-6 lg:p-8 pt-4 pb-2">
                                    <div className="flex items-center justify-between mb-4 relative">
                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-maroon/10 -translate-y-1/2 z-0 rounded-full" />
                                        <div
                                            className="absolute top-1/2 left-0 h-0.5 gradient-maroon -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${(step / 2) * 100}%` }}
                                        />
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs z-10 transition-all duration-500 transform ${step >= i ? 'gradient-maroon text-white scale-110 shadow-lg' : 'bg-white border-2 border-maroon/10 text-maroon/30'}`}>
                                                {step > i ? <CheckCircle size={16} /> : (i + 1)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="p-6 lg:p-8 pt-0">
                                    {/* Step 0: Email */}
                                    {step === 0 && (
                                        <form onSubmit={handleEmailSubmit} className="space-y-8 animate-fade-in">
                                            {error && (
                                                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-600 text-sm font-medium flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-red-600 text-xs font-bold">!</span>
                                                    </div>
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <div className="space-y-5">
                                                <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                    <Mail size={28} className="text-maroon" />
                                                    Institutional Email
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        placeholder="cb.en.u4cse23000@cb.students.amrita.edu"
                                                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl text-maroon text-base placeholder-maroon/30 focus:outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/5 transition-all shadow-sm group-hover:border-maroon/20"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <p className="text-xs text-maroon/40 font-medium">Only @amrita.edu domain is permitted.</p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full gradient-maroon text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 size={20} className="animate-spin" />
                                                        <span>Sending Code...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Verification Code</span>
                                                        <ArrowRight size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}

                                    {/* Step 1: OTP */}
                                    {step === 1 && (
                                        <form onSubmit={handleOTPSubmit} className="space-y-8 animate-fade-in">
                                            <div className="text-center space-y-2 p-4 bg-maroon-subtle rounded-xl">
                                                <p className="text-xs font-bold text-maroon/60 uppercase tracking-widest">Verification Sent To</p>
                                                <p className="text-maroon font-bold text-sm">{email}</p>
                                            </div>

                                            {error && (
                                                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-600 text-sm font-medium flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-red-600 text-xs font-bold">!</span>
                                                    </div>
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <div className="space-y-5 text-center">
                                                <label className="text-sm font-bold text-maroon">Secure OTP</label>
                                                <input
                                                    type="text"
                                                    maxLength="6"
                                                    placeholder="0 0 0 0 0 0"
                                                    className="w-full text-center py-4 text-3xl font-bold tracking-[0.4em] bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl focus:outline-none focus:border-maroon transition-all"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <button
                                                    type="submit"
                                                    className="w-full gradient-maroon text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                                >
                                                    Confirm Identity
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={otpTimer > 0}
                                                    onClick={handleEmailSubmit}
                                                    className="text-xs font-bold text-maroon uppercase tracking-widest hover:underline disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                                                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Request New Code'}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Step 2: Password */}
                                    {step === 2 && (
                                        <form onSubmit={handleRegisterSubmit} className="space-y-6 animate-fade-in">
                                            {error && (
                                                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-600 text-sm font-medium flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-red-600 text-xs font-bold">!</span>
                                                    </div>
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            {/* Username (Readonly) */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                        <User size={28} className="text-maroon" />
                                                        Portal Username
                                                    </label>
                                                    <span className="text-xs font-bold text-green-500">Locked</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="w-full px-5 py-3.5 bg-maroon/5 border-2 border-maroon/10 rounded-xl text-maroon/50 text-base font-bold"
                                                    value={username}
                                                    readOnly
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                        <Lock size={28} className="text-maroon" />
                                                        Master Password
                                                    </label>
                                                    <div className="flex gap-1">
                                                        {[...Array(4)].map((_, i) => (
                                                            <div key={i} className={`w-3 h-1 rounded-full transition-colors ${i < getPasswordStrength(password) ? 'gradient-maroon' : 'bg-maroon/10'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Strong & unique"
                                                        className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl text-maroon text-base placeholder-maroon/30 focus:outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/5 transition-all shadow-sm group-hover:border-maroon/20"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-5 flex items-center text-maroon/20 hover:text-maroon transition-colors"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <Shield size={18} className="text-maroon" /> : <Lock size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                    <Lock size={28} className="text-maroon" />
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Repeat password"
                                                    className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl text-maroon text-base placeholder-maroon/30 focus:outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/5 transition-all shadow-sm"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            {/* Terms Checkbox */}
                                            <label className="flex items-center gap-3 cursor-pointer group py-2">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreeTerms}
                                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-5 h-5 border-2 border-maroon/20 rounded-lg peer-checked:gradient-maroon peer-checked:border-maroon transition-all" />
                                                    <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-maroon/60">I consent to the <button type="button" className="text-maroon font-bold underline">Placement Privacy Terms</button></span>
                                            </label>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full gradient-maroon text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 size={20} className="animate-spin" />
                                                        <span>Creating Account...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Establish Account</span>
                                                        <ArrowRight size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}

                                    {/* Divider */}
                                    <div className="relative my-7">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-maroon/10"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 bg-maroon text-xs text-white font-bold uppercase tracking-wider">Already have an account?</span>
                                        </div>
                                    </div>

                                    {/* Login Link */}
                                    <div className="text-center">
                                        <Link
                                            to="/login"
                                            className="inline-block w-full py-2 border-2 border-maroon text-maroon rounded-xl text-sm font-bold hover:bg-maroon-subtle transition-all"
                                        >
                                            Sign In to Portal
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Links & Info */}
                            <div className="mt-4 space-y-4">
                                <p className="text-center text-xs text-maroon/30">
                                    By registering, you agree to our{' '}
                                    <button className="text-maroon hover:underline font-medium">Terms of Service</button>
                                    {' '}and{' '}
                                    <button className="text-maroon hover:underline font-medium">Privacy Policy</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;