import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageSquare, Building2, MapPin, Briefcase, Calendar, Sparkles, Filter } from 'lucide-react';

const AlumniInsights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni?company=${searchTerm}`);
                setInsights(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        const delaySearch = setTimeout(fetchInsights, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    return (
        <div className="space-y-10 page-enter pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-bold">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Institutional Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Alumni <span className="text-gradient">Insights</span></h1>
                    <p className="text-gray-500 font-medium mt-2">Historical interview patterns and decoded company strategies from Amrita alumni</p>
                </div>

                <div className="w-full md:w-96 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-amrita-maroon transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a company (e.g. Google)..."
                        className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white rounded-2xl outline-none font-bold focus:bg-white focus:ring-4 focus:ring-amrita-maroon/5 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {insights.length > 0 ? insights.map((insight, i) => (
                        <div key={i} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all">
                            <div className="p-1 bg-gradient-to-r from-amrita-maroon to-amrita-burgundy" />
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-amrita-maroon/10 transition-colors">
                                            <Building2 className="text-amrita-maroon" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-amrita-maroon transition-all">{insight.company}</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{insight.position}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-amrita-gold/10 text-amrita-maroon text-[10px] font-black rounded-full border border-amrita-gold/20 uppercase italic">
                                        {insight.year}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-amrita-maroon/40" /> {insight.location || 'Pan India'}</div>
                                        <div className="flex items-center gap-2"><Briefcase size={14} className="text-amrita-maroon/40" /> {insight.salaryPackage || 'Competitive'}</div>
                                    </div>

                                    <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[80px]">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                                            <MessageSquare size={10} /> Core Advice
                                        </h4>
                                        <p className="text-xs text-gray-700 italic leading-relaxed line-clamp-3">"{insight.summary}"</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {insight.rounds[0]?.topics.slice(0, 3).map((topic, j) => (
                                        <span key={j} className="px-3 py-1 bg-white text-gray-600 border border-gray-100 text-[10px] font-black rounded-lg group-hover:border-amrita-maroon/20 group-hover:text-amrita-maroon transition-colors">
                                            #{topic.toUpperCase()}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-3 border-2 border-dashed border-amrita-maroon/20 text-amrita-maroon font-black text-xs rounded-xl hover:bg-amrita-maroon hover:text-white transition-all uppercase tracking-widest">
                                    Decode Interview
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 glass-card flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <Building2 size={64} className="mb-4" />
                            <p className="text-xl font-black italic">No repositories found for this company.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlumniInsights;
