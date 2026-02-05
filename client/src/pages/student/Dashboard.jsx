import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Target, TrendingUp, AlertCircle, Calendar, ChevronRight, Brain, Sparkles, Zap, Award,
    Briefcase, Clock, CheckCircle, XCircle, Send, Users, Building2, GraduationCap, Star,
    ArrowUpRight, Bell, FileText, MapPin, Flame, Trophy, BookOpen, Rocket, Heart,
    Timer, Lightbulb, Megaphone, ArrowRight, Play, Coffee, BarChart3, TrendingDown,
    Download, Eye, Filter, Search, Plus, Shield, Globe, UserCheck, Mail, Video,
    MessageSquare, ThumbsUp, Share2, RefreshCw, Settings, LogOut, BellRing, Moon,
    Sun, PieChart, Activity, Cpu, Smartphone, Database, Cloud, Terminal, Wifi,
    Battery, Volume2, HelpCircle, Info, AlertTriangle, Clock3, CalendarDays,
    ChevronLeft, Maximize2, Minimize2, X, MoreVertical, ExternalLink, Copy,
    Edit3, Trash2, Save, Upload, Link, Lock, Unlock, EyeOff, Eye as EyeIcon
} from 'lucide-react';
import AIChatbot from '../../components/AIChatbot';
import DailyChallenge from '../../components/DailyChallenge';
import PlacementCountdown from '../../components/PlacementCountdown';
import SkillProgress from '../../components/SkillProgress';
import InterviewSchedule from '../../components/InterviewSchedule';
import ResourceRecommendations from '../../components/ResourceRecommendations';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        readinessScore: 0,
        profile: {},
        applications: { total: 0, inProgress: 0, offered: 0, rejected: 0 },
        drives: { upcoming: 0, eligible: 0 },
        skills: [],
        mockInterviews: { completed: 0, scheduled: 0, averageScore: 0 },
        resources: { viewed: 0, completed: 0 }
    });
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTip, setCurrentTip] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userStreak, setUserStreak] = useState(7);
    const [timeOfDay, setTimeOfDay] = useState('');

    // Initialize time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('Morning');
        else if (hour < 17) setTimeOfDay('Afternoon');
        else setTimeOfDay('Evening');
    }, []);

    // Daily tips rotation
    const dailyTips = [
        "Practice at least 2 DSA problems daily to stay sharp 💪",
        "Update your LinkedIn profile with recent projects 🔗",
        "Review alumni interview experiences before your next interview 📚",
        "Work on your communication skills - they matter! 🗣️",
        "Build that side project you've been thinking about 🚀",
        "Network with alumni on LinkedIn - ask for referrals 👥",
        "Review system design concepts weekly 🏗️",
        "Practice behavioral questions using STAR method ⭐",
        "Update your resume with quantifiable achievements 📄",
        "Participate in mock interviews for feedback 🎯"
    ];

    // Announcements ticker
    const announcements = [
        "🎉 Google hiring for SDE positions - Apply by March 15",
        "📢 Mock interview sessions starting next week",
        "🏆 Amazon offered highest package of ₹50 LPA this season",
        "📝 Resume building workshop on Friday at 3 PM",
        "💼 Microsoft on-campus drive scheduled for March 22",
        "🌟 New: AI-powered interview simulator launched",
        "📈 Placement stats: 85% of CSE students placed",
        "🎓 Alumni talk: Senior Engineer at Google - March 18",
        "💡 Tip: Update your GitHub with recent projects",
        "📊 New feature: Real-time application tracking"
    ];

    // Notifications
    const mockNotifications = [
        { id: 1, type: 'success', message: 'Your application to Google has been shortlisted!', time: '2 min ago', read: false },
        { id: 2, type: 'info', message: 'Microsoft drive application deadline tomorrow', time: '1 hour ago', read: false },
        { id: 3, type: 'warning', message: 'Complete your profile for better opportunities', time: '2 hours ago', read: true },
        { id: 4, type: 'success', message: 'You earned "Profile Pro" achievement', time: '5 hours ago', read: true },
    ];

    useEffect(() => {
        const tipInterval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % dailyTips.length);
        }, 8000);
        return () => clearInterval(tipInterval);
    }, []);

    useEffect(() => {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const fetchData = async () => {
            try {
                const [dashboardRes, drivesRes, applicationsRes, notificationsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/dashboard-stats/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/my-applications/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/${user.id}`)
                ]);

                setStats(dashboardRes.data);
                setDrives(drivesRes.data.slice(0, 5));
                setApplications(applicationsRes.data.slice(0, 5));
                setNotifications(notificationsRes.data || mockNotifications);
                setLoading(false);
            } catch (err) {
                console.error(err);
                // Enhanced mock data
                setStats({
                    readinessScore: 78,
                    profile: {
                        name: user.email.split('@')[0],
                        department: 'Computer Science',
                        cgpa: 8.5,
                        placementStatus: 'not_placed',
                        batch: '2026',
                        skills: ['React', 'Node.js', 'Python', 'MongoDB'],
                        achievements: ['Profile Pro', 'First Apply', '7-Day Streak']
                    },
                    applications: { total: 5, inProgress: 2, offered: 1, rejected: 1 },
                    drives: { upcoming: 8, eligible: 6 },
                    skills: [
                        { name: 'Data Structures', level: 85 },
                        { name: 'Algorithms', level: 78 },
                        { name: 'System Design', level: 65 },
                        { name: 'React', level: 90 },
                        { name: 'Node.js', level: 82 }
                    ],
                    mockInterviews: { completed: 3, scheduled: 2, averageScore: 7.5 },
                    resources: { viewed: 12, completed: 8 }
                });
                setDrives([
                    { _id: '1', companyName: 'Google', jobProfile: 'Software Engineer L3', date: '2026-03-15', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4500000 }, location: 'Bangalore', eligibility: { minCgpa: 7.5, backlog: 0 } },
                    { _id: '2', companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', status: 'upcoming', isEligible: true, hasApplied: true, ctcDetails: { ctc: 4200000 }, location: 'Hyderabad', eligibility: { minCgpa: 7.0, backlog: 0 } },
                    { _id: '3', companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4000000 }, location: 'Bangalore', eligibility: { minCgpa: 7.0, backlog: 1 } },
                    { _id: '4', companyName: 'Adobe', jobProfile: 'MTS', date: '2026-04-12', status: 'upcoming', isEligible: false, hasApplied: false, ctcDetails: { ctc: 3800000 }, location: 'Noida', eligibility: { minCgpa: 8.0, backlog: 0 } },
                    { _id: '5', companyName: 'Goldman Sachs', jobProfile: 'Technology Analyst', date: '2026-04-20', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 2800000 }, location: 'Bengaluru', eligibility: { minCgpa: 7.5, backlog: 0 } },
                ]);
                setApplications([
                    { _id: '1', driveId: { companyName: 'Microsoft', jobProfile: 'SDE' }, status: 'shortlisted', appliedDate: '2026-02-01', lastUpdated: '2026-02-10' },
                    { _id: '2', driveId: { companyName: 'Adobe', jobProfile: 'MTS' }, status: 'applied', appliedDate: '2026-01-28', lastUpdated: '2026-01-28' },
                    { _id: '3', driveId: { companyName: 'TCS', jobProfile: 'System Engineer' }, status: 'offered', appliedDate: '2026-01-15', lastUpdated: '2026-01-30' },
                    { _id: '4', driveId: { companyName: 'Infosys', jobProfile: 'Specialist Programmer' }, status: 'rejected', appliedDate: '2026-01-10', lastUpdated: '2026-01-25' },
                    { _id: '5', driveId: { companyName: 'Wipro', jobProfile: 'Project Engineer' }, status: 'round1', appliedDate: '2026-02-05', lastUpdated: '2026-02-08' },
                ]);
                setNotifications(mockNotifications);
                setLoading(false);
            }
        };
        fetchData();

        // Auto-refresh data every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [user.id]);

    const handleApply = async (driveId) => {
        const userId = user?._id || user?.id;
        if (!userId) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/apply`, {
                userId: userId,
                driveId
            });
            const drivesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`);
            setDrives(drivesRes.data.slice(0, 5));
            // Add notification
            setNotifications(prev => [{
                id: Date.now(),
                type: 'success',
                message: 'Application submitted successfully!',
                time: 'Just now',
                read: false
            }, ...prev]);
        } catch (err) {
            console.error('Failed to apply:', err);
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    const handleNotificationClick = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
            shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
            round1: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
            round2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
            round3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
            offered: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
            rejected: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
            accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    };

    const filteredDrives = drives.filter(drive =>
        drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.jobProfile.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-32 skeleton rounded-3xl animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="h-64 skeleton rounded-3xl animate-pulse"></div>
                <div className="h-64 skeleton rounded-3xl lg:col-span-2 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 skeleton rounded-2xl animate-pulse"></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 page-enter pb-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        Good {timeOfDay}, {stats.profile?.name || user.email.split('@')[0]}!
                        <span className="text-amrita-maroon dark:text-amrita-gold"> 👋</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Track your placement journey and opportunities</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search drives, resources..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amrita-maroon"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative"
                        >
                            <BellRing size={20} />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                        <button className="text-xs text-amrita-maroon hover:underline">
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif.id)}
                                            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${notif.type === 'success' ? 'bg-green-100 text-green-600' : notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {notif.type === 'success' ? <CheckCircle size={16} /> :
                                                        notif.type === 'warning' ? <AlertTriangle size={16} /> :
                                                            <Info size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                                    <a href="/notifications" className="text-center block text-sm text-amrita-maroon hover:underline font-medium">
                                        View all notifications
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* User Menu */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-full flex items-center justify-center font-bold">
                                {stats.profile?.name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <ChevronRight size={16} className="text-gray-400 group-hover:rotate-90 transition-transform" />
                        </button>
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <p className="font-bold text-gray-900 dark:text-white">{stats.profile?.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <a href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
                                    <UserCheck size={16} /> My Profile
                                </a>
                                <a href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
                                    <Settings size={16} /> Settings
                                </a>
                                <a href="/help" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
                                    <HelpCircle size={16} /> Help & Support
                                </a>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-red-600 w-full"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements Ticker */}
            <div className="announcement-bar rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amrita-maroon to-amrita-pink px-4 py-3 flex items-center gap-2">
                        <Megaphone size={18} className="text-white" />
                        <span className="font-black text-xs uppercase tracking-widest text-white">Live Updates</span>
                    </div>
                    <div className="overflow-hidden flex-1 bg-gray-50 dark:bg-gray-800">
                        <div className="animate-ticker py-3 px-4">
                            {[...announcements, ...announcements].map((item, i) => (
                                <span key={i} className="whitespace-nowrap mx-8 font-medium text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatCard
                    icon={<Target size={24} />}
                    label="Readiness Score"
                    value={`${Math.round(stats.readinessScore)}%`}
                    change="+2%"
                    gradient="from-amrita-maroon to-amrita-pink"
                />
                <QuickStatCard
                    icon={<Send size={24} />}
                    label="Applications"
                    value={stats.applications?.total || 0}
                    change="+1 today"
                    gradient="from-blue-500 to-cyan-400"
                />
                <QuickStatCard
                    icon={<Calendar size={24} />}
                    label="Upcoming Drives"
                    value={stats.drives?.upcoming || 0}
                    change="Next: 3 days"
                    gradient="from-purple-500 to-pink-400"
                />
                <QuickStatCard
                    icon={<Activity size={24} />}
                    label="Daily Streak"
                    value={`${userStreak} days`}
                    change="Keep going!"
                    gradient="from-amber-500 to-orange-400"
                />
            </div>

            {/* Dashboard Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
                {['overview', 'applications', 'preparation', 'analytics'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Readiness & Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Readiness Score Card */}
                        <div className="glass-card p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap size={80} className="text-amrita-maroon" />
                            </div>

                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Placement Readiness</h3>

                            <div className="relative w-44 h-44">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle className="text-gray-100 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle
                                        className="text-amrita-maroon transition-all duration-1000 ease-out"
                                        strokeWidth="8"
                                        strokeDasharray={2 * Math.PI * 40}
                                        strokeDashoffset={2 * Math.PI * 40 * (1 - stats.readinessScore / 100)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-amrita-maroon">{Math.round(stats.readinessScore)}%</span>
                                    <span className="text-xs font-black text-gray-400 uppercase mt-1">Ready</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <h4 className="text-lg font-black text-gray-800 dark:text-white">
                                    {stats.readinessScore >= 80 ? '🔥 Excellent!' : stats.readinessScore >= 60 ? '💪 Good Progress' : '🚀 Keep Going'}
                                </h4>
                            </div>
                        </div>

                        {/* Skill Progress */}
                        <div className="glass-card p-8">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                    <Cpu className="text-amrita-maroon" size={20} />
                                </div>
                                Skill Progress
                            </h3>
                            <SkillProgress skills={stats.skills} />
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Target Skills</p>
                                        <p className="font-bold text-gray-900 dark:text-white">5/8 completed</p>
                                    </div>
                                    <a href="/skills" className="text-sm text-amrita-maroon hover:underline font-bold">
                                        Add more →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Tracker */}
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                    <FileText className="text-amrita-maroon" size={20} />
                                </div>
                                Application Tracker
                            </h2>
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Filter size={16} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Download size={16} />
                                </button>
                                <a href="/applications" className="text-xs font-black bg-amrita-maroon/10 text-amrita-maroon px-4 py-2 rounded-full uppercase tracking-widest hover:bg-amrita-maroon hover:text-white transition-all">
                                    View All
                                </a>
                            </div>
                        </div>

                        {applications.length > 0 ? (
                            <div className="space-y-3">
                                {applications.map((app, i) => (
                                    <ApplicationCard
                                        key={i}
                                        application={app}
                                        getStatusColor={getStatusColor}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                                <Briefcase size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">No applications yet</p>
                                <p className="text-sm">Start applying to placement drives!</p>
                                <a href="/drives" className="mt-4 btn-premium !text-sm !py-2 !px-6">
                                    Browse Drives
                                </a>
                            </div>
                        )}

                        {/* Application Stats */}
                        <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <MiniStat label="Applied" value={stats.applications?.total} color="maroon" icon={<Send size={14} />} />
                            <MiniStat label="In Progress" value={stats.applications?.inProgress} color="blue" icon={<Clock size={14} />} />
                            <MiniStat label="Offers" value={stats.applications?.offered} color="green" icon={<Trophy size={14} />} />
                            <MiniStat label="Rejected" value={stats.applications?.rejected} color="red" icon={<XCircle size={14} />} />
                        </div>
                    </div>

                    {/* Upcoming Drives */}
                    <section className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                    <CalendarDays className="text-amrita-maroon" size={20} />
                                </div>
                                Upcoming Drives
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search drives..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amrita-maroon"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <a href="/drives" className="text-xs font-black text-amrita-maroon hover:underline uppercase tracking-widest flex items-center gap-1">
                                    View All <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredDrives.map((drive, i) => (
                                <DriveCard
                                    key={i}
                                    drive={drive}
                                    handleApply={handleApply}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Placement Countdown */}
                    <PlacementCountdown />
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Daily Challenge */}
                    <DailyChallenge streak={userStreak} />

                    {/* Tip of the Day */}
                    <div className="glass-card p-6 bg-gradient-to-br from-amrita-gold/20 to-transparent">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="text-amrita-gold" size={20} />
                            <h3 className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-widest">Tip of the Day</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                            {dailyTips[currentTip]}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-1">
                                {dailyTips.map((_, i) => (
                                    <div key={i} className={`h-1 rounded-full w-6 transition-all ${i === currentTip ? 'bg-amrita-gold' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                ))}
                            </div>
                            <button className="text-xs text-amrita-gold hover:underline font-bold">
                                Save tip
                            </button>
                        </div>
                    </div>

                    {/* AI Assistant */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-amrita-maroon to-amrita-pink rounded-2xl">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Brain className="text-white" size={22} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest">Placement AI</h3>
                                <p className="text-white/70 text-[10px] font-bold">Your Career Advisor</p>
                            </div>
                        </div>
                        <div className="h-[350px] overflow-hidden rounded-2xl">
                            <AIChatbot />
                        </div>
                    </div>

                    {/* Interview Schedule */}
                    <InterviewSchedule />

                    {/* Resource Recommendations */}
                    <ResourceRecommendations stats={stats.resources} />

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <QuickActionCard
                            icon={<Video size={18} />}
                            title="Mock Interview"
                            description="Schedule now"
                            color="purple"
                            href="/mock-interview"
                        />
                        <QuickActionCard
                            icon={<BookOpen size={18} />}
                            title="Prep Material"
                            description="Study resources"
                            color="blue"
                            href="/resources"
                        />
                        <QuickActionCard
                            icon={<Users size={18} />}
                            title="Alumni Connect"
                            description="Network now"
                            color="green"
                            href="/alumni"
                        />
                        <QuickActionCard
                            icon={<BarChart3 size={18} />}
                            title="Analytics"
                            description="View insights"
                            color="amber"
                            href="/analytics"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Achievement Badges */}
                <div className="glass-card p-6">
                    <h3 className="font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
                        <Trophy className="text-amrita-gold" size={18} />
                        Your Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {stats.profile?.achievements?.map((achievement, i) => (
                            <span key={i} className="achievement-badge">
                                {achievement.includes('Profile') && '🎯 '}
                                {achievement.includes('First') && '📝 '}
                                {achievement.includes('Streak') && '🔥 '}
                                {achievement}
                            </span>
                        ))}
                        <button className="achievement-badge !bg-transparent !border-dashed border-2 !text-gray-400 hover:!border-amrita-maroon hover:!text-amrita-maroon">
                            + Explore more
                        </button>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="glass-card p-6">
                    <h3 className="font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
                        <TrendingUp className="text-amrita-gold" size={18} />
                        Performance Metrics
                    </h3>
                    <div className="space-y-4">
                        <MetricItem label="Profile Views" value="124" change="+12%" positive />
                        <MetricItem label="Application Rate" value="68%" change="+5%" positive />
                        <MetricItem label="Interview Success" value="42%" change="-3%" positive={false} />
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="glass-card p-6">
                    <h3 className="font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
                        <Clock3 className="text-amrita-gold" size={18} />
                        Upcoming Deadlines
                    </h3>
                    <div className="space-y-3">
                        <DeadlineItem company="Google" deadline="Mar 15" type="application" />
                        <DeadlineItem company="Microsoft" deadline="Mar 22" type="drive" />
                        <DeadlineItem company="Amazon" deadline="Apr 5" type="test" />
                    </div>
                </div>
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

const ApplicationCard = ({ application, getStatusColor }) => (
    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-700/50 transition-all group cursor-pointer hover:shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                {application.driveId?.companyName?.[0] || 'C'}
            </div>
            <div>
                <h4 className="font-black text-gray-900 dark:text-white">{application.driveId?.companyName}</h4>
                <p className="text-sm text-gray-500 font-medium">{application.driveId?.jobProfile}</p>
                <p className="text-xs text-gray-400 mt-1">
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(application.status)}`}>
                {application.status?.replace('_', ' ')}
            </span>
            <ChevronRight className="text-gray-400 group-hover:text-amrita-maroon transition-colors" size={18} />
        </div>
    </div>
);

const DriveCard = ({ drive, handleApply }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all group hover:scale-[1.02]">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                {drive.companyName[0]}
            </div>
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-gray-900 dark:text-white text-lg">{drive.companyName}</h4>
                    {drive.ctcDetails?.ctc && (
                        <span className="text-[10px] font-black text-white bg-gradient-to-r from-amrita-maroon to-amrita-pink px-2 py-0.5 rounded-full">
                            ₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L
                        </span>
                    )}
                    <span className="text-[10px] font-medium text-gray-500">
                        <MapPin size={10} className="inline mr-1" />
                        {drive.location}
                    </span>
                </div>
                <p className="text-sm text-gray-500 font-bold">{drive.jobProfile}</p>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-medium text-gray-500">
                        Min CGPA: {drive.eligibility?.minCgpa || 'N/A'}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                        Backlogs: {drive.eligibility?.backlog || '0'}
                    </span>
                </div>
            </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase">Date</p>
                <p className="font-black text-gray-900 dark:text-white">{new Date(drive.date).toLocaleDateString()}</p>
            </div>
            {drive.isEligible ? (
                drive.hasApplied ? (
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full flex items-center gap-1">
                        <CheckCircle size={14} /> Applied
                    </span>
                ) : (
                    <button
                        onClick={() => handleApply(drive._id)}
                        className="btn-premium text-xs !py-2 !px-4 hover:scale-105 transition-transform"
                    >
                        Apply Now
                    </button>
                )
            ) : (
                <div className="text-right">
                    <p className="text-[10px] font-black text-red-500 uppercase">Not Eligible</p>
                    <p className="text-xs text-gray-500">Check criteria</p>
                </div>
            )}
        </div>
    </div>
);

const MiniStat = ({ label, value, color, icon }) => {
    const colors = {
        maroon: 'text-amrita-maroon bg-amrita-maroon/10',
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
        red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
        <div className={`text-center p-4 rounded-xl ${colors[color]} transition-all hover:scale-105 cursor-default`}>
            <div className="flex items-center justify-center gap-2 mb-2">
                {icon}
                <p className="text-2xl font-black">{value}</p>
            </div>
            <p className="text-[10px] font-bold uppercase">{label}</p>
        </div>
    );
};

const QuickActionCard = ({ icon, title, description, color, href }) => {
    const colorClasses = {
        purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200',
        green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200'
    };

    return (
        <a href={href} className={`${colorClasses[color]} p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 hover:shadow-lg`}>
            <div className="p-2 rounded-full bg-white/50 mb-2">
                {icon}
            </div>
            <h4 className="font-bold text-sm">{title}</h4>
            <p className="text-xs opacity-75 mt-1">{description}</p>
        </a>
    );
};

const MetricItem = ({ label, value, change, positive }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">{value}</span>
            <span className={`text-xs font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {positive ? '↗' : '↘'} {change}
            </span>
        </div>
    </div>
);

const DeadlineItem = ({ company, deadline, type }) => {
    const typeIcons = {
        application: <Send size={12} />,
        drive: <Calendar size={12} />,
        test: <FileText size={12} />
    };

    const daysLeft = Math.ceil((new Date(`2026-${deadline}`) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                    {typeIcons[type]}
                </div>
                <div>
                    <p className="font-medium text-sm">{company}</p>
                    <p className="text-xs text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-sm">{deadline}</p>
                <p className="text-xs text-gray-500">{daysLeft} days left</p>
            </div>
        </div>
    );
};

export default StudentDashboard;