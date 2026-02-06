import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogIn, Sparkles, User, Lock, ArrowRight, ShieldCheck, ArrowLeft,
    Eye, EyeOff, Loader2, GraduationCap, Award, TrendingUp, Users,
    Building2, CheckCircle, Target, Globe, Shield, Cpu, Database,
    Briefcase, Target as TargetIcon, BarChart3, Calendar
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
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${campusBg})`,
                    filter: 'brightness(0.9)'
                }}
            />
            <div className="absolute inset-0 bg-maroon-dark/10" />

            {/* Subtle Animated Orbs for Depth */}
            <div className="animated-bg opacity-30">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>
        </div>
    );
};

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

// ============= STATS COUNTER =============
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(easeOut * end));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    animate();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// ============= MAIN LOGIN COMPONENT =============
const Login = () => {
    const [identifier, setIdentifier] = useState('cb.sc.u4cse23621@cb.students.amrita.edu');
    const [password, setPassword] = useState('Harini05');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Animated stats for left panel
    const [stats] = useState([
        { value: 98, suffix: '%', label: 'Placement Success', icon: <TrendingUp size={20} /> },
        { value: 245, suffix: '+', label: 'Partner Companies', icon: <Building2 size={20} /> },
        { value: 56, suffix: ' LPA', label: 'Highest Package', icon: <Award size={20} /> },
        { value: 98, suffix: '%', label: 'B.Tech Placement', icon: <GraduationCap size={20} /> }
    ]);

    // Platform features
    const features = [
        {
            icon: <Target size={20} />,
            title: 'Smart Job Matching',
            description: 'AI-powered placement recommendations'
        },
        {
            icon: <BarChart3 size={20} />,
            title: 'Real-Time Analytics',
            description: 'Live placement statistics and trends'
        },
        {
            icon: <Calendar size={20} />,
            title: 'Drive Management',
            description: 'Never miss placement opportunities'
        },
        {
            icon: <Briefcase size={20} />,
            title: 'Career Guidance',
            description: 'Expert mentorship and support'
        }
    ];


    const handleQuickLogin = async (id, pwd) => {
        setIsLoading(true);
        setError('');
        setIdentifier(id);
        setPassword(pwd);

        try {
            const user = await login(id, pwd);
            await new Promise(resolve => setTimeout(resolve, 500));
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Quick login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic validation
        if (!identifier.trim()) {
            setError('Please enter your roll number or institutional email');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const user = await login(identifier, password);

            // Success animation delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please verify and try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                    background-size: 1000px 100%;
                }
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
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--maroon-secondary) 0%, transparent 70%);
                    bottom: -150px;
                    left: -150px;
                    animation-delay: -8s;
                }

                .orb-3 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--maroon-light) 0%, transparent 70%);
                    top: 40%;
                    left: 10%;
                    animation-delay: -16s;
                }

                .orb-4 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, var(--maroon-dark) 0%, transparent 70%);
                    bottom: 30%;
                    right: 20%;
                    animation-delay: -12s;
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
                .gradient-maroon {
                    background: var(--maroon-gradient);
                }
                .gradient-white {
                    background: var(--beige-gradient);
                }
                .glass-effect {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(0px) saturate(150%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
                }
                .input-focus-effect {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-focus-effect:focus {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--maroon-medium);
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
                            {/* Header */}
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

                                {/* Main Headline */}
                                <div className="max-w-lg">
                                    <h2 className="text-4xl font-bold text-maroon leading-tight mb-8">
                                        Track Your <span className="text-maroon/90">Placement</span> Journey
                                    </h2>
                                    <p className="text-maroon/70 text-base leading-relaxed">
                                        Access the comprehensive placement platform designed exclusively for Amrita students.
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

                    {/* Right Panel - Login Form */}
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
                                <h2 className="text-4xl font-black text-maroon">Welcome Back</h2>
                                <p className="text-maroon/60 text-base mt-2">Sign in to access your dashboard</p>
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

                            {/* Login Content Area */}
                            <div className="rounded-3xl overflow-hidden">
                                {/* Card Header */}
                                <div className="p-6 lg:p-8 pb-0">
                                    <div className="text-center mb-1">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-maroon-subtle mb-2 transform rotate-3 hover:rotate-0 transition-transform">
                                            <LogIn className="text-maroon" size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-maroon mb-0 tracking-tight">Sign In</h2>
                                        <p className="text-maroon/60 text-base leading-tight">
                                            Access your institutional placement dashboard!
                                        </p>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="p-6 lg:p-8 pt-0">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-600 text-sm font-medium flex items-start gap-3 animate-fade-in">
                                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-red-600 text-xs font-bold">!</span>
                                                </div>
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        {/* Identifier Field */}
                                        <div className="space-y-5">
                                            <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                <User size={28} className="text-maroon" />
                                                Roll Number / Institutional Email
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Admin: cir@amrita.edu / Student Roll No"
                                                    className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl text-maroon text-base placeholder-maroon/30 focus:outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/5 transition-all shadow-sm group-hover:border-maroon/20"
                                                    value={identifier}
                                                    onChange={(e) => setIdentifier(e.target.value)}
                                                    onFocus={() => setFocusedField('identifier')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-maroon flex items-center gap-2">
                                                    <Lock size={28} className="text-maroon" />
                                                    Password
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-[10px] text-maroon hover:text-maroon/80 transition-colors font-bold uppercase tracking-wider"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Admin: password123 / Student Pwd"
                                                    className="w-full px-5 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-maroon/10 rounded-xl text-maroon text-base placeholder-maroon/30 focus:outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/5 transition-all shadow-sm group-hover:border-maroon/20"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-5 flex items-center text-maroon/20 hover:text-maroon transition-colors"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full gradient-maroon text-white py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    <span>Signing In...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn size={20} />
                                                    <span>Sign In to Portal</span>
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>

                                        {/* Temporary Auto-Login Buttons */}
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => handleQuickLogin('cir@amrita.edu', 'password123')}
                                                className="py-2.5 px-4 bg-maroon hover:bg-maroon-dark border border-maroon text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md group/auto"
                                            >
                                                <ShieldCheck size={14} className="text-white group-hover/auto:scale-110 transition-transform" />
                                                Auto Admin
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickLogin('cb.sc.u4cse23621@cb.students.amrita.edu', 'Harini05')}
                                                className="py-2.5 px-4 bg-maroon hover:bg-maroon-dark border border-maroon text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md group/auto"
                                            >
                                                <User size={14} className="text-white group-hover/auto:scale-110 transition-transform" />
                                                Auto Student
                                            </button>
                                        </div>
                                    </form>

                                    {/* Divider */}
                                    <div className="relative my-7">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-maroon/10"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 bg-maroon text-xs text-white font-bold uppercase tracking-wider">Haven't registered yet?</span>
                                        </div>
                                    </div>

                                    {/* Register Link */}
                                    <div className="text-center">
                                        <Link
                                            to="/register"
                                            className="inline-block w-full py-2 border-2 border-maroon text-maroon rounded-xl text-sm font-bold hover:bg-maroon-subtle transition-all"
                                        >
                                            Create New Account
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Links & Info */}
                            <div className="mt-4 space-y-4">
                                <p className="text-center text-xs text-maroon/30">
                                    By signing in, you agree to our{' '}
                                    <button className="text-maroon hover:underline font-medium">Terms of Service</button>
                                    {' '}and{' '}
                                    <button className="text-maroon hover:underline font-medium">Privacy Policy</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;