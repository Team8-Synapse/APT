import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, Building2, Clock, MapPin, DollarSign, Users, Filter, Search,
    ChevronRight, CheckCircle, XCircle, AlertCircle, Briefcase, GraduationCap,
    ExternalLink, ChevronDown, List, Grid3X3
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

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`);
            setDrives(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Mock data
            setDrives([
                { _id: '1', companyName: 'Gsdfsdsle', jobProfile: 'Software Engineer L3', date: '2026-03-15', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4500000 }, eligibility: { minCgpa: 8.5, allowedDepartments: ['CSE', 'ECE'] }, selectionProcess: [{ roundName: 'Online Test' }, { roundName: 'Technical' }, { roundName: 'HR' }], workLocation: 'Bangalore', totalPositions: 5 },
                { _id: '2', companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', status: 'upcoming', isEligible: true, hasApplied: true, ctcDetails: { ctc: 4200000 }, eligibility: { minCgpa: 8.0, allowedDepartments: ['CSE', 'ECE', 'EEE'] }, workLocation: 'Hyderabad', totalPositions: 8 },
                { _id: '3', companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4000000 }, eligibility: { minCgpa: 7.5, allowedDepartments: ['CSE', 'ECE'] }, workLocation: 'Bangalore', totalPositions: 12 },
                { _id: '4', companyName: 'Adobe', jobProfile: 'MTS', date: '2026-03-28', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 2100000 }, eligibility: { minCgpa: 7.5, allowedDepartments: ['CSE', 'ECE'] }, workLocation: 'Noida', totalPositions: 6 },
                { _id: '5', companyName: 'Meta', jobProfile: 'Software Engineer', date: '2026-03-18', status: 'upcoming', isEligible: false, eligibilityReasons: ['CGPA below 8.5'], ctcDetails: { ctc: 5000000 }, eligibility: { minCgpa: 8.5, allowedDepartments: ['CSE'] }, workLocation: 'London', totalPositions: 3 },
                { _id: '6', companyName: 'Infosys', jobProfile: 'Systems Engineer', date: '2026-05-02', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 360000 }, eligibility: { minCgpa: 6.5, allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME', 'CE'] }, workLocation: 'Multiple', totalPositions: 50 },
            ]);
            setLoading(false);
        }
    };

    const handleApply = async (driveId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/apply`, {
                userId: user.id,
                driveId
            });
            await fetchDrives();
        } catch (err) {
            console.error('Failed to apply:', err);
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    const filteredDrives = drives.filter(drive => {
        if (filters.status !== 'all' && drive.status !== filters.status) return false;
        if (filters.eligibility === 'eligible' && !drive.isEligible) return false;
        if (filters.eligibility === 'applied' && !drive.hasApplied) return false;
        if (filters.search && !drive.companyName.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const sortedDrives = [...filteredDrives].sort((a, b) => new Date(a.date) - new Date(b.date));

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
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Placement <span className="text-gradient">Drives</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {sortedDrives.length} drives available • {sortedDrives.filter(d => d.isEligible).length} eligible for you
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

            {/* Filters */}
            <div className="glass-card p-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="input-field pl-12 !py-3"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <select
                        className="input-field !w-auto"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        className="input-field !w-auto"
                        value={filters.eligibility}
                        onChange={(e) => setFilters({ ...filters, eligibility: e.target.value })}
                    >
                        <option value="all">All Drives</option>
                        <option value="eligible">Eligible Only</option>
                        <option value="applied">Applied</option>
                    </select>
                </div>
            </div>

            {/* Drives Grid/List */}
            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedDrives.map((drive, i) => (
                        <DriveCard key={i} drive={drive} onApply={handleApply} />
                    ))}
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                                <th className="!pl-6">Company</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th>CTC</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDrives.map((drive, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                                    <td className="!pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amrita-maroon text-white rounded-lg flex items-center justify-center font-black">
                                                {drive.companyName[0]}
                                            </div>
                                            <span className="font-black text-gray-900 dark:text-white">{drive.companyName}</span>
                                        </div>
                                    </td>
                                    <td className="font-bold text-gray-600 dark:text-gray-400">{drive.jobProfile}</td>
                                    <td className="font-bold">{new Date(drive.date).toLocaleDateString()}</td>
                                    <td className="font-black text-amrita-maroon">₹{(drive.ctcDetails?.ctc / 100000).toFixed(1)}L</td>
                                    <td className="font-bold text-gray-600 dark:text-gray-400">{drive.workLocation}</td>
                                    <td>
                                        {drive.hasApplied ? (
                                            <span className="status-badge status-placed">Applied</span>
                                        ) : drive.isEligible ? (
                                            <span className="status-badge status-in-process">Eligible</span>
                                        ) : (
                                            <span className="status-badge status-not-placed">Not Eligible</span>
                                        )}
                                    </td>
                                    <td>
                                        {drive.isEligible && !drive.hasApplied && (
                                            <button
                                                onClick={() => handleApply(drive._id)}
                                                className="btn-premium !py-2 !px-4 text-xs"
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const DriveCard = ({ drive, onApply }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 ${expanded ? 'row-span-2' : ''}`}>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amrita-maroon text-amrita-gold rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                            {drive.companyName[0]}
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-gray-900 dark:text-white">{drive.companyName}</h3>
                            <p className="text-sm text-gray-500 font-medium">{drive.jobProfile}</p>
                        </div>
                    </div>
                    {drive.ctcDetails?.ctc && (
                        <div className="text-right">
                            <p className="text-2xl font-black text-amrita-maroon">₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">CTC</p>
                        </div>
                    )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={14} />
                        <span>{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin size={14} />
                        <span>{drive.workLocation || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users size={14} />
                        <span>{drive.totalPositions || 'N/A'} positions</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <GraduationCap size={14} />
                        <span>Min {drive.eligibility?.minCgpa || 0} CGPA</span>
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
                            <p className="text-xs font-black text-gray-400 uppercase mb-2">Eligible Departments</p>
                            <div className="flex flex-wrap gap-2">
                                {drive.eligibility.allowedDepartments.map((dept, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold">{dept}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {drive.selectionProcess && (
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase mb-2">Selection Process</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {drive.selectionProcess.map((round, i) => (
                                    <React.Fragment key={i}>
                                        <span className="px-3 py-1 bg-amrita-maroon/10 text-amrita-maroon rounded-full text-xs font-bold">
                                            {round.roundName}
                                        </span>
                                        {i < drive.selectionProcess.length - 1 && (
                                            <ChevronRight size={14} className="text-gray-400" />
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
                        className="w-full btn-premium py-3 flex items-center justify-center gap-2"
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
