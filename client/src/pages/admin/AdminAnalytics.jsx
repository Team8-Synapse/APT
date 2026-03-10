import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    FunnelChart, Funnel, LabelList
} from 'recharts';
import {
    LayoutDashboard, TrendingUp, Users, Briefcase, DollarSign,
    PieChart as PieChartIcon, Activity, Target, Award, Globe,
    Cpu, GraduationCap, Building2, Monitor, Zap, RefreshCw,
    Download, Calendar, Filter, MoreHorizontal, ChevronRight,
    Search, Bell, Plus, ExternalLink, ArrowUpRight, ArrowDownRight,
    CheckCircle2, AlertCircle, Clock, Timer, Layers, UserCheck
} from 'lucide-react';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';

// ============= COLORS & THEME (Dark Pastel Palette) =============
const CHART_COLORS = [
    '#B1124A', '#4E6C50', '#9A4444', '#4D4D7C', '#36506C',
    '#B79471', '#8B4C33', '#517664', '#583759', '#41436A'
];

const SECONDARY_COLORS = CHART_COLORS.map(c => `${c}B3`); // 70% opacity

const GRADIENTS = [
    { start: '#B1124A', end: '#8E0E3B' },
    { start: '#4E6C50', end: '#394A3B' },
    { start: '#9A4444', end: '#743232' },
    { start: '#4D4D7C', end: '#3A3A5C' },
    { start: '#36506C', end: '#283C51' }
];

