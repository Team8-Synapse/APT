import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Briefcase, BookOpen, MessageSquare, Bell, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    return (
        <nav className="sticky top-0 z-50 px-4 py-3">
            <div className="max-w-7xl mx-auto glass-card !rounded-2xl border-white/20 bg-white/40 shadow-xl overflow-hidden">
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center group">
                            <div className="w-10 h-10 bg-amrita-maroon rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Sparkles className="text-amrita-gold" size={20} />
                            </div>
                            <div className="ml-3">
                                <span className="block text-amrita-maroon font-black text-xl leading-none">AMRITA</span>
                                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Placement Tracker</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            {!isAdmin ? (
                                <>
                                    <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} />
                                    <NavLink to="/alumni" icon={<MessageSquare size={18} />} label="Insights" active={location.pathname === '/alumni'} />
                                    <NavLink to="/prephub" icon={<BookOpen size={18} />} label="Prep Hub" active={location.pathname === '/prephub'} />
                                    <NavLink to="/profile" icon={<User size={18} />} label="Profile" active={location.pathname === '/profile'} />
                                </>
                            ) : (
                                <>
                                    <NavLink to="/admin" icon={<LayoutDashboard size={18} />} label="Admin" active={location.pathname === '/admin'} />
                                    <NavLink to="/admin/drives" icon={<Briefcase size={18} />} label="Drives" active={location.pathname.startsWith('/admin/drives')} />
                                    <NavLink to="/admin/resources" icon={<BookOpen size={18} />} label="Resources" active={location.pathname.startsWith('/admin/resources')} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 transition-colors hover:bg-white/50 rounded-full text-amrita-maroon">
                            <Bell size={20} />
                        </button>

                        <div className="h-8 w-[1px] bg-gray-200 mx-2" />

                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:block text-right">
                                <p className="text-xs font-bold text-gray-900 leading-none">{user.email.split('@')[0]}</p>
                                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter mt-1 italic">{user.role}</p>
                            </div>
                            <button onClick={handleLogout} className="btn-premium !py-2 !px-4 text-xs flex items-center shadow-md">
                                <LogOut size={14} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 space-x-2 ${active
            ? 'bg-amrita-maroon text-white shadow-lg'
            : 'text-gray-600 hover:bg-amrita-maroon/5 hover:text-amrita-maroon'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default Navbar;
