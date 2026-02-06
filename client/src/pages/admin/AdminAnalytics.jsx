import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3, TrendingUp, PieChart, Users, Building2, GraduationCap,
    Calendar, Filter, Download, RefreshCw, ChevronDown, Sparkles,
    Target, Award, Briefcase, ArrowUpRight, ArrowDownRight, Activity,
    Layers, GitBranch, Clock, CheckCircle, XCircle, Loader2, Zap,
    Globe, Star, TrendingDown, Eye, Share2, Maximize2, MoreHorizontal
} from 'lucide-react';

// Mock data generator
const generateAnalyticsData = () => {
    const departments = ['CSE', 'EEE', 'ECE', 'ELC', 'MEC', 'AIE', 'AIDS'];
    const companies = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Cisco', 'Oracle', 'Zoho'];

    const departmentStats = departments.map(dept => ({
        department: dept,
        totalStudents: Math.floor(Math.random() * 150) + 60,
        placed: Math.floor(Math.random() * 80) + 20,
        inProcess: Math.floor(Math.random() * 30) + 5,
        notPlaced: Math.floor(Math.random() * 40) + 10,
        avgCgpa: (Math.random() * 1.5 + 7.5).toFixed(2),
        highestPackage: Math.floor(Math.random() * 30 + 20),
        avgPackage: Math.floor(Math.random() * 15 + 8)
    }));

    const yearWiseStats = [2026, 2027].map(year => ({
        year,
        totalStudents: year === 2026 ? 631 : 630,
        placed: year === 2026 ? Math.floor(Math.random() * 200 + 300) : 0,
        inProcess: year === 2026 ? Math.floor(Math.random() * 100 + 50) : 0,
        notPlaced: year === 2026 ? Math.floor(Math.random() * 150 + 100) : 630,
        placementRate: year === 2026 ? Math.floor(Math.random() * 20 + 55) : 0
    }));

    const sectionStats = departments.flatMap(dept =>
        ['A', 'B', 'C'].map(section => ({
            department: dept,
            section,
            totalStudents: 30,
            placed: Math.floor(Math.random() * 20) + 5,
            avgCgpa: (Math.random() * 1.5 + 7).toFixed(2)
        }))
    );

    const companyStats = companies.map(company => ({
        company,
        placements: Math.floor(Math.random() * 40) + 5,
        avgPackage: Math.floor(Math.random() * 20 + 10),
        departments: departments.slice(0, Math.floor(Math.random() * 4) + 2)
    }));

    const monthlyTrends = [
        { month: 'Aug', placements: 15, offers: 20 },
        { month: 'Sep', placements: 42, offers: 55 },
        { month: 'Oct', placements: 78, offers: 95 },
        { month: 'Nov', placements: 95, offers: 120 },
        { month: 'Dec', placements: 120, offers: 145 },
        { month: 'Jan', placements: 156, offers: 180 },
        { month: 'Feb', placements: 180, offers: 210 }
    ];

    return { departmentStats, yearWiseStats, sectionStats, companyStats, monthlyTrends };
};

