import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Target, TrendingUp, AlertCircle, Calendar, ChevronRight, Brain, Sparkles, Zap, Award,
    Briefcase, Clock, CheckCircle, XCircle, Send, Users, Building2, GraduationCap, Star,
    ArrowUpRight, Bell, FileText, MapPin
} from 'lucide-react';
import AIChatbot from '../components/AIChatbot';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        readinessScore: 0,
        profile: {},
        applications: { total: 0, inProgress: 0, offered: 0, rejected: 0 },
        drives: { upcoming: 0, eligible: 0 }
    });
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, drivesRes, applicationsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/dashboard-stats/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/my-applications/${user.id}`)
                ]);
                setStats(dashboardRes.data);
                setDrives(drivesRes.data.slice(0, 5));
                setApplications(applicationsRes.data.slice(0, 5));
                setLoading(false);
            } catch (err) {
                console.error(err);
                // Use mock data if API fails
                setStats({
                    readinessScore: 72,
                    profile: { name: user.email.split('@')[0], department: 'CSE', cgpa: 8.5, placementStatus: 'not_placed' },
                    applications: { total: 5, inProgress: 2, offered: 1, rejected: 1 },
                    drives: { upcoming: 8, eligible: 6 }
                });
                setDrives([
                    { _id: '1', companyName: 'Google', jobProfile: 'Software Engineer L3', date: '2026-03-15', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4500000 } },
                    { _id: '2', companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', status: 'upcoming', isEligible: true, hasApplied: true, ctcDetails: { ctc: 4200000 } },
                    { _id: '3', companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', status: 'upcoming', isEligible: true, hasApplied: false, ctcDetails: { ctc: 4000000 } },
                ]);
                setApplications([
                    { _id: '1', driveId: { companyName: 'Microsoft', jobProfile: 'SDE' }, status: 'shortlisted', appliedDate: '2026-02-01' },
                    { _id: '2', driveId: { companyName: 'Adobe', jobProfile: 'MTS' }, status: 'applied', appliedDate: '2026-01-28' },
                ]);
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const handleApply = async (driveId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/apply`, {
                userId: user.id,
                driveId
            });
            // Refresh drives
            const drivesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`);
            setDrives(drivesRes.data.slice(0, 5));
        } catch (err) {
            console.error('Failed to apply:', err);
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
            shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
            round1: 'bg-orange-100 text-orange-700',
            round2: 'bg-orange-100 text-orange-700',
            offered: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
            rejected: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
            accepted: 'bg-emerald-100 text-emerald-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) return (
        <div className="space-y-8 page-enter">
            <div className="h-32 skeleton rounded-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="h-64 skeleton rounded-3xl"></div>
                <div className="h-64 skeleton rounded-3xl lg:col-span-2"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 page-enter">
            {/* Header with Profile Summary */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold" size={18} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Personalized Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Welcome, <span className="text-gradient">{stats.profile?.name || user.email.split('@')[0]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {stats.profile?.department} • CGPA: {stats.profile?.cgpa?.toFixed(2)} • Batch 2026
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {stats.profile?.placementStatus === 'placed' ? (
                        <div className="glass-card !rounded-2xl px-6 py-3 bg-green-50 border-green-200">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-600" size={24} />
                                <div>
                                    <p className="text-[10px] font-black text-green-600 uppercase">Placed at</p>
                                    <p className="text-lg font-black text-green-700">{stats.profile?.offeredCompany}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card !rounded-2xl px-6 py-3 border-amrita-gold/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amrita-gold/10 rounded-lg">
                                    <Brain className="text-amrita-maroon" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Status</p>
                                    <p className="text-sm font-black text-amrita-maroon">ENGINE ACTIVE</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStatCard
                    icon={<Target size={20} />}
                    label="Readiness Score"
                    value={`${Math.round(stats.readinessScore)}%`}
                    gradient="stat-gradient-1"
                />
                <QuickStatCard
                    icon={<Send size={20} />}
                    label="Applications"
                    value={stats.applications?.total || 0}
                    gradient="stat-gradient-2"
                />
                <QuickStatCard
                    icon={<Calendar size={20} />}
                    label="Upcoming Drives"
                    value={stats.drives?.upcoming || 0}
                    gradient="stat-gradient-3"
                />
                <QuickStatCard
                    icon={<CheckCircle size={20} />}
                    label="Eligible Drives"
                    value={stats.drives?.eligible || 0}
                    gradient="stat-gradient-4"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Readiness Score Card */}
                <div className="glass-card p-10 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={80} className="text-amrita-maroon" />
                    </div>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-gray-100 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                            <circle className="text-amrita-maroon transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - stats.readinessScore / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-amrita-maroon">{Math.round(stats.readinessScore)}%</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ready</span>
                        </div>
                    </div>
                    <div className="text-center group-hover:scale-105 transition-transform">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white">
                            {stats.readinessScore >= 80 ? 'Excellent!' : stats.readinessScore >= 60 ? 'Good Progress' : 'Keep Going'}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium max-w-[200px] mt-2 italic">
                            Based on profile, skills, and application activity
                        </p>
                    </div>

                    {/* Readiness Breakdown */}
                    <div className="w-full space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <ReadinessBar label="Profile Complete" value={85} />
                        <ReadinessBar label="Skills Added" value={70} />
                        <ReadinessBar label="Applications" value={Math.min(stats.applications?.total * 10, 100)} />
                    </div>
                </div>

                {/* Application Tracker */}
                <div className="glass-card col-span-2 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black flex items-center gap-2 dark:text-white">
                            <FileText className="text-amrita-maroon" /> MY APPLICATIONS
                        </h2>
                        <a href="/applications" className="text-[10px] font-black bg-amrita-maroon/5 text-amrita-maroon px-3 py-1 rounded-full uppercase italic hover:bg-amrita-maroon/10 transition-colors">
                            View All
                        </a>
                    </div>

                    {applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((app, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/40 dark:bg-gray-800/40 border border-white dark:border-gray-700 rounded-2xl hover:bg-white/60 dark:hover:bg-gray-700/40 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amrita-maroon text-amrita-gold rounded-xl flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {app.driveId?.companyName?.[0] || 'C'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white">{app.driveId?.companyName}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{app.driveId?.jobProfile}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(app.status)}`}>
                                            {app.status?.replace('_', ' ')}
                                        </span>
                                        <ChevronRight className="text-gray-400 group-hover:text-amrita-maroon transition-colors" size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                            <Briefcase size={40} className="mb-4 opacity-20" />
                            <p className="font-bold italic">No applications yet. Start applying to drives!</p>
                        </div>
                    )}

                    {/* Application Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <MiniStat label="Applied" value={stats.applications?.total} color="blue" />
                        <MiniStat label="In Progress" value={stats.applications?.inProgress} color="orange" />
                        <MiniStat label="Offers" value={stats.applications?.offered} color="green" />
                        <MiniStat label="Rejected" value={stats.applications?.rejected} color="red" />
                    </div>
                </div>
            </div>

            {/* Lower Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Drives */}
                    <section className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                                <Calendar className="text-amrita-maroon" /> UPCOMING DRIVES
                            </h2>
                            <a href="/drives" className="text-xs font-black text-amrita-maroon hover:underline uppercase tracking-widest italic">View All</a>
                        </div>
                        <div className="space-y-4">
                            {drives.map((drive, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/40 dark:bg-gray-800/40 border border-white dark:border-gray-700 rounded-2xl hover:bg-white/60 dark:hover:bg-gray-700/40 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amrita-maroon text-amrita-gold rounded-xl flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {drive.companyName[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                                {drive.ctcDetails?.ctc && (
                                                    <span className="text-[10px] font-black text-amrita-gold bg-amrita-maroon/10 px-2 py-0.5 rounded-full">
                                                        ₹{(drive.ctcDetails.ctc / 100000).toFixed(1)}L
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-tighter italic">{drive.jobProfile}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400 uppercase">Schedule</p>
                                            <p className="font-black text-gray-900 dark:text-white">{new Date(drive.date).toLocaleDateString()}</p>
                                        </div>
                                        {drive.isEligible ? (
                                            drive.hasApplied ? (
                                                <span className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black rounded-full border border-green-100 dark:border-green-800 uppercase tracking-widest">
                                                    Applied ✓
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleApply(drive._id)}
                                                    className="px-4 py-2 bg-amrita-maroon text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform"
                                                >
                                                    Apply Now
                                                </button>
                                            )
                                        ) : (
                                            <span className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black rounded-full border border-red-100 dark:border-red-800 uppercase tracking-widest">
                                                Not Eligible
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Strategic Roadmap */}
                    <section className="glass-card p-8">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 dark:text-white">
                            <Award className="text-amrita-maroon" /> STRATEGIC ROADMAP
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <RoadmapStep num="01" title="Profile Setup" desc="Complete all fields" completed />
                            <RoadmapStep num="02" title="Skill Building" desc="Add certifications" active />
                            <RoadmapStep num="03" title="Apply to Drives" desc="Start applications" />
                            <RoadmapStep num="04" title="Interview Prep" desc="Use PrepHub" />
                        </div>
                    </section>
                </div>

                {/* AI Assistant */}
                <div className="space-y-8">
                    <div className="glass-card p-6 h-fit">
                        <div className="flex items-center gap-3 mb-6 p-2 bg-amrita-maroon rounded-2xl shadow-lg">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Brain className="text-amrita-gold" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest">Placement AI</h3>
                                <p className="text-amrita-gold/70 text-[10px] font-black italic">Neural Advisor v4.0</p>
                            </div>
                        </div>
                        <div className="min-h-[400px] overflow-hidden rounded-2xl">
                            <AIChatbot />
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="glass-card p-6">
                        <h3 className="font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Star className="text-amrita-gold" size={18} /> Quick Tips
                        </h3>
                        <div className="space-y-3">
                            <TipCard text="Complete your LinkedIn profile for better visibility" />
                            <TipCard text="Practice DSA daily on LeetCode" />
                            <TipCard text="Review alumni experiences before interviews" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickStatCard = ({ icon, label, value, gradient }) => (
    <div className={`${gradient} p-6 rounded-2xl text-white relative overflow-hidden group cursor-default`}>
        <div className="absolute top-0 right-0 p-2 opacity-20">
            {React.cloneElement(icon, { size: 60 })}
        </div>
        <div className="relative z-10">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
        </div>
    </div>
);

const ReadinessBar = ({ label, value }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-gray-500">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${value}%` }} />
        </div>
    </div>
);

const MiniStat = ({ label, value, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
        orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400',
        green: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',
        red: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
        <div className={`text-center p-3 rounded-xl ${colors[color]}`}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-[10px] font-bold uppercase">{label}</p>
        </div>
    );
};

const RoadmapStep = ({ num, title, desc, completed, active }) => (
    <div className={`relative p-5 rounded-2xl border transition-all ${active ? 'bg-amrita-maroon text-white shadow-xl scale-105 z-10' : completed ? 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60'}`}>
        <p className={`text-[10px] font-black tracking-widest mb-1 ${active ? 'text-amrita-gold' : completed ? 'text-green-600 dark:text-green-400' : 'text-amrita-maroon/40'}`}>{num}</p>
        <h4 className="font-black text-sm tracking-tighter uppercase">{title}</h4>
        <p className={`text-[10px] mt-1 font-medium italic ${active ? 'text-white/80' : 'text-gray-400'}`}>{desc}</p>
        {completed && <CheckCircle className="absolute top-3 right-3 text-green-500" size={16} />}
    </div>
);

const TipCard = ({ text }) => (
    <div className="p-3 bg-amrita-gold/10 rounded-xl text-sm text-gray-700 dark:text-gray-300 font-medium flex items-start gap-2">
        <span className="text-amrita-gold mt-0.5">💡</span>
        <span>{text}</span>
    </div>
);

export default StudentDashboard;
