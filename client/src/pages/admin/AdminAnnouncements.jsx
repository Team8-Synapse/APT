import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Megaphone, Send, Edit3, Trash2, Plus, Search, Filter, Calendar,
    Users, Eye, Clock, Star, Sparkles, TrendingUp, Bell, AlertCircle,
    CheckCircle, ExternalLink, Copy, MoreVertical, Pin, Archive,
    ChevronDown, Zap, Target, MessageSquare, BarChart3, RefreshCw
} from 'lucide-react';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);

    const [formData, setFormData] = useState({
        content: '',
        priority: 'normal',
        targetAudience: 'all',
        scheduledDate: '',
        expiryDate: '',
        links: [{ title: '', url: '' }],
        isPinned: false,
        category: 'general'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

    const priorities = [
        { id: 'urgent', label: 'Urgent', color: 'red', icon: <AlertCircle size={14} /> },
        { id: 'high', label: 'High', color: 'orange', icon: <Zap size={14} /> },
        { id: 'normal', label: 'Normal', color: 'blue', icon: <Bell size={14} /> },
        { id: 'low', label: 'Low', color: 'gray', icon: <MessageSquare size={14} /> }
    ];

    const categories = [
        { id: 'general', label: 'General', emoji: '📢' },
        { id: 'placement', label: 'Placement Drive', emoji: '💼' },
        { id: 'workshop', label: 'Workshop', emoji: '🎓' },
        { id: 'deadline', label: 'Deadline', emoji: '⏰' },
        { id: 'achievement', label: 'Achievement', emoji: '🏆' },
        { id: 'event', label: 'Event', emoji: '🎉' }
    ];

    const audiences = [
        { id: 'all', label: 'All Students' },
        { id: 'placed', label: 'Placed Students' },
        { id: 'unplaced', label: 'Unplaced Students' },
        { id: 'final_year', label: 'Final Year Only' },
        { id: 'pre_final', label: 'Pre-Final Year' }
    ];

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_URL}/announcements`);
            setAnnouncements(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching announcements:', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await axios.put(`${API_URL}/announcements/${editingAnnouncement._id}`, formData);
            } else {
                await axios.post(`${API_URL}/announcements`, formData);
            }
            fetchAnnouncements();
            resetForm();
        } catch (err) {
            console.error('Error saving announcement:', err);
            alert('Failed to save announcement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`${API_URL}/announcements/${id}`);
                fetchAnnouncements();
            } catch (err) {
                console.error('Error deleting announcement:', err);
            }
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setFormData({
            content: announcement.content || '',
            priority: announcement.priority || 'normal',
            targetAudience: announcement.targetAudience || 'all',
            scheduledDate: announcement.scheduledDate || '',
            expiryDate: announcement.expiryDate || '',
            links: announcement.links?.length > 0 ? announcement.links : [{ title: '', url: '' }],
            isPinned: announcement.isPinned || false,
            category: announcement.category || 'general'
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            content: '',
            priority: 'normal',
            targetAudience: 'all',
            scheduledDate: '',
            expiryDate: '',
            links: [{ title: '', url: '' }],
            isPinned: false,
            category: 'general'
        });
        setEditingAnnouncement(null);
        setShowForm(false);
        setPreviewMode(false);
    };

    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { title: '', url: '' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData({ ...formData, links: newLinks });
    };

    const updateLink = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index][field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesSearch = ann.content?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || ann.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const stats = {
        total: announcements.length,
        active: announcements.filter(a => !a.isArchived).length,
        urgent: announcements.filter(a => a.priority === 'urgent').length,
        thisWeek: announcements.filter(a => {
            const date = new Date(a.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date > weekAgo;
        }).length
    };

    const getPriorityStyle = (priority) => {
        const styles = {
            urgent: 'bg-red-500/10 text-red-600 border-red-200',
            high: 'bg-orange-500/10 text-orange-600 border-orange-200',
            normal: 'bg-blue-500/10 text-blue-600 border-blue-200',
            low: 'bg-gray-500/10 text-gray-600 border-gray-200'
        };
        return styles[priority] || styles.normal;
    };

    const getCategoryEmoji = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat?.emoji || '📢';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-12">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amrita-maroon via-amrita-burgundy to-amrita-pink p-8 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amrita-gold/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="text-amrita-gold" size={20} />
                            <span className="text-xs font-black tracking-[0.2em] uppercase text-white/80">Communication Center</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Announcements</h1>
                        <p className="text-white/70 font-medium">Broadcast important updates to students in real-time</p>
                    </div>

                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="group flex items-center gap-3 px-6 py-4 bg-white text-amrita-maroon rounded-2xl font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        New Announcement
                    </button>
                </div>

                {/* Stats Row */}
                <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Megaphone size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.total}</p>
                                <p className="text-xs text-white/70 font-medium">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-400/20 rounded-xl">
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.active}</p>
                                <p className="text-xs text-white/70 font-medium">Active</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-400/20 rounded-xl">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.urgent}</p>
                                <p className="text-xs text-white/70 font-medium">Urgent</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amrita-gold/20 rounded-xl">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats.thisWeek}</p>
                                <p className="text-xs text-white/70 font-medium">This Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${formData.category === cat.id
                                                    ? 'bg-amrita-maroon text-white shadow-lg scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>{cat.emoji}</span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                                    Announcement Content *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-amrita-maroon text-sm min-h-[120px] resize-none"
                                    placeholder="Write your announcement here... Use emojis to make it engaging! 🎉"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-2">Tip: Use emojis and clear language for better engagement</p>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">Priority Level</label>
                                <div className="flex gap-2">
                                    {priorities.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p.id })}
                                            className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border-2 ${formData.priority === p.id
                                                    ? `${getPriorityStyle(p.id)} border-current`
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent hover:border-gray-200'
                                                }`}
                                        >
                                            {p.icon}
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                                <select
                                    value={formData.targetAudience}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-amrita-maroon text-sm font-medium"
                                >
                                    {audiences.map(a => (
                                        <option key={a.id} value={a.id}>{a.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Links Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300">Links (Optional)</label>
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="text-xs font-bold text-amrita-maroon flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={14} /> Add Link
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.links.map((link, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => updateLink(idx, 'title', e.target.value)}
                                                placeholder="Link title"
                                                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                                            />
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateLink(idx, 'url', e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                                            />
                                            {formData.links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(idx)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pin Option */}
                            <div className="flex items-center justify-between p-4 bg-amrita-gold/10 rounded-2xl border border-amrita-gold/20">
                                <div className="flex items-center gap-3">
                                    <Pin size={20} className="text-amrita-gold" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Pin Announcement</p>
                                        <p className="text-xs text-gray-500">Pinned announcements appear first</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPinned}
                                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amrita-maroon/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amrita-maroon"></div>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(true)}
                                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} /> Preview
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amrita-maroon to-amrita-pink text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={18} />
                                    {editingAnnouncement ? 'Update' : 'Publish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-amrita-maroon text-sm font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold"
                    >
                        <option value="all">All Priorities</option>
                        {priorities.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={fetchAnnouncements}
                        className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((ann, i) => (
                        <div
                            key={ann._id || i}
                            className={`group bg-white dark:bg-gray-800 rounded-2xl border-2 ${ann.isPinned ? 'border-amrita-gold' : 'border-gray-100 dark:border-gray-700'
                                } shadow-sm hover:shadow-xl transition-all p-6`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Category Emoji */}
                                <div className="text-3xl">{getCategoryEmoji(ann.category)}</div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {ann.isPinned && (
                                            <span className="px-2 py-0.5 bg-amrita-gold/20 text-amrita-gold text-[10px] font-black rounded-full flex items-center gap-1">
                                                <Pin size={10} /> Pinned
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${getPriorityStyle(ann.priority)}`}>
                                            {ann.priority?.toUpperCase() || 'NORMAL'}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] font-black rounded-full">
                                            {ann.targetAudience || 'All Students'}
                                        </span>
                                    </div>

                                    <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
                                        {ann.content}
                                    </p>

                                    {ann.links && ann.links.length > 0 && ann.links[0].url && (
                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {ann.links.map((link, idx) => link.url && (
                                                <a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-amrita-maroon/10 text-amrita-maroon text-xs font-bold rounded-full hover:bg-amrita-maroon/20 transition-colors"
                                                >
                                                    <ExternalLink size={12} />
                                                    {link.title || 'View Link'}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(ann)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 hover:text-amrita-maroon transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(ann.content)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 hover:text-blue-600 transition-colors"
                                        title="Copy"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ann._id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-gray-500 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 mx-auto mb-6 bg-amrita-maroon/10 rounded-full flex items-center justify-center">
                            <Megaphone size={40} className="text-amrita-maroon/40" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No Announcements Yet</h3>
                        <p className="text-gray-500 mb-6">Create your first announcement to broadcast to students</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-amrita-maroon text-white rounded-2xl font-bold hover:bg-amrita-burgundy transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={18} /> Create Announcement
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
