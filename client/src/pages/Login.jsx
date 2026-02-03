import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogIn, Sparkles, User, Lock, ArrowRight, ShieldCheck, ArrowLeft,
    Eye, EyeOff, Loader2, GraduationCap, Award, TrendingUp, Users,
    Building2, Star, CheckCircle
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Animated stats
    const [animatedStats, setAnimatedStats] = useState({ placements: 0, companies: 0, avgPackage: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedStats({ placements: 95, companies: 500, avgPackage: 12 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickFacts = [
        { icon: <TrendingUp size={18} />, label: 'Placement Rate', value: '95%+' },
        { icon: <Building2 size={18} />, label: 'Companies', value: '500+' },
        { icon: <Award size={18} />, label: 'Avg Package', value: '₹12 LPA' },
        { icon: <Users size={18} />, label: 'Students Placed', value: '5000+' },
    ];

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 animated-gradient opacity-90" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Blobs */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float-slow" />

                {/* Pattern Overlay */}
                <div className="absolute inset-0 pattern-overlay opacity-30" />

                {/* Floating Icons */}
                <div className="absolute top-20 left-20 animate-float opacity-20">
                    <GraduationCap size={48} className="text-white" />
                </div>
                <div className="absolute bottom-32 right-20 animate-float-delayed opacity-20">
                    <Award size={40} className="text-white" />
                </div>
                <div className="absolute top-1/3 right-1/4 animate-float-slow opacity-20">
                    <Star size={32} className="text-white" />
                </div>
            </div>

            {/* Left Side - Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
                {/* Logo & Title */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl glow-white">
                            <GraduationCap className="text-amrita-maroon" size={36} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Amrita Vishwa Vidyapeetham</h1>
                            <p className="text-white/60 text-sm font-medium">Placement Intelligence Portal</p>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="max-w-lg">
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Shape Your <span className="text-amrita-gold">Future</span> With Us
                        </h2>
                        <p className="text-white/70 text-lg font-medium leading-relaxed">
                            Access exclusive placement opportunities, connect with top recruiters,
                            and leverage AI-powered career guidance to land your dream job.
                        </p>
                    </div>
                </div>

                {/* Quick Facts */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-widest">Placement Highlights 2026</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickFacts.map((fact, i) => (
                            <div
                                key={i}
                                className="glass-card !bg-white/10 !border-white/20 p-5 flex items-center gap-4 group hover:!bg-white/20 transition-all"
                            >
                                <div className="p-3 bg-white/20 rounded-xl text-white group-hover:scale-110 transition-transform">
                                    {fact.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">{fact.value}</p>
                                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{fact.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 text-white/30 text-xs font-bold">
                    <span>NAAC A++ Accredited</span>
                    <span>•</span>
                    <span>NIRF Rank #7</span>
                    <span>•</span>
                    <span>QS World Rankings</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md page-enter">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl">
                            <GraduationCap className="text-amrita-maroon" size={28} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white">Amrita University</h1>
                            <p className="text-white/60 text-xs">Placement Portal</p>
                        </div>
                    </div>

                    {/* Back Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-black uppercase tracking-widest transition-colors mb-8"
                    >
                        <ArrowLeft size={14} /> Return to Portal
                    </Link>

                    {/* Login Card */}
                    <div className="glass-card !bg-white/95 dark:!bg-gray-900/95 overflow-hidden !rounded-3xl shadow-2xl">
                        <div className="p-8 lg:p-10 space-y-8">
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amrita-maroon to-amrita-pink rounded-2xl flex items-center justify-center shadow-xl glow-primary transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <Sparkles className="text-white" size={32} />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Welcome <span className="text-gradient">Back</span>
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    Sign in to access your placement dashboard
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Alert */}
                                {error && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold text-center flex items-center justify-center gap-2">
                                        <span className="text-lg">⚠️</span> {error}
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="your.email@amrita.edu"
                                            className="input-field pl-12"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amrita-maroon transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            className="input-field pl-12 pr-12"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-amrita-maroon transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-amrita-maroon focus:ring-amrita-maroon"
                                        />
                                        <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                                            Remember me
                                        </span>
                                    </label>
                                    <button type="button" className="text-sm font-bold text-amrita-maroon hover:underline">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-premium py-4 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={20} />
                                            <span>Sign In</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-bold">or</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-gray-500 text-sm font-medium">
                                    New to the portal?{' '}
                                    <Link to="/register" className="font-black text-amrita-maroon hover:underline">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Security Footer */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 flex items-center justify-center gap-3 border-t border-gray-100 dark:border-gray-700">
                            <ShieldCheck className="text-green-600" size={18} />
                            <span className="text-xs font-bold text-gray-400">256-bit SSL Encrypted • Your data is secure</span>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-center text-xs text-white/40 font-medium mt-6">
                        By signing in, you agree to our{' '}
                        <button className="underline hover:text-white/60">Terms of Service</button>
                        {' '}and{' '}
                        <button className="underline hover:text-white/60">Privacy Policy</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
