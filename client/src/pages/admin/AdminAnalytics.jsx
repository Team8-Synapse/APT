import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3, PieChart, TrendingUp, Users, Briefcase, Calendar,
    ArrowUpRight, ArrowDownRight, Activity, Target, Download,
    Filter, MoreHorizontal, ChevronDown, Eye, EyeOff, RefreshCw,
    CheckCircle, Clock, XCircle, TrendingDown, DollarSign,
    Building, GraduationCap, Award, FileText, Search, Settings,
    Bell, User, Shield, Database, Cpu, Smartphone, Globe,
    LineChart, BarChart, PieChart as PieChartIcon, Grid,
    LayoutDashboard, Zap, TrendingUp as TrendingUpIcon,
    DownloadCloud, Upload, Save, Trash2, Eye as EyeIcon,
    Maximize2, Minimize2, RotateCcw, Filter as FilterIcon,
    Calendar as CalendarIcon, Hash, Percent, BarChart2,
    Layers, Grid3x3, Table, Map, PieChart as PieChart2,
    ScatterChart, Radar, Cloud, Database as DatabaseIcon,
    Crown, BookOpen, Book, Target as TargetIcon,
    UserCheck, UserX, UserMinus, Users as UsersIcon,
    Award as AwardIcon, TrendingUp as TrendUpIcon,
    TrendingDown as TrendDownIcon, School,
    Coffee, Code, Terminal, Server, Wifi,
    Battery, BatteryCharging, Smartphone as Phone,
    Laptop, Monitor, Tablet, Watch
} from 'lucide-react';

// Generate shades of #B1124A
const generateColorShades = (baseColor) => {
    return {
        50: '#FDF2F6',
        100: '#FAD8E4',
        200: '#F5B0CA',
        300: '#F089AF',
        400: '#EB6195',
        500: baseColor, // #B1124A
        600: '#8D0E3B',
        700: '#690A2C',
        800: '#45071D',
        900: '#22030E'
    };
};

const COLOR = generateColorShades('#B1124A');

