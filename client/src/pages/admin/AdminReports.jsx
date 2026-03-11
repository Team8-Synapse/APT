import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FileSpreadsheet, Download, Filter, Calendar, Users, Briefcase,
    Building2, RefreshCw, BarChart3, PieChart, Sparkles, TrendingUp,
    FileText, CheckCircle, AlertCircle, Clock, Printer, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable UI Components (Tailwind + Amrita Theme) ---

const SectionCard = ({ children, title, icon: Icon, className = "" }) => (
    <div className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm relative overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                <Icon size={20} />
            </div>
            <h3 className="font-black text-lg text-gray-800">{title}</h3>
        </div>
        {children}
    </div>
);

const ReportTypeCard = ({ label, description, icon: Icon, active, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-xl w-full h-full flex flex-col ${active
            ? 'border-amrita-maroon bg-amrita-maroon/5'
            : 'border-gray-100 bg-white hover:border-amrita-maroon/30'
            }`}
    >
        <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${active ? 'bg-amrita-maroon text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-amrita-maroon/10 group-hover:text-amrita-maroon'
            }`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h4 className={`font-black text-lg mb-1 ${active ? 'text-amrita-maroon' : 'text-gray-800'}`}>
                {label}
            </h4>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">
                {description}
            </p>
        </div>
        {active && (
            <div className="absolute top-4 right-4 text-amrita-maroon animate-scale-in">
                <CheckCircle size={20} fill="currentColor" className="text-white" />
            </div>
        )}
    </button>
);

const FilterSelect = ({ label, icon: Icon, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
            <Icon size={12} /> {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-gray-50 border-2 border-gray-100 text-gray-900 text-sm font-semibold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amrita-maroon focus:ring-4 focus:ring-amrita-maroon/10 transition-all cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
    </div>
);

const ActionButton = ({ label, onClick, disabled, loading, variant = "primary", icon: Icon, className = "" }) => {
    const variants = {
        primary: "bg-amrita-maroon text-white hover:bg-amrita-maroon/90 shadow-amrita-maroon/20",
        secondary: "bg-white border-2 border-gray-100 text-gray-700 hover:border-amrita-maroon hover:text-amrita-maroon",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${variants[variant]} ${className}`}
        >
            {loading ? (
                <RefreshCw size={18} className="animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={18} />}
                    {label}
                </>
            )}
        </button>
    );
};

// --- Main Page Component ---

const AdminReports = () => {
    const [reportType, setReportType] = useState('student_db');
    const [selectedBatch, setSelectedBatch] = useState('2026');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);
    const [recordCount, setRecordCount] = useState(null);
    const [countLoading, setCountLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const reportOptions = [
        {
            value: 'student_db',
            label: 'Master Student Database',
            description: 'Full profile dump including academic history, skills, and contact info.',
            icon: Users,
            colorClass: 'bg-blue-500'
        },
        {
            value: 'placement_master',
            label: 'Placement Master List',
            description: 'Detailed log of all offers, CTC details, and company assignments.',
            icon: Briefcase,
            colorClass: 'bg-amrita-maroon'
        },
        {
            value: 'unplaced',
            label: 'Unplaced Analysis',
            description: 'Focused list of students eligible but not yet placed for targeted support.',
            icon: AlertCircle,
            colorClass: 'bg-orange-500'
        },
        {
            value: 'company_stats',
            label: 'Company Visit ROI',
            description: 'Recruitment patterns, average packages, and conversion rates per company.',
            icon: Building2,
            colorClass: 'bg-green-600'
        }
    ];

    // Show notification helper
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // Fetch live count based on filters
    useEffect(() => {
        const fetchCount = async () => {
            setCountLoading(true);
            try {
                const token = localStorage.getItem('token');
                const params = new URLSearchParams();
                if (selectedBatch !== 'All') params.append('batch', selectedBatch);
                if (selectedDept !== 'All') params.append('department', selectedDept);
                if (selectedStatus !== 'All') params.append('status', selectedStatus);

                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/reports/count?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecordCount(res.data.count);
            } catch (err) {
                console.error(err);
            } finally {
                setCountLoading(false);
            }
        };

        fetchCount();
    }, [selectedBatch, selectedDept, selectedStatus]);

    const generateReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/reports/generate`, {
                params: {
                    type: reportType,
                    batch: selectedBatch,
                    department: selectedDept,
                    status: selectedStatus
                },
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Amrita_Report_${reportType}_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showNotification('success', 'Report generated and downloaded successfully!');
        } catch (err) {
            console.error(err);
            showNotification('error', 'Critical failure during report generation.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAIInsights = async () => {
        setAiLoading(true);
        setAiInsights(null);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/reports/ai-analyze`, {
                type: reportType,
                batch: selectedBatch,
                department: selectedDept,
                status: selectedStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAiInsights(res.data);
            showNotification('success', 'AI Analysis Complete: Insights rendered below.');
        } catch (err) {
            console.error(err);
            showNotification('error', 'AI Neural Engine timed out. Please retry.');
        } finally {
            setAiLoading(false);
        }
    };

    const resetFilters = () => {
        setSelectedBatch('All');
        setSelectedDept('All');
        setSelectedStatus('All');
        showNotification('info', 'Filters reset to default');
    };

    // Auto-select status when switching report types
    const handleReportSelect = (type) => {
        setReportType(type);
        setAiInsights(null); // Clear insights when type changes
        if (type === 'unplaced') {
            setSelectedStatus('Unplaced');
        } else if (type === 'company_stats') {
            setSelectedStatus('Placed');
        } else {
            setSelectedStatus('All');
        }
    };

    return (
        <div className="page-enter min-h-screen pb-20 !bg-white">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in border-l-4 ${notification.type === 'success' ? 'bg-white border-green-500 text-green-700' :
                    notification.type === 'error' ? 'bg-white border-red-500 text-red-700' :
                        'bg-white border-blue-500 text-blue-700'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{notification.message}</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <BarChart3 className="text-amrita-maroon" size={28} />
                        <span className="text-gray-900">Reports &</span> <span style={{ color: '#A4123F' }}>Intelligence</span>
                    </h1>
                    <p className="mt-2 text-gray-500 font-medium ml-1">
                        Select a report type below to configure and generate insights.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 px-4 py-2 rounded-xl text-xs font-bold text-gray-500">
                        System Status: <span className="text-green-600">● Online</span>
                    </div>
                </div>
            </div>

            {/* Report Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {reportOptions.map((option) => (
                    <ReportTypeCard
                        key={option.value}
                        {...option}
                        active={reportType === option.value}
                        onClick={() => handleReportSelect(option.value)}
                    />
                ))}
            </div>

            {/* Main Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Configuration Column (2/3 width) */}
                <SectionCard title="Query Configuration" icon={Filter} className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                        <FilterSelect
                            label="Target Batch"
                            icon={Calendar}
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Batches' },
                                { value: '2023', label: 'Batch 2023' },
                                { value: '2024', label: 'Batch 2024' },
                                { value: '2025', label: 'Batch 2025' },
                                { value: '2026', label: 'Batch 2026' },
                                { value: '2027', label: 'Batch 2027' }
                            ]}
                        />

                        <FilterSelect
                            label="Department"
                            icon={Building2}
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Departments' },
                                { value: 'CSE', label: 'Computer Science (CSE)' },
                                { value: 'ECE', label: 'Electronics (ECE)' },
                                { value: 'EEE', label: 'Electrical (EEE)' },
                                { value: 'ME', label: 'Mechanical (ME)' },
                                { value: 'CE', label: 'Civil (CE)' },
                                { value: 'AI', label: 'Artificial Intelligence' }
                            ]}
                        />

                        {!['unplaced'].includes(reportType) && (
                            <FilterSelect
                                label="Placement Status"
                                icon={Briefcase}
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                options={[
                                    { value: 'All', label: 'All Statuses' },
                                    { value: 'Placed', label: 'Placed Only' },
                                    { value: 'Unplaced', label: 'Unplaced Only' }
                                ]}
                            />
                        )}

                        <div className="lg:col-span-3 flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${countLoading ? 'bg-gray-100 border-gray-200 animate-pulse' : 'bg-green-50/50 border-green-100'}`}>
                                    <div className="p-2 bg-green-100/50 rounded-lg text-green-600">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Matching Profiles</p>
                                        <p className="text-xl font-black text-gray-800 leading-none">
                                            {countLoading ? '...' : (recordCount !== null ? recordCount.toLocaleString() : '---')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 font-medium hidden md:block">
                                    Filters applied to database scan
                                </div>
                            </div>

                            <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xs hover:border-amrita-maroon hover:text-amrita-maroon transition-all flex items-center gap-2">
                                <RefreshCw size={14} /> Reset Filters
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 block">
                                    Ready to Export: {reportOptions.find(r => r.value === reportType)?.label}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    Filters: {selectedBatch !== 'All' ? selectedBatch : 'All Batches'} • {selectedDept !== 'All' ? selectedDept : 'All Depts'}
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <ActionButton
                                label={aiLoading ? "Analyzing..." : "Analyze with AI"}
                                onClick={fetchAIInsights}
                                disabled={aiLoading}
                                loading={aiLoading}
                                variant="secondary"
                                icon={Sparkles}
                            />
                            <ActionButton
                                label={loading ? "Processing..." : "Generate Report"}
                                onClick={generateReport}
                                disabled={loading}
                                loading={loading}
                                icon={Download}
                            />
                        </div>
                    </div>
                </SectionCard>

                {/* Quick Actions Column (1/3 width) */}
                <div className="space-y-6">
                    <SectionCard title="Quick Actions" icon={TrendingUp}>
                        <div className="space-y-3">
                            <ActionButton
                                variant="success"
                                label="Dump Full CSV"
                                icon={FileSpreadsheet}
                                className="w-full justify-start"
                                onClick={() => {
                                    setReportType('student_db');
                                    resetFilters();
                                    generateReport();
                                }}
                            />
                            <ActionButton
                                variant="secondary"
                                label="Print Summary"
                                icon={Printer}
                                className="w-full justify-start"
                                onClick={() => showNotification('info', 'PDF Generation coming soon!')}
                            />
                        </div>
                    </SectionCard>

                    <div className="bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white rounded-[2rem] p-6 shadow-sm">
                        <h3 className="font-black text-lg mb-2">Detailed Analytics?</h3>
                        <p className="text-white/80 text-sm mb-4">
                            View interactive charts and graphs for deeper insights.
                        </p>
                        <button
                            onClick={() => window.location.href = '/admin'}
                            className="w-full py-3 bg-white text-amrita-maroon rounded-xl font-bold text-sm hover:bg-white/90 shadow-lg transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>

                {/* AI Insights Panel (Conditionally Visible) */}
                {aiInsights && (
                    <div className="lg:col-span-3 animate-slide-up">
                        <SectionCard title="AI Intelligence Hub" icon={Sparkles} className="bg-gradient-to-r from-amrita-maroon/5 to-transparent border-l-4 border-l-amrita-maroon">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-6">
                                    <div className="p-6 bg-white rounded-2xl border border-amrita-maroon/10 shadow-sm">
                                        <h4 className="flex items-center gap-2 text-amrita-maroon font-black mb-3 text-lg">
                                            <FileText size={20} /> Executive Summary
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {aiInsights.summary}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {aiInsights.metrics.map((metric, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">
                                                    {metric.label}
                                                </span>
                                                <span className={`text-xl font-black ${metric.color === 'green' ? 'text-green-600' :
                                                    metric.color === 'blue' ? 'text-blue-600' :
                                                        metric.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`}>
                                                    {metric.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                            <TrendingUp size={18} className="text-blue-500" /> Key Observations
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {aiInsights.insights.map((insight, idx) => (
                                                <div key={idx} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-blue-800 text-sm font-semibold flex gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    {insight}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" /> AI Recommendations
                                    </h4>
                                    <div className="space-y-3">
                                        {aiInsights.recommendations.map((rec, idx) => (
                                            <div key={idx} className="p-4 bg-green-50/50 rounded-xl border border-green-100/50 text-green-800 text-sm font-bold flex items-start gap-3">
                                                <div className="p-1 bg-green-500 text-white rounded mt-0.5">
                                                    <Sparkles size={12} />
                                                </div>
                                                {rec}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-2 opacity-60">
                                        <Database size={24} className="text-gray-400" />
                                        <p className="text-xs font-medium text-gray-500">More insights will appear as data matures</p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;