// ============= HELPER COMPONENTS =============
const AnalyticsCard = ({ title, icon: Icon, children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay / 1000 }}
        className={`bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:shadow-maroon-subtle/5 transition-all duration-500 group ${className}`}
    >
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amrita-maroon/5 flex items-center justify-center text-amrita-maroon group-hover:bg-amrita-maroon group-hover:text-white transition-all duration-300">
                    <Icon size={20} />
                </div>
                <h3 className="font-black text-gray-800 tracking-tight text-sm uppercase">{title}</h3>
            </div>
            <div className="flex gap-1">
                <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-300 transition-colors"><MoreHorizontal size={14} /></button>
            </div>
        </div>
        <div className="h-[280px] w-full">
            {children}
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-2xl text-white">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                {payload.map((item, index) => (
                    <p key={index} className="text-sm font-bold flex items-center gap-2" style={{ color: item.fill || item.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill || item.color }}></span>
                        {item.name}: {typeof item.value === 'number' && item.name.includes('%') ? item.value.toFixed(1) : item.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ============= MAIN COMPONENT =============
const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const response = await api.get('/analytics/dashboard?batch=2026');
            setData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-amrita-maroon/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-amrita-maroon rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-black text-amrita-maroon uppercase tracking-widest animate-pulse">Aggregating Global Metrics...</p>
        </div>
    );

    const {
        deptPlacementData = [],
        monthlyTrend = [],
        avgSalaryByCompany = [],
        salaryDistribution = [],
        statusOverview = [],
        topCompanies = [],
        offersBySector = [],
        appFunnel = [],
        batchProgress = [],
        deptAvgPackage = [],
        skillDemand = [],
        acceptanceRate = { accepted: 0, offered: 0 },
        visitFrequency = [],
        growthTrend = [],
        participationRate = []
    } = data || {};

    // Transform appFunnel for the funnel chart
    const funnelData = [
        { name: 'Applied', value: appFunnel.find(f => f._id === 'applied')?.count || 0, fill: '#8884d8' },
        { name: 'Shortlisted', value: appFunnel.find(f => f._id === 'shortlisted')?.count || 0, fill: '#83a6ed' },
        { name: 'Rounds', value: appFunnel.filter(f => ['round1', 'round2', 'round3', 'hr_round'].includes(f._id)).reduce((a, b) => a + b.count, 0), fill: '#8dd1e1' },
        { name: 'Offered', value: appFunnel.find(f => f._id === 'offered')?.count || 0, fill: '#82ca9d' },
        { name: 'Accepted', value: appFunnel.find(f => f._id === 'accepted')?.count || 0, fill: '#a4de6c' }
    ].sort((a, b) => b.value - a.value);

    return (
        <div className="p-4 !bg-white min-h-screen space-y-8 animate-fade-in text-gray-900">
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <Activity className="text-[#B1124A]" size={32} />
                        <span className="text-[#B1124A]">Insights</span> Engine
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className={`p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={20} className="text-[#B1124A]" />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-[#B1124A] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-maroon-subtle/40 hover:scale-105 active:scale-95 transition-all">
                        <Download size={18} /> Export Intel
                    </button>
                </div>
            </div>

            {/* Top Row: Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Global Placement', val: statusOverview.find(s => s.status === 'Placed')?.count || 0, icon: GraduationCap, color: '#B1124A' },
                    { label: 'Active Pipeline', val: statusOverview.find(s => s.status === 'In Process')?.count || 0, icon: Activity, color: '#4E6C50' },
                    { label: 'Avg Package', val: `₹${(deptAvgPackage.reduce((a, b) => a + b.avgCTC, 0) / (deptAvgPackage.length || 1) / 100000).toFixed(1)}L`, icon: DollarSign, color: '#9A4444' },
                    { label: 'Top Drive', val: topCompanies[0]?.company || 'N/A', icon: Building2, color: '#4D4D7C' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black text-gray-900">{stat.val}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Grid - 15 Dynamic Visualizations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* 1. Placement Rate by Department */}
                <AnalyticsCard title="Placement Efficiency" icon={LayoutDashboard} delay={100}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptPlacementData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="rate" name="Rate %" radius={[10, 10, 0, 0]}>
                                {deptPlacementData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 2. Monthly Placement Trend */}
                <AnalyticsCard title="Temporal Momentum" icon={TrendingUp} delay={200}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrend}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A4123F" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#A4123F" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="count" name="Placements" stroke="#A4123F" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 3. Average Salary by Company */}
                <AnalyticsCard title="Yield of Value" icon={DollarSign} delay={300}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avgSalaryByCompany} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="company" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 9, fontWeight: 800, fill: '#64748B' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="avgCTC" name="Avg CTC" radius={[0, 10, 10, 0]}>
                                {avgSalaryByCompany.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 4. Salary Distribution */}
                <AnalyticsCard title="Wealth Spectrum" icon={PieChartIcon} delay={400}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={salaryDistribution}
                                dataKey="count"
                                nameKey="range"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                            >
                                {salaryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900, paddingTop: 20 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 5. Placement Status Overview */}
                <AnalyticsCard title="Global Status" icon={PieChartIcon} delay={500}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusOverview}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusOverview.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={SECONDARY_COLORS[index % SECONDARY_COLORS.length]} stroke="white" strokeWidth={4} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 6. Top Recruiting Companies */}
                <AnalyticsCard title="Volume Leaders" icon={Building2} delay={600}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCompanies}>
                            <XAxis dataKey="company" hide />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Hires" radius={[8, 8, 8, 8]} barSize={20}>
                                {topCompanies.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 7. Offers by Industry Sector */}
                <AnalyticsCard title="Sector Exposure" icon={Globe} delay={700}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={offersBySector}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ sector, percent }) => `${sector} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="sector"
                            >
                                {offersBySector.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 8. Application Funnel */}
                <AnalyticsCard title="Recruitment Sieve" icon={Target} delay={800}>
                    <ResponsiveContainer width="100%" height="100%">
                        <FunnelChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Funnel
                                data={funnelData}
                                dataKey="value"
                                nameKey="name"
                                labelLine={true}
                            >
                                <LabelList position="right" fill="#4B5563" stroke="none" dataKey="name" style={{ fontSize: 10, fontWeight: 900 }} />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 9. Placement Progress by Batch */}
                <AnalyticsCard title="Batch Progression" icon={Layers} delay={900}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={batchProgress}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 10, fontWeight: 800 }} />
                            <Bar dataKey="total" name="Total Strength" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="placed" name="Confirmed Hires" fill="#A4123F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 10. Department-wise Average Package */}
                <AnalyticsCard title="Financial Matrix" icon={Briefcase} delay={1000}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={deptAvgPackage}>
                            <PolarGrid stroke="#E2E8F0" />
                            <PolarAngleAxis dataKey="department" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748B' }} />
                            <Radar name="Avg Package" dataKey="avgCTC" stroke="#A4123F" fill="#A4123F" fillOpacity={0.6} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 11. Student Skill Demand */}
                <AnalyticsCard title="Skill Ecosystem" icon={Cpu} delay={1100}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillDemand} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 9, fontWeight: 800 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="demand" name="Market Frequency" fill="#8B5CF6" radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 12. Offer Acceptance Rate */}
                <AnalyticsCard title="Retention Factor" icon={UserCheck} delay={1200}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Accepted', value: acceptanceRate.accepted, fill: '#10B981' },
                                    { name: 'Declined/Pending', value: acceptanceRate.offered - acceptanceRate.accepted, fill: '#F43F5E' }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                startAngle={90}
                                endAngle={450}
                            >
                                <LabelList position="center" content={({ cx, cy }) => (
                                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                                        <tspan x={cx} dy="-0.5em" fontSize="16" fontWeight="900" fill="#1A1A1A">{((acceptanceRate.accepted / (acceptanceRate.offered || 1)) * 100).toFixed(0)}%</tspan>
                                        <tspan x={cx} dy="1.5em" fontSize="8" fontWeight="900" fill="#9CA3AF" textAnchor="middle">ACCEPTANCE</tspan>
                                    </text>
                                )} />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 13. Company Visit Frequency */}
                <AnalyticsCard title="Partnership Frequency" icon={Building2} delay={1300}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visitFrequency}>
                            <XAxis dataKey="company" hide />
                            <YAxis axisLine={false} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="visits" name="Drive Visits" fill="#4E6C50" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 14. Placement Growth Over Years */}
                <AnalyticsCard title="Annual Scaling" icon={Activity} delay={1400}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="stepAfter" dataKey="count" name="Placed Strength" stroke="#635985" strokeWidth={4} dot={{ r: 6, fill: '#635985', strokeWidth: 3, stroke: 'white' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

                {/* 15. Drive Participation Rate */}
                <AnalyticsCard title="Engagement Profile" icon={Users} delay={1500}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={participationRate}>
                            <XAxis dataKey="name" hide />
                            <YAxis axisLine={false} tick={{ fontSize: 10 }} />
                            <Bar dataKey="count" name="Students Registered" fill="#4D4D7C" radius={[5, 5, 5, 5]} />
                            <Tooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsCard>

            </div>
        </div>
    );
};

export default AdminAnalytics;
