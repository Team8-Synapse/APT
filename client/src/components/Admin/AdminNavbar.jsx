import React from 'react';
import {
    LayoutDashboard, Calendar, Users, Briefcase, Brain, GraduationCap,
    Megaphone, BarChart3, FileSpreadsheet, Sparkles, BellRing,
    Settings, LogOut, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import NotificationsPanel from '../NotificationsPanel';

const AdminNavbar = ({
    activeTab,
    setActiveTab,
    user,
    logout,
    darkMode,
    setDarkMode,
    showNotifications,
    setShowNotifications,
    stats,
    filters,
    setFilters
}) => {
    const navigate = useNavigate();

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} />, path: '/admin' },
        { id: 'students', label: 'Students', icon: <Users size={20} />, path: '/admin' },
        { id: 'drives', label: 'Company Drives', icon: <Briefcase size={20} />, path: '/admin' },
        { id: 'prep', label: 'Prep Hub', icon: <Brain size={20} />, path: '/admin' },
        { id: 'alumni', label: 'Alumni Connect', icon: <GraduationCap size={20} />, path: '/admin' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} />, path: '/admin/announcements' },
        { id: 'ticker', label: 'Ticker', icon: <MessageSquare size={20} />, path: '/admin' },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin' },
        { id: 'reports', label: 'Reports', icon: <FileSpreadsheet size={20} />, path: '/admin' }
    ];

    const handleNavClick = (item) => {
        if (item.path !== window.location.pathname) {
            navigate(item.path);
        }
        if (setActiveTab) {
            setActiveTab(item.id);
        }
    };

    return (
        <div className="glass-card !bg-white/90 dark:!bg-gray-900/90 !rounded-2xl px-4 py-2 flex items-center justify-between sticky top-4 z-50 backdrop-blur-xl border border-white/20 shadow-xl">
            {/* Amrita Branding */}
            <div className="flex items-center gap-3 pr-5 border-r border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/admin')}>
                <img src={logoImg} alt="Amrita Placement Tracker" className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Navigation Tabs - Single Row */}
            <nav className="flex items-center gap-1 flex-1 justify-center px-4">
                {navItems.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleNavClick(tab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-amrita-maroon text-white shadow-lg shadow-amrita-maroon/30'
                            : 'text-gray-600 hover:text-amrita-maroon hover:bg-amrita-maroon/10'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>

            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center gap-3 pl-5 border-l border-gray-200 dark:border-gray-700">
                {/* Notifications */}
                <button
                    onClick={() => setShowNotifications && setShowNotifications(prev => !prev)}
                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative transition-colors text-gray-500"
                >
                    <BellRing size={22} />
                    {stats?.announcementCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
                </button>

                {/* User Profile */}
                <div className="relative group">
                    <button className="flex items-center gap-2 p-1.5 pl-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Admin</span>
                        <div className="w-9 h-9 bg-amrita-maroon text-white rounded-lg flex items-center justify-center font-bold text-base shadow-inner">
                            A
                        </div>
                    </button>
                    <div className="absolute right-0 top-14 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-base text-gray-900 dark:text-white">Admin User</p>
                            <p className="text-xs text-gray-500 uppercase font-bold mt-1">{user?.email}</p>
                        </div>
                        <div className="p-2">
                            <button className="flex items-center gap-2 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 w-full">
                                <Settings size={16} /> Account Settings
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 p-2.5 hover:bg-red-50 text-red-600 rounded-lg text-sm font-semibold w-full mt-1"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
                {showNotifications && <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}
            </div>
        </div>
    );
};

export default AdminNavbar;
