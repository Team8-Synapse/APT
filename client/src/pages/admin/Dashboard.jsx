import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Target, TrendingUp, AlertCircle, Calendar, ChevronRight, Brain, Briefcase, Clock, CheckCircle, XCircle, Send, Users, Building2, GraduationCap, Star,
    ArrowUpRight, Bell, FileText, MapPin, Flame, Trophy, BookOpen, Rocket, Heart,
    Timer, Lightbulb, Megaphone, ArrowRight, Play, Coffee, BarChart3, TrendingDown,
    Download, Filter, Search, Plus, Shield, Globe, UserCheck, Mail, Video,
    MessageSquare, ThumbsUp, Share2, RefreshCw, Settings, LogOut, BellRing, Moon,
    Sun, PieChart, Activity, Cpu, Smartphone, Database, Cloud, Terminal, Wifi,
    Battery, Volume2, HelpCircle, Info, AlertTriangle, Clock3, CalendarDays,
    ChevronLeft, Maximize2, Minimize2, X, MoreVertical, ExternalLink, Copy,
    Edit3, Trash2, Save, Upload, Link, Lock, Unlock, EyeOff, LayoutDashboard,
    ShieldCheck, DollarSign, FileSpreadsheet, UsersRound, Building, LineChart, Network,
    BriefcaseBusiness, School, FileCheck, ClipboardCheck, UserPlus, Sparkles, Zap, Eye as EyeIcon, Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import Administrative Components
import AddDriveModal from '../../components/admin/AddDriveModal';
import StudentDetailModal from '../../components/admin/StudentDetailModal';
import AddAlumniModal from '../../components/admin/AddAlumniModal';
import KanbanBoard from '../../components/admin/KanbanBoard';
import AdminPrepHub from './AdminPrepHub';

