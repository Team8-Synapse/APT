import React, { useState } from 'react';
import {
    LayoutDashboard, Calendar, Users, Briefcase, Brain, GraduationCap,
    Megaphone, BarChart3, FileSpreadsheet, Sparkles, BellRing,
    Settings, LogOut, MessageSquare, Menu, X, Sun, Moon
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} />, path: '/admin' },
        { id: 'students', label: 'Students', icon: <Users size={20} />, path: '/admin' },
        { id: 'drives', label: 'Company Drives', icon: <Briefcase size={20} />, path: '/admin' },
        { id: 'prep', label: 'Prep Hub', icon: <Brain size={20} />, path: '/admin' },
        { id: 'alumni', label: 'Alumni Connect', icon: <GraduationCap size={20} />, path: '/admin' },
        { id: 'ai-insights', label: 'Neural Insights', icon: <Brain size={20} />, path: '/admin' },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} />, path: '/admin' },
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
        setMobileMenuOpen(false);
    };

    return (
        <div className="glass-card !rounded-2xl border-white/20 bg-white shadow-xl p-3 md:px-4 md:py-2 flex flex-col justify-between sticky top-4 z-50 backdrop-blur-xl gap-y-3 md:gap-y-0">
            <div className="flex items-center justify-between w-full">
                {/* Amrita Branding */}
                <div className="flex items-center gap-3 pr-2 md:pr-5 md:border-r md:border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/admin')}>
                    <img src={logoImg} alt="Amrita Placement Tracker" className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform duration-300" />
                </div>

                {/* Desktop Navigation Tabs */}
                <nav className="hidden md:flex items-center gap-1 flex-1 justify-center px-4">
                    {navItems.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleNavClick(tab)}
                            className={`flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-amrita-maroon text-white shadow-lg shadow-amrita-maroon/30'
                                : 'text-gray-700 hover:text-amrita-maroon hover:bg-amrita-maroon/10'
                                }`}
                        >
                            <span className="scale-90 lg:scale-100">{tab.icon}</span>
                            <span className="hidden lg:block">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Right Section - Notifications & Profile */}
                <div className="flex items-center gap-2 pl-2 md:pl-5 md:border-l border-gray-200 dark:border-gray-700">
                    {/* Dark Mode Toggle */}
                    {setDarkMode && (
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 transition-all hover:bg-gray-100 rounded-xl text-gray-700"
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}

                    {/* Notifications */}
                    <button
                        onClick={() => setShowNotifications && setShowNotifications(prev => !prev)}
                        className="p-2 hover:bg-gray-100 rounded-xl relative transition-colors text-amrita-maroon"
                    >
                        <BellRing size={20} className="md:w-[22px] md:h-[22px]" />
                        {stats?.announcementCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
                    </button>

                    {/* User Profile */}
                    <div className="relative group hidden md:block">
                        <button className="flex items-center gap-2 p-1 md:p-1.5 pl-3 md:pl-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                            <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hidden sm:block">Admin</span>
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-amrita-maroon text-white rounded-lg flex items-center justify-center font-bold text-base shadow-inner">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-700 ml-1"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {showNotifications && <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />}
                </div>
            </div>

            {/* Mobile Navigation Menu Dropdown */}
            {mobileMenuOpen && (
                <nav className="md:hidden flex flex-col gap-1 w-full border-t border-gray-100 dark:border-gray-700 pt-3 mt-1 pb-2 px-1 animate-fade-in-up">
                    {navItems.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleNavClick(tab)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 w-full ${activeTab === tab.id
                                ? 'bg-amrita-maroon text-white shadow-md'
                                : 'text-gray-700 hover:text-amrita-maroon hover:bg-gray-100'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 w-full text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default AdminNavbar;
