import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
    Download,
    FileText,
    TrendingUp,
    BarChart3,
    FileSpreadsheet,
    FileJson,
    Filter,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Calendar,
    Briefcase,
    Building2,
    Users,
    Search,
    ChevronDown,
    Printer,
    Sparkles,
    Database,
    UserX,
    LayoutGrid,
    List
} from 'lucide-react';

// --- Reusable UI Components (Tailwind + Amrita Theme) ---

const SectionCard = ({ children, title, icon: Icon, className = "" }) => (
    <div className={`glass-card p-6 relative overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon">
                <Icon size={20} />
            </div>
            <h3 className="font-black text-lg text-gray-800 dark:text-white">{title}</h3>
        </div>
        {children}
    </div>
);

const ReportTypeCard = ({ label, description, icon: Icon, active, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group hover:shadow-xl w-full h-full flex flex-col ${active
            ? 'border-amrita-maroon bg-amrita-maroon/5 dark:bg-red-900/10'
            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-amrita-maroon/30'
            }`}
    >
        <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${active ? 'bg-amrita-maroon text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-amrita-maroon/10 group-hover:text-amrita-maroon'
            }`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h4 className={`font-black text-lg mb-1 ${active ? 'text-amrita-maroon' : 'text-gray-800 dark:text-white'}`}>
                {label}
            </h4>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
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

const FilterSelect = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1 flex items-center gap-1">
            {Icon && <Icon size={12} />} {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amrita-maroon focus:ring-4 focus:ring-amrita-maroon/10 transition-all cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    </div>
);

const ActionButton = ({ onClick, disabled, loading, icon: Icon, label, variant = 'primary', className = '' }) => {
    const baseClass = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-amrita-maroon text-white hover:bg-amrita-dark shadow-lg shadow-amrita-maroon/20",
        secondary: "bg-white text-gray-700 border-2 border-gray-100 hover:border-amrita-maroon/30 hover:bg-gray-50",
        outline: "border-2 border-dashed border-gray-300 text-gray-500 hover:border-amrita-maroon hover:text-amrita-maroon",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
    };

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClass} ${variants[variant]} ${className}`}>
            {loading ? <RefreshCw size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
            {label}
        </button>
    );
};

const AdminReports = () => {
    // State
    const [reportType, setReportType] = useState('student_placement');
    const [selectedBatch, setSelectedBatch] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

    // Report Definitions
    const reportOptions = [
        {
            value: 'student_placement',
            label: 'Student Placement Report',
            description: 'Comprehensive list of students with placement status, offers, and CTC details.',
            icon: Users,
            endpoint: 'admin-csv',
            filename: 'placement_report.csv'
        },
        {
            value: 'company_stats',
            label: 'Company Intelligence',
            description: 'Recruiter-wise analysis including hire counts, avg CTC, and department breakdown.',
            icon: Building2,
            endpoint: 'company-csv',
            filename: 'company_stats.csv'
        },
        {
            value: 'unplaced',
            label: 'Unplaced Talent Pool',
            description: 'Focus list of students yet to be placed, useful for scheduling remediation drives.',
            icon: UserX,
            endpoint: 'admin-csv',
            params: { placementStatus: 'Unplaced' },
            filename: 'unplaced_students.csv'
        },
        {
            value: 'student_db',
            label: 'Full Database Export',
            description: 'Raw export of all student records for archival or external processing.',
            icon: Database,
            endpoint: 'admin-csv',
            filename: 'student_database.csv'
        }
    ];

    const generateReport = async () => {
        const selectedReport = reportOptions.find(r => r.value === reportType);
        if (!selectedReport) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();

            // Add user selected filters
            if (selectedBatch !== 'All') params.append('batch', selectedBatch);
            if (selectedDept !== 'All') params.append('department', selectedDept);

            // Handle Status Filter Logic
            // If the report type enforces a status (e.g. Unplaced), use that. 
            // Otherwise use user selection.
            if (selectedReport.params && selectedReport.params.placementStatus) {
                params.append('placementStatus', selectedReport.params.placementStatus);
            } else if (selectedStatus !== 'All') {
                params.append('placementStatus', selectedStatus);
            }

            const response = await axios.get(`${API_URL}/reports/${selectedReport.endpoint}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
                responseType: 'blob'
            });

            saveAs(response.data, selectedReport.filename);
            showNotification('success', `Generated ${selectedReport.label}`);
        } catch (error) {
            console.error('Download failed:', error);
            showNotification('error', 'Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
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
        if (type === 'unplaced') {
            setSelectedStatus('Unplaced');
        } else if (type === 'company_stats') {
            setSelectedStatus('Placed');
        } else {
            setSelectedStatus('All');
        }
    };

    return (
        <div className="page-enter min-h-screen pb-20">
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
                        <span style={{ color: '#1A1A1A' }}>Reports &</span> <span style={{ color: '#A4123F' }}>Intelligence</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        <FilterSelect
                            label="Target Batch"
                            icon={Calendar}
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            options={[
                                { value: 'All', label: 'All Batches' },
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

                        {/* Only show status filter if report type doesn't lock it */}
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

                        <div className="flex items-end">
                            <button onClick={resetFilters} className="w-full py-3.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-bold text-sm hover:border-amrita-maroon hover:text-amrita-maroon transition-all flex items-center justify-center gap-2">
                                <RefreshCw size={16} /> Reset
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white block">
                                    Ready to Export: {reportOptions.find(r => r.value === reportType)?.label}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    Filters: {selectedBatch !== 'All' ? selectedBatch : 'All Batches'} • {selectedDept !== 'All' ? selectedDept : 'All Depts'}
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
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

                    <div className="glass-card p-6 bg-gradient-to-br from-amrita-maroon to-amrita-pink text-white">
                        <h3 className="font-black text-lg mb-2">Detailed Analytics?</h3>
                        <p className="text-white/80 text-sm mb-4">
                            View interactive charts and graphs for deeper insights.
                        </p>
                        <button
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="w-full py-3 bg-white text-amrita-maroon rounded-xl font-bold text-sm hover:bg-white/90 shadow-lg transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminReports;
