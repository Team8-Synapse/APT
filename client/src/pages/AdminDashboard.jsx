import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, Users, Briefcase, BookOpen, Search, ShieldCheck, TrendingUp, Sparkles,
    Filter, ChevronRight, Download, Calendar, Building2, GraduationCap, Award, Plus,
    Edit, Trash2, Eye, CheckCircle, XCircle, BarChart3, PieChart, ArrowUpRight, UserPlus,
    Clock, Bell, Activity, Target, Zap, FileText, Upload, RefreshCw, Settings,
    AlertCircle, ArrowRight, Megaphone, DollarSign, Timer,
    Mail, MessageSquare, Video, FileCode, Brain, TargetIcon, Bookmark, Star,
    ChartBar, DownloadCloud, Printer, FileSpreadsheet, BellRing, CalendarDays,
    UsersRound, Building, Trophy, TrendingUpIcon, LineChart, Network, Link,
    BriefcaseBusiness, School, TrendingDownIcon, FileCheck, ClipboardCheck
} from 'lucide-react';

// Theme configuration
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
    beige: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        light: '#FFFFFF',
        dark: '#F0F2F5',
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)'
    }
};

const AdminDashboard = () => {
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

    // Live announcements
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

    const fetchAlumni = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/directory`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAlumniList(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (activeTab === 'alumni') fetchAlumni();
    }, [activeTab]);

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

    const getStatusBadge = (status) => {
        const badges = {
            placed: 'status-badge status-placed',
            in_process: 'status-badge status-in-process',
            not_placed: 'status-badge status-not-placed',
            active: 'status-badge status-placed',
            pending: 'status-badge status-in-process',
            completed: 'status-badge status-not-placed'
        };
        return badges[status] || badges.not_placed;
    };

    const CalendarComponent = () => {
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
                case 'drive': return 'bg-red-500';
                case 'prep': return 'bg-blue-500';
                case 'alumni': return 'bg-green-500';
                default: return 'bg-gray-500';
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

    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-24 skeleton rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 skeleton rounded-3xl"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 page-enter pb-12">
            {/* Live Metrics Ticker */}
            <div className="announcement-bar rounded-2xl overflow-hidden" style={{ background: theme.maroon.gradient }}>
                <div className="flex items-center">
                    <div className="bg-white/20 px-4 py-3 flex items-center gap-2 border-r border-white/20">
                        <Activity size={18} className="animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-widest">Live</span>
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="animate-ticker py-3 px-4">
                            {[...liveMetrics, ...liveMetrics].map((item, i) => (
                                <span key={i} className="whitespace-nowrap mx-8 font-bold text-sm text-white">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Center Header */}
            <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10" style={{ background: theme.maroon.gradient }}>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="text-white" size={20} />
                            <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">CIR Command Center</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                            Admin <span className="text-white/90">Intelligence</span> Dashboard
                        </h1>
                        <p className="text-white/70 font-medium mt-2">Comprehensive placement analytics and management</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => handleExport('students')} className="glass-card !bg-white/20 !border-white/30 px-5 py-3 font-bold text-white flex items-center gap-2 hover:!bg-white/30 transition-all">
                            <Download size={18} /> Export
                        </button>
                        <button className="btn-premium !bg-white !text-amrita-maroon flex items-center gap-2">
                            <UserPlus size={18} /> Add Student
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Tab Navigation */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Tab Navigation */}
                    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                        {[
                            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
                            { id: 'students', label: 'Students', icon: <Users size={16} /> },
                            { id: 'drives', label: 'Company Drives', icon: <Briefcase size={16} /> },
                            { id: 'prep', label: 'Prep Hub', icon: <Brain size={16} /> },
                            { id: 'alumni', label: 'Alumni Insights', icon: <GraduationCap size={16} /> },
                            { id: 'announcements', label: 'Announcement', icon: <Megaphone size={16} /> },
                            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
                            { id: 'reports', label: 'Reports', icon: <FileSpreadsheet size={16} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-lg'
                                    : 'text-gray-500 hover:text-amrita-maroon hover:bg-white dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <>
                            {/* Performance Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={<Users />}
                                    label="Total Students"
                                    value={stats.studentCount}
                                    subtext="Batch 2026"
                                    color="maroon"
                                    trend="+5 this week"
                                />
                                <StatCard
                                    icon={<Briefcase />}
                                    label="Active Drives"
                                    value={stats.driveCount}
                                    subtext={`${stats.recentDrives?.length || 0} upcoming`}
                                    color="maroon"
                                />
                                <StatCard
                                    icon={<CheckCircle />}
                                    label="Placed Students"
                                    value={stats.placedStudents}
                                    subtext={`${stats.placementPercentage}% placed`}
                                    color="green"
                                    trend="+3 this week"
                                />
                                <StatCard
                                    icon={<DollarSign />}
                                    label="Highest CTC"
                                    value={`₹${(stats.ctcStats?.maxCTC / 100000 || 0).toFixed(1)}L`}
                                    subtext="This season"
                                    color="gold"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <QuickActionCard icon={<UserPlus />} label="Add Student" color="maroon" />
                                <QuickActionCard icon={<Plus />} label="Create Drive" color="maroon" />
                                <QuickActionCard icon={<Upload />} label="Bulk Upload" color="maroon" />
                                <QuickActionCard icon={<DownloadCloud />} label="Export Report" color="maroon" />
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Placement Status */}
                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2" style={{ background: theme.maroon.subtle, borderRadius: '12px' }}>
                                            <PieChart style={{ color: theme.maroon.primary }} size={20} />
                                        </div>
                                        Placement Status
                                    </h3>

                                    <div className="relative mb-8">
                                        <div className="flex justify-center">
                                            <div className="relative w-40 h-40">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle className="text-gray-100 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                                    <circle
                                                        className="text-green-500"
                                                        strokeWidth="10"
                                                        strokeDasharray={2 * Math.PI * 40}
                                                        strokeDashoffset={2 * Math.PI * 40 * (1 - stats.placedStudents / stats.studentCount)}
                                                        strokeLinecap="round"
                                                        stroke="currentColor"
                                                        fill="transparent"
                                                        r="40"
                                                        cx="50"
                                                        cy="50"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-3xl font-black" style={{ color: theme.maroon.primary }}>{stats.placementPercentage}%</span>
                                                    <span className="text-xs font-bold text-gray-400">Placed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {stats.placementStats?.map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${stat._id === 'placed' ? 'bg-green-500' : stat._id === 'in_process' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{stat._id?.replace('_', ' ')}</span>
                                                </div>
                                                <span className="font-black text-gray-900 dark:text-white">{stat.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Department Stats */}
                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2" style={{ background: theme.maroon.subtle, borderRadius: '12px' }}>
                                            <BarChart3 style={{ color: theme.maroon.primary }} size={20} />
                                        </div>
                                        Department Overview
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.departmentStats?.map((dept, i) => (
                                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-amrita-maroon/5 transition-all">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-black text-gray-900 dark:text-white text-lg">{dept._id}</span>
                                                    <span className="text-xs font-black text-white px-3 py-1 rounded-full" style={{ background: theme.maroon.primary }}>
                                                        {dept.count} students
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Avg CGPA: <span className="font-black" style={{ color: theme.maroon.primary }}>{dept.avgCgpa?.toFixed(2)}</span></span>
                                                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full" style={{ background: theme.maroon.gradient, width: `${(dept.count / stats.studentCount) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTC Stats */}
                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2" style={{ background: 'rgba(139, 0, 0, 0.1)', borderRadius: '12px' }}>
                                            <Award style={{ color: theme.maroon.primary }} size={20} />
                                        </div>
                                        CTC Statistics
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="text-center p-6 rounded-2xl text-white relative overflow-hidden" style={{ background: theme.maroon.gradient }}>
                                            <div className="absolute top-0 right-0 opacity-20">
                                                <DollarSign size={80} />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Highest Package</p>
                                            <p className="text-5xl font-black mt-2">₹{((stats.ctcStats?.maxCTC || 0) / 100000).toFixed(1)}L</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <p className="text-xs font-bold text-gray-500 uppercase">Average</p>
                                                <p className="text-2xl font-black mt-1" style={{ color: theme.maroon.primary }}>₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <p className="text-xs font-bold text-gray-500 uppercase">Minimum</p>
                                                <p className="text-2xl font-black text-gray-600 dark:text-gray-400 mt-1">₹{((stats.ctcStats?.minCTC || 0) / 100000).toFixed(1)}L</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Drives & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Upcoming Drives */}
                                <section className="glass-card p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                            <div className="p-2" style={{ background: theme.maroon.subtle, borderRadius: '12px' }}>
                                                <Calendar style={{ color: theme.maroon.primary }} size={20} />
                                            </div>
                                            Upcoming Drives
                                        </h2>
                                        <button className="text-xs font-black" style={{ color: theme.maroon.primary }}>View All</button>
                                    </div>

                                    <div className="space-y-4">
                                        {stats.recentDrives?.slice(0, 4).map((drive, i) => (
                                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all group">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 text-white rounded-xl flex items-center justify-center font-black text-lg" style={{ background: theme.maroon.gradient }}>
                                                            {drive.companyName?.[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{drive.companyName}</h4>
                                                            <p className="text-xs text-gray-500">{drive.jobProfile}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black" style={{ color: theme.maroon.primary }}>
                                                        ₹{(drive.ctcDetails?.ctc / 100000).toFixed(1)}L
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs text-gray-500">{new Date(drive.date).toLocaleDateString()}</span>
                                                    <span className={`text-[10px] font-black px-2 py-1 rounded ${drive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {drive.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Recent Activity */}
                                <section className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                        <div className="p-2" style={{ background: theme.maroon.subtle, borderRadius: '12px' }}>
                                            <Clock style={{ color: theme.maroon.primary }} size={20} />
                                        </div>
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, i) => (
                                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg" style={{ background: theme.maroon.subtle, color: theme.maroon.primary }}>
                                                        {activity.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{activity.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </>
                    )}

                    {activeTab === 'students' && (
                        <div className="glass-card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black dark:text-white">Student Management</h2>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            className="input-field pl-12 !py-3"
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        />
                                    </div>
                                    <button className="btn-premium" style={{ background: theme.maroon.primary }}>Search</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Roll Number</th>
                                            <th>Name</th>
                                            <th>Department</th>
                                            <th>CGPA</th>
                                            <th>Status</th>
                                            <th>Company</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.slice(0, 15).map((student, i) => (
                                            <tr key={i}>
                                                <td className="font-bold text-gray-600 dark:text-gray-400">{student.rollNumber}</td>
                                                <td className="font-black text-gray-900 dark:text-white">{student.firstName} {student.lastName}</td>
                                                <td className="font-bold uppercase">{student.department}</td>
                                                <td className="font-black" style={{ color: theme.maroon.primary }}>{student.cgpa?.toFixed(2)}</td>
                                                <td><span className={getStatusBadge(student.placementStatus)}>{student.placementStatus?.replace('_', ' ')}</span></td>
                                                <td className="font-bold text-gray-600 dark:text-gray-400">{student.offeredCompany || '-'}</td>
                                                <td className="flex gap-2">
                                                    <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition-all"><Eye size={16} /></button>
                                                    <button className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 transition-all"><Edit size={16} /></button>
                                                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition-all"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'drives' && (
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black dark:text-white">Company Drives</h2>
                                    <button className="btn-premium flex items-center gap-2" style={{ background: theme.maroon.primary }}>
                                        <Plus size={18} /> Add Drive
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {stats.recentDrives?.map((drive, i) => (
                                        <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-14 h-14 text-white rounded-xl flex items-center justify-center font-black text-xl" style={{ background: theme.maroon.gradient }}>
                                                    {drive.companyName?.[0]}
                                                </div>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${drive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {drive.status}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">{drive.companyName}</h3>
                                            <p className="text-sm text-gray-500 mb-4">{drive.jobProfile}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <span className="text-xs text-gray-400">{new Date(drive.date).toLocaleDateString()}</span>
                                                {drive.ctcDetails?.ctc && (
                                                    <span className="font-black" style={{ color: theme.maroon.primary }}>₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Company Directory */}
                            <div className="glass-card p-6">
                                <h3 className="font-black text-lg mb-6 dark:text-white">Company Directory</h3>
                                <div className="overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Status</th>
                                                <th>Drives</th>
                                                <th>Hired</th>
                                                <th>Avg CTC</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.map((company, i) => (
                                                <tr key={i}>
                                                    <td className="font-black text-gray-900 dark:text-white">{company.name}</td>
                                                    <td><span className={getStatusBadge(company.status)}>{company.status}</span></td>
                                                    <td className="font-bold">{company.drives}</td>
                                                    <td className="font-bold" style={{ color: theme.maroon.primary }}>{company.hired}</td>
                                                    <td className="font-bold">₹{(company.avgCTC / 100000).toFixed(1)}L</td>
                                                    <td>
                                                        <button className="p-2 hover:bg-amrita-maroon/10 rounded-lg" style={{ color: theme.maroon.primary }}>
                                                            <Eye size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prep' && (
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black dark:text-white">Preparation Hub</h2>
                                    <button className="btn-premium flex items-center gap-2" style={{ background: theme.maroon.primary }}>
                                        <Plus size={18} /> Add Workshop
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <Brain size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.prepStats?.workshops || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Workshops Conducted</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <MessageSquare size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.prepStats?.mockInterviews || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Mock Interviews</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <FileCheck size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.prepStats?.resumeReviews || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Resume Reviews</p>
                                    </div>
                                </div>

                                <h3 className="font-black text-lg mb-4 dark:text-white">Upcoming Sessions</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Advanced DSA Workshop', date: '2026-03-18', type: 'workshop', attendees: 45 },
                                        { title: 'Google Mock Interviews', date: '2026-03-20', type: 'interview', attendees: 32 },
                                        { title: 'Resume Building Session', date: '2026-03-22', type: 'workshop', attendees: 28 },
                                        { title: 'Communication Skills Workshop', date: '2026-03-25', type: 'workshop', attendees: 38 }
                                    ].map((session, i) => (
                                        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold dark:text-white">{session.title}</h4>
                                                <p className="text-sm text-gray-500">{session.date} • {session.attendees} attendees</p>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg font-bold text-sm" style={{ background: theme.maroon.primary, color: 'white' }}>
                                                Manage
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'alumni' && (
                        <div className="space-y-6">
                            <div className="glass-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black dark:text-white">Alumni Insights</h2>
                                    <button className="btn-premium flex items-center gap-2" style={{ background: theme.maroon.primary }}>
                                        <UserPlus size={18} /> Add Alumni
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <UsersRound size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.alumniStats?.connected || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Connected Alumni</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <GraduationCap size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.alumniStats?.mentors || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Active Mentors</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <Link size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.alumniStats?.referrals || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Referrals</p>
                                    </div>
                                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <TrendingUpIcon size={40} className="mx-auto mb-4" style={{ color: theme.maroon.primary }} />
                                        <p className="text-3xl font-black mb-2">{stats.alumniStats?.avgExperience || 0}</p>
                                        <p className="text-sm text-gray-500 font-bold">Avg Experience (yrs)</p>
                                    </div>
                                </div>

                                <h3 className="font-black text-lg mb-4 dark:text-white">Top Alumni</h3>
                                <div className="overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Company</th>
                                                <th>Role</th>
                                                <th>Batch</th>
                                                <th>CTC</th>
                                                <th>Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alumni.map((alum, i) => (
                                                <tr key={i}>
                                                    <td className="font-black text-gray-900 dark:text-white">{alum.name}</td>
                                                    <td className="font-bold">{alum.company}</td>
                                                    <td className="font-bold">{alum.role}</td>
                                                    <td className="font-bold">{alum.batch}</td>
                                                    <td className="font-black" style={{ color: theme.maroon.primary }}>₹{(alum.ctc / 100000).toFixed(1)}L</td>
                                                    <td>
                                                        <button className="p-2 hover:bg-amrita-maroon/10 rounded-lg" style={{ color: theme.maroon.primary }}>
                                                            <Mail size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div className="glass-card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black dark:text-white">Announcements</h2>
                                <button className="btn-premium flex items-center gap-2" style={{ background: theme.maroon.primary }}>
                                    <Megaphone size={18} /> Create Announcement
                                </button>
                            </div>

                            <div className="space-y-4">
                                {announcements.map((announcement, i) => (
                                    <div key={i} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg dark:text-white">{announcement.title}</h3>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded ${announcement.priority === 'high' ? 'bg-red-100 text-red-700' : announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {announcement.priority}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">{announcement.date}</span>
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="glass-card p-6 text-center">
                                    <p className="text-5xl font-black" style={{ color: theme.maroon.primary }}>{stats.placementPercentage}%</p>
                                    <p className="text-sm text-gray-500 mt-2 font-bold">Placement Rate</p>
                                </div>
                                <div className="glass-card p-6 text-center">
                                    <p className="text-5xl font-black" style={{ color: theme.maroon.primary }}>₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
                                    <p className="text-sm text-gray-500 mt-2 font-bold">Average CTC</p>
                                </div>
                                <div className="glass-card p-6 text-center">
                                    <p className="text-5xl font-black text-green-600">{stats.placedStudents}</p>
                                    <p className="text-sm text-gray-500 mt-2 font-bold">Students Placed</p>
                                </div>
                                <div className="glass-card p-6 text-center">
                                    <p className="text-5xl font-black text-blue-600">{stats.driveCount}</p>
                                    <p className="text-sm text-gray-500 mt-2 font-bold">Companies Visited</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 dark:text-white">Placement Trend</h3>
                                    <div className="h-64 flex items-center justify-center">
                                        <LineChart size={60} className="text-gray-300" />
                                        <p className="text-gray-500 ml-4 font-bold">Interactive chart coming soon</p>
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="font-black text-lg mb-6 dark:text-white">Department Performance</h3>
                                    <div className="space-y-4">
                                        {stats.departmentStats?.map((dept, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-bold dark:text-white">{dept._id}</span>
                                                    <span className="font-black" style={{ color: theme.maroon.primary }}>{dept.placed}/{dept.count}</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full" style={{ background: theme.maroon.gradient, width: `${(dept.placed / dept.count) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-black mb-6 dark:text-white">Reports & Exports</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <ReportCard
                                    icon={<FileSpreadsheet />}
                                    title="Placement Report"
                                    description="Detailed placement statistics"
                                    onExport={() => handleExport('placement')}
                                />
                                <ReportCard
                                    icon={<Users />}
                                    title="Student Database"
                                    description="Complete student records"
                                    onExport={() => handleExport('students')}
                                />
                                <ReportCard
                                    icon={<Briefcase />}
                                    title="Company Reports"
                                    description="Drive and company statistics"
                                    onExport={() => handleExport('companies')}
                                />
                                <ReportCard
                                    icon={<ChartBar />}
                                    title="Analytics Dashboard"
                                    description="Performance analytics"
                                    onExport={() => handleExport('analytics')}
                                />
                                <ReportCard
                                    icon={<GraduationCap />}
                                    title="Alumni Report"
                                    description="Alumni network data"
                                    onExport={() => handleExport('alumni')}
                                />
                                <ReportCard
                                    icon={<Printer />}
                                    title="Print All Reports"
                                    description="Generate printable reports"
                                    onExport={() => handleExport('all')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Calendar & Shortlist Engine */}
                <div className="space-y-8">
                    {/* Calendar */}
                    <CalendarComponent />

                    {/* Shortlist Engine */}
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl" style={{ background: theme.maroon.subtle }}>
                                <Filter style={{ color: theme.maroon.primary }} size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black dark:text-white">Shortlist Engine</h2>
                                <p className="text-xs text-gray-500">Filter eligible students</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Minimum CGPA</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input-field"
                                    value={filters.minCgpa}
                                    onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Max Backlogs</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={filters.maxBacklogs}
                                    onChange={(e) => setFilters({ ...filters, maxBacklogs: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400">Department</label>
                                <select
                                    className="input-field"
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                >
                                    <option value="">All Departments</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ME">ME</option>
                                </select>
                            </div>
                            <button onClick={handleShortlist} className="w-full btn-premium py-4 flex items-center justify-center gap-2" style={{ background: theme.maroon.primary }}>
                                <Sparkles size={20} /> Execute Shortlist
                            </button>
                        </div>

                        {/* Shortlist Results Preview */}
                        {shortlist.length > 0 && (
                            <div className="pt-6 border-t dark:border-gray-700">
                                <h3 className="font-bold text-sm mb-3 dark:text-gray-300">Shortlisted ({shortlist.length})</h3>
                                <div className="space-y-2">
                                    {shortlist.slice(0, 3).map((student, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: theme.maroon.gradient }}>
                                                    {student.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium dark:text-gray-300">{student.firstName}</p>
                                                    <p className="text-xs text-gray-500">{student.department}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black" style={{ color: theme.maroon.primary }}>{student.cgpa?.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Today's Drives</span>
                                <span className="font-bold">2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Pending Approvals</span>
                                <span className="font-bold" style={{ color: theme.maroon.primary }}>12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">New Applications</span>
                                <span className="font-bold">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Upcoming Events</span>
                                <span className="font-bold">5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value, subtext, color, trend }) => {
    return (
        <div className="glass-card p-6 flex items-center gap-5 overflow-hidden relative group hover:shadow-xl transition-all">
            <div className="p-4 rounded-2xl text-white shadow-lg" style={{ background: theme.maroon.gradient }}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{value}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{subtext}</p>
                    {trend && (
                        <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuickActionCard = ({ icon, label, color }) => {
    return (
        <button className="quick-action w-full group">
            <div className="p-3 rounded-xl mb-2 group-hover:bg-white transition-all" style={{ background: theme.maroon.subtle }}>
                {React.cloneElement(icon, { style: { color: theme.maroon.primary } })}
            </div>
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.maroon.primary }}>{label}</span>
        </button>
    );
};

const ReportCard = ({ icon, title, description, onExport }) => {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all">
            <div className="p-3 rounded-xl mb-4 w-fit" style={{ background: theme.maroon.subtle }}>
                {React.cloneElement(icon, { style: { color: theme.maroon.primary }, size: 24 })}
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className="flex gap-2">
                <button onClick={onExport} className="flex-1 py-2 rounded-lg font-bold text-sm" style={{ background: theme.maroon.primary, color: 'white' }}>
                    Export
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Eye size={18} />
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;