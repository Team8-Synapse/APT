import React from 'react';
import {
    LayoutDashboard, Calendar, Users, Briefcase, Brain, GraduationCap,
    Megaphone, BarChart3, FileSpreadsheet, Sparkles, Search, BellRing,
    Sun, Moon, Settings, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
        { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} />, path: '/admin' },
        { id: 'students', label: 'Students', icon: <Users size={18} />, path: '/admin' },
        { id: 'drives', label: 'Company Drives', icon: <Briefcase size={18} />, path: '/admin' },
        { id: 'prep', label: 'Prep Hub', icon: <Brain size={18} />, path: '/admin' },
        { id: 'alumni', label: 'Alumni Insights', icon: <GraduationCap size={18} />, path: '/admin' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={18} />, path: '/admin/announcements' },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, path: '/admin' },
        { id: 'reports', label: 'Reports', icon: <FileSpreadsheet size={18} />, path: '/admin' }
    ];

    const handleNavClick = (item) => {
        if (item.path !== window.location.pathname) {
            navigate(item.path);
            // If we are navigating to /admin, we might need to tell it which tab to open
            // but for now, we'll let the dashboard handle its own internal state if it's already on that page.
            // If we are on /admin/announcements and click 'Dashboard', it goes to /admin.
        }
        if (setActiveTab) {
            setActiveTab(item.id);
        }
    };

    return (
        <div className="glass-card !bg-white/80 dark:!bg-gray-900/80 !rounded-3xl p-3 flex flex-wrap items-center justify-between sticky top-4 z-50 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-6">
                {/* Amrita Branding */}
                <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-amrita-maroon rounded-xl flex items-center justify-center text-white shadow-lg shadow-amrita-maroon/20">
                        <Sparkles size={20} className="text-[#FFD700]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-amrita-maroon leading-tight tracking-tighter uppercase">Amrita</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Placement Tracker</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center gap-1 overflow-x-auto scroller-hide">
                    {navItems.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleNavClick(tab)}
                            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-amrita-maroon text-white shadow-lg shadow-amrita-maroon/30 scale-105'
                                : 'text-gray-500 hover:text-amrita-maroon hover:bg-amrita-maroon/5'
                                }`}
                        >
                            {tab.icon}
                            <span className={activeTab === tab.id ? 'block' : 'hidden lg:block'}>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4 pl-6">
                {/* Search Bar */}
                <div className="relative hidden xl:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search intelligence..."
                        className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#8B0000]/20 w-48 transition-all"
                        value={filters?.search || ''}
                        onChange={(e) => setFilters && setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowNotifications && setShowNotifications(prev => !prev)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative transition-colors text-gray-500 z-10"
                    >
                        <BellRing size={20} />
                        {stats?.announcementCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
                    </button>
                    <button
                        onClick={() => setDarkMode && setDarkMode(!darkMode)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* User Profile */}
                <div className="relative group">
                    <button className="flex items-center gap-2 p-1 pl-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300 hidden md:block">Admin</span>
                        <div className="w-8 h-8 bg-amrita-maroon text-white rounded-xl flex items-center justify-center font-bold shadow-inner">
                            A
                        </div>
                    </button>
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white">Admin User</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black">{user?.email}</p>
                        </div>
                        <div className="p-2">
                            <button className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 w-full">
                                <Settings size={14} /> Account Settings
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 p-2 hover:bg-red-50 text-red-600 rounded-lg text-xs font-bold w-full mt-1"
                            >
                                <LogOut size={14} /> Logout
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
