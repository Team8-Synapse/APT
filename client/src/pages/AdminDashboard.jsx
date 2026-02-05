import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, Users, Briefcase, BookOpen, Search, ShieldCheck, TrendingUp, Sparkles,
    Filter, ChevronRight, Download, Calendar, Building2, GraduationCap, Award, Plus,
    Edit, Trash2, Eye, CheckCircle, XCircle, BarChart3, PieChart, ArrowUpRight, UserPlus, Linkedin, Mail
} from 'lucide-react';

import AddDriveModal from '../components/AddDriveModal';
import StudentDetailModal from '../components/StudentDetailModal';
import AddAlumniModal from '../components/AddAlumniModal';
import KanbanBoard from '../components/Admin/KanbanBoard';
import CompanyLogo from '../components/CompanyLogo';

const AdminDashboard = () => {
    // ... state ...
    const [stats, setStats] = useState({
        studentCount: 0, driveCount: 0, alumniCount: 0,
        placedStudents: 0, placementPercentage: 0,
        recentDrives: [], departmentStats: [], placementStats: [], ctcStats: {}
    });
    const [students, setStudents] = useState([]);
    const [drives, setDrives] = useState([]);
    const [shortlist, setShortlist] = useState([]);
    const [filters, setFilters] = useState({ minCgpa: 7.0, maxBacklogs: 0, department: '', search: '' });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editDrive, setEditDrive] = useState(null);
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [driveApplicants, setDriveApplicants] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isKanbanView, setIsKanbanView] = useState(false);
    const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
    const [selectedAlumniMember, setSelectedAlumniMember] = useState(null);
    const [alumniList, setAlumniList] = useState([]);

    // ... (methods) ...

    useEffect(() => {
        fetchStats();
        fetchStudents();
        fetchDrives();
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

    const fetchDrives = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drives`);
            setDrives(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchApplicants = async (driveId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive/${driveId}/applicants`);
            setDriveApplicants(res.data);
        } catch (err) {
            console.error(err);
            setDriveApplicants([]);
        }
    };

    const handleDeleteDrive = async (driveId) => {
        if (!window.confirm('Are you sure you want to delete this drive? This action cannot be undone.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive/${driveId}`);
            fetchStats();
            fetchDrives();
        } catch (err) {
            console.error(err);
            alert('Failed to delete drive');
        }
    };

    const handleStatusChange = async (driveId, newStatus) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive`, {
                _id: driveId,
                status: newStatus
            });
            fetchStats();
            fetchDrives();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const openEditModal = (drive) => {
        setEditDrive(drive);
        setIsModalOpen(true);
    };

    const openViewApplicants = async (drive) => {
        setSelectedDrive(drive);
        await fetchApplicants(drive._id);
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
                {['overview', 'students', 'drives', 'analytics', 'alumni'].map(tab => (
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
                                                        <button onClick={() => setSelectedStudent(student)} className="text-left hover:text-amrita-maroon transition-colors">
                                                            {student.firstName} {student.lastName}
                                                        </button>
                                                        <p className="text-[10px] text-gray-400 font-medium">{student.email}</p>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-600 dark:text-gray-400">{student.rollNumber}</td>
                                                    <td className="text-sm font-bold uppercase">{student.department}</td>
                                                    <td className="font-black text-amrita-maroon">{student.cgpa?.toFixed(2)}</td>
                                                    <td><span className={getStatusBadge(student.placementStatus)}>{student.placementStatus?.replace('_', ' ')}</span></td>
                                                    <td>
                                                        <button
                                                            onClick={() => setSelectedStudent(student)}
                                                            className="p-2 hover:bg-amrita-maroon/10 rounded-lg text-amrita-maroon transition-all"
                                                        >
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
                        <h2 className="text-xl font-black dark:text-white" style={{ color: '#000000' }}>All Students</h2>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="input-field pl-12 !py-3"
                                    style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#e5e7eb' }}
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
                                <tr style={{ color: '#000000' }}>
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
                                        <td className="font-bold text-gray-600 dark:text-gray-400" style={{ color: '#4b5563' }}>{student.rollNumber}</td>
                                        <td className="font-black text-gray-900 dark:text-white" style={{ color: '#000000' }}>{student.firstName} {student.lastName}</td>
                                        <td className="font-bold uppercase">{student.department}</td>
                                        <td className="font-black text-amrita-maroon">{student.cgpa?.toFixed(2)}</td>
                                        <td><span className={getStatusBadge(student.placementStatus)}>{student.placementStatus?.replace('_', ' ')}</span></td>
                                        <td className="font-bold text-gray-600 dark:text-gray-400" style={{ color: '#4b5563' }}>{student.offeredCompany || '-'}</td>
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
                    {/* Drives Header */}
                    <div className="glass-card p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>Placement Drives</h2>
                                <p className="text-sm" style={{ color: '#6b7280' }}>{drives.length} total drives</p>
                            </div>
                            <button
                                onClick={() => { setEditDrive(null); setIsModalOpen(true); }}
                                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: '#A4123F' }}
                            >
                                <Plus size={18} /> Add New Drive
                            </button>
                        </div>
                    </div>

                    {/* Applicants Modal */}
                    {selectedDrive && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                                    <div>
                                        <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>
                                            {selectedDrive.companyName} - Applicants
                                        </h2>
                                        <p className="text-sm" style={{ color: '#6b7280' }}>
                                            {selectedDrive.jobProfile} • {driveApplicants.length} applicants
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-gray-100 rounded-lg p-1">
                                            <button onClick={() => setIsKanbanView(false)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!isKanbanView ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>List</button>
                                            <button onClick={() => setIsKanbanView(true)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isKanbanView ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Board</button>
                                        </div>
                                        <button onClick={() => setSelectedDrive(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                            <XCircle size={24} style={{ color: '#6b7280' }} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50/50 min-h-[500px]">
                                    {driveApplicants.length > 0 ? (
                                        isKanbanView ? (
                                            <KanbanBoard applications={driveApplicants} driveId={selectedDrive._id} />
                                        ) : (
                                            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>Student</th>
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>Department</th>
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>CGPA</th>
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>Applied On</th>
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>Status</th>
                                                            <th className="text-left py-3 px-4 text-sm font-bold" style={{ color: '#6b7280' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {driveApplicants.map((app, i) => (
                                                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="py-4 px-4">
                                                                    <button
                                                                        onClick={() => setSelectedStudent(app.studentId)}
                                                                        className="text-left hover:opacity-70 transition-all"
                                                                    >
                                                                        <p className="font-bold" style={{ color: '#1f2937' }}>
                                                                            {app.studentId?.firstName} {app.studentId?.lastName}
                                                                        </p>
                                                                        <p className="text-xs flex items-center gap-1" style={{ color: '#A4123F' }}>
                                                                            <Eye size={12} /> Click to view profile
                                                                        </p>
                                                                    </button>
                                                                    <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{app.studentId?.rollNumber}</p>
                                                                </td>
                                                                <td className="py-4 px-4 font-medium" style={{ color: '#4b5563' }}>{app.studentId?.department}</td>
                                                                <td className="py-4 px-4 font-bold" style={{ color: '#16a34a' }}>{app.studentId?.cgpa?.toFixed(2)}</td>
                                                                <td className="py-4 px-4 text-sm" style={{ color: '#6b7280' }}>
                                                                    {new Date(app.appliedDate).toLocaleDateString()}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                                                                        app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                                app.status === 'offered' ? 'bg-purple-100 text-purple-700' :
                                                                                    'bg-gray-100 text-gray-700'
                                                                        }`}>
                                                                        {app.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <select
                                                                        className="text-sm px-2 py-1 border border-gray-200 rounded-lg focus:outline-none"
                                                                        value={app.status}
                                                                        onChange={async (e) => {
                                                                            try {
                                                                                await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/application/${app._id}`, {
                                                                                    status: e.target.value
                                                                                });
                                                                                fetchApplicants(selectedDrive._id);
                                                                            } catch (err) {
                                                                                console.error(err);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <option value="applied">Applied</option>
                                                                        <option value="shortlisted">Shortlisted</option>
                                                                        <option value="round1">Round 1</option>
                                                                        <option value="round2">Round 2</option>
                                                                        <option value="hr_round">HR Round</option>
                                                                        <option value="offered">Offered</option>
                                                                        <option value="rejected">Rejected</option>
                                                                        <option value="accepted">Accepted</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-12">
                                            <Users size={48} className="mx-auto mb-4" style={{ color: '#d1d5db' }} />
                                            <p className="font-medium" style={{ color: '#6b7280' }}>No applicants yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Drives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(drives.length > 0 ? drives : stats.recentDrives || []).map((drive, i) => (
                            <div key={drive._id || i} className="glass-card p-6 hover:shadow-xl transition-all group">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <CompanyLogo name={drive.companyName} size="md" className="rounded-xl" />
                                    <select
                                        className="text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none"
                                        style={{
                                            backgroundColor: drive.status === 'upcoming' ? '#dbeafe' : drive.status === 'ongoing' ? '#dcfce7' : drive.status === 'completed' ? '#f3f4f6' : '#fee2e2',
                                            color: drive.status === 'upcoming' ? '#1d4ed8' : drive.status === 'ongoing' ? '#16a34a' : drive.status === 'completed' ? '#4b5563' : '#dc2626'
                                        }}
                                        value={drive.status}
                                        onChange={(e) => handleStatusChange(drive._id, e.target.value)}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Company Info */}
                                <h3 className="font-black text-lg mb-1" style={{ color: '#1f2937' }}>{drive.companyName}</h3>
                                <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{drive.jobProfile}</p>
                                {drive.jobType && (
                                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                                        backgroundColor: drive.jobType === 'Internship' ? '#dbeafe' : '#f3e8ff',
                                        color: drive.jobType === 'Internship' ? '#2563eb' : '#7c3aed'
                                    }}>
                                        {drive.jobType}
                                    </span>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs" style={{ color: '#9ca3af' }}>Date</p>
                                        <p className="font-bold text-sm" style={{ color: '#374151' }}>
                                            {new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs" style={{ color: '#9ca3af' }}>CTC</p>
                                        <p className="font-black text-sm" style={{ color: '#16a34a' }}>
                                            ₹{((drive.ctcDetails?.ctc || 0) / 100000).toFixed(1)}L
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs" style={{ color: '#9ca3af' }}>Applicants</p>
                                        <p className="font-bold text-sm" style={{ color: '#374151' }}>
                                            {drive.registeredStudents?.length || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs" style={{ color: '#9ca3af' }}>Min CGPA</p>
                                        <p className="font-bold text-sm" style={{ color: '#374151' }}>
                                            {drive.eligibility?.minCgpa || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openViewApplicants(drive)}
                                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all hover:opacity-80"
                                        style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}
                                    >
                                        <Eye size={14} /> Applicants
                                    </button>
                                    <button
                                        onClick={() => openEditModal(drive)}
                                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all hover:opacity-80"
                                        style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDrive(drive._id)}
                                        className="py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all hover:opacity-80"
                                        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {drives.length === 0 && stats.recentDrives?.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <Briefcase size={48} className="mx-auto mb-4" style={{ color: '#d1d5db' }} />
                            <h3 className="font-bold text-lg mb-2" style={{ color: '#374151' }}>No drives yet</h3>
                            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>Create your first placement drive</p>
                            <button
                                onClick={() => { setEditDrive(null); setIsModalOpen(true); }}
                                className="px-6 py-3 rounded-xl font-bold text-white"
                                style={{ backgroundColor: '#A4123F' }}
                            >
                                Add Drive
                            </button>
                        </div>
                    )}
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

            {activeTab === 'alumni' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/40 dark:bg-gray-800/40 p-6 rounded-3xl shadow-sm border border-white/20 dark:border-gray-700/50 backdrop-blur-md" style={{ backgroundColor: '#ffffff' }}>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2" style={{ color: '#000000' }}><Users className="text-amrita-maroon" /> Alumni Directory Management</h2>
                            <p className="text-sm text-gray-500 font-medium">Manually update the placement network database</p>
                        </div>
                        <button
                            onClick={() => { setSelectedAlumniMember(null); setIsAlumniModalOpen(true); }}
                            className="btn-premium flex items-center gap-2"
                        >
                            <Plus size={18} /> Add Alumni Member
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alumniList.length > 0 ? alumniList.map((alum, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col gap-4 relative group hover:scale-[1.02] transition-all">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setSelectedAlumniMember(alum); setIsAlumniModalOpen(true); }}
                                        className="p-1 text-gray-400 hover:text-amrita-maroon"
                                    >
                                        <Edit size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amrita-maroon/10 flex items-center justify-center text-amrita-maroon font-black text-lg">
                                        {alum.name ? alum.name[0] : 'A'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight" style={{ color: '#000000' }}>{alum.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amrita-maroon">{alum.role}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300" style={{ color: '#4b5563' }}>
                                        <Building2 size={14} className="text-gray-400" /> {alum.company}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                        <Calendar size={14} className="text-gray-400" /> Batch {alum.batch} • {alum.department}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {alum.linkedin && <a href={alum.linkedin} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Linkedin size={14} /></a>}
                                        {alum.email && <a href={`mailto:${alum.email}`} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"><Mail size={14} /></a>}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 text-center text-gray-400">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-bold">Directory is empty</p>
                                <p className="text-xs">Add the first alumni using the button above.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AddDriveModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditDrive(null); }}
                onSuccess={() => {
                    fetchStats();
                    fetchDrives();
                    setIsModalOpen(false);
                    setEditDrive(null);
                }}
                editDrive={editDrive}
            />

            <AddAlumniModal
                isOpen={isAlumniModalOpen}
                onClose={() => { setIsAlumniModalOpen(false); setSelectedAlumniMember(null); }}
                onRefresh={fetchAlumni}
                editAlumni={selectedAlumniMember}
            />

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
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
