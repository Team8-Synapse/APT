/**
 * Mobile: Frontend / Pages / Student
 * Description: Preparation Hub Component.
 * - Provides curated preparation resources (Coding, Aptitude, Technical, HR).
 * - Allows students to create, edit, and delete personal notes.
 * - Supports searching and filtering resources.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ExternalLink, Search, Sparkles, Filter, Code, Cpu, UserCheck, Briefcase, LayoutGrid, List, StickyNote, Plus, Trash2, Edit, Save, X, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PrepHub = () => {
    const { user, token } = useAuth();
    // Resource State
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [category, setCategory] = useState('Coding');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const categories = [
        { id: 'All', icon: <LayoutGrid size={18} />, label: 'All' },
        { id: 'Coding', icon: <Code size={18} />, label: 'Practice' },
        { id: 'Aptitude', icon: <UserCheck size={18} />, label: 'Aptitude & Logic' },
        { id: 'Technical', icon: <Cpu size={18} />, label: 'Core Technical' },
        { id: 'HR', icon: <Briefcase size={18} />, label: 'HR' },
        { id: 'Notes', icon: <StickyNote size={18} />, label: 'My Notes' },
    ];

    // Personal Notes State
    const [notes, setNotes] = useState([]);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteFormData, setNoteFormData] = useState({ name: '', text: '' });

    useEffect(() => {
        if (category === 'Notes') {
            if (!token) {
                setCategory('All');
            } else {
                fetchNotes();
            }
        } else {
            fetchResources();
        }
    }, [category, token]);

    // Fetch resources based on selected category
    const fetchResources = async () => {
        setLoading(true);
        try {
            const url = category === 'All'
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources?category=${category}`;
            const res = await axios.get(url);
            setResources(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Fetch personal notes
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotes(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Create or Update Note
    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNoteId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes/${editingNoteId}`, noteFormData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes`, noteFormData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setNoteFormData({ name: '', text: '' });
            setIsAddingNote(false);
            setEditingNoteId(null);
            fetchNotes();
        } catch (err) {
            console.error('Note Save Error:', err.response || err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to save note';
            alert(`Error: ${errorMsg}`);
        }
    };

    // Populate form for editing
    const handleEditNote = (note) => {
        setEditingNoteId(note._id);
        setNoteFormData({ name: note.name, text: note.text });
        setIsAddingNote(true);
    };

    // Delete Note
    const handleDeleteNote = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    // Helper: Truncate note content for preview
    const getShortSummary = (text) => {
        if (!text) return '';
        // Prefer line breaks if present (First two lines)
        const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
        if (lines.length >= 2) {
            return lines.slice(0, 2).join('\n');
        }
        // Fallback to sentences if line breaks are not present (First two sentences)
        const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g);
        if (sentences && sentences.length >= 1) {
            return sentences.slice(0, 2).map(s => s.trim()).join(' ');
        }
        // Absolute fallback if no clear lines or punctuation
        return text.trim();
    };

    // Filter resources based on search term
    const filteredResources = resources.filter(res => {
        // Requirement: 'Notes' MUST be excluded from 'All' browsing and search results
        if (res.category === 'Notes' || res.type === 'Notes') return false;

        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = res.title?.toLowerCase().includes(searchLower);
        const matchesTags = res.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        return matchesTitle || matchesTags;
    });

    return (
        <div className="space-y-10 page-enter pb-12 font-bold">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex-1">
                    <h1 className="text-4xl font-black flex items-center gap-2">
                        <BookOpen className="text-amrita-maroon" size={32} />
                        <span style={{ color: '#1A1A1A' }}>Prep</span> <span style={{ color: '#A4123F' }}>Hub</span>
                    </h1>
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
                    {/* Search Bar & View Mode Section */}
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/40 dark:bg-gray-800/30 p-4 rounded-3xl border border-white dark:border-gray-700 shadow-sm">
                        <div className="relative flex-1 group w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="text-gray-400 group-focus-within:text-amrita-maroon transition-colors" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title or tags..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/40 rounded-2xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none transition-all font-medium text-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value.trim() !== '') {
                                        setCategory('All');
                                    }
                                }}
                            />
                        </div>
                        <div className="flex bg-white/60 p-1 rounded-xl shadow-sm border border-white/40">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amrita-maroon text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amrita-maroon text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                        </div>
                    ) : category === 'Notes' ? (
                        !token ? (
                            <div className="col-span-full py-24 glass-card flex flex-col items-center justify-center text-gray-400 opacity-50 bg-white/20 border-white/40">
                                <Lock size={64} className="mb-4" />
                                <p className="text-xl font-black italic">Workspace Locked</p>
                                <p className="text-xs font-bold mt-2 uppercase">Please log in to manage your personal preparation notes</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center bg-white/40 p-6 rounded-2xl border border-white">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">Personal <span className="text-amrita-maroon italic">Workspace</span></h2>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Organize your preparation insights</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsAddingNote(true);
                                            setEditingNoteId(null);
                                            setNoteFormData({ name: '', text: '' });
                                        }}
                                        className="flex items-center gap-2 bg-amrita-maroon text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-all"
                                    >
                                        <Plus size={16} /> Create Note
                                    </button>
                                </div>

                                {isAddingNote && (
                                    <div className="glass-card p-6 animate-fade-in border-t-4 border-t-amrita-maroon">
                                        <h3 className="font-black text-lg mb-4 text-gray-900">{editingNoteId ? 'Update' : 'New'} Note</h3>
                                        <form onSubmit={handleNoteSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Note Name</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full p-3 bg-white/60 border border-white/40 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amrita-maroon/20 outline-none"
                                                        placeholder="e.g., Recursion Logic"
                                                        value={noteFormData.name}
                                                        onChange={(e) => setNoteFormData({ ...noteFormData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Note Content</label>
                                                <textarea
                                                    required rows="4"
                                                    className="w-full p-3 bg-white/60 border border-white/40 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amrita-maroon/20 outline-none"
                                                    placeholder="Write your insights here..."
                                                    value={noteFormData.text}
                                                    onChange={(e) => setNoteFormData({ ...noteFormData, text: e.target.value })}
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-amrita-maroon text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-amrita-maroon/90">
                                                    <Save size={16} /> {editingNoteId ? 'Update' : 'Save'} Note
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingNote(false)}
                                                    className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-200"
                                                >
                                                    <X size={16} /> Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {notes.length > 0 ? notes.map((note) => (
                                        <div key={note._id} className="glass-card group p-6 flex flex-col h-full bg-white/40 border-white/40">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-amrita-maroon/10 rounded-xl text-amrita-maroon">
                                                        <StickyNote size={20} />
                                                    </div>
                                                    <h3 className="font-black text-lg text-gray-900 group-hover:text-amrita-maroon transition-colors">{note.name}</h3>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditNote(note)} className="p-2 hover:bg-amrita-maroon/5 text-gray-400 hover:text-amrita-maroon rounded-lg transition-all"><Edit size={14} /></button>
                                                    <button onClick={() => handleDeleteNote(note._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed flex-1 whitespace-pre-wrap">{note.text}</p>
                                            {note.createdAt && (
                                                <div className="mt-6 pt-4 border-t border-white/40 flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 opacity-50 bg-white/20 rounded-3xl border border-white/40">
                                            <StickyNote size={64} className="mb-4" />
                                            <p className="text-xl font-black italic">Your notepad is empty.</p>
                                            <p className="text-xs font-bold mt-2 uppercase">Create your first note to start tracking insights</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                                <button onClick={() => {
                                                    const url = res.links?.[0] || res.link;
                                                    if (!url) return;
                                                    // For PPT files, use Google Docs Viewer
                                                    if (res.type === 'PPT' || url.toLowerCase().includes('.ppt')) {
                                                        window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');
                                                        return;
                                                    }
                                                    window.open(url, '_blank');
                                                }} className="p-2 transition-colors hover:bg-amrita-maroon/5 rounded-full text-amrita-maroon">
                                                    <ExternalLink size={18} />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-lg font-black text-gray-900 group-hover:text-amrita-maroon transition-colors line-clamp-1">{res.title}</h3>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 whitespace-pre-line">{getShortSummary(res.description || res.content)}</p>
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
                                            onClick={() => {
                                                const url = res.links?.[0] || res.link;
                                                if (!url) return;
                                                // For PPT files, use Google Docs Viewer
                                                if (res.type === 'PPT' || url.toLowerCase().includes('.ppt')) {
                                                    window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');
                                                    return;
                                                }
                                                window.open(url, '_blank');
                                            }}
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
                        ) : (
                            <div className="glass-card overflow-hidden bg-white/40 border border-white">
                                <table className="w-full">
                                    <thead className="bg-white/60 border-b border-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Resource</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/40">
                                        {filteredResources.length > 0 ? filteredResources.map((res, i) => (
                                            <tr key={i} className="hover:bg-white/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-amrita-maroon/5 text-amrita-maroon rounded-lg group-hover:bg-amrita-maroon group-hover:text-white transition-all self-start mt-1">
                                                            <BookOpen size={16} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-gray-900 text-sm group-hover:text-amrita-maroon transition-colors">{res.title}</span>
                                                            <p className="text-[10px] text-gray-400 font-medium line-clamp-1 mt-0.5 whitespace-pre-line leading-tight">
                                                                {getShortSummary(res.description || res.content)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">{res.category || category}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black bg-white border border-gray-100 px-2 py-1 rounded-lg uppercase tracking-widest text-gray-600 italic">{res.type || 'Link'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            const url = res.links?.[0] || res.link;
                                                            if (!url) return;
                                                            // For PPT files, use Google Docs Viewer
                                                            if (res.type === 'PPT' || url.toLowerCase().includes('.ppt')) {
                                                                window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');
                                                                return;
                                                            }
                                                            window.open(url, '_blank');
                                                        }}
                                                        className="p-2 text-amrita-maroon hover:bg-amrita-maroon hover:text-white rounded-lg transition-all"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-gray-400 opacity-50 font-black italic">
                                                    No modules matching your search prefix.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>


            </div>
        </div>
    );
};

export default PrepHub;
