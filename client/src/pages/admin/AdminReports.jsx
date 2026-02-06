import React, { useState } from 'react';
import {
    FileSpreadsheet, Users, Briefcase, GraduationCap, Building2, TrendingUp,
    Download, Filter, Calendar, ChevronDown, FileText, BarChart3, PieChart,
    Clock, CheckCircle, XCircle, AlertCircle, Eye, Printer, Mail, Share2,
    RefreshCw, Search, Sparkles, Award, Target, DollarSign, ArrowUpRight
} from 'lucide-react';

// Report Card Component
const ReportCard = ({
    icon,
    title,
    description,
    category,
    lastGenerated,
    format,
    onGenerate,
    onPreview,
    onEmail,
    gradient
}) => (
    <div className="glass-card p-6 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amrita-maroon/10 rounded-xl text-amrita-maroon group-hover:bg-white/20 group-hover:text-white transition-all">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded group-hover:bg-white/20 group-hover:text-white">
                    {category}
                </span>
            </div>

            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-2 group-hover:text-white transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 group-hover:text-white/70 transition-colors">
                {description}
            </p>

            <div className="flex items-center justify-between mb-4 text-xs text-gray-400 group-hover:text-white/60">
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Last: {lastGenerated}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FileText size={12} />
                    <span>{format}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onGenerate}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amrita-maroon text-white rounded-xl font-bold text-xs hover:bg-amrita-dark transition-all group-hover:bg-white group-hover:text-amrita-maroon"
                >
                    <Download size={14} />
                    Generate
                </button>
                <button
                    onClick={onPreview}
                    className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition-all group-hover:bg-white/20 group-hover:text-white"
                >
                    <Eye size={14} />
                </button>
                <button
                    onClick={onEmail}
                    className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition-all group-hover:bg-white/20 group-hover:text-white"
                >
                    <Mail size={14} />
                </button>
            </div>
        </div>
    </div>
);

