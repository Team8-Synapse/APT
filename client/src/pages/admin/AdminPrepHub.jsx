import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen, Search, Plus, Edit3, Trash2, ExternalLink,
    Filter, LayoutGrid, List, FileText, Link as LinkIcon,
    Code, Cpu, UserCheck, Briefcase, PlusCircle, Save, X,
    ChevronLeft, Sparkles, TrendingUp, Clock, Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPrepHub = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Coding',
        type: 'Link',
        link: '',
        content: '',
        tags: ''
    });

    const categories = ['All', 'Coding', 'Aptitude', 'Technical', 'HR'];
    const types = ['Link', 'PDF', 'Video', 'Article'];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`);
            setResources(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const dataToSubmit = { ...formData, tags: tagsArray, addedBy: user.id };

            if (editingResource) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources/${editingResource._id}`, dataToSubmit);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`, dataToSubmit);
            }

            setShowModal(false);
            setEditingResource(null);
            setFormData({ title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: '' });
            fetchResources();
        } catch (err) {
            console.error('Error saving resource:', err);
            alert('Failed to save resource');
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            category: resource.category,
            type: resource.type || 'Link',
            link: resource.link || '',
            content: resource.content || '',
            tags: resource.tags?.join(', ') || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources/${id}`);
                fetchResources();
            } catch (err) {
                console.error('Error deleting resource:', err);
            }
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = category === 'All' || res.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 page-enter pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-maroon" size={18} />
                        <span className="text-[10px] font-black tracking-widest text-amrita-maroon uppercase">Training Material Manager</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Prep <span className="text-amrita-maroon italic">Hub</span> Center</h1>
                    <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-tight">Curate and manage elite preparation modules</p>
                </div>
                <button
                    onClick={() => {
                        setEditingResource(null);
                        setFormData({ title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-amrita-maroon text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-maroon-900/20"
                >
                    <Plus size={18} /> Add Module
                </button>
            </div>

            {/* Quick Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-amrita-maroon flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Modules</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{resources.length}</p>
                    </div>
                    <div className="p-4 bg-amrita-maroon/10 rounded-2xl text-amrita-maroon">
                        <BookOpen size={24} />
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-gray-400 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Links</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{resources.filter(r => r.type === 'Link').length}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-2xl text-gray-600">
                        <LinkIcon size={24} />
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-amrita-maroon/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Topics Covered</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{new Set(resources.map(r => r.category)).size}</p>
                    </div>
                    <div className="p-4 bg-amrita-maroon/5 rounded-2xl text-amrita-maroon/70">
                        <Tag size={24} />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${category === cat
                                    ? 'bg-amrita-maroon text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by title or tags..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amrita-maroon text-white' : 'text-gray-400'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amrita-maroon text-white' : 'text-gray-400'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Resources List/Grid */}
            {loading ? (
                <div className="py-20 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
                </div>
            ) : filteredResources.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((res) => (
                            <div key={res._id} className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-amrita-maroon/10 text-amrita-maroon rounded-2xl group-hover:bg-amrita-maroon group-hover:text-white transition-all duration-300">
                                            {res.category === 'Coding' ? <Code size={20} /> :
                                                res.category === 'Aptitude' ? <Cpu size={20} /> :
                                                    res.category === 'HR' ? <Briefcase size={20} /> :
                                                        <FileText size={20} />}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(res)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete(res._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors line-clamp-1">{res.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold mt-2 lowercase italic group-hover:text-gray-700">{res.type} Module</p>
                                    <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-3 font-medium">
                                        {res.content || res.description || 'No description provided.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {res.tags?.map((tag, i) => (
                                            <span key={i} className="text-[9px] font-black bg-gray-50 dark:bg-gray-700/50 text-gray-500 px-2.5 py-1 rounded-lg uppercase tracking-wider">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-amrita-maroon uppercase tracking-widest">{res.category}</span>
                                    {res.link && (
                                        <a href={res.link} target="_blank" rel="noopener noreferrer" className="p-2 text-amrita-maroon hover:bg-maroon-50 rounded-lg transition-all">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredResources.map((res) => (
                                    <tr key={res._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amrita-maroon/5 text-amrita-maroon rounded-lg">
                                                    <BookOpen size={16} />
                                                </div>
                                                <span className="font-black text-gray-900 dark:text-white text-sm">{res.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-500">{res.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg uppercase tracking-widest text-gray-600">{res.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => handleEdit(res)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(res._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 opacity-50 glass-card">
                    <BookOpen size={64} className="mb-4" />
                    <p className="text-xl font-black italic">No modules found.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {editingResource ? 'Update' : 'New'} <span className="text-amrita-maroon italic">Module</span>
                                </h2>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase">Configure training material details</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Module Title</label>
                                    <input
                                        type="text" name="title" required
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                        placeholder="e.g., Dynamic Programming Masterclass"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                                    <select
                                        name="category"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Content Type</label>
                                    <select
                                        name="type"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Resource Link (Optional)</label>
                                    <input
                                        type="url" name="link"
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                        placeholder="https://example.com/material"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description / Content Summary</label>
                                <textarea
                                    name="content" rows="4"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                    placeholder="Provide a brief overview of the module content..."
                                    value={formData.content}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags (comma separated)</label>
                                <input
                                    type="text" name="tags"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                                    placeholder="dsa, algorithms, python, interviews"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-amrita-maroon text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-maroon-900/10">
                                    {editingResource ? 'Update Module' : 'Publish Module'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPrepHub;
