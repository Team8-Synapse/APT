import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Megaphone, Send, Edit3, Trash2, Plus, Search, Filter, Calendar,
    Users, Eye, Clock, Star, Sparkles, TrendingUp, Bell, AlertCircle,
    CheckCircle, ExternalLink, Copy, MoreVertical, Pin, Archive,
    ChevronDown, Zap, Target, MessageSquare, BarChart3, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const theme = {
    maroon: {
        primary: '#A4123F',
        secondary: '#8A0F3C',
        light: '#C04040',
        dark: '#6E0B30',
        gradient: 'linear-gradient(135deg, #A4123F 0%, #8A0F3C 100%)',
        subtle: 'rgba(164, 18, 63, 0.08)',
        medium: 'rgba(164, 18, 63, 0.15)',
        strong: 'rgba(164, 18, 63, 0.25)'
    },
    neutral: {
        white: '#FFFFFF',
        gray50: '#F8F9FA',
        gray100: '#F0F2F5',
        textPrimary: '#1a1a1a',
        textSecondary: '#444444'
    }
};

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);

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

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [stats, setStats] = useState({ announcementCount: 0 });

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
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/announcements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const submissionData = { ...formData };
            if (!submissionData.scheduledDate) delete submissionData.scheduledDate;
            if (!submissionData.expiryDate) delete submissionData.expiryDate;

            let res;
            if (editingAnnouncement) {
                res = await axios.put(`${API_URL}/announcements/${editingAnnouncement._id}`, submissionData, { headers });
                setAnnouncements(prev => prev.map(a => a._id === editingAnnouncement._id ? res.data : a));
            } else {
                res = await axios.post(`${API_URL}/announcements`, submissionData, { headers });
                setAnnouncements(prev => [res.data, ...prev]);

                // Success Wow Factor
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A4123F', '#8A0F3C', '#6E0B30', '#B1124A']
                });
            }

            setShowForm(false);
            resetForm();
            // We still fetch to ensure server-side sorting/filtering is synced
            fetchAnnouncements();
        } catch (err) {
            console.error('Error saving announcement:', err);
            alert('Operation failed. Check server connection.');
        }
    };

    const toggleSelect = (id) => {
        setSelectedAnnouncements(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedAnnouncements.length} announcements?`)) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await Promise.all(selectedAnnouncements.map(id => axios.delete(`${API_URL}/announcements/${id}`, { headers })));
            setSelectedAnnouncements([]);
            fetchAnnouncements();
            alert('Bulk deletion successful');
        } catch (err) {
            console.error('Bulk delete failed:', err);
        }
    };

    const handleBulkPin = async (status) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await Promise.all(selectedAnnouncements.map(id =>
                axios.put(`${API_URL}/announcements/${id}`, { isPinned: status }, { headers })
            ));
            setSelectedAnnouncements([]);
            fetchAnnouncements();
        } catch (err) {
            console.error('Bulk pin failed:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                await axios.delete(`${API_URL}/announcements/${id}`, { headers });
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


    const getPriorityStyle = (priority) => {
        const styles = {
            urgent: `bg-[${theme.maroon.strong}] text-[${theme.maroon.dark}] border-[${theme.maroon.primary}]`,
            high: `bg-[${theme.maroon.medium}] text-[${theme.maroon.primary}] border-[${theme.maroon.secondary}]`,
            normal: `bg-[${theme.maroon.subtle}] text-[${theme.neutral.textPrimary}] border-[${theme.neutral.gray100}]`,
            low: `bg-[${theme.neutral.gray50}] text-[${theme.neutral.textSecondary}] border-[${theme.neutral.gray100}]`
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
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 page-enter min-h-screen" style={{ background: theme.neutral.white }}>
            <AdminNavbar
                activeTab="announcements"
                user={user}
                logout={logout}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                stats={stats}
            />


            {/* Page Header */}
            <div className="flex justify-between items-center p-8 rounded-[2rem] shadow-sm" style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}` }}>
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase" style={{ color: theme.neutral.textPrimary }}>Announcements Hub</h1>
                    <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: theme.neutral.textSecondary }}>Management Domain Control</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="px-8 py-4 text-white rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-3 transition-all"
                    style={{ background: theme.maroon.gradient }}
                >
                    <Plus size={20} /> NEW SIGNAL
                </motion.button>
            </div>

            {/* Stats Row - Matching Dashboard Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Signals', value: announcements.length, change: '+5 this week', icon: <Megaphone /> },
                    { label: 'Live Broadcasts', value: announcements.filter(a => a.status !== 'draft').length, change: 'Active now', icon: <TrendingUp /> },
                    { label: 'Pending Drafts', value: announcements.filter(a => a.status === 'draft').length, change: 'Requires review', icon: <Clock /> },
                    { label: 'High Priority', value: announcements.filter(a => a.priority === 'urgent' || a.priority === 'high').length, change: 'Action required', icon: <Star /> }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="p-6 rounded-[2rem] text-white relative overflow-hidden group shadow-lg"
                        style={{ background: theme.maroon.gradient }}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {React.cloneElement(stat.icon, { size: 60 })}
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                            <p className="text-[10px] font-bold mt-2 opacity-90 uppercase tracking-widest">{stat.change}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bulk Actions Bar (Sticky) */}
            <AnimatePresence>
                {selectedAnnouncements.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-2xl rounded-[3rem] p-4 flex items-center justify-between gap-6"
                        style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}`, boxShadow: `0 40px 100px ${theme.maroon.subtle}` }}
                    >
                        <div className="flex items-center gap-4 ml-6">
                            <span className="w-12 h-12 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg animate-pulse" style={{ background: theme.maroon.primary }}>
                                {selectedAnnouncements.length}
                            </span>
                            <span className="font-black text-xs uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Records Selected</span>
                        </div>
                        <div className="flex gap-3 mr-2">
                            <button onClick={() => handleBulkPin(true)} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase transition-all tracking-widest" style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }}>Pin All</button>
                            <button onClick={handleBulkDelete} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase transition-all tracking-widest" style={{ background: theme.maroon.subtle, color: theme.maroon.primary }}>Purge Selection</button>
                            <button onClick={() => setSelectedAnnouncements([])} className="p-4 rounded-2xl" style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }}><RefreshCw size={20} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Advanced Search & Filtering (Maximized) */}
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-[2rem] p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center"
                    style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}` }}
                >
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2" size={18} style={{ color: theme.neutral.textSecondary }} />
                        <input
                            type="text"
                            placeholder="Search broadcasts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-transparent transition-all text-sm font-bold outline-none"
                            style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }}
                        />
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-6 py-4 border-2 border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm"
                            style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }}
                        >
                            <option value="all">Priority: All</option>
                            {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                        <button onClick={fetchAnnouncements} className="p-4 rounded-xl transition-all shadow-sm active:scale-95" style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}`, color: theme.maroon.primary }}><RefreshCw size={20} /></button>
                    </div>
                </motion.div>
            </div>

            {/* The "Broadcast Signal" List */}
            <div className="grid grid-cols-1 gap-10 mt-10">
                <AnimatePresence mode="popLayout">
                    {filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((ann, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                key={ann._id || i}
                                className={`relative group rounded-[2.5rem] border transition-all p-10 flex flex-col xl:flex-row items-start gap-10`}
                                style={{
                                    background: theme.neutral.white,
                                    borderColor: ann.isPinned ? theme.maroon.secondary : ann.priority === 'urgent' ? theme.maroon.primary : theme.neutral.gray100
                                }}
                            >
                                {/* Multi-select Indicator */}
                                <div
                                    onClick={() => toggleSelect(ann._id)}
                                    className="absolute top-8 left-8 p-2 rounded-xl cursor-pointer transition-all z-20"
                                    style={{
                                        background: selectedAnnouncements.includes(ann._id) ? theme.maroon.primary : theme.neutral.gray50,
                                        color: selectedAnnouncements.includes(ann._id) ? theme.neutral.white : theme.neutral.textSecondary,
                                        transform: selectedAnnouncements.includes(ann._id) ? 'scale(1.1)' : 'scale(1)',
                                        boxShadow: selectedAnnouncements.includes(ann._id) ? '0 10px 20px rgba(139,0,0,0.2)' : 'none'
                                    }}
                                >
                                    <CheckCircle size={20} />
                                </div>

                                {/* Status Badge Overlays */}
                                <div className="absolute top-10 right-10 flex gap-2">
                                    {ann.status === 'draft' && (
                                        <div className="px-4 py-2 text-[9px] font-black uppercase rounded-lg" style={{ background: theme.neutral.gray50, color: theme.neutral.textSecondary, border: `1px solid ${theme.neutral.gray100}` }}>DRAFT</div>
                                    )}
                                    {new Date(ann.scheduledDate) > new Date() && (
                                        <div className="px-4 py-2 text-[9px] font-black uppercase rounded-lg" style={{ background: theme.maroon.subtle, color: theme.maroon.primary, border: `1px solid ${theme.maroon.secondary}` }}>SCHEDULED</div>
                                    )}
                                </div>

                                {/* Category Icon / Date Block */}
                                <div className="flex flex-col items-center gap-6 mt-12 xl:mt-0 min-w-[120px]">
                                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-inner transition-colors" style={{ background: theme.neutral.gray50, border: `1px solid ${theme.neutral.gray100}` }}>
                                        {getCategoryEmoji(ann.category)}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: theme.maroon.primary }}>{new Date(ann.createdAt).toLocaleDateString('en-IN', { month: 'short' })}</p>
                                        <p className="text-4xl font-black leading-none tracking-tight" style={{ color: theme.neutral.textPrimary }}>{new Date(ann.createdAt).getDate()}</p>
                                    </div>
                                </div>

                                {/* Content Core */}
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className="px-4 py-1.5 text-[8px] font-black rounded-full uppercase tracking-widest"
                                            style={{
                                                background: ann.priority === 'urgent' ? theme.maroon.strong : ann.priority === 'high' ? theme.maroon.medium : theme.maroon.subtle,
                                                color: ann.priority === 'urgent' || ann.priority === 'high' ? theme.maroon.primary : theme.neutral.textPrimary,
                                                border: `1px solid ${theme.maroon.secondary}`
                                            }}>
                                            {ann.priority || 'NORMAL'}
                                        </span>
                                        <span className="px-4 py-1.5 text-[8px] font-black rounded-full uppercase tracking-widest" style={{ background: theme.neutral.gray50, color: theme.neutral.textSecondary, border: `1px solid ${theme.neutral.gray100}` }}>
                                            {ann.targetAudience?.replace('_', ' ') || 'Everywhere'}
                                        </span>
                                    </div>

                                    <p className="text-2xl font-bold leading-[1.4] tracking-tight" style={{ color: theme.neutral.textPrimary }}>
                                        {ann.content}
                                    </p>

                                    {ann.links && ann.links.length > 0 && ann.links[0].url && (
                                        <div className="flex flex-wrap gap-4 mt-8">
                                            {ann.links.map((link, idx) => (
                                                <motion.a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-3 px-6 py-3 text-[9px] font-black rounded-xl transition-all shadow-sm"
                                                    style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}`, color: theme.neutral.textPrimary }}
                                                    whileHover={{ background: theme.maroon.primary, color: theme.neutral.white }}
                                                >
                                                    <ExternalLink size={12} />
                                                    <span className="uppercase tracking-widest">{link.title || 'View Resource'}</span>
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Impact Analytics Overlay */}
                                    <div className="flex items-center gap-4 mt-8 text-[9px] font-bold pt-6" style={{ borderTop: `1px solid ${theme.neutral.gray100}`, color: theme.neutral.textSecondary }}>
                                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: theme.neutral.gray50, border: `1px solid ${theme.neutral.gray100}` }}>
                                            <Clock size={12} style={{ color: theme.maroon.primary }} />
                                            {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.ceil((new Date(ann.createdAt) - new Date()) / (1000 * 60 * 60 * 24)), 'day').toUpperCase()}
                                        </span>
                                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: theme.maroon.subtle, color: theme.maroon.primary, border: `1px solid ${theme.maroon.medium}` }}>
                                            <Eye size={12} /> {Math.floor(Math.random() * 800) + 150} VIEWS
                                        </span>
                                        <div className="ml-auto flex items-center gap-2">
                                            <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: theme.neutral.gray100 }}>
                                                <div className="h-full" style={{ width: '85%', background: theme.maroon.primary }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Command Actions */}
                                <div className="flex flex-row xl:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                    {[
                                        { icon: <Edit3 size={18} />, action: () => handleEdit(ann), hoverBg: theme.maroon.subtle, hoverColor: theme.maroon.primary },
                                        { icon: <Copy size={18} />, action: () => { navigator.clipboard.writeText(ann.content); alert('Signal Copied'); }, hoverBg: theme.maroon.subtle, hoverColor: theme.maroon.secondary },
                                        { icon: <Trash2 size={18} />, action: () => handleDelete(ann._id), hoverBg: theme.maroon.subtle, hoverColor: theme.maroon.dark }
                                    ].map((tool, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={tool.action}
                                            className="p-3 rounded-xl transition-all shadow-sm"
                                            style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}`, color: theme.neutral.textSecondary }}
                                        >
                                            {tool.icon}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 rounded-[3rem] border-2 border-dashed shadow-sm"
                            style={{ background: theme.neutral.white, borderColor: theme.neutral.gray100 }}
                        >
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ background: theme.neutral.gray50, color: theme.maroon.light }}>
                                <Megaphone size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase" style={{ color: theme.neutral.textPrimary }}>No active signals</h3>
                            <p className="font-bold mb-10 max-w-sm mx-auto uppercase tracking-widest text-[10px]" style={{ color: theme.neutral.textSecondary }}>Initialize a new broadcast to reach students across the network.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { resetForm(); setShowForm(true); }}
                                className="px-10 py-5 text-white rounded-2xl font-black shadow-lg transition-all inline-flex items-center gap-3 text-sm tracking-widest"
                                style={{ background: theme.maroon.gradient }}
                            >
                                <Plus size={24} /> CREATE SIGNAL
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Announcement Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 lg:p-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="absolute inset-0 backdrop-blur-2xl"
                            style={{ background: 'rgba(26, 26, 26, 0.8)' }}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="relative rounded-[4rem] shadow-[0_100px_200px_rgba(139,0,0,0.2)] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}` }}
                        >
                            {/* Modal Header */}
                            <div className="p-8 flex justify-between items-center" style={{ borderBottom: `1px solid ${theme.neutral.gray100}`, background: theme.neutral.white }}>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 text-white rounded-2xl shadow-lg flex items-center justify-center" style={{ background: theme.maroon.gradient }}>
                                        {editingAnnouncement ? <RefreshCw size={24} /> : <Plus size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight uppercase" style={{ color: theme.neutral.textPrimary }}>
                                            {editingAnnouncement ? 'Edit Signal' : 'New Broadcast'}
                                        </h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: theme.neutral.textSecondary }}>Amrita Management Protocol</p>
                                    </div>
                                </div>
                                <button onClick={resetForm} className="w-12 h-12 flex items-center justify-center rounded-xl transition-all text-xl" style={{ background: theme.neutral.gray50, color: theme.neutral.textSecondary }}>✕</button>
                            </div>

                            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-12" style={{ borderRight: `1px solid ${theme.neutral.gray100}` }}>
                                        {/* Category Archetype */}
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Signal Archetype</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {categories.map(cat => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        key={cat.id} type="button"
                                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                                        className="p-6 rounded-3xl text-[10px] font-black transition-all flex flex-col items-center gap-3 border-2"
                                                        style={{
                                                            background: formData.category === cat.id ? theme.maroon.primary : theme.neutral.gray50,
                                                            color: formData.category === cat.id ? theme.neutral.white : theme.neutral.textSecondary,
                                                            borderColor: formData.category === cat.id ? theme.maroon.primary : 'transparent',
                                                            boxShadow: formData.category === cat.id ? '0 10px 30px rgba(139,0,0,0.2)' : 'none'
                                                        }}
                                                    >
                                                        <span className="text-3xl">{cat.emoji}</span>
                                                        <span className="uppercase tracking-widest">{cat.label.split(' ')[0]}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Message Body */}
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Broadcast Content</label>
                                            <textarea
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-6 py-6 border-2 border-transparent rounded-2xl transition-all text-sm font-bold leading-relaxed outline-none shadow-inner min-h-[150px]"
                                                style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }}
                                                placeholder="Enter message content..."
                                                required
                                            />
                                        </div>

                                        {/* Priority Settings */}
                                        <div className="space-y-6">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Priority Level</label>
                                            <div className="flex gap-4">
                                                {priorities.map(p => (
                                                    <motion.button
                                                        whileHover={{ y: -4 }}
                                                        key={p.id} type="button"
                                                        onClick={() => setFormData({ ...formData, priority: p.id })}
                                                        className="flex-1 p-4 rounded-xl transition-all border-2 flex flex-col items-center gap-2 relative overflow-hidden"
                                                        style={{
                                                            background: formData.priority === p.id ? theme.maroon.subtle : theme.neutral.gray50,
                                                            color: formData.priority === p.id ? theme.maroon.primary : theme.neutral.textSecondary,
                                                            borderColor: formData.priority === p.id ? theme.maroon.primary : 'transparent',
                                                            boxShadow: formData.priority === p.id ? '0 5px 15px rgba(139,0,0,0.1)' : 'none'
                                                        }}
                                                    >
                                                        <div className="relative z-10">{p.icon}</div>
                                                        <span className="text-[8px] font-black uppercase tracking-widest relative z-10">{p.label}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dispatch Settings */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Scheduled Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.scheduledDate}
                                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                                    className="w-full px-6 py-5 border-2 rounded-3xl transition-all text-xs font-bold outline-none"
                                                    style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary, borderColor: theme.neutral.gray100 }}
                                                />
                                            </div>
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Status</label>
                                                <div className="flex p-2 rounded-3xl" style={{ background: theme.neutral.gray50 }}>
                                                    <button type="button" onClick={() => setFormData({ ...formData, status: 'published' })} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all" style={{ background: formData.status !== 'draft' ? theme.maroon.primary : 'transparent', color: formData.status !== 'draft' ? theme.neutral.white : theme.neutral.textSecondary, boxShadow: formData.status !== 'draft' ? '0 5px 15px rgba(139,0,0,0.2)' : 'none' }}>Live</button>
                                                    <button type="button" onClick={() => setFormData({ ...formData, status: 'draft' })} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all" style={{ background: formData.status === 'draft' ? theme.maroon.secondary : 'transparent', color: formData.status === 'draft' ? theme.neutral.white : theme.neutral.textSecondary, boxShadow: formData.status === 'draft' ? '0 5px 15px rgba(139,0,0,0.2)' : 'none' }}>Draft</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Resource Links */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.neutral.textSecondary }}>Resource Links</label>
                                                <button type="button" onClick={addLink} className="text-[10px] font-black flex items-center gap-2 hover:underline tracking-[0.2em]" style={{ color: theme.maroon.primary }}>
                                                    <Plus size={16} /> ADD ATTACHMENT
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.links.map((link, idx) => (
                                                    <div key={idx} className="flex gap-4 items-center">
                                                        <input value={link.title} onChange={(e) => updateLink(idx, 'title', e.target.value)} placeholder="Label" className="flex-[0.3] px-6 py-4 rounded-2xl border-2 border-transparent outline-none text-[10px] font-bold" style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }} />
                                                        <input value={link.url} onChange={(e) => updateLink(idx, 'url', e.target.value)} placeholder="Resource URL" className="flex-1 px-6 py-4 rounded-2xl border-2 border-transparent outline-none text-[10px] font-bold" style={{ background: theme.neutral.gray50, color: theme.neutral.textPrimary }} />
                                                        {formData.links.length > 1 && <button type="button" onClick={() => removeLink(idx)} className="p-4 rounded-2xl transition-all" style={{ color: theme.maroon.primary, background: theme.maroon.subtle }}><Trash2 size={20} /></button>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pin Protocol */}
                                        <div className="p-6 rounded-3xl border transition-all flex items-center justify-between"
                                            style={{
                                                background: formData.isPinned ? theme.maroon.subtle : theme.neutral.gray50,
                                                borderColor: formData.isPinned ? theme.maroon.secondary : 'transparent',
                                                boxShadow: formData.isPinned ? '0 5px 15px rgba(139,0,0,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{
                                                        background: formData.isPinned ? theme.maroon.primary : theme.neutral.gray100,
                                                        color: formData.isPinned ? theme.neutral.white : theme.neutral.textSecondary,
                                                        boxShadow: formData.isPinned ? '0 4px 12px rgba(139,0,0,0.25)' : 'none'
                                                    }}
                                                ><Pin size={20} /></div>
                                                <div>
                                                    <p className="font-black uppercase text-[10px] tracking-tight" style={{ color: theme.neutral.textPrimary }}>Priority Pin</p>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Keep at top of feed</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={formData.isPinned} onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })} className="sr-only peer" />
                                                <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner transition-all"
                                                    style={{ background: formData.isPinned ? theme.maroon.primary : theme.neutral.gray100 }}
                                                ></div>
                                            </label>
                                        </div>

                                        <button type="submit" className="w-full py-6 text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest group mt-8 overflow-hidden relative" style={{ background: theme.maroon.gradient }}>
                                            <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                            <span>{editingAnnouncement ? 'UPDATE SIGNAL' : 'DISPATCH SIGNAL'}</span>
                                        </button>
                                    </form>

                                    {/* Simulation Pane */}
                                    <div className="p-10 lg:p-14 flex flex-col items-center justify-center" style={{ background: theme.neutral.gray50, borderLeft: `1px solid ${theme.neutral.gray100}` }}>
                                        <div className="w-full max-w-sm space-y-12">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Broadcast Trace</label>
                                                <div className="flex gap-2">
                                                    <div className="w-2 h-2 rounded-full animate-ping" style={{ background: theme.maroon.primary }} />
                                                    <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: theme.maroon.primary }}>Sync Active</span>
                                                </div>
                                            </div>

                                            {/* Preview Card */}
                                            <div className="rounded-[2.5rem] shadow-sm p-8 space-y-6 relative overflow-hidden" style={{ background: theme.neutral.white, border: `1px solid ${theme.neutral.gray100}` }}>
                                                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: theme.maroon.primary }} />
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner" style={{ background: theme.neutral.gray50 }}>{getCategoryEmoji(formData.category)}</div>
                                                    <div className="space-y-1">
                                                        <div className="px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest w-fit" style={{ background: theme.maroon.subtle, color: theme.maroon.primary, border: `1px solid ${theme.maroon.secondary}` }}>{formData.priority}</div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Management HUD</p>
                                                    </div>
                                                </div>
                                                <p className="text-xl font-bold leading-[1.4] tracking-tight" style={{ color: theme.neutral.textPrimary }}>
                                                    {formData.content || 'Payload description...'}
                                                </p>
                                                <div className="pt-6 space-y-3 text-center" style={{ borderTop: `1px solid ${theme.neutral.gray50}` }}>
                                                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: theme.neutral.gray100 }}>
                                                        <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-1/2 h-full" style={{ background: theme.maroon.primary }} />
                                                    </div>
                                                    <p className="font-black text-[7px] uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Network Synchronization In Progress</p>
                                                </div>
                                            </div>

                                            {/* Audience Selector */}
                                            <div className="space-y-4 mt-10">
                                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.neutral.textSecondary }}>Target Sector</label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {audiences.map(a => (
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            key={a.id}
                                                            onClick={() => setFormData({ ...formData, targetAudience: a.id })}
                                                            className="p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                                                            style={{
                                                                background: formData.targetAudience === a.id ? theme.maroon.subtle : theme.neutral.white,
                                                                border: formData.targetAudience === a.id ? `1px solid ${theme.maroon.primary}` : `1px solid ${theme.neutral.gray100}`,
                                                                color: formData.targetAudience === a.id ? theme.maroon.primary : theme.neutral.textSecondary,
                                                                boxShadow: formData.targetAudience === a.id ? '0 4px 12px rgba(139,0,0,0.1)' : 'none'
                                                            }}
                                                        >
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{a.label}</span>
                                                            {formData.targetAudience === a.id && <div className="w-3 h-3 rounded-full" style={{ background: theme.maroon.primary }} />}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminAnnouncements;
