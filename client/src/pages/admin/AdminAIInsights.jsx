import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, Zap, CheckCircle, RefreshCw, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/admin-insights`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInsights(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <RefreshCw size={48} className="text-amrita-maroon animate-spin mb-6" />
            <h3 className="text-2xl font-black text-gray-900">Synthesizing Institutional Data...</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">Connecting to Neural Engine</p>
        </div>
    );

    if (!insights) return (
        <div className="p-12 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Failed to load AI Insights</h3>
            <button onClick={fetchInsights} className="mt-4 px-6 py-2 bg-amrita-maroon text-white rounded-lg font-bold hover:bg-[#8B0000]">Retry</button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-amrita-maroon to-[#D1477C] rounded-2xl text-white shadow-lg">
                            <Brain size={28} />
                        </div>
                        <span className="text-gray-900">Director's</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amrita-maroon to-[#D1477C]">Neural Dashboard</span>
                    </h2>
                    <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest">Powered by Google Gemini Array</p>
                </div>
                <button
                    onClick={fetchInsights}
                    className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm text-gray-600 transition-colors border border-gray-100"
                    title="Refresh Insights"
                >
                    <RefreshCw size={20} />
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Executive Summary */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] p-10 bg-gradient-to-br from-[#1E0610] to-[#45071D] text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-10 transform scale-150">
                        <Activity size={200} />
                    </div>
                    <div className="relative z-10 w-full max-w-4xl">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#F5B0CA] mb-4 flex items-center gap-2">
                            <Zap size={16} /> Executive Summary
                        </h3>
                        <p className="text-2xl lg:text-3xl font-bold leading-relaxed text-pink-50">
                            {insights.summary}
                        </p>
                    </div>
                </div>

                {/* AI Predictions */}
                <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 border-t-4 border-t-amrita-maroon border-x border-b border-gray-100 shadow-sm">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 text-gray-900">
                        <div className="p-2 bg-pink-50 text-amrita-maroon rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                        Market Predictions
                    </h3>
                    <div className="space-y-4">
                        {(insights.predictions || []).map((pred, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3"
                            >
                                <Target size={18} className="text-amrita-maroon mt-1 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 leading-relaxed">{pred}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Strategic Action Plan */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border-t-4 border-t-[#D1477C] border-x border-b border-gray-100 shadow-sm">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 text-gray-900">
                        <div className="p-2 bg-pink-50 text-[#D1477C] rounded-xl">
                            <Brain size={20} />
                        </div>
                        Strategic Action Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(insights.actionPlan || []).map((action, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                key={i}
                                className="p-5 bg-gradient-to-br from-white to-pink-50/50 border border-pink-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col"
                            >
                                <div className="w-8 h-8 rounded-full bg-pink-100 text-[#D1477C] flex items-center justify-center font-black mb-3 text-sm">
                                    {i + 1}
                                </div>
                                <span className="text-sm font-bold text-gray-800 leading-relaxed flex-1">{action}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAIInsights;
