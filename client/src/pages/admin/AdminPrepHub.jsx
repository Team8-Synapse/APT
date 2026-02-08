import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen, Search, Plus, Edit3, Trash2, ExternalLink,
    Filter, LayoutGrid, List, FileText, Link as LinkIcon,
    Code, Cpu, UserCheck, Briefcase, PlusCircle, Save, X,
    ChevronLeft, Sparkles, TrendingUp, Clock, Tag, ChevronDown, Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPrepHub = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Coding',
        type: 'Link',
        link: '',
        tags: ''
    });

    const categories = [
        { id: 'All', icon: <LayoutGrid size={18} />, label: 'All' },
        { id: 'Coding', icon: <Code size={18} />, label: 'Practice' },
        { id: 'Aptitude', icon: <Cpu size={18} />, label: 'Aptitude & Logic' },
        { id: 'Technical', icon: <UserCheck size={18} />, label: 'Core Technical' },
        { id: 'HR', icon: <Briefcase size={18} />, label: 'HR' },
    ];
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

            setEditingResource(null);
            setFormData({ title: '', description: '', category: 'Coding', type: 'Link', link: '', tags: '' });
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
            description: resource.description || resource.content || '',
            link: resource.link || '',
            tags: resource.tags?.join(', ') || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            </div>

            {/* Inline Module Publisher */}
            <div className="glass-card overflow-hidden border-t-4 border-t-amrita-maroon animate-fade-in">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            {editingResource ? <Edit3 size={20} className="text-amrita-maroon" /> : <PlusCircle size={20} className="text-amrita-maroon" />}
                            {editingResource ? 'Edit' : 'Add'} <span className="text-amrita-maroon italic">Module</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Streamline preparation content delivery</p>
                    </div>
                    {editingResource && (
                        <button
                            onClick={() => {
                                setEditingResource(null);
                                setFormData({ title: '', description: '', category: 'Coding', type: 'Link', link: '', tags: '' });
                            }}
                            className="text-[10px] font-black text-gray-400 hover:text-amrita-maroon uppercase tracking-widest flex items-center gap-1 group transition-colors"
                        >
                            <X size={12} className="group-hover:rotate-90 transition-transform" /> Cancel Editing
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Module Title</label>
                            <input
                                type="text" name="title" required
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all"
                                placeholder="e.g., Dynamic Programming Masterclass"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all appearance-none cursor-pointer pr-10"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categories.filter(c => c.id !== 'All').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Content Type</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all appearance-none cursor-pointer pr-10"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            {(formData.type === 'PDF' || formData.type === 'PPT') ? (
                                <>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Upload Document</label>
                                    <div className="relative">
                                        <input
                                            type="url" name="link"
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all font-mono"
                                            placeholder="https://example.com/material"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                        />
                                        <Upload className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Resource Link (e.g., Drive, YouTube, Article)</label>
                                    <input
                                        type="url" name="link"
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all font-mono"
                                        placeholder="https://example.com/material"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Material Description & Content</label>
                            <textarea
                                name="description" rows="5"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all"
                                placeholder="Write detailed information here. The first two lines will serve as the student summary..."
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags (comma separated)</label>
                            <textarea
                                name="tags" rows="2"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20 transition-all"
                                placeholder="dsa, algorithms, python, interviews"
                                value={formData.tags}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button type="submit" className="w-full md:w-auto px-10 bg-amrita-maroon text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-maroon-900/10 flex items-center justify-center gap-2">
                            {editingResource ? <Save size={16} /> : <Plus size={16} />}
                            {editingResource ? 'Update Module' : 'Publish Module'}
                        </button>
                    </div>
                </form>
            </div>



            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-700">
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
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by title or tags..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon/20"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    setCategory('All');
                                }
                            }}
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
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(res)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete(res._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPrepHub;
