import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Sparkles, Mail, Lock, ShieldCheck, UserCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[url('https://images.unsplash.com/photo-1523050853063-bd8012fbb230?auto=format&fit=crop&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amrita-maroon/90 to-amrita-burgundy/80 backdrop-blur-[2px]" />

            <div className="relative w-full max-w-md page-enter">
                <Link to="/" className="absolute -top-16 left-0 text-white/50 hover:text-white flex items-center gap-2 font-bold tracking-widest text-xs uppercase transition-colors">
                    <ArrowLeft size={16} /> Return to Portal
                </Link>
                <div className="glass-card overflow-hidden !rounded-3xl border-white/20 shadow-2xl bg-white/10 backdrop-blur-xl">
                    <div className="p-10 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <UserPlus className="text-amrita-maroon" size={40} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Establish <span className="text-amrita-gold">ID</span></h1>
                            <p className="text-white/60 font-medium text-sm">Join the Amrita Placement Ecosystem</p>
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
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Institutional Email"
                                        className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-bold placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amrita-gold transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Secure Password"
                                        className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-bold placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-amrita-gold transition-colors">
                                        <UserCircle size={20} />
                                    </div>
                                    <select
                                        className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white font-bold appearance-none focus:bg-white/20 transition-all shadow-inner"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="student" className="bg-amrita-maroon text-white font-bold">New Candidate</option>
                                        <option value="admin" className="bg-amrita-maroon text-white font-bold">CIR Official</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-white text-amrita-maroon font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                <Sparkles size={20} /> ESTABLISH ACCOUNT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="text-center">
                            <Link to="/login" className="text-white/40 text-xs font-black uppercase tracking-widest hover:text-amrita-gold transition-colors italic">
                                Already Registered? <span className="text-white underline ml-1">Initiate Session</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
                    <ShieldCheck className="text-white" size={24} />
                    <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Verified Institutional Protocol</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