// Animated Counter
const AnimatedCounter = ({ value, suffix = '', prefix = '', duration = 1500 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Radial Progress Component
const RadialProgress = ({ value, max, size = 120, strokeWidth = 8, color = '#B90E50', label, sublabel }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((value / max) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-100 dark:text-gray-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{percentage.toFixed(0)}%</span>
                {label && <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>}
            </div>
            {sublabel && <span className="mt-2 text-xs font-bold text-gray-500">{sublabel}</span>}
        </div>
    );
};

// Sparkline Component
const Sparkline = ({ data, dataKey, width = 100, height = 30, color = '#B90E50' }) => {
    const values = data.map(d => d[dataKey]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const points = values.map((v, i) => ({
        x: (i / (values.length - 1)) * width,
        y: height - ((v - min) / range) * (height - 4) - 2
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`spark-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={pathD + ` L ${width} ${height} L 0 ${height} Z`} fill={`url(#spark-${color.replace('#', '')})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="3" fill={color} />
        </svg>
    );
};

// Enhanced Stat Card with 3D effect
const StatCard3D = ({ icon, label, value, change, changeType = 'positive', gradient, sparkData, sparkKey }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`glass-card p-5 relative overflow-hidden transition-all duration-500 ${isHovered ? 'transform scale-[1.02] shadow-2xl' : ''}`}>
                {/* Animated background gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ${gradient}`} />

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                            style={{
                                left: `${20 + i * 30}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${3 + i}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-gradient-to-br from-amrita-maroon/20 to-amrita-pink/10 rounded-xl text-amrita-maroon group-hover:bg-white/20 group-hover:text-white transition-all shadow-inner">
                            {icon}
                        </div>
                        {change && (
                            <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${changeType === 'positive'
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/50'
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/50'
                                } group-hover:bg-white/20 group-hover:text-white`}>
                                {changeType === 'positive' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {change}
                            </div>
                        )}
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 group-hover:text-white/70">
                        {label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-white">
                        <AnimatedCounter
                            value={typeof value === 'number' ? value : parseInt(value) || 0}
                            prefix={typeof value === 'string' && value.includes('₹') ? '₹' : ''}
                            suffix={typeof value === 'string' && value.includes('L') ? 'L' : typeof value === 'string' && value.includes('%') ? '%' : ''}
                        />
                    </p>

                    {/* Mini sparkline */}
                    {sparkData && sparkKey && (
                        <div className="mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Sparkline data={sparkData} dataKey={sparkKey} width={80} height={24} />
                        </div>
                    )}
                </div>

                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amrita-maroon/20 to-amrita-pink/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
        </div>
    );
};

// Animated Donut Chart
const DonutChart = ({ data, colors, size = 200 }) => {
    const [animated, setAnimated] = useState(false);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                    <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                    </filter>
                </defs>
                {data.map((slice, i) => {
                    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                    cumulativePercent += slice.value / total;
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;

                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <path
                            key={i}
                            d={pathData}
                            fill={colors[i % colors.length]}
                            className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                            style={{
                                filter: 'url(#donutShadow)',
                                transform: animated ? 'scale(1)' : 'scale(0)',
                                transformOrigin: 'center',
                                transitionDelay: `${i * 100}ms`
                            }}
                        />
                    );
                })}
                <circle r="0.55" fill="white" className="dark:fill-gray-800" />
                <circle r="0.53" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.02" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                    <AnimatedCounter value={total} />
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
            </div>
        </div>
    );
};

// Area Chart with Gradient
const AreaChart = ({ data, height = 200 }) => {
    const max = Math.max(...data.map(d => Math.max(d.placements, d.offers)));
    const width = 100;

    const getPoints = (key) => data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - 20 - ((d[key] / max) * (height - 40))
    }));

    const placementPoints = getPoints('placements');
    const offerPoints = getPoints('offers');

    const createPath = (points) => points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const createArea = (points) => createPath(points) + ` L ${width} ${height - 20} L 0 ${height - 20} Z`;

    return (
        <div style={{ height }} className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="placementGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#B90E50" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#B90E50" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="offerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {[...Array(5)].map((_, i) => (
                    <line key={i} x1="0" y1={20 + i * ((height - 40) / 4)} x2={width} y2={20 + i * ((height - 40) / 4)}
                        stroke="currentColor" strokeWidth="0.3" className="text-gray-200 dark:text-gray-700" />
                ))}

                {/* Areas */}
                <path d={createArea(offerPoints)} fill="url(#offerGradient)" />
                <path d={createArea(placementPoints)} fill="url(#placementGradient)" />

                {/* Lines */}
                <path d={createPath(offerPoints)} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                <path d={createPath(placementPoints)} fill="none" stroke="#B90E50" strokeWidth="2.5" strokeLinecap="round" />

                {/* Data points */}
                {placementPoints.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#B90E50" strokeWidth="2" className="transition-all hover:r-6" />
                        <circle cx={offerPoints[i].x} cy={offerPoints[i].y} r="3" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                    </g>
                ))}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-gray-400">{d.month}</span>
                ))}
            </div>
        </div>
    );
};

