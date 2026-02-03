import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from "emailjs-com";
import {
    Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft,
    CheckCircle2, Sparkles, GraduationCap, Award, TrendingUp, Users,
    Building2, RefreshCw, Loader2, CheckCircle, Shield, User
} from 'lucide-react';

// ============= THEME & ANIMATIONS (Matching Home.jsx) =============
const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amrita-maroon/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amrita-pink/10 rounded-full blur-[100px] animate-pulse delay-700" />
    </div>
);

const GlowingOrbs = () => (
    <>
        <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-amrita-maroon rounded-full blur-[4px] animate-ping opacity-20" />
        <div className="absolute bottom-[30%] right-[15%] w-3 h-3 bg-amrita-gold rounded-full blur-[3px] animate-ping opacity-20 delay-500" />
    </>
);

const TiltCard = ({ children, className = '' }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        setTilt({ x: y, y: x });
    };
    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });
    return (
        <div
            className={`transition-transform duration-300 ease-out ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
            {children}
        </div>
    );
};

const FadeIn = ({ children, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return (
        <div className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

const Register = () => {
    const [step, setStep] = useState(0); // 0: Email, 1: OTP, 2: Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Regex for Amrita institutional email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?amrita\.edu$/;

    useEffect(() => {
        let timer;
        if (otpTimer > 0) {
            timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [otpTimer]);

    const extractUsername = (email) => {
        const partBeforeAt = email.split('@')[0];
        return partBeforeAt.toUpperCase();
    };

    const getPasswordStrength = (pass) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(email)) {
            setError('Please use your Amrita institutional email (@amrita.edu). Other domains are not permitted.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // First check if user already exists (optional but good for UX)
            // For now, we'll just send OTP
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

    const handleOTPSubmit = (e) => {
        e.preventDefault();
        if (otp !== generatedOtp) {
            setError('The code you entered is incorrect. Please try again.');
            return;
        }
        setError('');
        setStep(2);
    };

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

    const quickFacts = [
        { icon: <TrendingUp size={20} />, label: 'Highest Package', value: '₹56 LPA' },
        { icon: <Building2 size={20} />, label: 'Top Recruiters', value: '500+' },
        { icon: <Award size={20} />, label: 'Dream Offers', value: '1500+' },
        { icon: <Users size={20} />, label: 'Alumni Network', value: '50k+' },
    ];

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
                <AnimatedBackground />
                <FadeIn>
                    <div className="text-center space-y-8 relative z-10 max-w-lg">
                        <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30 animate-bounce">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tight">Account <span className="text-green-500">Ready!</span></h2>
                            <p className="text-gray-500 text-xl font-medium">Your credentials are secured. Redirecting you to the portal...</p>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full animate-[progress_2.5s_linear]" />
                        </div>
                    </div>
                </FadeIn>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex relative overflow-hidden font-inter text-gray-900">
            <AnimatedBackground />
            <GlowingOrbs />

            {/* Left Side: Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-16 bg-amrita-maroon/5 border-r border-amrita-maroon/10">
                <FadeIn delay={200}>
                    <div className="flex items-center gap-5 mb-16">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-amrita-maroon/20 transform hover:scale-110 transition-transform cursor-pointer">
                            <GraduationCap className="text-amrita-maroon" size={36} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-amrita-maroon tracking-tighter uppercase">Amrita</h1>
                            <p className="text-amrita-maroon/60 text-xs font-bold tracking-[0.2em] uppercase">Placement Portal</p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-6xl font-black text-gray-900 leading-tight mb-8">
                            Join the <span className="text-amrita-maroon underline decoration-amrita-gold/40 decoration-wavy">Elite</span> Cluster.
                        </h2>
                        <p className="text-gray-600 text-xl font-medium leading-relaxed mb-12 border-l-4 border-amrita-gold pl-6">
                            Register to access the unified placement system. Verified Amritian students get exclusive access to industry giants.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-2 gap-6">
                    {quickFacts.map((fact, i) => (
                        <FadeIn key={i} delay={400 + i * 100}>
                            <div className="bg-white/60 backdrop-blur-md border border-amrita-maroon/10 p-6 rounded-3xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-amrita-maroon/10 rounded-2xl flex items-center justify-center text-amrita-maroon group-hover:bg-amrita-maroon group-hover:text-white transition-colors mb-4">
                                    {fact.icon}
                                </div>
                                <p className="text-3xl font-black text-gray-900 mb-1">{fact.value}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{fact.label}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={800}>
                    <div className="flex items-center gap-6 text-amrita-maroon/40 text-[10px] font-black uppercase tracking-[0.3em]">
                        <span>Verified Amritian</span>
                        <div className="w-1 h-1 bg-amrita-maroon/20 rounded-full" />
                        <span>NAAC A++</span>
                        <div className="w-1 h-1 bg-amrita-maroon/20 rounded-full" />
                        <span>Data Secured</span>
                    </div>
                </FadeIn>
            </div>

            {/* Right Side: Step-based Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <FadeIn delay={300}>
                    <TiltCard className="w-full max-w-md">
                        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(185,14,80,0.15)] overflow-hidden">
                            <div className="p-10 lg:p-12">
                                <Link to="/" className="inline-flex items-center gap-2 text-amrita-maroon/40 hover:text-amrita-maroon text-[10px] font-black uppercase tracking-widest transition-all mb-8 group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                                {/* Header */}
                                <div className="mb-10 text-center">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Build <span className="text-amrita-maroon">Profile</span></h2>
                                    <p className="text-gray-500 text-sm font-medium">Step {step + 1} of 3: Verification</p>
                                </div>

                                {/* Progress Indicator */}
                                <div className="flex items-center justify-between mb-12 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                                    <div
                                        className="absolute top-1/2 left-0 h-0.5 bg-amrita-maroon -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${(step / 2) * 100}%` }}
                                    />
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] z-10 transition-all duration-500 transform ${step >= i ? 'bg-amrita-maroon text-white scale-110 shadow-lg shadow-amrita-maroon/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                            {step > i ? <CheckCircle size={16} /> : (i + 1)}
                                        </div>
                                    ))}
                                </div>

                                {/* Form Sections */}
                                <div className="min-h-[320px]">
                                    {step === 0 && (
                                        <FadeIn>
                                            <form onSubmit={handleEmailSubmit} className="space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Institutional Identifier</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                                            <Mail size={18} />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            placeholder="cb.en.u4cse23000@amrita.edu"
                                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-amrita-maroon/30 transition-all text-sm font-bold placeholder:text-gray-300"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 font-bold px-1 uppercase tracking-tighter">Only @amrita.edu domain is permitted.</p>
                                                </div>

                                                {error && <p className="text-red-500 text-[11px] font-black bg-red-50 p-4 rounded-xl border-l-4 border-red-500 animate-shake">⚠️ {error}</p>}

                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-amrita-maroon text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amrita-maroon/25 transition-all disabled:opacity-70 group"
                                                >
                                                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                                                        <><span>Send Code</span> <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
                                                    )}
                                                </button>
                                            </form>
                                        </FadeIn>
                                    )}

                                    {step === 1 && (
                                        <FadeIn>
                                            <form onSubmit={handleOTPSubmit} className="space-y-8">
                                                <div className="text-center space-y-2">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verification Sent To</p>
                                                    <p className="text-amrita-maroon font-black text-sm">{email}</p>
                                                </div>

                                                <div className="space-y-4 text-center">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure OTP</label>
                                                    <input
                                                        type="text"
                                                        maxLength="6"
                                                        placeholder="0 0 0 0 0 0"
                                                        className="w-full text-center py-5 text-4xl font-black tracking-[0.4em] bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-amrita-maroon/30 transition-all outline-none"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                        required
                                                    />
                                                </div>

                                                {error && <p className="text-red-500 text-[11px] font-black bg-red-50 p-4 rounded-xl border-l-4 border-red-500">⚠️ {error}</p>}

                                                <div className="flex flex-col gap-5">
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-amrita-maroon text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-amrita-maroon/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                    >
                                                        Confirm Identity
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={otpTimer > 0}
                                                        onClick={handleEmailSubmit}
                                                        className="text-[10px] font-black text-amrita-maroon uppercase tracking-widest hover:underline disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                                                        {otpTimer > 0 ? `Resend Available in ${otpTimer}s` : 'Request New Code'}
                                                    </button>
                                                </div>
                                            </form>
                                        </FadeIn>
                                    )}

                                    {step === 2 && (
                                        <FadeIn>
                                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center ml-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portal Username</label>
                                                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Locked to Email ID</span>
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
                                                                <User size={18} />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="w-full pl-14 pr-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-black text-sm"
                                                                value={username}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center ml-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Password</label>
                                                            <div className="flex gap-1">
                                                                {[...Array(4)].map((_, i) => (
                                                                    <div key={i} className={`w-3 h-1 rounded-full transition-colors ${i < getPasswordStrength(password) ? 'bg-amrita-maroon' : 'bg-gray-100'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                                                <Lock size={18} />
                                                            </div>
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Strong & unique"
                                                                className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-amrita-maroon/30 transition-all font-bold text-sm"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-amrita-maroon transition-colors"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <Shield className="text-amrita-maroon" size={18} /> : <Lock size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Identity</label>
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Repeat password"
                                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-amrita-maroon/30 transition-all font-bold text-sm"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                checked={agreeTerms}
                                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-4 h-4 border-2 border-gray-200 rounded-lg peer-checked:bg-amrita-maroon peer-checked:border-amrita-maroon transition-all" />
                                                            <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">I consent to the <button type="button" className="text-amrita-maroon font-black underline">Placement Privacy Terms</button></span>
                                                    </label>
                                                </div>

                                                {error && <p className="text-red-500 text-[11px] font-black bg-red-50 p-4 rounded-xl border-l-4 border-red-500 animate-shake">⚠️ {error}</p>}

                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-amrita-maroon text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amrita-maroon/25 transition-all disabled:opacity-70 group overflow-hidden relative"
                                                >
                                                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                                                        <><span>Establish Account</span> <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" /></>
                                                    )}
                                                </button>
                                            </form>
                                        </FadeIn>
                                    )}
                                </div>

                                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                        Back to <Link to="/login" className="text-amrita-maroon underline decoration-2 underline-offset-4 ml-1">Secure Sign In</Link>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50/80 px-10 py-5 flex items-center justify-center gap-3 border-t border-gray-100">
                                <ShieldCheck className="text-green-500" size={16} />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Institutional Security Protocol Verified</span>
                            </div>
                        </div>
                    </TiltCard>
                </FadeIn>
            </div>
        </div>
    );
};

export default Register;