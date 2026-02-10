import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Users, LayoutDashboard, Briefcase, BookOpen, MessageSquare, Bell, Sparkles, Moon, Sun, Calendar, FileText, Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';
import NotificationsPanel from './NotificationsPanel';

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
        { to: '/alumni-insights', icon: <Users size={18} />, label: 'Connect' },
        { to: '/prephub', icon: <BookOpen size={18} />, label: 'Prep' },
        { to: '/profile', icon: <User size={18} />, label: 'Profile' },
    ];

    const adminLinks = [
        { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/calendar', icon: <Calendar size={18} />, label: 'Schedule' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <nav className="sticky top-0 z-50 px-4 py-5">
            <div className="max-w-full mx-auto glass-card !rounded-2xl border-white/20 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/80 shadow-xl">
                <div className="px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center group">
                            <img src={logoImg} alt="Amrita Placement Tracker" className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300" />
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

                            <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
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
        </nav >
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 gap-2 ${active
            ? 'bg-amrita-maroon text-white shadow-lg'
            : 'text-gray-600 dark:text-gray-300 hover:bg-amrita-maroon/5 dark:hover:bg-amrita-maroon/20 hover:text-amrita-maroon dark:hover:text-amrita-gold'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default Navbar;