// Horizontal Bar with Animation
const HorizontalBar = ({ data, dataKey, labelKey, maxValue, showRank = false }) => {
    const max = maxValue || Math.max(...data.map(d => d[dataKey]));
    const colors = ['#B90E50', '#D91A65', '#E91E63', '#F06292', '#F48FB1', '#F8BBD9', '#FCE4EC'];

    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i} className="group">
                    <div className="flex items-center gap-3">
                        {showRank && (
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-amber-100 text-amber-600' :
                                    i === 1 ? 'bg-gray-100 text-gray-500' :
                                        i === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-gray-50 text-gray-400'
                                }`}>
                                {i + 1}
                            </span>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-amrita-maroon transition-colors">
                                    {item[labelKey]}
                                </span>
                                <span className="text-sm font-black text-amrita-maroon">{item[dataKey]}</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${(item[dataKey] / max) * 100}%`,
                                        background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}cc)`,
                                        animationDelay: `${i * 100}ms`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Live Indicator
const LiveIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-full">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">Live Data</span>
    </div>
);

// Main Component
const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedDept, setSelectedDept] = useState('all');
    const [activeView, setActiveView] = useState('overview');

    useEffect(() => {
        setTimeout(() => {
            setData(generateAnalyticsData());
            setLoading(false);
        }, 800);
    }, []);

    const summaryStats = useMemo(() => {
        if (!data) return null;
        const totalStudents = data.departmentStats.reduce((sum, d) => sum + d.totalStudents, 0);
        const totalPlaced = data.departmentStats.reduce((sum, d) => sum + d.placed, 0);
        const totalInProcess = data.departmentStats.reduce((sum, d) => sum + d.inProcess, 0);
        const avgPackage = Math.round(data.departmentStats.reduce((sum, d) => sum + d.avgPackage, 0) / data.departmentStats.length);
        const highestPackage = Math.max(...data.departmentStats.map(d => d.highestPackage));

        return { totalStudents, totalPlaced, totalInProcess, avgPackage, highestPackage };
    }, [data]);

    const filteredDeptStats = useMemo(() => {
        if (!data) return [];
        if (selectedDept === 'all') return data.departmentStats;
        return data.departmentStats.filter(d => d.department === selectedDept);
    }, [data, selectedDept]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-amrita-maroon/20 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-amrita-maroon border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-500 font-bold">Loading Analytics...</p>
                    <p className="text-xs text-gray-400 mt-1">Crunching the numbers</p>
                </div>
            </div>
        );
    }

    const placementStatusData = [
        { label: 'Placed', value: summaryStats.totalPlaced, color: '#10B981' },
        { label: 'In Process', value: summaryStats.totalInProcess, color: '#F59E0B' },
        { label: 'Not Placed', value: summaryStats.totalStudents - summaryStats.totalPlaced - summaryStats.totalInProcess, color: '#EF4444' }
    ];

    return (
        <div className="space-y-6 page-enter">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amrita-maroon via-amrita-dark to-purple-900 p-8 text-white">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amrita-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <BarChart3 size={24} className="text-amrita-gold" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">Analytics Command Center</h1>
                                    <p className="text-white/60 font-medium text-sm">Real-time placement insights & intelligence</p>
                                </div>
                            </div>
                        </div>
                        <LiveIndicator />
                    </div>

                    {/* Quick filters */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            <option value={2026} className="text-gray-900">Batch 2026</option>
                            <option value={2027} className="text-gray-900">Batch 2027</option>
                        </select>

                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            <option value="all" className="text-gray-900">All Departments</option>
                            {data.departmentStats.map(d => (
                                <option key={d.department} value={d.department} className="text-gray-900">{d.department}</option>
                            ))}
                        </select>

                        <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm hover:bg-white/20 transition-all">
                            <Download size={16} />
                            Export
                        </button>

                        <button
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setData(generateAnalyticsData());
                                    setLoading(false);
                                }, 500);
                            }}
                            className="flex items-center gap-2 bg-white text-amrita-maroon rounded-xl px-4 py-2.5 font-bold text-sm hover:bg-white/90 transition-all shadow-lg shadow-black/20"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard3D
                    icon={<Users size={22} />}
                    label="Total Students"
                    value={summaryStats.totalStudents}
                    change="+12%"
                    changeType="positive"
                    gradient="bg-gradient-to-br from-amrita-maroon to-amrita-pink"
                    sparkData={data.monthlyTrends}
                    sparkKey="placements"
                />
                <StatCard3D
                    icon={<CheckCircle size={22} />}
                    label="Placed"
                    value={summaryStats.totalPlaced}
                    change="+8%"
                    changeType="positive"
                    gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                    sparkData={data.monthlyTrends}
                    sparkKey="placements"
                />
                <StatCard3D
                    icon={<Clock size={22} />}
                    label="In Process"
                    value={summaryStats.totalInProcess}
                    change="+15%"
                    changeType="positive"
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <StatCard3D
                    icon={<Target size={22} />}
                    label="Avg Package"
                    value={`${summaryStats.avgPackage}L`}
                    change="+5%"
                    changeType="positive"
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
                <StatCard3D
                    icon={<Award size={22} />}
                    label="Highest Package"
                    value={`${summaryStats.highestPackage}L`}
                    change="+20%"
                    changeType="positive"
                    gradient="bg-gradient-to-br from-purple-500 to-violet-600"
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut Chart */}
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amrita-maroon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white relative z-10">
                        <div className="p-2 bg-gradient-to-br from-amrita-maroon/20 to-amrita-pink/10 rounded-xl">
                            <PieChart className="text-amrita-maroon" size={20} />
                        </div>
                        Placement Distribution
                    </h3>
                    <div className="flex flex-col items-center relative z-10">
                        <DonutChart
                            data={placementStatusData.map(d => ({ label: d.label, value: d.value }))}
                            colors={placementStatusData.map(d => d.color)}
                            size={180}
                        />
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {placementStatusData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                                    <span className="text-xs font-black text-gray-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-lg flex items-center gap-3 dark:text-white">
                            <div className="p-2 bg-gradient-to-br from-amrita-maroon/20 to-amrita-pink/10 rounded-xl">
                                <TrendingUp className="text-amrita-maroon" size={20} />
                            </div>
                            Placement Trend (2025-26)
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-amrita-maroon rounded" />Placements</span>
                            <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-indigo-500 rounded" />Offers</span>
                        </div>
                    </div>
                    <AreaChart data={data.monthlyTrends} height={220} />

                    {/* Summary stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-center p-3 bg-amrita-maroon/5 rounded-xl">
                            <p className="text-2xl font-black text-amrita-maroon">
                                <AnimatedCounter value={data.monthlyTrends[data.monthlyTrends.length - 1].placements} />
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">This Month</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <p className="text-2xl font-black text-green-500">+24%</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Growth Rate</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <p className="text-2xl font-black text-blue-500">
                                <AnimatedCounter value={data.monthlyTrends.reduce((sum, d) => sum + d.placements, 0)} />
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Total YTD</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department & Company Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                        <div className="p-2 bg-gradient-to-br from-amrita-maroon/20 to-amrita-pink/10 rounded-xl">
                            <Building2 className="text-amrita-maroon" size={20} />
                        </div>
                        Department Performance
                    </h3>
                    <HorizontalBar data={filteredDeptStats} dataKey="placed" labelKey="department" showRank />
                </div>

                <div className="glass-card p-6">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                        <div className="p-2 bg-gradient-to-br from-amrita-maroon/20 to-amrita-pink/10 rounded-xl">
                            <Briefcase className="text-amrita-maroon" size={20} />
                        </div>
                        Top Recruiters
                    </h3>
                    <div className="space-y-3">
                        {data.companyStats.slice(0, 5).sort((a, b) => b.placements - a.placements).map((company, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-amrita-maroon/20">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                            i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                'bg-gradient-to-br from-amrita-maroon to-amrita-pink'
                                    } shadow-lg group-hover:scale-110 transition-transform`}>
                                    {company.company[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">
                                        {company.company}
                                    </h4>
                                    <p className="text-[10px] text-gray-400">₹{company.avgPackage}L avg • {company.departments.join(', ')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-amrita-maroon">{company.placements}</p>
                                    <p className="text-[10px] text-gray-400">hires</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Radial Progress Section */}
            <div className="glass-card p-6 bg-gradient-to-br from-amrita-maroon/5 to-purple-50/50 dark:from-amrita-maroon/10 dark:to-purple-900/10">
                <h3 className="font-black text-lg mb-6 flex items-center gap-3 dark:text-white">
                    <div className="p-2 bg-amrita-maroon rounded-xl">
                        <Activity className="text-white" size={20} />
                    </div>
                    Department Placement Rates
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {data.departmentStats.map((dept, i) => (
                        <RadialProgress
                            key={i}
                            value={dept.placed}
                            max={dept.totalStudents}
                            size={100}
                            strokeWidth={8}
                            color={['#B90E50', '#10B981', '#6366f1', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][i % 7]}
                            sublabel={dept.department}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <TrendingUp />, title: 'Best Performer', value: 'CSE', sub: '72% placement rate', color: 'green' },
                    { icon: <Briefcase />, title: 'Dream Company', value: 'Google', sub: '₹45L avg package', color: 'blue' },
                    { icon: <Award />, title: 'Top Recruiter', value: 'TCS', sub: '45 students hired', color: 'purple' },
                    { icon: <Target />, title: 'Target 2026', value: '85%', sub: 'Currently at 67%', color: 'amber' }
                ].map((item, i) => (
                    <div key={i} className={`glass-card p-5 border-l-4 border-${item.color}-500 hover:shadow-lg transition-all cursor-pointer group`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-${item.color}-500`}>{React.cloneElement(item.icon, { size: 16 })}</span>
                            <span className={`text-[10px] font-black text-${item.color}-600 uppercase`}>{item.title}</span>
                        </div>
                        <p className="text-xl font-black text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">{item.value}</p>
                        <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnalytics;
