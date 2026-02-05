import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ExternalLink, Search, Sparkles, Filter, Code, Cpu, UserCheck, Briefcase, Megaphone } from 'lucide-react';

const PrepHub = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('Coding');
    const [searchTerm, setSearchTerm] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    const categories = [
        { id: 'Coding', icon: <Code size={18} />, label: 'Practice' },
        { id: 'Aptitude', icon: <Cpu size={18} />, label: 'Aptitude & Logic' },
        { id: 'Technical', icon: <UserCheck size={18} />, label: 'Core Technical' },
        { id: 'HR', icon: <Briefcase size={18} />, label: 'HR & Behavioral' },
    ];

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources?category=${category}`);
                setResources(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchResources();
        fetchAnnouncements();

        // Polling for real-time updates (every 30 seconds)
        const pollInterval = setInterval(fetchAnnouncements, 30000);
        return () => clearInterval(pollInterval);
    }, [category]);

    const filteredResources = resources.filter(res => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return res.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    });

    return (
        <div className="space-y-10 page-enter pb-12 font-bold">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Elite Training Material</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Prep <span className="text-gradient">Hub</span></h1>
                    <p className="text-gray-500 font-medium mt-2">Curated preparation resources verified by CIR, Amrita</p>
                </div>

                <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-2">
                    <div className="flex p-1.5 bg-white/40 border border-white rounded-2xl shadow-sm gap-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${category === cat.id
                                    ? 'bg-amrita-maroon text-white shadow-lg scale-105'
                                    : 'text-gray-600 hover:bg-white/60'
                                    }`}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content */}
                <div className="flex-1 space-y-10">
                    {/* Search Bar Section */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-amrita-maroon transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by tags (e.g., dsa, oop, java)..."
                            className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredResources.length > 0 ? filteredResources.map((res, i) => (
                                <div key={i} className="glass-card flex flex-col group h-full">
                                    <div className="p-6 flex-1 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-amrita-maroon/10 rounded-2xl group-hover:bg-amrita-maroon/20 transition-colors">
                                                    <BookOpen className="text-amrita-maroon" size={24} />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest italic group-hover:border-amrita-maroon/20 w-fit">
                                                        {res.type || 'Link'}
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => window.open(res.links?.[0] || res.link, '_blank')} className="p-2 transition-colors hover:bg-amrita-maroon/5 rounded-full text-amrita-maroon">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-amrita-maroon transition-colors line-clamp-1">{res.title}</h3>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{res.content || res.description}</p>
                                        </div>

                                        {res.tags && res.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {res.tags.map((tag, idx) => (
                                                    <span key={idx} className="text-[9px] font-black text-amrita-maroon bg-amrita-maroon/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/40">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amrita-maroon to-amrita-burgundy flex items-center justify-center text-[10px] text-white font-black">
                                                {res.addedBy?.email?.[0].toUpperCase() || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 leading-none">Curated by CIR</p>
                                                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-widest mt-1 italic">Verified Content</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.open(res.links?.[0] || res.link, '_blank')}
                                        className="w-full py-4 bg-white/40 border-t border-white group-hover:bg-amrita-maroon group-hover:text-white transition-all text-xs font-black uppercase tracking-widest italic rounded-b-[1.5rem]"
                                    >
                                        Start Learning
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full py-24 glass-card flex flex-col items-center justify-center text-gray-400 opacity-50">
                                    <BookOpen size={64} className="mb-4" />
                                    <p className="text-xl font-black italic">No modules matching your search prefix.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Announcements */}
                <aside className="w-full lg:w-80 space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-amrita-maroon to-amrita-burgundy text-white flex items-center gap-3">
                            <Megaphone size={20} className="animate-bounce" />
                            <h2 className="font-black uppercase tracking-widest text-xs">Admin Updates</h2>
                        </div>
                        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
                            {announcements.length > 0 ? announcements.map((ann, i) => (
                                <div key={i} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <p className="text-sm font-bold text-gray-800 leading-relaxed italic">
                                        "{ann.content}"
                                    </p>
                                    {ann.links && ann.links.length > 0 && ann.links[0].url && (
                                        <div className="flex flex-wrap gap-2">
                                            {ann.links.map((link, idx) => (
                                                link.url && (
                                                    <a
                                                        key={idx}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] font-black text-amrita-maroon flex items-center gap-1 hover:underline"
                                                    >
                                                        <ExternalLink size={10} /> {link.title || 'View Link'}
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-center text-xs text-gray-400 font-bold py-10 italic">No updates available at this moment.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PrepHub;
