import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ExternalLink, Search, Sparkles, Filter, Code, Cpu, UserCheck, Briefcase } from 'lucide-react';

const PrepHub = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('Coding');

    const categories = [
        { id: 'Coding', icon: <Code size={18} />, label: 'Data Structures' },
        { id: 'Aptitude', icon: <Cpu size={18} />, label: 'Aptitude & Logic' },
        { id: 'Technical', icon: <UserCheck size={18} />, label: 'Core Technical' },
        { id: 'HR', icon: <Briefcase size={18} />, label: 'HR & Behavioral' },
    ];

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
    }, [category]);

    return (
        <div className="space-y-10 page-enter pb-12 font-bold">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Elite Training Material</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Prep <span className="text-gradient">Hub</span></h1>
                    <p className="text-gray-500 font-medium mt-2">Curated preparation resources verified by Amrita Corporate Relations</p>
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

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.length > 0 ? resources.map((res, i) => (
                        <div key={i} className="glass-card flex flex-col group h-full">
                            <div className="p-6 flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-amrita-maroon/10 rounded-2xl group-hover:bg-amrita-maroon/20 transition-colors">
                                            <BookOpen className="text-amrita-maroon" size={24} />
                                        </div>
                                        <div className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest italic group-hover:border-amrita-maroon/20">
                                            {res.type}
                                        </div>
                                    </div>
                                    <button onClick={() => window.open(res.link, '_blank')} className="p-2 transition-colors hover:bg-amrita-maroon/5 rounded-full text-amrita-maroon">
                                        <ExternalLink size={18} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-amrita-maroon transition-colors line-clamp-1">{res.title}</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{res.description}</p>
                                </div>

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
                                onClick={() => window.open(res.link, '_blank')}
                                className="w-full py-4 bg-white/40 border-t border-white group-hover:bg-amrita-maroon group-hover:text-white transition-all text-xs font-black uppercase tracking-widest italic rounded-b-[1.5rem]"
                            >
                                Initiate Learning Module
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 glass-card flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <BookOpen size={64} className="mb-4" />
                            <p className="text-xl font-black italic">Module currently in CIR verification phase.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PrepHub;
