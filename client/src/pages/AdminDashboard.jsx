import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, Users, Briefcase, BookOpen, Search, ShieldCheck, TrendingUp, Sparkles,
    Filter, ChevronRight, Download, Calendar, Building2, GraduationCap, Award, Plus,
    Edit, Trash2, Eye, CheckCircle, XCircle, BarChart3, PieChart, ArrowUpRight, UserPlus, Megaphone
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
    const [adminResources, setAdminResources] = useState([]);
    const [newResource, setNewResource] = useState({
        title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: ''
    });
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ content: '', links: [{ title: '', url: '' }] });
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchStudents();
        fetchAdminResources();
        fetchAnnouncements();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/stats`);
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Mock data
            setStats({
                studentCount: 65, driveCount: 15, alumniCount: 8,
                placedStudents: 12, inProcessStudents: 18, placementPercentage: 18.5,
                recentDrives: [
                    { companyName: 'Google', date: '2026-03-15', status: 'upcoming', ctcDetails: { ctc: 4500000 } },
                    { companyName: 'Microsoft', date: '2026-03-22', status: 'upcoming', ctcDetails: { ctc: 4200000 } },
                ],
                departmentStats: [
                    { _id: 'CSE', count: 40, avgCgpa: 8.2 },
                    { _id: 'ECE', count: 15, avgCgpa: 8.0 },
                    { _id: 'EEE', count: 10, avgCgpa: 7.8 }
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
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/resources`, payload);
            alert('Resource deployed successfully!');
            setNewResource({ title: '', category: 'Coding', type: 'Link', link: '', content: '', tags: '' });
            fetchAdminResources();
        } catch (err) {
            console.error(err);
            alert('Failed to deploy resource');
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        }
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
        <div className="space-y-10 page-enter pb-12 font-bold">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="text-amrita-maroon" size={20} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">CIR Central Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Admin <span className="text-gradient">Intelligence</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Comprehensive placement analytics and management dashboard</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                        <Download size={18} /> Export Data
                    </button>
                    <button className="btn-premium flex items-center gap-2">
                        <UserPlus size={18} /> Add Student
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                {['overview', 'students', 'drives', 'materials', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-black text-sm uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-amrita-maroon text-white' : 'text-gray-500 hover:text-amrita-maroon hover:bg-amrita-maroon/10'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Performance Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<Users />} label="Total Students" value={stats.studentCount} subtext="Batch 2026" color="maroon" />
                        <StatCard icon={<Briefcase />} label="Active Drives" value={stats.driveCount} subtext="15 companies" color="gold" />
                        <StatCard icon={<CheckCircle />} label="Placed Students" value={stats.placedStudents} subtext={`${stats.placementPercentage}% placed`} color="green" />
                        <StatCard icon={<TrendingUp />} label="Highest CTC" value={`₹${(stats.ctcStats?.maxCTC / 100000 || 0).toFixed(1)}L`} subtext="This season" color="purple" />
                    </div>

                    {/* Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Placement Status Chart */}
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2 dark:text-white">
                                <PieChart className="text-amrita-maroon" size={20} /> Placement Status
                            </h3>
                            <div className="space-y-4">
                                {stats.placementStats?.map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${stat._id === 'placed' ? 'bg-green-500' : stat._id === 'in_process' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                            <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{stat._id?.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${stat._id === 'placed' ? 'bg-green-500' : stat._id === 'in_process' ? 'bg-blue-500' : 'bg-gray-400'}`}
                                                    style={{ width: `${(stat.count / stats.studentCount) * 100}%` }}
                                                />
                                            </div>
                                            <span className="font-black text-gray-900 dark:text-white w-8">{stat.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Department Stats */}
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2 dark:text-white">
                                <BarChart3 className="text-amrita-maroon" size={20} /> Department Overview
                            </h3>
                            <div className="space-y-4">
                                {stats.departmentStats?.map((dept, i) => (
                                    <div key={i} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-black text-gray-900 dark:text-white">{dept._id}</span>
                                            <span className="text-[10px] font-black text-amrita-maroon bg-amrita-maroon/10 px-2 py-1 rounded-full">
                                                Avg: {dept.avgCgpa?.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>{dept.count} students</span>
                                            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amrita-maroon" style={{ width: `${(dept.count / stats.studentCount) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTC Stats */}
                        <div className="glass-card p-8">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-2 dark:text-white">
                                <Award className="text-amrita-gold" size={20} /> CTC Statistics
                            </h3>
                            <div className="space-y-6">
                                <div className="text-center p-6 bg-gradient-to-br from-amrita-maroon to-amrita-burgundy rounded-2xl text-white">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">Highest Package</p>
                                    <p className="text-4xl font-black mt-2">₹{((stats.ctcStats?.maxCTC || 0) / 100000).toFixed(1)}L</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Average</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Minimum</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">₹{((stats.ctcStats?.minCTC || 0) / 100000).toFixed(1)}L</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Drives & Shortlist */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shortlist Engine */}
                        <div className="glass-card p-8 space-y-6 h-fit lg:sticky lg:top-28">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amrita-maroon/10 rounded-2xl"><Filter className="text-amrita-maroon" /></div>
                                <h2 className="text-xl font-black dark:text-white">Shortlist Engine</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Minimum CGPA</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="input-field"
                                        value={filters.minCgpa}
                                        onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Max Backlogs</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={filters.maxBacklogs}
                                        onChange={(e) => setFilters({ ...filters, maxBacklogs: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-400">Department</label>
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
                                    <Sparkles size={20} /> EXECUTE SHORTLIST
                                </button>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="glass-card p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                        <Users className="text-amrita-maroon" /> SHORTLISTED CANDIDATES
                                    </h2>
                                    <span className="text-[10px] font-black bg-amrita-maroon/5 text-amrita-maroon px-4 py-1.5 rounded-full uppercase tracking-widest italic">
                                        {shortlist.length} Records Found
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
                                            {shortlist.length > 0 ? shortlist.slice(0, 10).map((student, i) => (
                                                <tr key={i} className="group">
                                                    <td className="font-black text-gray-900 dark:text-white">
                                                        {student.firstName} {student.lastName}
                                                        <p className="text-[10px] text-gray-400 font-medium">{student.email}</p>
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
                                                    <td colSpan="6" className="py-12 text-center text-gray-400 font-bold italic">
                                                        No query executed. Adjust filters and execute.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="glass-card p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                        <Calendar className="text-amrita-maroon" /> UPCOMING DRIVES
                                    </h2>
                                    <button className="text-xs font-black text-amrita-maroon hover:underline uppercase italic">Manage Drives</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {stats.recentDrives?.map((drive, i) => (
                                        <div key={i} className="p-5 bg-white/40 dark:bg-gray-800/40 border border-white dark:border-gray-700 rounded-2xl hover:bg-white/60 dark:hover:bg-gray-700/40 transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-black text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                                {drive.ctcDetails?.ctc && (
                                                    <span className="text-[10px] font-black text-amrita-gold bg-amrita-maroon px-2 py-1 rounded-full">
                                                        ₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(drive.date).toLocaleDateString()}</p>
                                                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${drive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {drive.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
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
                            <div key={i} className="p-6 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-amrita-maroon text-white rounded-xl flex items-center justify-center font-black text-lg">
                                        {drive.companyName?.[0]}
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${drive.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {drive.status}
                                    </span>
                                </div>
                                <h3 className="font-black text-lg text-gray-900 dark:text-white mb-2">{drive.companyName}</h3>
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
                            <p className="text-4xl font-black text-amrita-maroon">{stats.placementPercentage}%</p>
                            <p className="text-sm text-gray-500 mt-2">Placement Rate</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <p className="text-4xl font-black text-amrita-gold">₹{((stats.ctcStats?.avgCTC || 0) / 100000).toFixed(1)}L</p>
                            <p className="text-sm text-gray-500 mt-2">Average CTC</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <p className="text-4xl font-black text-green-600">{stats.placedStudents}</p>
                            <p className="text-sm text-gray-500 mt-2">Students Placed</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <p className="text-4xl font-black text-blue-600">{stats.driveCount}</p>
                            <p className="text-sm text-gray-500 mt-2">Companies Visited</p>
                        </div>
                    </div>
                    <div className="glass-card p-8">
                        <h3 className="font-black text-lg mb-6 dark:text-white">Detailed Analytics Coming Soon...</h3>
                        <p className="text-gray-500">Interactive charts and advanced analytics will be available here.</p>
                    </div>
                </div>
            )}

            {activeTab === 'materials' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Announcements Management */}
                        <div className="glass-card p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-amrita-maroon/10 rounded-2xl"><Megaphone className="text-amrita-maroon" /></div>
                                <div>
                                    <h2 className="text-xl font-black dark:text-black">Announcements</h2>
                                    <p className="text-xs text-gray-500 font-medium">Post updates for students in Prep Hub</p>
                                </div>
                            </div>

                            <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#5B081F]">Announcement Content</label>
                                    <textarea
                                        required
                                        className="input-field min-h-[120px]"
                                        placeholder="Enter announcement text here..."
                                        value={newAnnouncement.content}
                                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-black uppercase text-[#5B081F]">Quick Links (Optional)</label>
                                        <button
                                            type="button"
                                            onClick={() => setNewAnnouncement({ ...newAnnouncement, links: [...newAnnouncement.links, { title: '', url: '' }] })}
                                            className="text-[10px] font-black text-amrita-maroon hover:underline uppercase"
                                        >
                                            + Add Link
                                        </button>
                                    </div>
                                    {newAnnouncement.links.map((link, idx) => (
                                        <div key={idx} className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                className="input-field !py-2 text-xs"
                                                placeholder="Link Title"
                                                value={link.title}
                                                onChange={(e) => {
                                                    const newLinks = [...newAnnouncement.links];
                                                    newLinks[idx].title = e.target.value;
                                                    setNewAnnouncement({ ...newAnnouncement, links: newLinks });
                                                }}
                                            />
                                            <input
                                                type="url"
                                                className="input-field !py-2 text-xs"
                                                placeholder="https://..."
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...newAnnouncement.links];
                                                    newLinks[idx].url = e.target.value;
                                                    setNewAnnouncement({ ...newAnnouncement, links: newLinks });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button type="submit" className="btn-premium flex-1 py-4 flex items-center justify-center gap-2">
                                        {editingAnnouncement ? <><Edit size={20} /> UPDATE POST</> : <><Megaphone size={20} /> POST UPDATE</>}
                                    </button>
                                    {editingAnnouncement && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingAnnouncement(null);
                                                setNewAnnouncement({ content: '', links: [{ title: '', url: '' }] });
                                            }}
                                            className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm uppercase"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mt-8 space-y-4">
                                <h4 className="text-xs font-black uppercase text-gray-400">Recent Posts</h4>
                                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
                                    {announcements.map((ann, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 group relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm font-bold text-gray-800 line-clamp-2">{ann.content}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditAnnouncement(ann)} className="p-1.5 hover:bg-white rounded-lg text-blue-600 transition-all">
                                                        <Edit size={14} />
                                                    </button>
                                                    <button onClick={() => handleAnnouncementDelete(ann._id)} className="p-1.5 hover:bg-white rounded-lg text-red-600 transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {ann.links && ann.links.length > 0 && ann.links[0].url && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {ann.links.map((link, idx) => (
                                                        link.url && <span key={idx} className="text-[10px] font-black text-amrita-maroon italic">#{link.title || 'Link'}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-2">{new Date(ann.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add Resources Form */}
                        <div className="glass-card p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-amrita-maroon/10 rounded-2xl"><BookOpen className="text-amrita-maroon" /></div>
                                <div>
                                    <h2 className="text-xl font-black dark:text-black">Add Resources</h2>
                                    <p className="text-xs text-gray-500 font-medium">Provision elite training resources to the Prep Hub</p>
                                </div>
                            </div>

                            <form onSubmit={handleResourceSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-[#5B081F]">Resource Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="e.g. Advanced System Design"
                                            value={newResource.title}
                                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-[#5B081F]">Category</label>
                                        <select
                                            required
                                            className="input-field"
                                            value={newResource.category}
                                            onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                                        >
                                            <option value="Coding">Practice</option>
                                            <option value="Aptitude">Aptitude & Logic</option>
                                            <option value="Technical">Core Technical</option>
                                            <option value="HR">HR & Behavioral</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-[#5B081F]">Content Type</label>
                                        <select
                                            className="input-field"
                                            value={newResource.type}
                                            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                        >
                                            <option value="Link">External Link</option>
                                            <option value="PDF">PDF Document</option>
                                            <option value="PPT">PPT Presentation</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase text-[#5B081F]">Resource URL / Link</label>
                                        <input
                                            type="url"
                                            required
                                            className="input-field"
                                            placeholder="https://..."
                                            value={newResource.link}
                                            onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#5B081F]">Description</label>
                                    <textarea
                                        className="input-field min-h-[100px]"
                                        placeholder="Brief summary of the material..."
                                        value={newResource.content}
                                        onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-[#5B081F]">Search Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="dsa, java, oop..."
                                        value={newResource.tags}
                                        onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="btn-premium w-full py-4 flex items-center justify-center gap-2">
                                        <Plus size={20} /> PUBLISH RESOURCE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black dark:text-black mb-6">Active Resources</h3>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Tags</th>
                                        <th>Preview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminResources.map((res, i) => (
                                        <tr key={i}>
                                            <td className="font-black text-gray-900 dark:text-black-400">{res.title}</td>
                                            <td className="text-sm font-bold uppercase">{res.category}</td>
                                            <td><span className=" text-[12px] font-black">{res.type}</span></td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {res.tags?.map((t, idx) => (
                                                        <span key={idx} className="text-[12px] font-black text-amrita-maroon italic">#{t}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <button onClick={() => window.open(res.links?.[0] || res.link, '_blank')} className="p-2 hover:bg-amrita-maroon/10 rounded-lg text-amrita-maroon transition-all">
                                                    <Eye size={18} />
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
        </div >
    );
};

const StatCard = ({ icon, label, value, subtext, color }) => {
    const colors = {
        maroon: 'bg-amrita-maroon/10 text-amrita-maroon',
        gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };

    return (
        <div className="glass-card p-6 flex items-center gap-6 overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon, { size: 80 })}
            </div>
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{value}</h3>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
