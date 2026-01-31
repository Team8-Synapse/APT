import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, User, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amrita-maroon/90 to-amrita-burgundy/80 backdrop-blur-[2px]" />

            <div className="relative w-full max-w-md page-enter">
                <Link to="/" className="absolute -top-16 left-0 text-white/50 hover:text-white flex items-center gap-2 font-bold tracking-widest text-xs uppercase transition-colors">
                    <ArrowLeft size={16} /> Return to Portal
                </Link>
                <div className="glass-card overflow-hidden !rounded-3xl border-white/20 shadow-2xl bg-white/10 backdrop-blur-xl">
                    <div className="p-10 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="text-amrita-maroon" size={40} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Welcome <span className="text-amrita-gold">Back</span></h1>
                            <p className="text-white/60 font-medium text-sm">Amrita Placement Intelligence Portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-xs font-black tracking-widest uppercase text-center italic">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amrita-gold transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Institutional Email"
                                        className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-bold placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amrita-gold transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Secret Password"
                                        className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-bold placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-white text-amrita-maroon font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                <LogIn size={20} /> INITIATE SESSION <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="text-center">
                            <Link to="/register" className="text-white/40 text-xs font-black uppercase tracking-widest hover:text-amrita-gold transition-colors italic">
                                New Candidate? <span className="text-white underline ml-1">Establish Credentials</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
                    <ShieldCheck className="text-white" size={24} />
                    <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Secured by Amrita CIR Neural Net</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
