import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageSquare, Building2, MapPin, Briefcase, Calendar, Sparkles, Filter, Linkedin, Mail, User, School, ExternalLink, Globe, Copy, Check, MessageCircle } from 'lucide-react';
import CompanyLogo from '../../components/CompanyLogo';

const AlumniInsights = () => {
    const [insights, setInsights] = useState([]);
    const [directory, setDirectory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Filters both
    const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'insights'
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [selectedAlum, setSelectedAlum] = useState(null);
    const [copied, setCopied] = useState(false);

    const openMessageModal = (alum) => {
        setSelectedAlum(alum);
        setMessageModalOpen(true);
        setCopied(false);
    };

    const handleCopy = () => {
        const text = `Hi ${selectedAlum.name.split(' ')[0]}, I am a junior at Amrita. I saw you are working as ${selectedAlum.role} at ${selectedAlum.company}. I would love to connect and learn from your experience.\n\nThanks!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Directory (Real Placed Students)
                if (activeTab === 'directory') {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/directory?company=${searchTerm}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    // Filter out empty names if any (cleanup)
                    setDirectory(res.data);
                }
                // Fetch Insights (Curated Reports)
                else {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni?company=${searchTerm}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setInsights(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                // Mock data for demo if empty
                if (activeTab === 'directory' && directory.length === 0) {
                    // Keep empty strict or provide mock? Better empty to show real db state
                }
            }
        };
        const delaySearch = setTimeout(fetchData, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, activeTab]);

    return (
        <div className="space-y-8 page-enter pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-bold">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">
                            {activeTab === 'directory' ? 'Alumni Network' : 'Institutional Intelligence'}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Alumni <span className="text-gradient">{activeTab === 'directory' ? 'Connect' : 'Insights'}</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        {activeTab === 'directory'
                            ? "Connect with seniors placed in top companies. Network, ask for referrals, and get mentored."
                            : "Historical interview patterns and decoded company strategies from Amrita alumni."}
                    </p>
                </div>

                <div className="w-full md:w-96 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-amrita-maroon transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder={activeTab === 'directory' ? "Find mentors by company (e.g. Google)..." : "Search reports..."}
                        className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white rounded-2xl outline-none font-bold focus:bg-white focus:ring-4 focus:ring-amrita-maroon/5 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('directory')}
                    className={`pb-3 px-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'directory' ? 'border-amrita-maroon text-amrita-maroon' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <div className="flex items-center gap-2"><User size={16} /> Alumni Directory</div>
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={`pb-3 px-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === 'insights' ? 'border-amrita-maroon text-amrita-maroon' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <div className="flex items-center gap-2"><Globe size={16} /> Strategy Reports</div>
                </button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                </div>
            ) : (
                <>
                    {/* DIRECTORY VIEW */}
                    {activeTab === 'directory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {directory.length > 0 ? directory.map((alum, i) => (
                                <div key={i} className="glass-card p-6 hover:shadow-xl transition-all group flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 p-1 border-4 border-white shadow-lg relative">
                                        {/* Company Logo Avatar */}
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                                            <CompanyLogo name={alum.company} className="!w-full !h-full !rounded-none !p-4" size="xl" />
                                        </div>
                                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Placed"></div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900">{alum.name}</h3>
                                    <p className="text-sm font-medium text-amrita-maroon">{alum.role || 'Software Engineer'}</p>

                                    <div className="mt-4 w-full bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <div className="flex items-center justify-center gap-2 text-gray-800 font-bold mb-1">
                                            <Building2 size={16} className="text-gray-400" />
                                            {alum.company || 'Top Tech Company'}
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                                            <School size={12} /> Class of {alum.batch || '2025'} • {alum.department || 'CSE'}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6 w-full">
                                        {alum.linkedin && (
                                            <a href={alum.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0077b5]/10 text-[#0077b5] rounded-lg font-bold text-sm hover:bg-[#0077b5] hover:text-white transition-all">
                                                <Linkedin size={16} /> LinkedIn
                                            </a>
                                        )}
                                        {alum.email && (
                                            <a href={`mailto:${alum.email}`}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-800 hover:text-white dark:hover:bg-gray-600 transition-all">
                                                <Mail size={16} /> Email
                                            </a>
                                        )}
                                        <button onClick={() => openMessageModal(alum)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Draft Connection Message">
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    <User size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-bold">No alumni found for "{searchTerm}"</p>
                                    <p className="text-xs">Try searching for a different company.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* INSIGHTS VIEW (Classic) */}
                    {activeTab === 'insights' && (
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
                                                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-all">{insight.company}</h3>
                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{insight.position}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-amrita-gold/10 text-amrita-maroon text-[10px] font-black rounded-full border border-amrita-gold/20 uppercase italic">
                                                {insight.year}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 min-h-[80px]">
                                                <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                                                    <MessageSquare size={10} /> Core Advice
                                                </h4>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed line-clamp-3">"{insight.summary}"</p>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 border-2 border-dashed border-amrita-maroon/20 text-amrita-maroon font-black text-xs rounded-xl hover:bg-amrita-maroon hover:text-white transition-all uppercase tracking-widest">
                                            Read Report
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    <Globe size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-bold">No reports found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Message Generator Modal */}
            {messageModalOpen && selectedAlum && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white relative">
                            <h3 className="text-xl font-black">Connection Request</h3>
                            <p className="text-white/80 text-sm mt-1">Send this to {selectedAlum.name}</p>
                            <button onClick={() => setMessageModalOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 font-medium text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                {`Hi ${selectedAlum.name.split(' ')[0]},

I am a junior at Amrita. I saw you are working as ${selectedAlum.role} at ${selectedAlum.company}. I would love to connect and learn from your experience.

Thanks!`}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy to Clipboard</>}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-3">Paste this in your LinkedIn connection note.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniInsights;
