/**
 * Mobile: Frontend / Pages / Student
 * Description: My Applications Component.
 * - Tracks the status of all student applications (Applied, Shortlisted, Offered, etc.).
 * - Allows students to withdraw applications or accept/reject offers.
 * - Displays application history and progress timeline.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    FileText, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Building2,
    Calendar, ArrowRight, ExternalLink, Filter, Search, Briefcase
} from 'lucide-react';
import CompanyLogo from '../../components/CompanyLogo';

const MyApplications = () => {
    const { user } = useAuth();
    // Application Data State
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ total: 0, applied: 0, shortlisted: 0, inProgress: 0, offered: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Load applications on mount

    useEffect(() => {
        fetchApplications();
    }, [user]);

    // Fetch applications and stats
    const fetchApplications = async () => {
        const userId = user?._id || user?.id;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const [appsRes, statsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/my-applications/${userId}`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/stats/${userId}`)
            ]);
            setApplications(appsRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Mock data fallback for demonstration/dev purposes
            setApplications([
                { _id: '1', driveId: { companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', ctcDetails: { ctc: 4200000 } }, status: 'shortlisted', appliedDate: '2026-02-01', rounds: [{ roundName: 'Applied', status: 'passed' }, { roundName: 'Online Test', status: 'passed' }, { roundName: 'Technical', status: 'scheduled' }] },
                { _id: '2', driveId: { companyName: 'Adobe', jobProfile: 'MTS', date: '2026-03-28', ctcDetails: { ctc: 2100000 } }, status: 'applied', appliedDate: '2026-01-28' },
                { _id: '3', driveId: { companyName: 'Google', jobProfile: 'Software Engineer', date: '2026-03-15', ctcDetails: { ctc: 4500000 } }, status: 'rejected', appliedDate: '2026-01-20' },
                { _id: '4', driveId: { companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', ctcDetails: { ctc: 4000000 } }, status: 'offered', appliedDate: '2026-01-15', offeredCTC: 4000000 },
            ]);
            setStats({ total: 4, applied: 1, shortlisted: 1, inProgress: 1, offered: 1, rejected: 1 });
            setLoading(false);
        }
    };

    // Withdraw application
    const handleWithdraw = async (applicationId) => {
        if (!confirm('Are you sure you want to withdraw this application?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/withdraw/${applicationId}`);
            await fetchApplications();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to withdraw');
        }
    };

    // Accept or Decline Offer
    const handleRespondOffer = async (applicationId, status) => {
        if (!confirm(`Are you sure you want to ${status} this offer?`)) return;
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/respond-offer/${applicationId}`, { status });

            if (status === 'accepted') {
                import('canvas-confetti').then((module) => {
                    const confetti = module.default;
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                    });
                });
                alert('Congratulations! Offer Accepted 🎉');
            }

            await fetchApplications();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || `Failed to ${status} offer`);
        }
    };

    // Helper: Get color/icon config for status
    const getStatusConfig = (status) => {
        const configs = {
            applied: { color: 'blue', icon: Clock, label: 'Applied' },
            shortlisted: { color: 'purple', icon: CheckCircle, label: 'Shortlisted' },
            round1: { color: 'orange', icon: ArrowRight, label: 'Round 1' },
            round2: { color: 'orange', icon: ArrowRight, label: 'Round 2' },
            round3: { color: 'orange', icon: ArrowRight, label: 'Round 3' },
            hr_round: { color: 'indigo', icon: ArrowRight, label: 'HR Round' },
            offered: { color: 'green', icon: CheckCircle, label: 'Offered 🎉' },
            rejected: { color: 'red', icon: XCircle, label: 'Rejected' },
            accepted: { color: 'emerald', icon: CheckCircle, label: 'Accepted' },
            declined: { color: 'gray', icon: XCircle, label: 'Declined' }
        };
        return configs[status] || configs.applied;
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        if (filter === 'active') return !['rejected', 'declined', 'accepted'].includes(app.status);
        return app.status === filter;
    });

    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-24 skeleton rounded-3xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 skeleton rounded-2xl"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 page-enter">
            <header>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
                    <FileText className="text-amrita-maroon" size={32} />
                    <span style={{ color: '#1A1A1A' }}>My</span> <span style={{ color: '#A4123F' }}>Applications</span>
                </h1>
                <p style={{ color: '#6b7280' }} className="font-medium mt-1">
                    Track your placement journey
                </p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass-card p-4 text-center">
                    <p className="text-3xl font-black" style={{ color: '#374151' }}>{stats.total}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#9ca3af' }}>Total</p>
                </div>
                <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: '#dbeafe' }}>
                    <p className="text-3xl font-black" style={{ color: '#1d4ed8' }}>{stats.inProgress}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#3b82f6' }}>In Progress</p>
                </div>
                <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: '#f3e8ff' }}>
                    <p className="text-3xl font-black" style={{ color: '#7c3aed' }}>{stats.shortlisted}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#8b5cf6' }}>Shortlisted</p>
                </div>
                <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: '#dcfce7' }}>
                    <p className="text-3xl font-black" style={{ color: '#16a34a' }}>{stats.offered}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#22c55e' }}>Offers</p>
                </div>
                <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: '#fee2e2' }}>
                    <p className="text-3xl font-black" style={{ color: '#dc2626' }}>{stats.rejected}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#ef4444' }}>Rejected</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'applied', 'shortlisted', 'offered', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
                        style={{
                            backgroundColor: filter === f ? '#B1124A' : '#f3f4f6',
                            color: filter === f ? 'white' : '#6b7280'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.length > 0 ? filteredApplications.map((app, i) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div key={i} className="glass-card p-6 hover:shadow-xl transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Company Info */}
                                <div className="flex items-center gap-4">
                                    <CompanyLogo name={app.driveId?.companyName} size="md" className="rounded-2xl shadow-lg" />
                                    <div>
                                        <h3 className="font-black text-xl" style={{ color: '#1f2937' }}>{app.driveId?.companyName}</h3>
                                        <p className="font-medium" style={{ color: '#6b7280' }}>{app.driveId?.jobProfile}</p>
                                        <div className="flex items-center gap-4 mt-1 text-sm">
                                            <span className="flex items-center gap-1" style={{ color: '#9ca3af' }}>
                                                <Calendar size={14} />
                                                Applied {new Date(app.appliedDate).toLocaleDateString()}
                                            </span>
                                            {app.driveId?.ctcDetails?.ctc && (
                                                <span className="font-black" style={{ color: '#16a34a' }}>
                                                    ₹{(app.driveId.ctcDetails.ctc / 100000).toFixed(1)}L
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black bg-${statusConfig.color}-100 dark:bg-${statusConfig.color}-900/30 text-${statusConfig.color}-700 dark:text-${statusConfig.color}-400`}>
                                        <StatusIcon size={16} />
                                        {statusConfig.label}
                                    </div>

                                    {app.status === 'applied' && (
                                        <button
                                            onClick={() => handleWithdraw(app._id)}
                                            className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        >
                                            Withdraw
                                        </button>
                                    )}

                                    {app.status === 'offered' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleRespondOffer(app._id, 'accepted')}
                                                className="px-6 py-2 bg-[#B1124A] hover:bg-[#8B0000] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                            >
                                                Accept Offer
                                            </button>
                                            <button
                                                onClick={() => handleRespondOffer(app._id, 'declined')}
                                                className="px-6 py-2 border-2 border-[#B1124A] text-[#B1124A] hover:bg-pink-50 text-sm font-bold rounded-xl transition-all"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            {app.rounds && app.rounds.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-black text-gray-400 uppercase mb-3">Progress Timeline</p>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                        {app.rounds.map((round, j) => (
                                            <React.Fragment key={j}>
                                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${round.status === 'passed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : round.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : round.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                                    {round.status === 'passed' && <CheckCircle size={14} />}
                                                    {round.status === 'failed' && <XCircle size={14} />}
                                                    {round.status === 'scheduled' && <Clock size={14} />}
                                                    {round.status === 'pending' && <AlertCircle size={14} />}
                                                    <span className="text-sm font-bold">{round.roundName}</span>
                                                </div>
                                                {j < app.rounds.length - 1 && (
                                                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Offer Details */}
                            {app.status === 'offered' && (
                                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black text-green-700 dark:text-green-400">🎉 Congratulations! You have an offer!</p>
                                            {app.offeredCTC && (
                                                <p className="text-2xl font-black text-green-800 dark:text-green-300 mt-1">
                                                    ₹{(app.offeredCTC / 100000).toFixed(1)} LPA
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="glass-card p-12 text-center">
                        <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-black text-xl text-gray-400 mb-2">No Applications Yet</h3>
                        <p className="text-gray-500 mb-6">Start applying to placement drives to track your progress here.</p>
                        <a href="/drives" className="btn-premium inline-flex items-center gap-2">
                            Browse Drives <ArrowRight size={18} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatBadge = ({ label, value, color }) => {
    const colors = {
        gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };

    return (
        <div className={`p-4 rounded-2xl text-center ${colors[color]}`}>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
};

export default MyApplications;