// Process real data from backend
const processAnalyticsData = (rawData, selectedYear) => {
    if (!rawData || rawData.length === 0) return null;

    // Filter by selected year (if needed, but we also need overall trends)
    // rawData contains students from all available years

    // 1. Year Trends
    const years = [...new Set(rawData.map(s => s.batch_year))].sort();
    const yearTrends = years.map(year => {
        const students = rawData.filter(s => s.batch_year === year);
        const total = students.length;
        const placed = students.filter(s => s.placement_status === 'Placed').length;
        const inProgress = students.filter(s => s.placement_status === 'In Process').length;
        const notPlaced = students.filter(s => s.placement_status === 'Not Placed').length;
        const packages = students.filter(s => s.ctc).map(s => s.ctc);
        const avgPackage = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;

        return {
            year,
            total,
            placed,
            inProgress,
            notPlaced,
            avgPackage,
            placementRate: total ? ((placed / total) * 100).toFixed(1) : 0
        };
    });

    // Data for the Selected Year
    const yearData = rawData.filter(s => s.batch_year === selectedYear);
    const departments = [...new Set(yearData.map(s => s.dept_code))];

    // 2. Department Analysis
    const deptPlacement = departments.map(dept => {
        const students = yearData.filter(s => s.dept_code === dept);
        const total = students.length;
        const placed = students.filter(s => s.placement_status === 'Placed').length;
        const inProgress = students.filter(s => s.placement_status === 'In Process').length;
        const notPlaced = students.filter(s => s.placement_status === 'Not Placed').length;
        const packages = students.filter(s => s.ctc).map(s => s.ctc);
        const avgPackage = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;

        return {
            department: dept,
            placed,
            inProgress,
            notPlaced,
            total,
            placementRate: total ? ((placed / total) * 100).toFixed(1) : 0,
            avgPackage
        };
    });

    // 3. Company Trends (Top 10)
    const companies = [...new Set(rawData.filter(s => s.company).map(s => s.company))];
    let companyTrends = companies.map(company => {
        const hires = rawData.filter(s => s.company === company);
        const totalPlacements = hires.length;
        const packages = hires.map(s => s.ctc);
        const avgPackage = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;

        const trendData = years.map(year => {
            const yearHires = hires.filter(s => s.batch_year === year);
            const yearPackages = yearHires.map(s => s.ctc);
            return {
                year,
                placements: yearHires.length,
                avgPackage: yearPackages.length ? (yearPackages.reduce((a, b) => a + b, 0) / yearPackages.length).toFixed(1) : 0
            };
        });

        return {
            company,
            totalPlacements,
            avgPackage,
            trendData
        };
    });
    companyTrends.sort((a, b) => b.totalPlacements - a.totalPlacements); // Sort by total hires
    companyTrends = companyTrends.slice(0, 10); // Take top 10

    // 4. CGPA Analysis
    const cgpaRanges = [
        { label: '<7.0', min: 0, max: 6.99 },
        { label: '7.0-7.5', min: 7.0, max: 7.49 },
        { label: '7.5-8.0', min: 7.5, max: 7.99 },
        { label: '8.0-8.5', min: 8.0, max: 8.49 },
        { label: '8.5-9.0', min: 8.5, max: 8.99 },
        { label: '9.0+', min: 9.0, max: 10 }
    ];

    const cgpaAnalysis = cgpaRanges.map(range => {
        const students = yearData.filter(s => s.cgpa >= range.min && s.cgpa <= range.max);
        const total = students.length;
        const placed = students.filter(s => s.placement_status === 'Placed').length;
        const inProgress = students.filter(s => s.placement_status === 'In Process').length;
        const notPlaced = students.filter(s => s.placement_status === 'Not Placed').length;

        return {
            cgpaRange: range.label,
            total,
            placed,
            inProgress,
            notPlaced,
            placementRate: total ? ((placed / total) * 100).toFixed(1) : 0
        };
    });

    // 5. Batch Analysis (Same as Year Trends but focused structure)
    const batchAnalysis = years.map(batch => {
        const students = rawData.filter(s => s.batch_year === batch);
        const total = students.length;
        const placed = students.filter(s => s.placement_status === 'Placed').length;
        const inProgress = students.filter(s => s.placement_status === 'In Process').length;
        const notPlaced = students.filter(s => s.placement_status === 'Not Placed').length;
        const maxPackage = Math.max(...students.map(s => s.ctc || 0));

        return {
            batch: batch.toString(),
            total,
            placed,
            inProgress,
            notPlaced,
            placementRate: total ? ((placed / total) * 100).toFixed(1) : 0,
            topPackage: maxPackage || 0
        };
    });

    // 6. Monthly Trends (Mocked as real data doesn't have dates)
    // We will simulate distribution for visualization
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = months.map((month, i) => {
        // Pseudo-random distribution based on typical placement season (Aug-Dec peak)
        const factor = (i >= 7) ? 1.5 : 0.5;
        return {
            month,
            placed: Math.floor(Math.random() * yearData.length * 0.1 * factor),
            inProgress: Math.floor(Math.random() * yearData.length * 0.05),
            notPlaced: Math.floor(Math.random() * yearData.length * 0.02),
            offers: Math.floor(Math.random() * yearData.length * 0.15 * factor)
        };
    });

    // 7. Top Performers
    const topPerformers = yearData
        .filter(s => s.placement_status === 'Placed' && s.ctc > 0)
        .sort((a, b) => b.ctc - a.ctc)
        .slice(0, 10)
        .map((s, i) => ({
            id: i + 1,
            name: s.full_name,
            department: s.dept_code,
            cgpa: s.cgpa.toFixed(2),
            company: s.company,
            package: s.ctc,
            status: s.placement_status
        }));

    // Summary data for selected year
    const summaryStudents = yearData;
    const summaryPackages = summaryStudents.filter(s => s.ctc).map(s => s.ctc);

    return {
        yearTrends,
        deptPlacement,
        companyTrends,
        cgpaAnalysis,
        batchAnalysis,
        monthlyTrends,
        topPerformers,
        summary: {
            totalStudents: summaryStudents.length,
            placed: summaryStudents.filter(s => s.placement_status === 'Placed').length,
            inProgress: summaryStudents.filter(s => s.placement_status === 'In Process').length,
            notPlaced: summaryStudents.filter(s => s.placement_status === 'Not Placed').length,
            avgPlacementRate: summaryStudents.length ? ((summaryStudents.filter(s => s.placement_status === 'Placed').length / summaryStudents.length) * 100).toFixed(1) : 0,
            avgPackage: summaryPackages.length ? (summaryPackages.reduce((a, b) => a + b, 0) / summaryPackages.length).toFixed(1) : 0,
            topPackage: Math.max(...summaryPackages, 0).toFixed(1)
        }
    };
};