const theme = {
    maroon: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        light: '#C04040',
        dark: '#5A0000',
        gradient: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
        subtle: 'rgba(139, 0, 0, 0.08)',
        medium: 'rgba(139, 0, 0, 0.15)',
        strong: 'rgba(139, 0, 0, 0.25)'
    },
    neutral: {
        white: '#FFFFFF',
        gray50: '#F8F9FA',
        gray100: '#F0F2F5',
        textPrimary: '#1a1a1a',
        textSecondary: '#444444'
    }
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [timeOfDay, setTimeOfDay] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    // Initialize time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('Morning');
        else if (hour < 17) setTimeOfDay('Afternoon');
        else setTimeOfDay('Evening');
    }, []);

    // ... state ...
    const [stats, setStats] = useState({
        studentCount: 0, driveCount: 0, alumniCount: 0,
        placedStudents: 0, inProcessStudents: 0, placementPercentage: 0,
        recentDrives: [], departmentStats: [], placementStats: [], ctcStats: {},
        prepStats: {}, alumniStats: {}, announcementCount: 0
    });
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [shortlist, setShortlist] = useState([]);
    const [filters, setFilters] = useState({ minCgpa: 7.0, maxBacklogs: 0, department: '', search: '' });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [adminResources, setAdminResources] = useState([]);
    const [newResource, setNewResource] = useState({
        title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: ''
    });
    const [newAnnouncement, setNewAnnouncement] = useState({ content: '', links: [{ title: '', url: '' }] });
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [editingResource, setEditingResource] = useState(null);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Live intelligence metrics
    const liveMetrics = [
        "🎯 12 students placed this week",
        "📈 Placement rate up 5% from last month",
        "💼 Google offering ₹45 LPA packages",
        "🏆 Amazon drive closing in 3 days",
        "📊 65 applications pending review",
    ];

    // Recent activities
    const recentActivities = [
        { type: 'placement', message: 'Rahul Kumar placed at Microsoft', time: '2 hours ago', icon: <Trophy /> },
        { type: 'application', message: '15 new applications for Google drive', time: '4 hours ago', icon: <FileText /> },
        { type: 'drive', message: 'Amazon drive scheduled for March 22', time: '1 day ago', icon: <Calendar /> },
        { type: 'update', message: 'CTC statistics updated', time: '2 days ago', icon: <RefreshCw /> },
    ];

    // Calendar events
    const calendarData = [
        { date: '2026-03-15', title: 'Google Drive', type: 'drive', company: 'Google' },
        { date: '2026-03-17', title: 'Mock Interview Workshop', type: 'prep', time: '10:00 AM' },
        { date: '2026-03-18', title: 'Alumni Meet', type: 'alumni', time: '3:00 PM' },
        { date: '2026-03-20', title: 'Microsoft Drive', type: 'drive', company: 'Microsoft' },
        { date: '2026-03-22', title: 'Amazon Drive', type: 'drive', company: 'Amazon' },
        { date: '2026-03-25', title: 'Resume Review Session', type: 'prep', time: '2:00 PM' },
    ];

    useEffect(() => {
        fetchStats();
        fetchStudents();
        fetchCompanies();
        fetchAnnouncements();
        fetchAlumni();
    }, []);

    // Unified fetchAlumni moved below

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/stats`);
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setStats({
                studentCount: 248, driveCount: 32, alumniCount: 156,
                placedStudents: 142, inProcessStudents: 38, placementPercentage: 57.3,
                recentDrives: [
                    { companyName: 'Google', jobProfile: 'SDE L3', date: '2026-03-15', status: 'upcoming', ctcDetails: { ctc: 4500000 } },
                    { companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', status: 'upcoming', ctcDetails: { ctc: 4200000 } },
                    { companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', status: 'upcoming', ctcDetails: { ctc: 4000000 } },
                    { companyName: 'Adobe', jobProfile: 'Product Engineer', date: '2026-03-28', status: 'upcoming', ctcDetails: { ctc: 3800000 } },
                ],
                departmentStats: [
                    { _id: 'CSE', count: 120, avgCgpa: 8.2, placed: 68 },
                    { _id: 'ECE', count: 65, avgCgpa: 8.0, placed: 35 },
                    { _id: 'EEE', count: 40, avgCgpa: 7.8, placed: 22 },
                    { _id: 'ME', count: 23, avgCgpa: 7.6, placed: 17 }
                ],
                placementStats: [
                    { _id: 'placed', count: 142 },
                    { _id: 'in_process', count: 38 },
                    { _id: 'not_placed', count: 68 }
                ],
                ctcStats: { avgCTC: 1800000, maxCTC: 5000000, minCTC: 350000 },
                prepStats: { workshops: 24, mockInterviews: 156, resumeReviews: 89, avgPrepScore: 78 },
                alumniStats: { connected: 156, mentors: 42, referrals: 89, avgExperience: 3.5 },
                announcementCount: 12
            });
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/students`, {
                params: filters
            });
            setStudents(res.data.students || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/companies`);
            setCompanies(res.data);
        } catch (err) {
            console.error(err);
            setCompanies([
                { name: 'Google', status: 'active', drives: 5, hired: 25 },
                { name: 'Microsoft', status: 'active', drives: 4, hired: 20 },
                { name: 'Amazon', status: 'active', drives: 3, hired: 18 },
                { name: 'Adobe', status: 'pending', drives: 2, hired: 12 },
                { name: 'Goldman Sachs', status: 'active', drives: 3, hired: 15 },
            ]);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
            setAnnouncements([
                { title: 'Google Drive Registration', date: '2026-03-10', priority: 'high', category: 'drive' },
                { title: 'Resume Workshop', date: '2026-03-12', priority: 'medium', category: 'prep' },
                { title: 'Alumni Networking Event', date: '2026-03-15', priority: 'low', category: 'alumni' },
                { title: 'Summer Internship Deadlines', date: '2026-03-08', priority: 'high', category: 'internship' },
            ]);
        }
    };

    const fetchAlumni = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/directory`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAlumni(res.data);
        } catch (err) {
            console.error(err);
            setAlumni([
                { name: 'Arun Kumar', company: 'Google', role: 'Senior SDE', batch: '2018', ctc: 6500000 },
                { name: 'Priya Sharma', company: 'Microsoft', role: 'Product Manager', batch: '2019', ctc: 5500000 },
                { name: 'Rajesh Patel', company: 'Amazon', role: 'SDM', batch: '2017', ctc: 7000000 },
                { name: 'Sneha Reddy', company: 'Adobe', role: 'Design Lead', batch: '2020', ctc: 4800000 },
            ]);
        }
    };

    const handleShortlist = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/shortlist`, filters);
            setShortlist(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleExport = async (type) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/export/${type}`);
            const dataStr = JSON.stringify(res.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}_export.json`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Export failed');
        }
    };

    const fetchAdminResources = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`);
            setAdminResources(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const payload = {
                title: newResource.title,
                category: newResource.category,
                type: newResource.type,
                links: [newResource.link],
                content: newResource.content,
                tags: tagsArray
            };

            if (editingResource) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources/${editingResource._id}`, payload);
                alert('Resource updated successfully!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`, payload);
                alert('Resource deployed successfully!');
            }

            setNewResource({ title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: '' });
            setEditingResource(null);
            fetchAdminResources();
        } catch (err) {
            console.error(err);
            alert(`Failed to ${editingResource ? 'update' : 'deploy'} resource`);
        }
    };

    const handleResourceDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources/${id}`);
            alert('Resource deleted!');
            fetchAdminResources();
        } catch (err) {
            console.error(err);
            alert('Failed to delete resource');
        }
    };

    const handleEditResource = (res) => {
        setEditingResource(res);
        setNewResource({
            title: res.title,
            category: res.category,
            type: res.type,
            link: res.links?.[0] || res.link || '',
            content: res.content || '',
            tags: res.tags?.join(', ') || ''
        });
    };

    // Duplicate removed

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements/${editingAnnouncement._id}`, newAnnouncement);
                alert('Announcement updated!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`, newAnnouncement);
                alert('Announcement posted!');
            }
            setNewAnnouncement({ content: '', links: [{ title: '', url: '' }] });
            setEditingAnnouncement(null);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert('Failed to post announcement');
        }
    };

    const handleAnnouncementDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditAnnouncement = (ann) => {
        setEditingAnnouncement(ann);
        setNewAnnouncement({ content: ann.content, links: ann.links?.length ? ann.links : [{ title: '', url: '' }] });
    };


    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-24 skeleton rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 skeleton rounded-3xl"></div>)}
            </div>
        </div>
    );

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 page-enter">
            {/* New Premium Navigation Bar */}
            <div className="glass-card !bg-white/80 dark:!bg-gray-900/80 !rounded-3xl p-3 flex flex-wrap items-center justify-between sticky top-4 z-50 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex items-center gap-6">
                    {/* Amrita Branding */}
                    <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 bg-amrita-maroon rounded-xl flex items-center justify-center text-white shadow-lg shadow-amrita-maroon/20">
                            <Sparkles size={20} className="text-amrita-gold" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-amrita-maroon leading-tight tracking-tighter uppercase">Amrita</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Placement Tracker</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center gap-1 overflow-x-auto scroller-hide">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
                            { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
                            { id: 'students', label: 'Students', icon: <Users size={18} /> },
                            { id: 'drives', label: 'Company Drives', icon: <Briefcase size={18} /> },
                            { id: 'prep', label: 'Prep Hub', icon: <Brain size={18} /> },
                            { id: 'alumni', label: 'Alumni Insights', icon: <GraduationCap size={18} /> },
                            { id: 'announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
                            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
                            { id: 'reports', label: 'Reports', icon: <FileSpreadsheet size={18} /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id === 'schedule' ? 'overview' : tab.id)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id || (tab.id === 'overview' && activeTab === 'overview')
                                    ? 'bg-amrita-maroon text-white shadow-lg shadow-amrita-maroon/30 scale-105'
                                    : 'text-gray-500 hover:text-amrita-maroon hover:bg-amrita-maroon/5'
                                    }`}
                            >
                                {tab.icon}
                                <span className={activeTab === tab.id ? 'block' : 'hidden lg:block'}>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4 pl-6">
                    {/* Search Bar - Hidden on small nav */}
                    <div className="relative hidden xl:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search intelligence..."
                            className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-amrita-maroon/20 w-48 transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative transition-colors text-gray-500"
                        >
                            <BellRing size={20} />
                            {stats.announcementCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-1 pl-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                            <span className="text-xs font-black text-gray-700 dark:text-gray-300 hidden md:block">Admin</span>
                            <div className="w-8 h-8 bg-amrita-maroon text-white rounded-xl flex items-center justify-center font-bold shadow-inner">
                                A
                            </div>
                        </button>
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-bold text-gray-900 dark:text-white">Admin User</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 w-full">
                                    <Settings size={14} /> Account Settings
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold w-full mt-1"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Metrics Ticker */}
            <div className="announcement-bar rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                    <div className="bg-amrita-maroon px-4 py-3 flex items-center gap-2">
                        <Activity size={18} className="text-white" />
                        <span className="font-black text-xs uppercase tracking-widest text-white">Live Insights</span>
                    </div>
                    <div className="overflow-hidden flex-1 bg-white dark:bg-gray-800">
                        <div className="py-3 px-4 flex gap-8 overflow-x-auto scroller-hide">
                            {liveMetrics.map((item, i) => (
                                <span key={i} className="whitespace-nowrap font-bold text-xs text-gray-600 dark:text-gray-400 capitalize flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amrita-maroon" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Center Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatCard
                    icon={<Users size={24} />}
                    label="Total Students"
                    value={stats.studentCount}
                    change="+5 this week"
                    gradient="from-[#8B0000] to-[#A52A2A]"
                />
                <QuickStatCard
                    icon={<Briefcase size={24} />}
                    label="Active Drives"
                    value={stats.driveCount}
                    change={`${stats.recentDrives?.length || 0} upcoming`}
                    gradient="from-[#8B0000] to-[#A52A2A]"
                />
                <QuickStatCard
                    icon={<CheckCircle size={24} />}
                    label="Placed Students"
                    value={stats.placedStudents}
                    change={`${stats.placementPercentage}% placed`}
                    gradient="from-[#8B0000] to-[#A52A2A]"
                />
                <QuickStatCard
                    icon={<DollarSign size={24} />}
                    label="Highest Package"
                    value={`₹${(stats.ctcStats?.maxCTC / 100000 || 0).toFixed(1)}L`}
                    change="This season"
                    gradient="from-[#8B0000] to-[#A52A2A]"
                />
            </div>

            {/* Main Content Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroller-hide">
                {activeTab === 'overview' && (
                    <>
                        {/* Main Statistics & Charts */}
                        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                            {/* Analytics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                            <PieChart className="text-amrita-maroon" size={20} />
                                        </div>
                                        Placement Status
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.placementStats?.map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${stat._id === 'placed' ? 'bg-amrita-maroon' : stat._id === 'in_process' ? 'bg-gray-400' : 'bg-gray-200'}`}></div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{stat._id?.replace('_', ' ')}</span>
                                                </div>
                                                <span className="font-black text-gray-900 dark:text-white">{stat.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                            <BarChart3 className="text-amrita-maroon" size={20} />
                                        </div>
                                        Department Overview
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.departmentStats?.slice(0, 3).map((dept, i) => (
                                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-black text-gray-900 dark:text-white">{dept._id}</span>
                                                    <span className="text-xs font-black text-amrita-maroon">{((dept.placed / dept.count) * 100 || 0).toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amrita-maroon" style={{ width: `${(dept.placed / dept.count) * 100 || 0}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Drives & Shortcuts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-black text-lg flex items-center gap-3 dark:text-white">
                                            <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                                <Briefcase className="text-amrita-maroon" size={20} />
                                            </div>
                                            Upcoming Drives
                                        </h3>
                                        <button onClick={() => setActiveTab('drives')} className="text-xs font-black text-amrita-maroon hover:underline">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {stats.recentDrives?.slice(0, 3).map((drive, i) => (
                                            <div key={i} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{drive.jobProfile}</p>
                                                    </div>
                                                    <span className="text-[10px] font-black bg-amrita-maroon/10 text-amrita-maroon px-2 py-0.5 rounded">NEW</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                                                    <span>{new Date(drive.date).toLocaleDateString()}</span>
                                                    <span>₹{(drive.ctcDetails?.ctc / 100000).toFixed(1)}L</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <QuickActionCard icon={<UserPlus />} label="Add Student" />
                                    <QuickActionCard icon={<Building />} label="Add Company" />
                                    <button onClick={() => window.location.href = '/admin/prephub'} className="glass-card !bg-white/50 dark:!bg-gray-800/50 p-6 flex flex-col items-center justify-center gap-3 group hover:!bg-amrita-maroon transition-all">
                                        <div className="p-3 bg-amrita-maroon/10 text-amrita-maroon rounded-xl group-hover:bg-white/20 group-hover:text-white transition-all">
                                            <BookOpen size={24} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-white">Prep Hub</span>
                                    </button>
                                    <QuickActionCard icon={<Megaphone />} label="Broadcast" />
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="glass-card p-6">
                                <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                    <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                        <Activity className="text-amrita-maroon" size={20} />
                                    </div>
                                    Recent Intelligence
                                </h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm group-hover:scale-110 transition-transform text-amrita-maroon">
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{activity.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-black">{activity.time}</p>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {/* Calendar Intelligence */}
                            <div className="glass-card p-6">
                                <CalendarComponent
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    calendarData={stats.recentDrives || []}
                                />
                            </div>

                            {/* Quick Stats Sidebar */}
                            <div className="glass-card p-6 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TrendingUp size={120} />
                                </div>
                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Seasonal Performance
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs opacity-70">Success Rate</p>
                                        <p className="text-2xl font-black">{stats.placementPercentage}%</p>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full" style={{ width: `${stats.placementPercentage}%` }} />
                                    </div>
                                    <p className="text-[10px] font-bold opacity-70">
                                        Outstanding performance in CSE & ECE departments this year.
                                    </p>
                                </div>
                            </div>

                            {/* Shortlist Engine Preview */}
                            <div className="glass-card p-6">
                                <h3 className="font-black text-lg mb-4 dark:text-white">Shortlist Engine</h3>
                                <p className="text-xs text-gray-500 mb-6 font-bold leading-relaxed">
                                    Optimize your selection process using our automated shortlist recommendation engine.
                                </p>
                                <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-amrita-maroon font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amrita-maroon hover:text-white transition-all">
                                    Configure Engine
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'students' && (
                    <div className="lg:col-span-3 glass-card p-8 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black dark:text-white">Student Directory</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search students..." className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs w-48 focus:ring-1 focus:ring-amrita-maroon/50" />
                                </div>
                                <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100"><Filter size={14} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Roll No.</th>
                                        <th>Student Name</th>
                                        <th>Department</th>
                                        <th>CGPA</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, i) => (
                                        <tr key={i} className="group">
                                            <td className="text-sm font-bold text-gray-500">{student.rollNumber}</td>
                                            <td className="text-sm font-black text-gray-900 dark:text-white">{student.firstName} {student.lastName}</td>
                                            <td className="text-xs font-bold uppercase">{student.department}</td>
                                            <td className="text-sm font-black text-amrita-maroon">{student.cgpa?.toFixed(2)}</td>
                                            <td><span className={getStatusBadge(student.placementStatus)}>{student.placementStatus?.replace('_', ' ')}</span></td>
                                            <td>
                                                <div className="flex gap-1">
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><EyeIcon size={16} /></button>
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit3 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="lg:col-span-3 glass-card p-8 animate-fade-in-up">
                        <h2 className="text-2xl font-black mb-8 dark:text-white">Reports & Intelligence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ReportCard icon={<FileSpreadsheet size={24} />} title="Placement Report" description="Detailed student placement statistics and trends" onExport={() => { }} />
                            <ReportCard icon={<Users size={24} />} title="Student Database" description="Complete export of student records and CGPA" onExport={() => { }} />
                            <ReportCard icon={<Briefcase size={24} />} title="Company Intelligence" description="Drive history and hiring performance analytics" onExport={() => { }} />
                        </div>
                    </div>
                )}

                {activeTab === 'drives' && (
                    <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
                        <div className="glass-card p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                    <Briefcase className="text-amrita-maroon" size={24} />
                                    Upcoming Company Drives
                                </h2>
                                <button className="btn-premium flex items-center gap-2 !py-2 !px-4 !text-xs">
                                    <Plus size={14} /> Add New Drive
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {stats.recentDrives?.map((drive, i) => (
                                    <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-amrita-maroon transition-all">
                                        <div className="w-12 h-12 bg-amrita-maroon text-white rounded-xl flex items-center justify-center font-black text-xl mb-4">
                                            {drive.companyName?.[0]}
                                        </div>
                                        <h3 className="font-black text-lg dark:text-white mb-1">{drive.companyName}</h3>
                                        <p className="text-xs text-gray-500 font-bold mb-4">{drive.jobProfile}</p>
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs font-bold">
                                            <span>{new Date(drive.date).toLocaleDateString()}</span>
                                            <span className="text-amrita-maroon">₹{(drive.ctcDetails?.ctc / 100000).toFixed(1)}L</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prep' && (
                    <div className="lg:col-span-3 animate-fade-in-up">
                        <AdminPrepHub />
                    </div>
                )}

                {activeTab === 'alumni' && (
                    <div className="lg:col-span-3 glass-card p-8 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black dark:text-white">Alumni Intelligence</h2>
                            <button className="btn-premium flex items-center gap-2 !py-2 !px-4 !text-xs">
                                <Plus size={14} /> Invite Alumni
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Alumni Name</th>
                                        <th>Company</th>
                                        <th>Role</th>
                                        <th>Batch</th>
                                        <th>CTC</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumni.map((alum, i) => (
                                        <tr key={i}>
                                            <td className="font-black dark:text-white">{alum.name}</td>
                                            <td className="text-sm text-gray-500">{alum.company}</td>
                                            <td className="text-xs font-bold uppercase">{alum.role}</td>
                                            <td className="text-xs text-gray-500">Class of {alum.batch}</td>
                                            <td className="font-black text-amrita-maroon">₹{(alum.ctc / 100000).toFixed(1)}L</td>
                                            <td><button className="p-2 hover:bg-gray-100 rounded-lg"><Mail size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'announcements' && (
                    <div className="lg:col-span-3 glass-card p-8 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                <Megaphone className="text-amrita-maroon" size={24} />
                                Communication Center
                            </h2>
                            <button className="btn-premium flex items-center gap-2 !py-2 !px-4 !text-xs">
                                <Send size={14} /> New Announcement
                            </button>
                        </div>
                        <div className="space-y-4">
                            {announcements.map((ann, i) => (
                                <div key={i} className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${ann.priority === 'high' ? 'bg-amrita-maroon/10 text-amrita-maroon' : 'bg-gray-100 text-gray-600'}`}>
                                            {ann.priority} Priority
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">{ann.date}</span>
                                    </div>
                                    <h3 className="font-bold text-lg dark:text-white">{ann.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-black mb-6 dark:text-white">Placement Velocity</h3>
                                <div className="h-64 flex items-end gap-2 pb-4">
                                    {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-amrita-maroon/10 rounded-t-lg relative group">
                                            <div className="absolute inset-x-0 bottom-0 bg-amrita-maroon rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }} />
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{h}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-black mb-6 dark:text-white">Salary Insights</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-maroon-subtle rounded-2xl border border-amrita-maroon/10">
                                        <p className="text-[10px] font-black text-amrita-maroon uppercase">Maximum</p>
                                        <p className="text-3xl font-black mt-1 dark:text-white">₹{(stats.ctcStats?.maxCTC / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Average</p>
                                        <p className="text-3xl font-black mt-1 dark:text-white">₹{(stats.ctcStats?.avgCTC / 100000).toFixed(1)}L</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Component definitions
const QuickStatCard = ({ icon, label, value, change, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl text-white relative overflow-hidden group cursor-default hover:scale-105 transition-transform duration-300 shadow-lg`}>
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
            {React.cloneElement(icon, { size: 60 })}
        </div>
        <div className="relative z-10">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
            {change && (
                <p className="text-xs font-bold mt-2 opacity-90">
                    {change}
                </p>
            )}
        </div>
    </div>
);

const StatCard = ({ icon, label, value, subtext, color, trend }) => {
    return (
        <div className="p-6 rounded-2xl text-white bg-gradient-to-br from-amrita-maroon to-amrita-pink relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {React.cloneElement(icon, { size: 80 })}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
            <p className="text-3xl font-black mt-1">{value}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-bold opacity-80">{subtext}</span>
                {trend && <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-full">{trend}</span>}
            </div>
        </div>
    );
}

const QuickActionCard = ({ icon, label, color }) => (
    <button className="glass-card !bg-white/50 dark:!bg-gray-800/50 p-6 flex flex-col items-center justify-center gap-3 group hover:!bg-amrita-maroon transition-all">
        <div className="p-3 bg-amrita-maroon/10 text-amrita-maroon rounded-xl group-hover:bg-white/20 group-hover:text-white transition-all">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-white">{label}</span>
    </button>
);

const ReportCard = ({ icon, title, description, onExport }) => (
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all">
        <div className="p-3 rounded-xl mb-4 w-fit bg-amrita-maroon/10 text-amrita-maroon">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="font-bold text-lg mb-2 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex gap-2">
            <button onClick={onExport} className="flex-1 py-2 rounded-lg font-bold text-sm bg-amrita-maroon text-white">
                Export
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <EyeIcon size={18} />
            </button>
        </div>
    </div>
);

const getStatusBadge = (status) => {
    const badges = {
        placed: 'bg-amrita-maroon/10 text-amrita-maroon px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
        in_process: 'bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
        not_placed: 'bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
        active: 'bg-amrita-maroon/10 text-amrita-maroon px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
        pending: 'bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
        completed: 'bg-amrita-maroon text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider'
    };
    return badges[status] || badges.not_placed;
};

const CalendarComponent = ({ currentDate, setCurrentDate, calendarData }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const daysArray = Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDay + 1;
        return day > 0 && day <= daysInMonth ? day : null;
    });

    const getEventsForDay = (day) => {
        if (!day) return [];
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return calendarData.filter(event => event.date === dateStr);
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'drive': return 'bg-amrita-maroon';
            case 'prep': return 'bg-[#A52A2A]';
            case 'alumni': return 'bg-[#C04040]';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg dark:text-white">Calendar</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-black text-gray-400 p-2">
                        {day}
                    </div>
                ))}

                {daysArray.map((day, index) => (
                    <div key={index} className={`min-h-20 p-1 border border-gray-100 dark:border-gray-700 rounded-lg ${day ? 'bg-white dark:bg-gray-800' : ''}`}>
                        {day && (
                            <>
                                <div className="text-right mb-1">
                                    <span className={`text-sm font-bold ${getEventsForDay(day).length > 0 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {day}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {getEventsForDay(day).slice(0, 2).map((event, i) => (
                                        <div key={i} className={`text-xs p-1 rounded ${getEventColor(event.type)} text-white truncate`}>
                                            {event.company || event.title.split(' ')[0]}
                                        </div>
                                    ))}
                                    {getEventsForDay(day).length > 2 && (
                                        <div className="text-xs text-gray-500 text-center">+{getEventsForDay(day).length - 2} more</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 dark:border-gray-700">
                <h4 className="font-bold text-sm mb-3 dark:text-gray-300">Upcoming Events</h4>
                <div className="space-y-2">
                    {calendarData.slice(0, 3).map((event, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium dark:text-gray-300">{event.title}</p>
                                <p className="text-xs text-gray-500">{event.date} {event.time && `• ${event.time}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;