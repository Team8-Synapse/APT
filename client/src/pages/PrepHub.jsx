import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ExternalLink, Search, Sparkles, Filter, Code, Cpu, UserCheck, Briefcase, Megaphone, FileText, Plus, X, Trash2, Edit2 } from 'lucide-react';

const PrepHub = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '' });

    const categories = [
        { id: 'All', icon: <Sparkles size={18} />, label: 'All Resources' },
        { id: 'Coding', icon: <Code size={18} />, label: 'Practice' },
        { id: 'Aptitude', icon: <Cpu size={18} />, label: 'Aptitude & Logic' },
        { id: 'Technical', icon: <UserCheck size={18} />, label: 'Core Technical' },
        { id: 'HR', icon: <Briefcase size={18} />, label: 'HR & Behavioral' },
        { id: 'Notes', icon: <FileText size={18} />, label: 'My Notes' },
    ];

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                if (category === 'Notes') {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setNotes(res.data);
                } else {
                    let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`;
                    if (!searchTerm && category !== 'All') {
                        url += `?category=${category}`;
                    }
                    const res = await axios.get(url, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setResources(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchResources();
    }, [category, searchTerm]);

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = noteForm.tags.split(',').map(tag => tag.trim()).filter(t => t !== '');
            const payload = { ...noteForm, tags: tagsArray };

            if (editingNote) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes/${editingNote._id}`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes`, payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }

            setShowNoteModal(false);
            setEditingNote(null);
            setNoteForm({ title: '', content: '', tags: '' });
            // Refresh notes
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filteredNotes = notes.filter(n => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            n.title?.toLowerCase().includes(searchLower) ||
            n.content?.toLowerCase().includes(searchLower) ||
            n.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
    });

    const filteredResources = resources.filter(res => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            res.title?.toLowerCase().includes(searchLower) ||
            res.content?.toLowerCase().includes(searchLower) ||
            res.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
    });

    const openLink = (link) => {
        if (!link) return;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5005';
        let finalUrl = link;

        if (link.startsWith('uploads/')) {
            finalUrl = `${baseUrl}/${link}`;
        } else if (!/^https?:\/\//i.test(link)) {
            finalUrl = `https://${link}`;
        }

        window.open(finalUrl, '_blank');
    };

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

            <div className="flex flex-col gap-10">
                <div className="flex-1 space-y-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-amrita-maroon transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by tags (e.g., dsa, oop, java)..."
                            className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                                if (value.trim() !== '' && category !== 'Notes') {
                                    setCategory('All');
                                }
                            }}
                        />
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                        </div>
                    ) : category === 'Notes' ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900">Personal Insights</h2>
                                <button
                                    onClick={() => {
                                        setEditingNote(null);
                                        setNoteForm({ title: '', content: '', tags: '' });
                                        setShowNoteModal(true);
                                    }}
                                    className="btn-premium flex items-center gap-2"
                                >
                                    <Plus size={18} /> New Note
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNotes.length > 0 ? filteredNotes.map((note, i) => (
                                    <div key={i} className="glass-card p-6 flex flex-col group h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-amrita-maroon/10 rounded-2xl">
                                                <FileText className="text-amrita-maroon" size={20} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingNote(note);
                                                        setNoteForm({ title: note.title, content: note.content, tags: note.tags?.join(', ') || '' });
                                                        setShowNoteModal(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-amrita-maroon hover:bg-amrita-maroon/5 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(note._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2 truncate">{note.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-4 flex-1 mb-4">
                                            {note.content}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                            {note.tags?.map((tag, idx) => (
                                                <span key={idx} className="text-[10px] font-black text-amrita-maroon/60 bg-amrita-maroon/5 px-2 py-1 rounded-md uppercase">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-24 glass-card flex flex-col items-center justify-center text-gray-300">
                                        <FileText size={64} className="mb-4 opacity-20" />
                                        <p className="text-xl font-black italic">Your knowledge base is empty.</p>
                                        <p className="text-sm font-bold mt-2 opacity-50">Click "New Note" to start documenting your journey.</p>
                                    </div>
                                )}
                            </div>
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
                                            </div>
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
                                        onClick={() => openLink(res.links?.[0] || res.link)}
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
            </div>

            {showNoteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{editingNote ? 'Refine Note' : 'Capture Knowledge'}</h2>
                                <p className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mt-1">Your personal growth archive</p>
                            </div>
                            <button
                                onClick={() => setShowNoteModal(false)}
                                className="p-3 hover:bg-white/20 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleNoteSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Document Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Dynamic Programming Strategy"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-bold text-gray-900"
                                    value={noteForm.title}
                                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Knowledge Content</label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="Write your notes here..."
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-bold text-gray-900 resize-none"
                                    value={noteForm.content}
                                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Classification Tags</label>
                                <input
                                    type="text"
                                    placeholder="dsa, oop, interview (comma separated)"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-bold text-gray-900 font-mono text-sm"
                                    value={noteForm.tags}
                                    onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNoteModal(false)}
                                    className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 px-6 bg-amrita-maroon text-white rounded-2xl font-black hover:bg-amrita-burgundy transition-all shadow-lg shadow-amrita-maroon/20 uppercase tracking-widest text-xs"
                                >
                                    {editingNote ? 'Update Repository' : 'Secure Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrepHub;
