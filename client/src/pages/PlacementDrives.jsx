import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, Building2, Clock, MapPin, DollarSign, Users, Filter, Search,
    ChevronRight, CheckCircle, XCircle, AlertCircle, Briefcase, GraduationCap,
    ExternalLink, ChevronDown, List, Grid3X3, TrendingUp, Target, Award, Timer
} from 'lucide-react';

const PlacementDrives = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('cards');
    const [filters, setFilters] = useState({
        status: 'all',
        eligibility: 'all',
        search: ''
    });
    const [sortBy, setSortBy] = useState('date'); // date, ctc, company

    // Helper function to calculate days until deadline
    const getDaysUntil = (date) => {
        const today = new Date();
        const driveDate = new Date(date);
        const diffTime = driveDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Helper function to get deadline badge
    const getDeadlineBadge = (date) => {
        const days = getDaysUntil(date);
        if (days < 0) return { text: 'Expired', color: '#6b7280', bg: '#f3f4f6' };
        if (days === 0) return { text: 'Today!', color: '#dc2626', bg: '#fef2f2' };
        if (days === 1) return { text: 'Tomorrow', color: '#ea580c', bg: '#fff7ed' };
        if (days <= 3) return { text: `${days} days left`, color: '#d97706', bg: '#fffbeb' };
        if (days <= 7) return { text: `${days} days left`, color: '#059669', bg: '#ecfdf5' };
        return null;
    };

    useEffect(() => {
        if (user) {
            fetchDrives();
        }
    }, [user]);

    const fetchDrives = async () => {
        try {
            const token = localStorage.getItem('token');
            // Ensure we have a fallback for ID if missing
            const userObj = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user?._id || user?.id || userObj._id || userObj.id;

            console.log("Flux Debug: Fetching drives...", { userId, hasToken: !!token });

            if (!userId) {
                console.error("Flux Debug: No User ID found. Cannot fetch drives.");
                setLoading(false);
                return;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Flux Debug: API Response Success", res.data);

            if (Array.isArray(res.data)) {
                console.log(`Flux Debug: Setting ${res.data.length} drives to state.`);
                setDrives(res.data);
            } else {
                console.error("Flux Debug: API returned non-array data", res.data);
                setDrives([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Flux Debug: Fetch drives ERROR:", err);
            if (err.response) {
                console.error("Flux Debug: Server responded with", err.response.status, err.response.data);
            }
            // For debugging, if 404/500, we might want to alert the user
            // alert(`Debug Error: ${err.message}`);
            setLoading(false);
        }
    };

    const handleApply = async (driveId) => {
        try {
            const userId = user?._id || user?.id;
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/apply`, {
                userId,
                driveId
            });
            await fetchDrives();
        } catch (err) {
            console.error('Failed to apply:', err);
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    const filteredDrives = drives.filter(drive => {
        // Case-insensitive status check
        if (filters.status !== 'all' && drive.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
        if (filters.eligibility === 'eligible' && !drive.isEligible) return false;
        if (filters.eligibility === 'applied' && !drive.hasApplied) return false;
        if (filters.search && !drive.companyName.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const sortedDrives = [...filteredDrives].sort((a, b) => {
        if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'ctc') return (b.ctcDetails?.ctc || 0) - (a.ctcDetails?.ctc || 0);
        if (sortBy === 'company') return (a.companyName || '').localeCompare(b.companyName || '');
        return 0;
    });

    // Calculate stats
    const stats = {
        total: drives.length,
        eligible: drives.filter(d => d.isEligible).length,
        applied: drives.filter(d => d.hasApplied).length,
        urgent: drives.filter(d => getDaysUntil(d.date) <= 3 && getDaysUntil(d.date) >= 0).length
    };

    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-24 skeleton rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 skeleton rounded-3xl"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 page-enter">
            {/* DEBUG SECTION: Show if validation fails but data exists */}
            {drives.length > 0 && filteredDrives.length === 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Debug Info:</strong>
                    <span className="block sm:inline"> Data fetched ({drives.length} drives), but hidden by filters.</span>
                    <br />
                    <small>Statuses found: {drives.map(d => d.status).join(', ')}</small>
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">
                        <span style={{ color: '#1f2937' }}>Placement</span> <span style={{ color: '#A4123F' }}>Drives</span>
                    </h1>
                    <p style={{ color: '#6b7280' }} className="font-medium mt-1">
                        Discover opportunities from top companies
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                        >
                            <Grid3X3 size={20} className={viewMode === 'cards' ? 'text-amrita-maroon' : 'text-gray-400'} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                        >
                            <List size={20} className={viewMode === 'list' ? 'text-amrita-maroon' : 'text-gray-400'} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setFilters({ ...filters, eligibility: 'all' })}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e0e7ff' }}>
                        <Building2 size={24} style={{ color: '#4f46e5' }} />
                    </div>
                    <div>
                        <p className="text-2xl font-black" style={{ color: '#1f2937' }}>{stats.total}</p>
                        <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>Total Drives</p>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setFilters({ ...filters, eligibility: 'eligible' })}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                        <Target size={24} style={{ color: '#059669' }} />
                    </div>
                    <div>
                        <p className="text-2xl font-black" style={{ color: '#1f2937' }}>{stats.eligible}</p>
                        <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>Eligible</p>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setFilters({ ...filters, eligibility: 'applied' })}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fce7f3' }}>
                        <Award size={24} style={{ color: '#db2777' }} />
                    </div>
                    <div>
                        <p className="text-2xl font-black" style={{ color: '#1f2937' }}>{stats.applied}</p>
                        <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>Applied</p>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                        <Timer size={24} style={{ color: '#d97706' }} />
                    </div>
                    <div>
                        <p className="text-2xl font-black" style={{ color: '#1f2937' }}>{stats.urgent}</p>
                        <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>Deadline Soon</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-amrita-maroon/30 focus:border-amrita-maroon transition-all"
                            style={{ color: '#1f2937' }}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <select
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amrita-maroon/30 focus:border-amrita-maroon transition-all"
                        style={{ color: '#374151' }}
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amrita-maroon/30 focus:border-amrita-maroon transition-all"
                        style={{ color: '#374151' }}
                        value={filters.eligibility}
                        onChange={(e) => setFilters({ ...filters, eligibility: e.target.value })}
                    >
                        <option value="all">All Drives</option>
                        <option value="eligible">Eligible Only</option>
                        <option value="applied">Applied</option>
                    </select>
                    <select
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amrita-maroon/30 focus:border-amrita-maroon transition-all"
                        style={{ color: '#374151' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Sort by Date</option>
                        <option value="ctc">Sort by CTC</option>
                        <option value="company">Sort by Company</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
                    Showing {sortedDrives.length} of {drives.length} drives
                </p>
            </div>

            {/* Drives Grid/List */}
            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedDrives.length > 0 ? sortedDrives.map((drive, i) => (
                        <DriveCard key={i} drive={drive} onApply={handleApply} getDeadlineBadge={getDeadlineBadge} />
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 glass-card">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f3f4f6' }}>
                                <Briefcase size={40} style={{ color: '#9ca3af' }} />
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#374151' }}>No drives found</h3>
                            <p className="text-sm" style={{ color: '#6b7280' }}>Try adjusting your filters or check back later</p>
                            <button
                                onClick={() => setFilters({ status: 'all', eligibility: 'all', search: '' })}
                                className="mt-4 px-4 py-2 rounded-lg font-semibold text-sm"
                                style={{ backgroundColor: '#A4123F', color: 'white' }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-card overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-4 px-6 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Company</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">CTC</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Location</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-4 text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {sortedDrives.length > 0 ? sortedDrives.map((drive, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white rounded-lg flex items-center justify-center font-black shadow-md">
                                                {drive.companyName?.[0] || '?'}
                                            </div>
                                            <span className="font-bold" style={{ color: '#1f2937' }}>{drive.companyName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium" style={{ color: '#374151' }}>{drive.jobProfile}</td>
                                    <td className="py-4 px-4 font-medium" style={{ color: '#374151' }}>{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                                    <td className="py-4 px-4 font-black" style={{ color: '#16a34a' }}>₹{((drive.ctcDetails?.ctc || 0) / 100000).toFixed(1)}L</td>
                                    <td className="py-4 px-4 font-medium" style={{ color: '#374151' }}>{drive.workLocation || 'TBD'}</td>
                                    <td className="py-4 px-4">
                                        {drive.hasApplied ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">Applied</span>
                                        ) : drive.isEligible ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">Eligible</span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Not Eligible</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        {drive.isEligible && !drive.hasApplied && (
                                            <button
                                                onClick={() => handleApply(drive._id)}
                                                className="px-4 py-2 bg-gradient-to-r from-amrita-maroon to-amrita-burgundy text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400">No drives found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const DriveCard = ({ drive, onApply, getDeadlineBadge }) => {
    const [expanded, setExpanded] = useState(false);
    const deadlineBadge = getDeadlineBadge ? getDeadlineBadge(drive.date) : null;

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 hover:shadow-xl ${expanded ? 'row-span-2' : ''}`}>
            {/* Deadline Badge - Top ribbon */}
            {deadlineBadge && (
                <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: deadlineBadge.bg }}>
                    <Clock size={14} style={{ color: deadlineBadge.color }} />
                    <span className="text-xs font-bold" style={{ color: deadlineBadge.color }}>{deadlineBadge.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 min-w-[3rem] bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg flex-shrink-0">
                            {drive.companyName?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-lg truncate" style={{ color: '#1f2937' }} title={drive.companyName}>
                                {drive.companyName || 'Unknown Company'}
                            </h3>
                            <p className="text-sm font-medium truncate" style={{ color: '#6b7280' }}>{drive.jobProfile || 'Position'}</p>
                        </div>
                        {drive.ctcDetails?.ctc && (
                            <div className="text-right flex-shrink-0">
                                <p className="text-xl font-black" style={{ color: '#16a34a' }}>₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L</p>
                                <p className="text-[10px] font-bold uppercase" style={{ color: '#9ca3af' }}>CTC</p>
                            </div>
                        )}
                    </div>
                    {/* Job Type & Posted Date */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {drive.jobType && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: drive.jobType === 'Internship' ? '#dbeafe' : '#f3e8ff', color: drive.jobType === 'Internship' ? '#2563eb' : '#7c3aed' }}>
                                {drive.jobType}
                            </span>
                        )}
                        {drive.createdAt && (
                            <span className="text-xs" style={{ color: '#9ca3af' }}>
                                Posted: {new Date(drive.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} style={{ color: '#6b7280' }} />
                        <span style={{ color: '#4b5563' }}>{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: '#6b7280' }} />
                        <span style={{ color: '#4b5563' }}>{drive.workLocation || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={14} style={{ color: '#6b7280' }} />
                        <span style={{ color: '#4b5563' }}>{drive.totalPositions || 'N/A'} positions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap size={14} style={{ color: '#6b7280' }} />
                        <span style={{ color: '#4b5563' }}>Min {drive.eligibility?.minCgpa || 0} CGPA</span>
                    </div>
                </div>
            </div>

            {/* Eligibility Banner */}
            <div className={`px-6 py-3 ${drive.isEligible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {drive.isEligible ? (
                            <>
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-sm font-bold text-green-700 dark:text-green-400">You are eligible</span>
                            </>
                        ) : (
                            <>
                                <XCircle size={16} className="text-red-600" />
                                <span className="text-sm font-bold text-red-700 dark:text-red-400">Not eligible</span>
                            </>
                        )}
                    </div>
                    {!drive.isEligible && drive.eligibilityReasons && (
                        <span className="text-xs text-red-500">{drive.eligibilityReasons[0]}</span>
                    )}
                </div>
            </div>

            {/* Expand Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-amrita-maroon hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
                {expanded ? 'Show Less' : 'View Details'}
                <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    {drive.eligibility?.allowedDepartments && (
                        <div>
                            <p className="text-xs font-black uppercase mb-2" style={{ color: '#6b7280' }}>Eligible Departments</p>
                            <div className="flex flex-wrap gap-2">
                                {drive.eligibility.allowedDepartments.map((dept, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#e5e7eb', color: '#374151' }}>{dept}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {drive.selectionProcess && drive.selectionProcess.length > 0 && (
                        <div>
                            <p className="text-xs font-black uppercase mb-2" style={{ color: '#6b7280' }}>Selection Process</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {drive.selectionProcess.map((round, i) => (
                                    <React.Fragment key={i}>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#fce4ec', color: '#A4123F' }}>
                                            {round.roundName || round}
                                        </span>
                                        {i < drive.selectionProcess.length - 1 && (
                                            <ChevronRight size={14} style={{ color: '#9ca3af' }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Button */}
            <div className="px-6 pb-6">
                {drive.hasApplied ? (
                    <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-center font-black flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Applied Successfully
                    </div>
                ) : drive.isEligible ? (
                    <button
                        onClick={() => onApply(drive._id)}
                        className="w-full py-3 bg-gradient-to-r from-amrita-maroon to-amrita-burgundy text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                    >
                        <Briefcase size={18} /> Apply Now
                    </button>
                ) : (
                    <div className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl text-center font-bold">
                        Not Eligible
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacementDrives;
