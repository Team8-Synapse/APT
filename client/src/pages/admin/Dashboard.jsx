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
import { useNavigate } from 'react-router-dom';

// Import Administrative Components
import AddDriveModal from '../../components/admin/AddDriveModal';
import StudentDetailModal from '../../components/admin/StudentDetailModal';
import AddAlumniModal from '../../components/admin/AddAlumniModal';
import KanbanBoard from '../../components/admin/KanbanBoard';
import AdminPrepHub from './AdminPrepHub';
import AdminAnalytics from './AdminAnalytics';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AddEventModal from '../../components/admin/AddEventModal';
import NotificationsPanel from '../../components/NotificationsPanel';

import AdminReports from './AdminReports';
import AdminTickerManager from './AdminTickerManager';
import CompanyLogo from '../../components/CompanyLogo'; // Added for drives UI

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
        title: '', description: '', category: 'Coding', type: 'Link', link: '', content: '', tags: ''
    });
    const [newAnnouncement, setNewAnnouncement] = useState({ content: '', links: [{ title: '', url: '' }] });
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [editingResource, setEditingResource] = useState(null);

    // Drive Management State
    const [allDrives, setAllDrives] = useState([]);
    const [viewingDrive, setViewingDrive] = useState(null); // Drive selected for Kanban
    const [driveApplications, setDriveApplications] = useState([]);
    const [showAddDriveModal, setShowAddDriveModal] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState(null); // For editing drive details

    // Student Detail Modal (Applicants View)
    const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Alumni Modal State
    const [showAddAlumniModal, setShowAddAlumniModal] = useState(false);

    const [editingAlumni, setEditingAlumni] = useState(null);
    const [alumniSearch, setAlumniSearch] = useState('');
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [selectedEventDate, setSelectedEventDate] = useState('');

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Recent activities
    const recentActivities = [
        { type: 'placement', message: 'Rahul Kumar placed at Microsoft', time: '2 hours ago', icon: <Trophy /> },
        { type: 'application', message: '15 new applications for Google drive', time: '4 hours ago', icon: <FileText /> },
        { type: 'drive', message: 'Amazon drive scheduled for March 22', time: '1 day ago', icon: <Calendar /> },
        { type: 'update', message: 'CTC statistics updated', time: '2 days ago', icon: <RefreshCw /> },
    ];

    // Calendar events
    // const calendarData = fetched dynamically now

    useEffect(() => {
        fetchStats();
        fetchStudents();
        fetchCompanies();
        fetchAnnouncements();
        fetchAlumni();
        fetchAlumni();
        fetchAllDrives();
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/schedule`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCalendarEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

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
            setAlumni([]);
        }
    };

    const handleDeleteAlumni = async (id) => {
        if (!window.confirm('Are you sure you want to remove this alumni member?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/member/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchAlumni();
        } catch (err) {
            console.error(err);
            alert('Failed to delete alumni');
        }
    };

    const handleEditAlumni = (alum) => {
        setEditingAlumni(alum);
        setShowAddAlumniModal(true);
    };

    const fetchAllDrives = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drives`);
            setAllDrives(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDriveApplications = async (driveId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive/${driveId}/applications`);
            setDriveApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewApplicants = (drive) => {
        setViewingDrive(drive);
        fetchDriveApplications(drive._id);
    };

    const handleEditDrive = (drive) => {
        setSelectedDrive(drive);
        setShowAddDriveModal(true);
    };



    const handleDeleteDrive = async (id) => {
        if (!window.confirm('Are you sure you want to delete this drive?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive/${id}`);
            fetchAllDrives();
            fetchStats(); // Update global stats
        } catch (err) {
            console.error(err);
            alert('Failed to delete drive');
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
                description: newResource.description,
                category: newResource.category,
                type: newResource.type,
                link: newResource.link,
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

            setNewResource({ title: '', description: '', category: 'Coding', type: 'Link', link: '', content: '', tags: '' });
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
            description: res.description || '',
            link: res.links?.[0] || res.link || '',
            content: res.content || '',
            tags: res.tags?.join(', ') || ''
        });
    };

    // Duplicate removed

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editingAnnouncement) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements/${editingAnnouncement._id}`, newAnnouncement, { headers });
                alert('Announcement updated!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`, newAnnouncement, { headers });
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
            <AdminNavbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                logout={logout}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                stats={stats}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Command Center Stats - Only show on Dashboard/Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickStatCard
                        icon={<Users size={24} />}
                        label="2026 Batch Strength"
                        value={stats.studentCount}
                        change="+5 this week"
                        gradient="from-[#8A0F3C] to-[#6E0B30]"
                    />
                    <QuickStatCard
                        icon={<Briefcase size={24} />}
                        label="Active Drives"
                        value={stats.driveCount}
                        change={`${stats.recentDrives?.length || 0} upcoming`}
                        gradient="from-[#8A0F3C] to-[#6E0B30]"
                    />
                    <QuickStatCard
                        icon={<CheckCircle size={24} />}
                        label="Placed Students"
                        value={stats.placedStudents}
                        change={`${stats.placementPercentage}% placed`}
                        gradient="from-[#8A0F3C] to-[#6E0B30]"
                    />
                    <QuickStatCard
                        icon={<DollarSign size={24} />}
                        label="Highest Package"
                        value={`₹${(stats.ctcStats?.maxCTC / 100000 || 0).toFixed(1)}L`}
                        change="This season"
                        gradient="from-[#8A0F3C] to-[#6E0B30]"
                    />
                </div>
            )}

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
                                        2026 Department Overview
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.departmentStats?.slice(0, 3).map((dept, i) => (
                                            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-black text-gray-900 dark:text-white">{dept._id}</span>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold text-gray-500 block">
                                                            {dept.placed}/{dept.count} Placed
                                                        </span>
                                                        <span className="text-xs font-black text-amrita-maroon">{(dept.placementPercentage || 0).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amrita-maroon" style={{ width: `${dept.placementPercentage || 0}%` }} />
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
                            {/* Calendar */}
                            <CalendarComponent
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                calendarData={calendarEvents}
                                onAddEvent={(date) => {
                                    setSelectedEventDate(date || new Date().toISOString().split('T')[0]);
                                    setShowAddEventModal(true);
                                }}
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
                    <div className="lg:col-span-3 animate-fade-in-up">
                        <AdminReports />
                    </div>
                )}

                {activeTab === 'ticker' && (
                    <div className="lg:col-span-3">
                        <AdminTickerManager />
                    </div>
                )}

                {activeTab === 'drives' && (
                    <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
                        {viewingDrive ? (
                            <div className="glass-card p-8 h-[calc(100vh-200px)] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <button
                                            onClick={() => setViewingDrive(null)}
                                            className="text-sm font-bold text-gray-500 hover:text-amrita-maroon flex items-center gap-1 mb-2"
                                        >
                                            <ChevronLeft size={16} /> Back to Drives
                                        </button>
                                        <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                            {viewingDrive.companyName} <span className="text-gray-400 text-lg font-bold">| Applicants Manager</span>
                                        </h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold">
                                            Total: {driveApplications.length}
                                        </div>
                                    </div>
                                </div>
                                <KanbanBoard
                                    applications={driveApplications}
                                    driveId={viewingDrive._id}
                                    fetchApplications={() => fetchDriveApplications(viewingDrive._id)}
                                    onViewStudent={(student) => {
                                        setSelectedStudent(student);
                                        setShowStudentDetailModal(true);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="glass-card p-8 !bg-white dark:!bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-[2rem]">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black dark:text-white text-gray-900 tracking-tight">
                                            Placement Drives
                                        </h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <p className="text-sm text-gray-500 font-bold">
                                                {(allDrives.length || stats.recentDrives?.length || 0)} active drives
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedDrive(null); setShowAddDriveModal(true); }}
                                        className="bg-[#A4123F] hover:bg-[#8B0000] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amrita-maroon/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        <Plus size={20} /> Add New Drive
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {(allDrives.length > 0 ? allDrives : stats.recentDrives)?.map((drive, i) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-amrita-maroon/5 transition-all duration-300 group overflow-hidden flex flex-col relative w-full">

                                            {/* Status Badge Absolute */}
                                            <div className="absolute top-6 right-6 z-10">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${drive.status === 'upcoming'
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                                                    : drive.status === 'ongoing'
                                                        ? 'bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-300'
                                                        : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {drive.status === 'upcoming' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                                    {drive.status === 'ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                                    {drive.status}
                                                </span>
                                            </div>

                                            <div className="p-7 flex-1 flex flex-col">
                                                {/* Header: Logo */}
                                                <div className="mb-4">
                                                    <div className="w-16 h-16 rounded-2xl p-1 bg-white shadow-lg border border-gray-50 mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                                                        <CompanyLogo name={drive.companyName} size="md" className="rounded-xl w-full h-full object-contain" />
                                                    </div>

                                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-amrita-maroon transition-colors line-clamp-1" title={drive.companyName}>
                                                        {drive.companyName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 font-bold line-clamp-1" title={drive.jobProfile}>
                                                        {drive.jobProfile}
                                                    </p>

                                                    {drive.jobType && (
                                                        <div className="mt-3 flex gap-2">
                                                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 rounded-lg text-[10px] uppercase font-black tracking-wider">
                                                                {drive.jobType}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 mt-auto">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">Date</p>
                                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                                            {new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">CTC</p>
                                                        <p className="text-sm font-black text-[#16a34a]">
                                                            ₹{(drive.ctcDetails?.ctc / 100000).toFixed(1)}L
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">Applicants</p>
                                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                                                            {drive.registeredStudents?.length || 0}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">Min CGPA</p>
                                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                                                            {drive.eligibility?.minCgpa || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 flex gap-3 border-t border-gray-100 dark:border-gray-700 backdrop-blur-sm mt-auto">
                                                <button
                                                    onClick={() => handleViewApplicants(drive)}
                                                    className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md h-10"
                                                >
                                                    <Users size={14} strokeWidth={2.5} /> Applicants
                                                </button>
                                                <button
                                                    onClick={() => handleEditDrive(drive)}
                                                    className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-400 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md h-10"
                                                >
                                                    <Edit3 size={14} strokeWidth={2.5} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDrive(drive._id)}
                                                    className="px-4 bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center group-hover:shadow-md h-10"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            <button
                                onClick={() => {
                                    setEditingAlumni(null);
                                    setShowAddAlumniModal(true);
                                }}
                                className="btn-premium flex items-center gap-2 !py-2 !px-4 !text-xs"
                            >
                                <Plus size={14} /> Add Alumni Member
                            </button>
                        </div>


                        {/* Search Bar */}
                        <div className="mb-8 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by company..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-amrita-maroon/20 text-sm transition-all"
                                value={alumniSearch}
                                onChange={(e) => setAlumniSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {alumni
                                .filter(a =>
                                    (a.company?.toLowerCase() || '').includes(alumniSearch.toLowerCase()) ||
                                    (a.name?.toLowerCase() || '').includes(alumniSearch.toLowerCase())
                                )
                                .map((alum, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[20px] shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group relative flex flex-col items-center text-center">

                                        {/* Actions */}
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <button
                                                onClick={() => handleEditAlumni(alum)}
                                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-amrita-maroon hover:bg-amrita-maroon hover:text-white transition-colors shadow-sm"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAlumni(alum._id)}
                                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Company Logo */}
                                        <div className="w-20 h-20 mb-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                            <CompanyLogo name={alum.company} />
                                        </div>

                                        {/* Details */}
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{alum.name}</h3>
                                        <p className="text-xs font-bold text-amrita-maroon uppercase tracking-wider mb-4 px-3 py-1 bg-amrita-maroon/5 rounded-full">
                                            {alum.role || 'Alumni'}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center px-2">
                                            <div className="flex flex-col items-start bg-gray-50 dark:bg-gray-800 p-2 rounded-lg min-w-[30%]">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">Batch</span>
                                                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{alum.batch}</span>
                                            </div>
                                            <div className="flex flex-col items-end bg-gray-50 dark:bg-gray-800 p-2 rounded-lg min-w-[30%]">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">Dept</span>
                                                <span className="text-xs font-black text-gray-700 dark:text-gray-300">{alum.department || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 w-full">
                                            <div className="text-xs font-bold text-gray-400 flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <Building2 size={12} /> {alum.company}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {alumni.filter(a => (a.company?.toLowerCase() || '').includes(alumniSearch.toLowerCase())).length === 0 && (
                            <div className="py-12 text-center text-gray-400">
                                <p className="font-bold">No alumni found.</p>
                            </div>
                        )}
                    </div>
                )
                }



                {
                    activeTab === 'schedule' && (
                        <div className="lg:col-span-3 animate-fade-in-up">
                            <div className="glass-card p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                                            <Calendar className="text-amrita-maroon" /> Placement Schedule
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">Manage all drives, workshops, and events.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedEventDate(new Date().toISOString().split('T')[0]);
                                            setShowAddEventModal(true);
                                        }}
                                        className="bg-amrita-maroon text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Event
                                    </button>
                                </div>
                                <CalendarComponent
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    calendarData={calendarEvents}
                                    onAddEvent={(date) => {
                                        setSelectedEventDate(date || new Date().toISOString().split('T')[0]);
                                        setShowAddEventModal(true);
                                    }}
                                />
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {calendarEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map((event, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                                            <div className="p-3 bg-white rounded-lg shadow-sm text-amrita-maroon font-black text-center min-w-[60px]">
                                                <span className="text-xs block">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                                <span className="text-xl block">{new Date(event.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{event.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{event.type.toUpperCase()} • {event.time || 'All Day'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'announcements' && (
                        <div className="lg:col-span-3 glass-card p-8 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                                    <Megaphone className="text-amrita-maroon" size={24} />
                                    Communication Center
                                </h2>
                                <button
                                    onClick={() => {
                                        setEditingAnnouncement(null);
                                        setNewAnnouncement({ content: '', links: [{ title: '', url: '' }] });
                                        document.getElementById('announcement-form').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="btn-premium flex items-center gap-2 !py-2 !px-4 !text-xs"
                                >
                                    <Send size={14} /> New Announcement
                                </button>
                            </div>

                            {/* Announcement Form */}
                            <div id="announcement-form" className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                <h3 className="font-bold text-lg mb-4 dark:text-white">
                                    {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                                </h3>
                                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            Announcement Content *
                                        </label>
                                        <textarea
                                            value={newAnnouncement.content}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amrita-maroon text-sm"
                                            rows="3"
                                            placeholder="Enter announcement content (e.g., 🎉 Google hiring for SDE positions - Apply by March 15)"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            Links (Optional)
                                        </label>
                                        {newAnnouncement.links.map((link, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={link.title}
                                                    onChange={(e) => {
                                                        const updatedLinks = [...newAnnouncement.links];
                                                        updatedLinks[idx].title = e.target.value;
                                                        setNewAnnouncement({ ...newAnnouncement, links: updatedLinks });
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm"
                                                    placeholder="Link title"
                                                />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const updatedLinks = [...newAnnouncement.links];
                                                        updatedLinks[idx].url = e.target.value;
                                                        setNewAnnouncement({ ...newAnnouncement, links: updatedLinks });
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn-premium !py-2 !px-6 !text-sm"
                                        >
                                            {editingAnnouncement ? 'Update Announcement' : 'Post Announcement'}
                                        </button>
                                        {editingAnnouncement && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingAnnouncement(null);
                                                    setNewAnnouncement({ content: '', links: [{ title: '', url: '' }] });
                                                }}
                                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Announcements List */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg dark:text-white">Active Announcements</h3>
                                {announcements.length > 0 ? (
                                    announcements.map((ann, i) => (
                                        <div key={ann._id || i} className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ann.content}</p>
                                                    {ann.links && ann.links.length > 0 && ann.links[0].url && (
                                                        <div className="mt-2 flex gap-2 flex-wrap">
                                                            {ann.links.map((link, idx) => link.url && (
                                                                <a
                                                                    key={idx}
                                                                    href={link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-amrita-maroon hover:underline flex items-center gap-1"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                    {link.title || 'Link'}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] font-bold text-gray-400 mt-2 block">
                                                        {new Date(ann.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditAnnouncement(ann)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-amrita-maroon"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAnnouncementDelete(ann._id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <Megaphone size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No announcements yet</p>
                                        <p className="text-sm">Create your first announcement to communicate with students</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'analytics' && (
                        <div className="lg:col-span-3 animate-fade-in-up">
                            <AdminAnalytics />
                        </div>
                    )
                }



            </div>
            {/* Add Drive Modal */}
            < AddDriveModal
                isOpen={showAddDriveModal}
                onClose={() => setShowAddDriveModal(false)}
                editDrive={selectedDrive}
                onSuccess={() => { fetchAllDrives(); fetchStats(); }}
            />

            {/* Student Detail Modal */}
            {
                showStudentDetailModal && (
                    <StudentDetailModal
                        student={selectedStudent}
                        onClose={() => setShowStudentDetailModal(false)}
                    />
                )
            }

            {/* Add Alumni Modal */}
            <AddAlumniModal
                isOpen={showAddAlumniModal}
                onClose={() => setShowAddAlumniModal(false)}
                onRefresh={fetchAlumni}
                editAlumni={editingAlumni}
            />

            <AddEventModal
                isOpen={showAddEventModal}
                initialDate={selectedEventDate}
                onClose={() => setShowAddEventModal(false)}
                onSuccess={fetchSchedule}
            />
        </div >
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

const CalendarComponent = ({ currentDate, setCurrentDate, calendarData, onAddEvent }) => {
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
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg dark:text-white">Calendar</h3>
                    <button
                        onClick={() => onAddEvent()}
                        className="p-1.5 bg-amrita-maroon/10 text-amrita-maroon rounded-lg hover:bg-amrita-maroon hover:text-white transition-colors"
                        title="Add Event"
                    >
                        <Plus size={14} />
                    </button>
                </div>
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

                {daysArray.map((day, index) => {
                    const dateStr = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
                    return (
                        <div
                            key={index}
                            onClick={() => day && onAddEvent(dateStr)}
                            className={`min-h-20 p-1 border border-gray-100 dark:border-gray-700 rounded-lg ${day ? 'bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : ''}`}
                        >
                            {day && (
                                <>
                                    <div className="text-right mb-1">
                                        <span className={`text-sm font-bold ${getEventsForDay(day).length > 0 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {day}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {getEventsForDay(day).slice(0, 2).map((event, i) => (
                                            <div key={i} onClick={(e) => { e.stopPropagation(); /* Prevent trigger add on event click for now */ }} className={`text-xs p-1 rounded ${getEventColor(event.type)} text-white truncate`}>
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
                    )
                })}
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