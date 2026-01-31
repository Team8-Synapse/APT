import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Briefcase, BookOpen, Search, ShieldCheck, TrendingUp, Sparkles, Filter, ChevronRight, Download } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ studentCount: 0, driveCount: 0, alumniCount: 0, recentDrives: [] });
    const [shortlist, setShortlist] = useState([]);
    const [filters, setFilters] = useState({ minCgpa: 0, maxBacklogs: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/stats`);
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const handleShortlist = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/shortlist`, filters);
            setShortlist(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
        </div>
    );

    return (
        <div className="space-y-10 page-enter pb-12 font-bold">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="text-amrita-maroon" size={20} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">CIR Central Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin <span className="text-gradient">Intelligence</span></h1>
                    <p className="text-gray-500 font-medium mt-1">High-level placement analytics and candidate shortlisting engine</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-premium flex items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </header>

            {/* Performance Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={<Users />} label="Enrolled Students" value={stats.studentCount} color="maroon" />
                <StatCard icon={<Briefcase />} label="Active Drives" value={stats.driveCount} color="gold" />
                <StatCard icon={<TrendingUp />} label="Alumni Network" value={stats.alumniCount} color="maroon" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shortlisting Engine */}
                <div className="glass-card p-8 space-y-8 h-fit lg:sticky lg:top-28">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amrita-maroon/10 rounded-2xl"><Filter className="text-amrita-maroon" /></div>
                        <h2 className="text-xl font-black">Shortlist Engine</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400">Minimum CGPA</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-black focus:bg-white transition-all"
                                value={filters.minCgpa}
                                onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-gray-400">Max Backlogs</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none font-black focus:bg-white transition-all"
                                value={filters.maxBacklogs}
                                onChange={(e) => setFilters({ ...filters, maxBacklogs: e.target.value })}
                            />
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
                            <h2 className="text-xl font-black flex items-center gap-3">
                                <Users className="text-amrita-maroon" /> SHORTLISTED CANDIDATES
                            </h2>
                            <span className="text-[10px] font-black bg-amrita-maroon/5 text-amrita-maroon px-4 py-1.5 rounded-full uppercase tracking-widest italic">
                                {shortlist.length} Records Found
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-100">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dept</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">CGPA</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {shortlist.length > 0 ? shortlist.map((student, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 font-black text-gray-900">
                                                {student.firstName} {student.lastName}
                                                <p className="text-[10px] text-gray-400 font-medium italic">{student.userId?.email}</p>
                                            </td>
                                            <td className="py-4 text-sm text-gray-600 font-bold uppercase">{student.department}</td>
                                            <td className="py-4 font-black text-amrita-maroon">{student.cgpa}</td>
                                            <td className="py-4">
                                                <button className="p-2 transition-all hover:bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-400 font-bold italic opacity-50">
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
                            <h2 className="text-xl font-black flex items-center gap-3">
                                <Calendar size={22} className="text-amrita-maroon" /> RECENT DRIVES
                            </h2>
                            <button className="text-xs font-black text-amrita-maroon hover:underline uppercase italic">Manage Drives</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.recentDrives.map((drive, i) => (
                                <div key={i} className="p-5 bg-white/40 border border-white rounded-2xl hover:bg-white/60 transition-all group">
                                    <h4 className="font-black text-gray-900 group-hover:text-amrita-maroon transition-colors">{drive.companyName}</h4>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(drive.date).toLocaleDateString()}</p>
                                        <span className="text-[10px] font-black text-amrita-maroon italic">View Details</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`glass-card p-8 flex items-center gap-6 overflow-hidden relative group`}>
        <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform ${color === 'maroon' ? 'text-amrita-maroon' : 'text-amrita-gold'}`}>
            {React.cloneElement(icon, { size: 100 })}
        </div>
        <div className={`p-4 rounded-2xl ${color === 'maroon' ? 'bg-amrita-maroon/10 text-amrita-maroon' : 'bg-amrita-gold/10 text-amrita-maroon'}`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <h3 className="text-3xl font-black text-gray-900 tabular-nums">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
