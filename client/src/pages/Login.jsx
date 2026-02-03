import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogIn, Sparkles, User, Lock, ArrowRight, ShieldCheck, ArrowLeft,
    Eye, EyeOff, Loader2, GraduationCap, Award, TrendingUp, Users,
    Building2, Star, CheckCircle
} from 'lucide-react';

// ============= THEME & ANIMATIONS (Matching Home.jsx) =============
const theme = {
    maroon: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        gradient: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
    }
};

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

const Login = () => {
    const [email, setEmail] = useState(''); // Internal state mapped to Email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email.trim()) {
            setError('Please enter your roll number or email.');
            return false;
        }
        if (password.length < 1) {
            setError('Please enter your password.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const user = await login(email, password);

            // Success animation or delay could be added here
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
            setError(errorMessage);

            // Trigger shake animation handled by CSS
        } finally {
            setIsLoading(false);
        }
    };

    const quickFacts = [
        { icon: <TrendingUp size={20} />, label: 'Placement Rate', value: '95%+' },
        { icon: <Building2 size={20} />, label: 'Companies', value: '500+' },
        { icon: <Award size={20} />, label: 'Avg Package', value: '₹12 LPA' },
        { icon: <Users size={20} />, label: 'Students Placed', value: '5000+' },
    ];

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
                            Your Future <span className="text-amrita-maroon underline decoration-amrita-gold/40 decoration-wavy">Starts Here</span>.
                        </h2>
                        <p className="text-gray-600 text-xl font-medium leading-relaxed mb-12 border-l-4 border-amrita-gold pl-6">
                            Join the elite league of Amritians placed at global giants. Track drives, analyze performance, and land your dream offer.
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
                        <span>NAAC A++</span>
                        <div className="w-1 h-1 bg-amrita-maroon/20 rounded-full" />
                        <span>NIRF #7</span>
                        <div className="w-1 h-1 bg-amrita-maroon/20 rounded-full" />
                        <span>Security Guaranteed</span>
                    </div>
                </FadeIn>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <FadeIn delay={300}>
                    <TiltCard className="w-full max-w-md">
                        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(185,14,80,0.15)] overflow-hidden">
                            <div className="p-10 lg:p-14">
                                <Link to="/" className="inline-flex items-center gap-2 text-amrita-maroon/40 hover:text-amrita-maroon text-[10px] font-black uppercase tracking-widest transition-all mb-10 group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                                </Link>
                                <div className="mb-12">
                                    <div className="w-14 h-14 bg-amrita-maroon rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-amrita-maroon/30 rotate-3 transform hover:rotate-0 transition-all">
                                        <Sparkles className="text-white" size={28} />
                                    </div>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Welcome <span className="text-amrita-maroon">Back</span></h2>
                                    <p className="text-gray-500 font-medium text-sm">Continue your journey to success</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-600 text-xs font-black flex items-center gap-3 animate-shake">
                                            <span className="text-lg">⚠️</span> {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username or Email</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Roll Number / Email"
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-amrita-maroon/30 focus:ring-4 focus:ring-amrita-maroon/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                autoFocus
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                            <button type="button" className="text-[10px] font-black text-amrita-maroon uppercase tracking-widest hover:underline">Forgot?</button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-amrita-maroon/30 focus:ring-4 focus:ring-amrita-maroon/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-amrita-maroon transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-amrita-maroon peer-checked:border-amrita-maroon transition-all" />
                                                <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors">Keep me signed in</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-amrita-maroon text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amrita-maroon/25 transition-all disabled:opacity-70 group overflow-hidden relative"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-12 text-center pt-8 border-t border-gray-100">
                                    <p className="text-gray-500 text-xs font-bold">
                                        First time here? <Link to="/register" className="text-amrita-maroon font-black underline decoration-2 underline-offset-4 ml-1">Create Student Account</Link>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50/80 px-10 py-5 flex items-center justify-center gap-3 border-t border-gray-100">
                                <ShieldCheck className="text-green-500" size={16} />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enterprise Security Verified</span>
                            </div>
                        </div>
                    </TiltCard>
                </FadeIn>
            </div>
        </div>
    );
};

export default Login;
