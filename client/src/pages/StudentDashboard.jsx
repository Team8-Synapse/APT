import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Target, TrendingUp, AlertCircle, Calendar, ChevronRight, Brain, Sparkles, Zap, Award } from 'lucide-react';
import AIChatbot from '../components/AIChatbot';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ readinessScore: 0, recommendations: [], insights: "" });
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aiRes, driveRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/insights`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligibility`)
                ]);
                setStats(aiRes.data);
                // Mock data for drives for now
                setDrives([
                    { companyName: 'Google', jobProfile: 'Software Engineer', date: '2026-03-15', status: 'upcoming' },
                    { companyName: 'Microsoft', jobProfile: 'Cloud Solutions', date: '2026-03-20', status: 'upcoming' },
                ]);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
        </div>
    );

    return (
        <div className="space-y-10 page-enter">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Personalized Insight</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Namaste, <span className="text-gradient">{user.email.split('@')[0]}</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Here's your real-time placement readiness intelligence</p>
                </div>
                <div className="flex items-center gap-3 glass-card !rounded-2xl px-6 py-3 border-amrita-gold/20">
                    <div className="p-2 bg-amrita-gold/10 rounded-lg">
                        <Brain className="text-amrita-maroon" size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Status</p>
                        <p className="text-sm font-black text-amrita-maroon">ENGINE ACTIVE</p>
                    </div>
                </div>
            </header>

            {/* AI Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-10 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={80} className="text-amrita-maroon" />
                    </div>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                            <circle className="text-amrita-maroon transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - stats.readinessScore / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-amrita-maroon">{Math.round(stats.readinessScore)}%</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Readiness</span>
                        </div>
                    </div>
                    <div className="text-center group-hover:scale-105 transition-transform">
                        <h3 className="text-lg font-black text-gray-800">Elite Standing</h3>
                        <p className="text-sm text-gray-500 font-medium max-w-[200px] mt-2 italic">Based on skill vector mapping and CGPA parity.</p>
                    </div>
                </div>

                <div className="glass-card col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <TrendingUp className="text-amrita-maroon" /> AI RECOM-ENGINE
                        </h2>
                        <span className="text-[10px] font-black bg-amrita-maroon/5 text-amrita-maroon px-3 py-1 rounded-full uppercase italic">Precision Matching</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.recommendations.length > 0 ? stats.recommendations.map((rec, i) => (
                            <div key={i} className="group p-5 bg-white/40 border border-white hover:border-amrita-maroon/20 hover:bg-white/60 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-amrita-maroon/10 transition-colors">
                                        <Briefcase size={20} className="text-amrita-maroon" />
                                    </div>
                                    <span className="text-xs font-black text-amrita-maroon italic">{rec.matchProbability}% MATCH</span>
                                </div>
                                <h3 className="font-black text-gray-900 group-hover:text-amrita-maroon transition-colors">{rec.company}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-2 line-clamp-2">{rec.reasoning}</p>
                                <button className="mt-4 flex items-center gap-1 text-[10px] font-black text-amrita-maroon uppercase tracking-widest hover:gap-2 transition-all">
                                    Analyze Requirements <ChevronRight size={14} />
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-2 py-12 flex flex-col items-center justify-center text-gray-400">
                                <AlertCircle size={40} className="mb-4 opacity-20" />
                                <p className="font-bold italic">Awaiting profile completion for matrix matching...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lower Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black flex items-center gap-3">
                                <Calendar className="text-amrita-maroon" /> UPCOMING DRIVES
                            </h2>
                            <button className="text-xs font-black text-amrita-maroon hover:underline uppercase tracking-widest italic">View All Calendar</button>
                        </div>
                        <div className="space-y-4">
                            {drives.map((drive, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/40 border border-white rounded-2xl hover:bg-white/60 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amrita-maroon text-amrita-gold rounded-xl flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {drive.companyName[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-tighter italic">{drive.jobProfile}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400 uppercase">Schedule</p>
                                            <p className="font-black text-gray-900">{new Date(drive.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="px-4 py-2 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-widest italic">
                                            {drive.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-card p-8">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                            <Award className="text-amrita-maroon" /> STRATEGIC ROADMAP
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <RoadmapStep num="01" title="Matrix Sync" desc="Skill verification" completed />
                            <RoadmapStep num="02" title="Mock Labs" desc="Pattern training" active />
                            <RoadmapStep num="03" title="Insight Review" desc="Alumni intelligence" />
                            <RoadmapStep num="04" title="Final Pivot" desc="Company specific" />
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 p-2 bg-amrita-maroon rounded-2xl shadow-lg">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Brain className="text-amrita-gold" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest">Placement AI</h3>
                                <p className="text-amrita-gold/70 text-[10px] font-black italic">Neural Advisor v4.0</p>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[500px] overflow-hidden rounded-2xl">
                            <AIChatbot />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoadmapStep = ({ num, title, desc, completed, active }) => (
    <div className={`relative p-5 rounded-2xl border transition-all ${active ? 'bg-amrita-maroon text-white shadow-xl scale-105 z-10' : completed ? 'bg-green-50/50 border-green-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
        <p className={`text-[10px] font-black tracking-widest mb-1 ${active ? 'text-amrita-gold' : 'text-amrita-maroon/40'}`}>{num}</p>
        <h4 className="font-black text-sm tracking-tighter uppercase">{title}</h4>
        <p className={`text-[10px] mt-1 font-medium italic ${active ? 'text-white/80' : 'text-gray-400'}`}>{desc}</p>
    </div>
);

export default StudentDashboard;
