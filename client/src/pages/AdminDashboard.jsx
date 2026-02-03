import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, Users, Briefcase, BookOpen, Search, ShieldCheck, TrendingUp, Sparkles,
    Filter, ChevronRight, Download, Calendar, Building2, GraduationCap, Award, Plus,
    Edit, Trash2, Eye, CheckCircle, XCircle, BarChart3, PieChart, ArrowUpRight, UserPlus,
    Clock, Bell, Activity, Target, Zap, FileText, Upload, RefreshCw, Settings,
    AlertCircle, ArrowRight, Megaphone, TrendingDown, DollarSign, Timer
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        studentCount: 0, driveCount: 0, alumniCount: 0,
        placedStudents: 0, placementPercentage: 0,
        recentDrives: [], departmentStats: [], placementStats: [], ctcStats: {}
    });
    const [students, setStudents] = useState([]);
    const [shortlist, setShortlist] = useState([]);
    const [filters, setFilters] = useState({ minCgpa: 7.0, maxBacklogs: 0, department: '', search: '' });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

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

    useEffect(() => {
        fetchStats();
        fetchStudents();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/stats`);
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setStats({
                studentCount: 65, driveCount: 15, alumniCount: 8,
                placedStudents: 12, inProcessStudents: 18, placementPercentage: 18.5,
                recentDrives: [
                    { companyName: 'Google', jobProfile: 'SDE L3', date: '2026-03-15', status: 'upcoming', ctcDetails: { ctc: 4500000 } },
                    { companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', status: 'upcoming', ctcDetails: { ctc: 4200000 } },
                    { companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', status: 'upcoming', ctcDetails: { ctc: 4000000 } },
                ],
                departmentStats: [
                    { _id: 'CSE', count: 40, avgCgpa: 8.2, placed: 8 },
                    { _id: 'ECE', count: 15, avgCgpa: 8.0, placed: 3 },
                    { _id: 'EEE', count: 10, avgCgpa: 7.8, placed: 1 }
                ],
                placementStats: [
                    { _id: 'placed', count: 12 },
                    { _id: 'in_process', count: 18 },
                    { _id: 'not_placed', count: 35 }
                ],
                ctcStats: { avgCTC: 1800000, maxCTC: 5000000, minCTC: 350000 }
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

    const handleShortlist = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/shortlist`, filters);
            setShortlist(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleExport = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/export/students`);
            const dataStr = JSON.stringify(res.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'students_export.json';
            link.click();
        } catch (err) {
            console.error(err);
            alert('Export failed');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            placed: 'status-badge status-placed',
            in_process: 'status-badge status-in-process',
            not_placed: 'status-badge status-not-placed'
        };
        return badges[status] || badges.not_placed;
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
            <div className="announcement-bar rounded-2xl overflow-hidden">
                <div className="flex items-center">
                    <div className="bg-white/20 px-4 py-3 flex items-center gap-2 border-r border-white/20">
                        <Activity size={18} className="animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-widest">Live</span>
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="animate-ticker py-3 px-4">
                            {[...liveMetrics, ...liveMetrics].map((item, i) => (
                                <span key={i} className="whitespace-nowrap mx-8 font-bold text-sm">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Center Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amrita-maroon via-amrita-pink to-amrita-rose p-8 lg:p-10">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="text-amrita-gold" size={20} />
                            <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">CIR Command Center</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                            Admin <span className="text-amrita-gold">Intelligence</span> Dashboard
                        </h1>
                        <p className="text-white/70 font-medium mt-2">Comprehensive placement analytics and management</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleExport} className="glass-card !bg-white/20 !border-white/30 px-5 py-3 font-bold text-white flex items-center gap-2 hover:!bg-white/30 transition-all">
                            <Download size={18} /> Export
                        </button>
                        <button className="btn-premium !bg-white !text-amrita-maroon flex items-center gap-2">
                            <UserPlus size={18} /> Add Student
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                {['overview', 'students', 'drives', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${activeTab === tab
                                ? 'bg-amrita-maroon text-white shadow-lg'
                                : 'text-gray-500 hover:text-amrita-maroon hover:bg-white dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab}
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
                            color="pink"
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
                        <QuickActionCard icon={<Plus />} label="Create Drive" color="pink" />
                        <QuickActionCard icon={<Upload />} label="Bulk Upload" color="rose" />
                        <QuickActionCard icon={<Download />} label="Export Report" color="gold" />
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Placement Status */}
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                    <PieChart className="text-amrita-maroon" size={20} />
                                </div>
                                Placement Status
                            </h3>

                            {/* Visual Progress */}
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
                                            <span className="text-3xl font-black text-amrita-maroon">{stats.placementPercentage}%</span>
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
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                    <BarChart3 className="text-amrita-maroon" size={20} />
                                </div>
                                Department Overview
                            </h3>
                            <div className="space-y-4">
                                {stats.departmentStats?.map((dept, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-amrita-maroon/5 transition-all">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-black text-gray-900 dark:text-white text-lg">{dept._id}</span>
                                            <span className="text-xs font-black text-white bg-amrita-maroon px-3 py-1 rounded-full">
                                                {dept.count} students
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Avg CGPA: <span className="font-black text-amrita-maroon">{dept.avgCgpa?.toFixed(2)}</span></span>
                                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-amrita-maroon to-amrita-pink" style={{ width: `${(dept.count / stats.studentCount) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTC Stats */}
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                                <div className="p-2 bg-amrita-gold/20 rounded-xl">
                                    <Award className="text-amrita-gold" size={20} />
                                </div>
                                CTC Statistics
                            </h3>

                            <div className="space-y-6">
                                <div className="text-center p-6 bg-gradient-to-br from-amrita-maroon to-amrita-pink rounded-2xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 opacity-20">
                                        <DollarSign size={80} />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">Highest Package</p>
                                    <p className="text-5xl font-black mt-2">₹{((stats.ctcStats?.maxCTC || 0) / 100000).toFixed(1)}L</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Average</p>
                                        <p className="text-2xl font-black text-amrita-maroon mt-1">₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Minimum</p>
                                        <p className="text-2xl font-black text-gray-600 dark:text-gray-400 mt-1">₹{((stats.ctcStats?.minCTC || 0) / 100000).toFixed(1)}L</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lower Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shortlist Engine */}
                        <div className="glass-card p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amrita-maroon/10 rounded-2xl">
                                    <Filter className="text-amrita-maroon" size={22} />
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
                                <button onClick={handleShortlist} className="w-full btn-premium py-4 flex items-center justify-center gap-2">
                                    <Sparkles size={20} /> Execute Shortlist
                                </button>
                            </div>
                        </div>

                        {/* Shortlist Results & Drives */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shortlist Results */}
                            <section className="glass-card p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                            <Users className="text-amrita-maroon" size={20} />
                                        </div>
                                        Shortlisted Candidates
                                    </h2>
                                    <span className="text-xs font-black bg-amrita-maroon/10 text-amrita-maroon px-4 py-2 rounded-full uppercase">
                                        {shortlist.length} Records
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Roll No</th>
                                                <th>Dept</th>
                                                <th>CGPA</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shortlist.length > 0 ? shortlist.slice(0, 8).map((student, i) => (
                                                <tr key={i} className="group">
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-xl flex items-center justify-center font-black">
                                                                {student.firstName?.[0]}{student.lastName?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                                                                <p className="text-[10px] text-gray-400">{student.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-600 dark:text-gray-400">{student.rollNumber}</td>
                                                    <td className="text-sm font-bold uppercase">{student.department}</td>
                                                    <td className="font-black text-amrita-maroon">{student.cgpa?.toFixed(2)}</td>
                                                    <td><span className={getStatusBadge(student.placementStatus)}>{student.placementStatus?.replace('_', ' ')}</span></td>
                                                    <td>
                                                        <button className="p-2 hover:bg-amrita-maroon/10 rounded-lg text-amrita-maroon transition-all">
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-gray-400 font-bold">
                                                        <Filter size={40} className="mx-auto mb-4 opacity-20" />
                                                        <p>No query executed yet</p>
                                                        <p className="text-sm">Use the filter to shortlist students</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Upcoming Drives */}
                            <section className="glass-card p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                            <Calendar className="text-amrita-maroon" size={20} />
                                        </div>
                                        Upcoming Drives
                                    </h2>
                                    <button className="text-xs font-black text-amrita-maroon hover:underline uppercase flex items-center gap-1">
                                        Manage <ArrowRight size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stats.recentDrives?.map((drive, i) => (
                                        <div key={i} className="p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-xl flex items-center justify-center font-black text-lg">
                                                        {drive.companyName?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                                        <p className="text-xs text-gray-500">{drive.jobProfile}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar size={14} />
                                                    {new Date(drive.date).toLocaleDateString()}
                                                </div>
                                                {drive.ctcDetails?.ctc && (
                                                    <span className="text-sm font-black text-amrita-maroon">
                                                        ₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <section className="glass-card p-8">
                        <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                            <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                                <Clock className="text-amrita-maroon" size={20} />
                            </div>
                            Recent Activity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl relative timeline-item">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{activity.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {activeTab === 'students' && (
                <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black dark:text-white">All Students</h2>
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
                            <button onClick={fetchStudents} className="btn-premium">Search</button>
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
                                {students.slice(0, 20).map((student, i) => (
                                    <tr key={i}>
                                        <td className="font-bold text-gray-600 dark:text-gray-400">{student.rollNumber}</td>
                                        <td className="font-black text-gray-900 dark:text-white">{student.firstName} {student.lastName}</td>
                                        <td className="font-bold uppercase">{student.department}</td>
                                        <td className="font-black text-amrita-maroon">{student.cgpa?.toFixed(2)}</td>
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
                <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black dark:text-white">Placement Drives</h2>
                        <button className="btn-premium flex items-center gap-2">
                            <Plus size={18} /> Add Drive
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.recentDrives?.map((drive, i) => (
                            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-xl flex items-center justify-center font-black text-xl">
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
                                        <span className="font-black text-amrita-maroon">₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L</span>
                                    )}
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
                            <p className="text-5xl font-black text-amrita-maroon">{stats.placementPercentage}%</p>
                            <p className="text-sm text-gray-500 mt-2 font-bold">Placement Rate</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <p className="text-5xl font-black text-amrita-gold">₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
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
                    <div className="glass-card p-8">
                        <h3 className="font-black text-lg mb-6 dark:text-white">Detailed Analytics</h3>
                        <div className="text-center py-12">
                            <BarChart3 size={60} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-bold">Interactive charts and advanced analytics coming soon</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const Trophy = () => <Award />;

const StatCard = ({ icon, label, value, subtext, color, trend }) => {
    const colors = {
        maroon: 'from-amrita-maroon to-amrita-pink',
        pink: 'from-amrita-pink to-amrita-rose',
        green: 'from-green-500 to-green-400',
        gold: 'from-amrita-gold to-yellow-400',
    };

    return (
        <div className="glass-card p-6 flex items-center gap-5 overflow-hidden relative group hover:shadow-xl transition-all">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
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
    const colors = {
        maroon: 'hover:bg-amrita-maroon hover:text-white text-amrita-maroon',
        pink: 'hover:bg-amrita-pink hover:text-white text-amrita-pink',
        rose: 'hover:bg-amrita-rose hover:text-white text-amrita-rose',
        gold: 'hover:bg-amrita-gold hover:text-gray-900 text-amrita-gold',
    };

    return (
        <button className={`quick-action ${colors[color]} w-full`}>
            <div className="p-3 bg-current/10 rounded-xl mb-2">
                {icon}
            </div>
            <span className="text-xs font-black uppercase tracking-wider">{label}</span>
        </button>
    );
};

export default AdminDashboard;
