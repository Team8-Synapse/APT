import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Users, LayoutDashboard, Briefcase, BookOpen, MessageSquare, Bell, Sparkles, Moon, Sun, Calendar, FileText, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications`, {
                withCredentials: true // IMPORTANT for Auth
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/${id}`, {}, {
                withCredentials: true
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    const studentLinks = [
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/calendar', icon: <Calendar size={18} />, label: 'Schedule' },
        { to: '/drives', icon: <Briefcase size={18} />, label: 'Drives' },
        { to: '/applications', icon: <FileText size={18} />, label: 'Apps' },
        { to: '/experiences', icon: <MessageSquare size={18} />, label: 'Stories' },
        { to: '/alumni', icon: <Users size={18} />, label: 'Insights' },
        { to: '/prephub', icon: <BookOpen size={18} />, label: 'Prep' },
        { to: '/profile', icon: <User size={18} />, label: 'Profile' },
    ];

    const adminLinks = [
        { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/calendar', icon: <Calendar size={18} />, label: 'Schedule' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <nav className="sticky top-0 z-50 px-4 py-3">
            <div className="max-w-full mx-auto glass-card !rounded-2xl border-white/20 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/80 shadow-xl overflow-hidden">
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-amrita-maroon rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Sparkles className="text-amrita-gold" size={20} />
                            </div>
                            <div className="ml-2 hidden xl:block">
                                <span className="block text-amrita-maroon dark:text-amrita-gold font-black text-xl leading-none">AMRITA</span>
                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Placement Tracker</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {links.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    icon={link.icon}
                                    label={link.label}
                                    active={location.pathname === link.to}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 transition-all hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl text-gray-600 dark:text-gray-300"
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative z-50">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl text-amrita-maroon dark:text-amrita-gold relative"
                                style={{ zIndex: 51 }}
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full pointer-events-none"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 glass-card !rounded-2xl shadow-2xl overflow-hidden z-[100]">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                        <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? notifications.map(n => (
                                            <div
                                                key={n._id || n.id}
                                                onClick={() => markAsRead(n._id)}
                                                className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : 'bg-amrita-maroon'}`} />
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-bold leading-tight mb-1 ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {n.title || n.message}
                                                        </p>
                                                        {n.title && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{n.message}</p>}
                                                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center text-gray-400">
                                                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No updates yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center">
                                        <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-amrita-maroon dark:text-amrita-gold hover:underline">
                                            View All Notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />

                        {/* User Info & Logout */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="hidden lg:block text-right">
                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.email.split('@')[0]}</p>
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter mt-1 italic">{user.role}</p>
                            </div>
                            <button onClick={handleLogout} className="btn-premium !py-2 !px-4 text-xs flex items-center shadow-md">
                                <LogOut size={14} className="mr-2" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 px-6 py-4 space-y-2">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === link.to
                                    ? 'bg-amrita-maroon text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button onClick={handleLogout} className="w-full btn-premium py-3 flex items-center justify-center gap-2">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 gap-2 ${active
            ? 'bg-amrita-maroon text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-300 hover:bg-amrita-maroon/5 dark:hover:bg-amrita-maroon/20 hover:text-amrita-maroon dark:hover:text-amrita-gold'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default Navbar;