// Quick Stats Card
const QuickStat = ({ icon, label, value, trend }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                {icon}
            </div>
            {trend && (
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {trend}
                </span>
            )}
        </div>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

// Recent Report Item
const RecentReportItem = ({ title, type, date, status, size }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group border border-transparent hover:border-amrita-maroon/20">
        <div className="p-3 bg-amrita-maroon/10 rounded-xl text-amrita-maroon">
            <FileSpreadsheet size={20} />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amrita-maroon transition-colors">
                {title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-gray-400">{type}</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] font-bold text-gray-400">{date}</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] font-bold text-gray-400">{size}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${status === 'ready' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' :
                    status === 'processing' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                {status}
            </span>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download size={14} className="text-gray-400" />
            </button>
        </div>
    </div>
);

const AdminReports = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('all');

    const categories = [
        { id: 'all', label: 'All Reports', count: 8 },
        { id: 'placement', label: 'Placement', count: 3 },
        { id: 'student', label: 'Student', count: 2 },
        { id: 'company', label: 'Company', count: 2 },
        { id: 'analytics', label: 'Analytics', count: 1 }
    ];

    const reports = [
        {
            id: 1,
            icon: <Users size={24} />,
            title: 'Student Placement Report',
            description: 'Complete list of all students with their placement status, company, package, and joining dates.',
            category: 'placement',
            lastGenerated: '2 hours ago',
            format: 'Excel, PDF',
            gradient: 'bg-gradient-to-br from-amrita-maroon to-amrita-pink'
        },
        {
            id: 2,
            icon: <Building2 size={24} />,
            title: 'Company Wise Report',
            description: 'Detailed breakdown of students placed in each company with CTC statistics and department distribution.',
            category: 'company',
            lastGenerated: '1 day ago',
            format: 'Excel, PDF',
            gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
        },
        {
            id: 3,
            icon: <GraduationCap size={24} />,
            title: 'Department Performance',
            description: 'Department-wise placement analysis including placement rate, average package, and top recruiters.',
            category: 'analytics',
            lastGenerated: '3 hours ago',
            format: 'Excel, PDF, PPT',
            gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
        },
        {
            id: 4,
            icon: <TrendingUp size={24} />,
            title: 'Year-on-Year Comparison',
            description: 'Compare placement statistics across multiple academic years with trend analysis.',
            category: 'analytics',
            lastGenerated: '5 days ago',
            format: 'PDF, PPT',
            gradient: 'bg-gradient-to-br from-purple-500 to-violet-600'
        },
        {
            id: 5,
            icon: <DollarSign size={24} />,
            title: 'CTC Analysis Report',
            description: 'Comprehensive salary statistics including min, max, average CTC by department and company.',
            category: 'placement',
            lastGenerated: '1 day ago',
            format: 'Excel, PDF',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
        },
        {
            id: 6,
            icon: <FileSpreadsheet size={24} />,
            title: 'Student Database Export',
            description: 'Full student database with academic details, skills, certifications, and contact information.',
            category: 'student',
            lastGenerated: '12 hours ago',
            format: 'Excel, CSV',
            gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
        },
        {
            id: 7,
            icon: <Briefcase size={24} />,
            title: 'Drive Summary Report',
            description: 'Summary of all placement drives including dates, eligibility, applications, and selections.',
            category: 'company',
            lastGenerated: '4 hours ago',
            format: 'Excel, PDF',
            gradient: 'bg-gradient-to-br from-rose-500 to-pink-600'
        },
        {
            id: 8,
            icon: <Award size={24} />,
            title: 'Unplaced Students Report',
            description: 'List of students yet to be placed with CGPA, backlog status, and eligible companies.',
            category: 'student',
            lastGenerated: '6 hours ago',
            format: 'Excel, PDF',
            gradient: 'bg-gradient-to-br from-slate-500 to-gray-600'
        }
    ];

    const recentReports = [
        { title: 'Placement_Report_Feb2026.xlsx', type: 'Placement Report', date: 'Feb 5, 2026', status: 'ready', size: '2.4 MB' },
        { title: 'CSE_Department_Analysis.pdf', type: 'Department Report', date: 'Feb 4, 2026', status: 'ready', size: '1.8 MB' },
        { title: 'Company_Statistics_Q4.xlsx', type: 'Company Report', date: 'Feb 3, 2026', status: 'ready', size: '3.1 MB' },
        { title: 'CTC_Breakdown_2026.pdf', type: 'CTC Analysis', date: 'Feb 2, 2026', status: 'processing', size: '—' },
        { title: 'Unplaced_Students_List.xlsx', type: 'Student Report', date: 'Feb 1, 2026', status: 'ready', size: '1.2 MB' }
    ];

    const filteredReports = reports.filter(report => {
        const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleGenerate = (report) => {
        alert(`Generating ${report.title}...`);
    };

    const handlePreview = (report) => {
        alert(`Opening preview for ${report.title}...`);
    };

    const handleEmail = (report) => {
        alert(`Email options for ${report.title}...`);
    };

    return (
        <div className="space-y-8 page-enter">
            {/* Header */}
            <div className="glass-card p-6 bg-gradient-to-r from-amrita-maroon to-amrita-pink text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <FileSpreadsheet size={200} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-amrita-gold" size={24} />
                        <h1 className="text-2xl font-black">Reports & Intelligence Center</h1>
                    </div>
                    <p className="text-white/70 font-medium">
                        Generate, download, and share comprehensive placement reports and analytics
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/30 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2.5 pr-10 font-bold text-sm cursor-pointer hover:bg-white/30 transition-all"
                        >
                            <option value="all" className="text-gray-900">All Time</option>
                            <option value="week" className="text-gray-900">This Week</option>
                            <option value="month" className="text-gray-900">This Month</option>
                            <option value="year" className="text-gray-900">This Year</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <button className="flex items-center gap-2 bg-white text-amrita-maroon rounded-xl px-4 py-2.5 font-bold text-sm hover:bg-white/90 transition-all">
                        <RefreshCw size={16} />
                        Refresh All
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStat
                    icon={<FileSpreadsheet size={18} />}
                    label="Total Reports"
                    value="8"
                    trend="+2 new"
                />
                <QuickStat
                    icon={<Download size={18} />}
                    label="Downloaded"
                    value="156"
                    trend="+12 today"
                />
                <QuickStat
                    icon={<Mail size={18} />}
                    label="Shared via Email"
                    value="43"
                />
                <QuickStat
                    icon={<Clock size={18} />}
                    label="Last Generated"
                    value="2h ago"
                />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${selectedCategory === cat.id
                                ? 'bg-amrita-maroon text-white shadow-lg shadow-amrita-maroon/30'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {cat.label}
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${selectedCategory === cat.id
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            }`}>
                            {cat.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredReports.map(report => (
                    <ReportCard
                        key={report.id}
                        {...report}
                        onGenerate={() => handleGenerate(report)}
                        onPreview={() => handlePreview(report)}
                        onEmail={() => handleEmail(report)}
                    />
                ))}
            </div>

            {/* Recent Reports */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-lg flex items-center gap-3 dark:text-white">
                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                            <Clock className="text-amrita-maroon" size={20} />
                        </div>
                        Recently Generated Reports
                    </h3>
                    <button className="text-xs font-black text-amrita-maroon hover:underline">
                        View All History
                    </button>
                </div>
                <div className="space-y-3">
                    {recentReports.map((report, i) => (
                        <RecentReportItem key={i} {...report} />
                    ))}
                </div>
            </div>

            {/* Scheduled Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="font-black text-lg mb-4 flex items-center gap-3 dark:text-white">
                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                            <Calendar className="text-amrita-maroon" size={20} />
                        </div>
                        Scheduled Reports
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amrita-maroon text-white rounded-lg flex items-center justify-center font-black text-sm">
                                    M
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Weekly Placement Summary</p>
                                    <p className="text-xs text-gray-400">Every Monday, 9:00 AM</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center font-black text-sm">
                                    1
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Monthly Analytics Report</p>
                                    <p className="text-xs text-gray-400">1st of every month, 10:00 AM</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 rounded-xl font-bold text-sm hover:border-amrita-maroon hover:text-amrita-maroon transition-all">
                        + Add Scheduled Report
                    </button>
                </div>

                {/* Report Templates */}
                <div className="glass-card p-6">
                    <h3 className="font-black text-lg mb-4 flex items-center gap-3 dark:text-white">
                        <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                            <FileText className="text-amrita-maroon" size={20} />
                        </div>
                        Custom Report Builder
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Create custom reports by selecting specific fields and filters.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <input type="checkbox" className="w-4 h-4 accent-amrita-maroon" defaultChecked />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student Details</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <input type="checkbox" className="w-4 h-4 accent-amrita-maroon" defaultChecked />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Placement Status</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <input type="checkbox" className="w-4 h-4 accent-amrita-maroon" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CTC Information</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <input type="checkbox" className="w-4 h-4 accent-amrita-maroon" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Details</span>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2.5 bg-amrita-maroon text-white rounded-xl font-bold text-sm hover:bg-amrita-dark transition-all flex items-center justify-center gap-2">
                        <Sparkles size={16} />
                        Generate Custom Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