// Custom Chart Components
const YearlyTrendChart = ({ data, selectedYear }) => {
    const maxValue = Math.max(...data.map(d => d.total));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900 dark:text-white">Year-over-Year Trends</h4>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[500] }}></div>
                        <span className="text-xs text-gray-600">Total Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[300] }}></div>
                        <span className="text-xs text-gray-600">Placed</span>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-between h-48 px-4">
                {data.map((yearData, index) => {
                    const isSelected = yearData.year === selectedYear;
                    const totalHeight = (yearData.total / maxValue) * 100;
                    const placedHeight = (yearData.placed / maxValue) * 100;

                    return (
                        <div key={yearData.year} className="flex flex-col items-center gap-1 w-12">
                            <div className="relative w-8">
                                <div
                                    className="w-8 rounded-t-lg absolute bottom-0"
                                    style={{
                                        height: `${totalHeight}%`,
                                        backgroundColor: isSelected ? COLOR[700] : COLOR[200],
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                                <div
                                    className="w-8 rounded-t-lg absolute bottom-0"
                                    style={{
                                        height: `${placedHeight}%`,
                                        backgroundColor: isSelected ? COLOR[500] : COLOR[300],
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#B1124A]' : 'text-gray-500'}`}>
                                {yearData.year}
                            </span>
                            <div className="text-center">
                                <div className="text-xs font-bold text-gray-900 dark:text-white">{yearData.placementRate}%</div>
                                <div className="text-xs text-gray-500">Rate</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StatusDonutChart = ({ placed, inProgress, notPlaced }) => {
    const total = placed + inProgress + notPlaced;
    const placedPercent = (placed / total) * 100;
    const inProgressPercent = (inProgress / total) * 100;
    const notPlacedPercent = (notPlaced / total) * 100;

    const circumference = 2 * Math.PI * 40;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={COLOR[100]}
                    strokeWidth="12"
                />

                {/* Placed segment */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={COLOR[500]}
                    strokeWidth="12"
                    strokeDasharray={`${placedPercent * circumference / 100} ${circumference}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                />

                {/* In Progress segment */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={COLOR[300]}
                    strokeWidth="12"
                    strokeDasharray={`${inProgressPercent * circumference / 100} ${circumference}`}
                    strokeDashoffset={`${-placedPercent * circumference / 100}`}
                    transform="rotate(-90 50 50)"
                />

                {/* Not Placed segment */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={COLOR[700]}
                    strokeWidth="12"
                    strokeDasharray={`${notPlacedPercent * circumference / 100} ${circumference}`}
                    strokeDashoffset={`${-(placedPercent + inProgressPercent) * circumference / 100}`}
                    transform="rotate(-90 50 50)"
                />

                {/* Center text */}
                <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    className="text-2xl font-bold fill-gray-900 dark:fill-white"
                >
                    {total}
                </text>
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    className="text-sm fill-gray-500"
                >
                    Total
                </text>
            </svg>

            {/* Legend */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[500] }}></div>
                    <span className="text-xs text-gray-600">Placed</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[300] }}></div>
                    <span className="text-xs text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[700] }}></div>
                    <span className="text-xs text-gray-600">Not Placed</span>
                </div>
            </div>
        </div>
    );
};

const DepartmentBarChart = ({ data }) => {
    const maxTotal = Math.max(...data.map(d => d.total));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900 dark:text-white">Department-wise Placement</h4>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[500] }}></div>
                        <span className="text-xs text-gray-600">Placed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR[300] }}></div>
                        <span className="text-xs text-gray-600">In Progress</span>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {data.map((dept, index) => {
                    const placedWidth = (dept.placed / maxTotal) * 100;
                    const inProgressWidth = (dept.inProgress / maxTotal) * 100;
                    const notPlacedWidth = (dept.notPlaced / maxTotal) * 100;

                    return (
                        <div key={dept.department} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-900 dark:text-white w-20">{dept.department}</span>
                                <span className="text-gray-500">{dept.placementRate}%</span>
                            </div>
                            <div className="flex h-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <div
                                    className="transition-all duration-500"
                                    style={{
                                        width: `${placedWidth}%`,
                                        backgroundColor: COLOR[500]
                                    }}
                                    title={`Placed: ${dept.placed}`}
                                />
                                <div
                                    className="transition-all duration-500"
                                    style={{
                                        width: `${inProgressWidth}%`,
                                        backgroundColor: COLOR[300]
                                    }}
                                    title={`In Progress: ${dept.inProgress}`}
                                />
                                <div
                                    className="transition-all duration-500"
                                    style={{
                                        width: `${notPlacedWidth}%`,
                                        backgroundColor: COLOR[700]
                                    }}
                                    title={`Not Placed: ${dept.notPlaced}`}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Total: {dept.total}</span>
                                <span>Package: ₹{dept.avgPackage}L</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CompanyTrendChart = ({ data, selectedYear }) => {
    const selectedCompanyData = data.find(c => c.company === selectedYear) || data[0];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900 dark:text-white">Company-wise Trends</h4>
                <select
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#B1124A]"
                    value={selectedYear}
                    onChange={() => { }}
                >
                    {data.map(company => (
                        <option key={company.company} value={company.company}>
                            {company.company}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {data.slice(0, 4).map(company => (
                    <div key={company.company} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#B1124A] transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Building size={16} className="text-[#B1124A]" />
                                <span className="font-bold text-gray-900 dark:text-white">{company.company}</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: COLOR[100], color: COLOR[700] }}>
                                {company.totalPlacements} placed
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Avg Package</span>
                                <span className="font-bold text-gray-900 dark:text-white">₹{company.avgPackage}L</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(company.totalPlacements / Math.max(...data.map(c => c.totalPlacements))) * 100}%`,
                                        backgroundColor: COLOR[500]
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-48 flex items-end gap-2">
                {selectedCompanyData.trendData.map((trend, index) => (
                    <div key={trend.year} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-full">
                            <div
                                className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                                style={{
                                    height: `${(trend.placements / 100) * 80}%`,
                                    backgroundColor: COLOR[500]
                                }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {trend.placements} placements
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <div className="text-xs font-bold text-gray-900 dark:text-white">{trend.year}</div>
                            <div className="text-xs text-gray-500">₹{trend.avgPackage}L</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CGPAAnalysisChart = ({ data }) => {
    return (
        <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white">CGPA-wise Analysis</h4>
            <div className="space-y-4">
                {data.map((cgpa, index) => {
                    const placedPercent = (cgpa.placed / cgpa.total) * 100;
                    const inProgressPercent = (cgpa.inProgress / cgpa.total) * 100;
                    const notPlacedPercent = (cgpa.notPlaced / cgpa.total) * 100;

                    return (
                        <div key={cgpa.cgpaRange} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">{cgpa.cgpaRange}</span>
                                <span className="text-gray-500">{cgpa.placementRate}% placed</span>
                            </div>
                            <div className="relative h-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <div
                                    className="absolute left-0 h-full transition-all duration-500"
                                    style={{
                                        width: `${placedPercent}%`,
                                        backgroundColor: COLOR[500]
                                    }}
                                    title={`Placed: ${cgpa.placed}`}
                                />
                                <div
                                    className="absolute left-0 h-full transition-all duration-500"
                                    style={{
                                        width: `${placedPercent + inProgressPercent}%`,
                                        backgroundColor: COLOR[300]
                                    }}
                                    title={`In Progress: ${cgpa.inProgress}`}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Total: {cgpa.total}</span>
                                <div className="flex gap-3">
                                    <span>Placed: {cgpa.placed}</span>
                                    <span>In Progress: {cgpa.inProgress}</span>
                                    <span>Not Placed: {cgpa.notPlaced}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BatchAnalysisChart = ({ data }) => {
    return (
        <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white">Batch-wise Performance</h4>
            <div className="space-y-6">
                {data.map((batch, index) => (
                    <div key={batch.batch} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">{batch.batch}</span>
                            <span className="text-sm" style={{ color: COLOR[700] }}>{batch.placementRate}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLOR[50] }}>
                                <div className="text-2xl font-bold" style={{ color: COLOR[500] }}>{batch.placed}</div>
                                <div className="text-xs text-gray-600">Placed</div>
                            </div>
                            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLOR[100] }}>
                                <div className="text-2xl font-bold" style={{ color: COLOR[500] }}>{batch.inProgress}</div>
                                <div className="text-xs text-gray-600">In Progress</div>
                            </div>
                            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLOR[200] }}>
                                <div className="text-2xl font-bold" style={{ color: COLOR[700] }}>{batch.notPlaced}</div>
                                <div className="text-xs text-gray-600">Not Placed</div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Total: {batch.total}</span>
                            <span>Top Package: ₹{batch.topPackage}L</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MonthlyTrendChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.offers));

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white">Monthly Trends</h4>
            <div className="flex items-end justify-between h-48">
                {data.map((month, index) => (
                    <div key={month.month} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-3/4">
                            {/* Not Placed */}
                            <div
                                className="w-full rounded-t transition-all duration-300"
                                style={{
                                    height: `${(month.notPlaced / maxValue) * 100}%`,
                                    backgroundColor: COLOR[700],
                                    opacity: 0.8
                                }}
                            />
                            {/* In Progress */}
                            <div
                                className="w-full rounded-t transition-all duration-300"
                                style={{
                                    height: `${((month.notPlaced + month.inProgress) / maxValue) * 100}%`,
                                    backgroundColor: COLOR[300],
                                    opacity: 0.9
                                }}
                            />
                            {/* Placed */}
                            <div
                                className="w-full rounded-t transition-all duration-300 group-hover:opacity-90"
                                style={{
                                    height: `${((month.notPlaced + month.inProgress + month.placed) / maxValue) * 100}%`,
                                    backgroundColor: COLOR[500]
                                }}
                            />

                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Offers: {month.offers}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <div className="text-xs font-bold text-gray-900 dark:text-white">{month.month}</div>
                            <div className="text-xs text-gray-500">{month.placed} placed</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Component
const AdminAnalytics = () => {
    const [selectedYear, setSelectedYear] = useState(2026); // Default to current batch
    const [viewMode, setViewMode] = useState('overview');
    const [data, setData] = useState(null);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customization, setCustomization] = useState({
        showPercentages: true,
        showTrendLines: true,
        animateCharts: true,
        compactView: false,
        highlightThreshold: 80
    });

    // Fetch raw data once
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5005/api/admin/analytics-dataset');
                if (!response.ok) throw new Error('Failed to fetch analytics data');
                const result = await response.json();
                setRawData(result);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process data when year changes or raw data loads
    useEffect(() => {
        if (rawData) {
            const processed = processAnalyticsData(rawData, selectedYear);
            setData(processed);
        }
    }, [rawData, selectedYear]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-[#B1124A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading placement analytics...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
            <XCircle size={48} className="mb-4" />
            <p className="text-lg font-bold">Error loading data</p>
            <p className="text-sm opacity-80">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#B1124A] text-white rounded-lg hover:bg-[#8D0E3B] transition-colors"
            >
                Retry
            </button>
        </div>
    );

    if (!data) return null;

    const summary = data.summary;

    return (
        <div className="space-y-8 page-enter">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#B1124A] to-[#D1477C]">
                            <Activity className="text-white" size={28} />
                        </div>
                        Placement Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                        Comprehensive analysis for {selectedYear} | Fully customizable visualizations
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <CalendarIcon size={18} className="text-gray-500" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#B1124A]"
                            style={{ color: COLOR[500] }}
                        >
                            {data.yearTrends.map(t => t.year).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        {['overview', 'details', 'comparison'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === mode
                                    ? 'bg-gradient-to-r from-[#B1124A] to-[#D1477C] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6" style={{ borderLeft: `4px solid ${COLOR[500]}` }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: COLOR[50] }}>
                            <Users size={24} style={{ color: COLOR[500] }} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Students</h3>
                            <p className="text-3xl font-black" style={{ color: COLOR[500] }}>{summary.totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6" style={{ borderLeft: `4px solid ${COLOR[500]}` }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: COLOR[100] }}>
                            <UserCheck size={24} style={{ color: COLOR[500] }} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Placed</h3>
                            <p className="text-3xl font-black" style={{ color: COLOR[500] }}>{summary.placed}</p>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {((summary.placed / summary.totalStudents) * 100).toFixed(1)}% of total
                    </div>
                </div>

                <div className="glass-card p-6" style={{ borderLeft: `4px solid ${COLOR[300]}` }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: COLOR[50] }}>
                            <Clock size={24} style={{ color: COLOR[300] }} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase">In Progress</h3>
                            <p className="text-3xl font-black" style={{ color: COLOR[300] }}>{summary.inProgress}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6" style={{ borderLeft: `4px solid ${COLOR[700]}` }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: COLOR[50] }}>
                            <UserX size={24} style={{ color: COLOR[700] }} />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Not Placed</h3>
                            <p className="text-3xl font-black" style={{ color: COLOR[700] }}>{summary.notPlaced}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Year-over-Year Trends */}
                    <div className="glass-card p-6">
                        <YearlyTrendChart data={data.yearTrends} selectedYear={selectedYear} />
                    </div>

                    {/* Department-wise Analysis */}
                    <div className="glass-card p-6">
                        <DepartmentBarChart data={data.deptPlacement} />
                    </div>

                    {/* Company-wise Trends */}
                    <div className="glass-card p-6">
                        <CompanyTrendChart data={data.companyTrends} selectedYear={selectedYear} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Overall Status Donut */}
                    <div className="glass-card p-6">
                        <div className="text-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Overall Placement Status</h3>
                            <p className="text-sm text-gray-500">{selectedYear} Academic Year</p>
                        </div>
                        <StatusDonutChart
                            placed={summary.placed}
                            inProgress={summary.inProgress}
                            notPlaced={summary.notPlaced}
                        />
                        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold" style={{ color: COLOR[500] }}>{summary.avgPlacementRate}%</div>
                                <div className="text-xs text-gray-500">Placement Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold" style={{ color: COLOR[500] }}>₹{summary.avgPackage}L</div>
                                <div className="text-xs text-gray-500">Avg Package</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold" style={{ color: COLOR[500] }}>₹{summary.topPackage}L</div>
                                <div className="text-xs text-gray-500">Top Package</div>
                            </div>
                        </div>
                    </div>

                    {/* CGPA Analysis */}
                    <div className="glass-card p-6">
                        <CGPAAnalysisChart data={data.cgpaAnalysis} />
                    </div>

                    {/* Batch Analysis */}
                    <div className="glass-card p-6">
                        <BatchAnalysisChart data={data.batchAnalysis} />
                    </div>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="glass-card p-6">
                <MonthlyTrendChart data={data.monthlyTrends} />
            </div>

            {/* Customization Panel */}
            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Customization Panel</h3>
                    <button
                        onClick={() => setCustomization({
                            showPercentages: true,
                            showTrendLines: true,
                            animateCharts: true,
                            compactView: false,
                            highlightThreshold: 80
                        })}
                        className="px-4 py-2 text-sm font-bold rounded-lg"
                        style={{ backgroundColor: COLOR[100], color: COLOR[700] }}
                    >
                        Reset to Default
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={customization.showPercentages}
                                onChange={(e) => setCustomization({ ...customization, showPercentages: e.target.checked })}
                                className="rounded border-gray-300"
                                style={{ accentColor: COLOR[500] }}
                            />
                            Show Percentages
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={customization.showTrendLines}
                                onChange={(e) => setCustomization({ ...customization, showTrendLines: e.target.checked })}
                                className="rounded border-gray-300"
                                style={{ accentColor: COLOR[500] }}
                            />
                            Show Trend Lines
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={customization.animateCharts}
                                onChange={(e) => setCustomization({ ...customization, animateCharts: e.target.checked })}
                                className="rounded border-gray-300"
                                style={{ accentColor: COLOR[500] }}
                            />
                            Animate Charts
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={customization.compactView}
                                onChange={(e) => setCustomization({ ...customization, compactView: e.target.checked })}
                                className="rounded border-gray-300"
                                style={{ accentColor: COLOR[500] }}
                            />
                            Compact View
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Highlight Threshold: {customization.highlightThreshold}%
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            value={customization.highlightThreshold}
                            onChange={(e) => setCustomization({ ...customization, highlightThreshold: parseInt(e.target.value) })}
                            className="w-full h-2 rounded-lg"
                            style={{ accentColor: COLOR[500] }}
                        />
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="glass-card p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Top Performers - {selectedYear}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b">
                                <th className="pb-3">Student</th>
                                <th className="pb-3">Department</th>
                                <th className="pb-3">CGPA</th>
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Package (LPA)</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topPerformers.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="py-3 font-medium">{student.name}</td>
                                    <td className="py-3">{student.department}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold"
                                            style={{
                                                backgroundColor: student.cgpa >= 9 ? COLOR[100] : COLOR[50],
                                                color: COLOR[700]
                                            }}
                                        >
                                            {student.cgpa}
                                        </span>
                                    </td>
                                    <td className="py-3">{student.company}</td>
                                    <td className="py-3 font-bold" style={{ color: COLOR[500] }}>
                                        ₹{student.package}L
                                    </td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === 'Placed' ? 'bg-green-100 text-green-800' :
                                            student.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;