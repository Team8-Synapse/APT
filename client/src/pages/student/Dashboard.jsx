import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    Target, TrendingUp, AlertCircle, Calendar, ChevronRight, Brain, Sparkles, Zap, Award,
    Briefcase, Clock, CheckCircle, XCircle, Send, Users, Building2, GraduationCap, Star,
    ArrowUpRight, Bell, FileText, MapPin, Flame, Trophy, BookOpen, Rocket, Heart,
    Timer, Lightbulb, Megaphone, ArrowRight, Play, Coffee, BarChart3, TrendingDown,
    Download, Eye, Filter, Search, Plus, Shield, Globe, UserCheck, Mail, Video,
    MessageSquare, ThumbsUp, Share2, RefreshCw, Settings, LogOut, BellRing, Moon,
    Sun, PieChart, Activity, Cpu, Smartphone, Database, Cloud, Terminal, Wifi,
    Battery, Volume2, HelpCircle, Info, AlertTriangle, Clock3, CalendarDays,
    ChevronLeft, Maximize2, Minimize2, X, MoreVertical, ExternalLink, Copy,
    Edit3, Trash2, Save, Upload, Link, Lock, Unlock, EyeOff, Eye as EyeIcon
} from 'lucide-react';
import NotificationsPanel from '../../components/NotificationsPanel';

// ============= MAROON-WHITE MODERN THEME =============
const theme = {
    maroon: {
        primary: '#B1124A',
        secondary: '#B1124A',
        light: '#D14D72',
        dark: '#7A0C32',
        gradient: 'linear-gradient(135deg, #B1124A 0%, #D14D72 100%)',
        subtle: 'rgba(177, 18, 74, 0.08)',
        medium: 'rgba(177, 18, 74, 0.15)',
        strong: 'rgba(177, 18, 74, 0.25)'
    },
    beige: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        light: '#FFFFFF',
        dark: '#F0F2F5'
    }
};

// ============= ANIMATED BACKGROUND =============
const AnimatedBackground = () => (
    <div className="animated-bg-dashboard">
        <div className="gradient-orb-d orb-d1"></div>
        <div className="gradient-orb-d orb-d2"></div>
        <div className="gradient-orb-d orb-d3"></div>
    </div>
);



// ============= ANIMATED COUNTER =============
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const startTime = Date.now();
                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(easeOut * end));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    animate();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// ============= TILT CARD =============
const TiltCard = ({ children, className = '' }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * -8;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div
            className={`tilt-card-d ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
                transition: 'transform 0.3s ease-out'
            }}
        >
            {isHovered && <div className="card-glow"></div>}
            {children}
        </div>
    );
};

// ============= FADE IN ANIMATION =============
const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1, rootMargin: '-20px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    const directions = {
        up: 'translateY(40px)',
        down: 'translateY(-40px)',
        left: 'translateX(40px)',
        right: 'translateX(-40px)'
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0) scale(1)' : `${directions[direction]} scale(0.95)`,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

// ============= ANIMATED SKILL BAR =============
const AnimatedSkillBar = ({ skill, level, delay = 0, color = '#B1124A' }) => {
    const [progress, setProgress] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    setTimeout(() => {
                        let start = 0;
                        const increment = level / 50;
                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= level) {
                                setProgress(level);
                                clearInterval(timer);
                            } else {
                                setProgress(Math.floor(start));
                            }
                        }, 20);
                    }, delay);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [level, delay, hasAnimated]);

    return (
        <div ref={ref} className="skill-bar-container">
            <div className="skill-bar-header">
                <span className="skill-name">{skill}</span>
                <span className="skill-level">{progress}%</span>
            </div>
            <div className="skill-bar-track">
                <div
                    className="skill-bar-fill"
                    style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}dd)`
                    }}
                >
                    <div className="skill-bar-glow"></div>
                </div>
            </div>
        </div>
    );
};

// ============= PULSE NOTIFICATION =============
const PulseNotification = ({ count }) => (
    <div className="pulse-notification">
        <span>{count}</span>
        <div className="pulse-ring"></div>
    </div>
);

// ============= MOCK DATA =============
const mockNotifications = [
    { id: 1, message: 'Google drive registration closes tomorrow!', type: 'urgent', time: '2h ago' },
    { id: 2, message: 'You\'ve been shortlisted for Microsoft', type: 'success', time: '5h ago' },
    { id: 3, message: 'New mock interview scheduled', type: 'info', time: '1d ago' },
];

// ============= MAIN DASHBOARD COMPONENT =============
const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        readinessScore: 78,
        profile: { name: '', department: 'Computer Science', cgpa: 8.5, placementStatus: 'not_placed', batch: '2026' },
        applications: { total: 5, inProgress: 2, offered: 1, rejected: 1 },
        drives: { upcoming: 8, eligible: 6 },
        skills: [
            { name: 'Data Structures', level: 85 },
            { name: 'Algorithms', level: 78 },
            { name: 'System Design', level: 65 },
            { name: 'React', level: 90 },
            { name: 'Node.js', level: 82 }
        ],
        mockInterviews: { completed: 3, scheduled: 2, averageScore: 7.5 },
        resources: { viewed: 12, completed: 8 }
    });
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [userStreak, setUserStreak] = useState(7);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch data
    useEffect(() => {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/announcements`);
                setAnnouncements(res.data || []);
            } catch (err) {
                console.error('Error fetching announcements:', err);
            }
        };

        const fetchData = async () => {
            try {
                const [dashboardRes, drivesRes, applicationsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/dashboard-stats/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/eligible-drives/${user.id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/applications/my-applications/${user.id}`)
                ]);
                setStats(dashboardRes.data);
                setDrives(drivesRes.data.slice(0, 5));
                setApplications(applicationsRes.data.slice(0, 5));
                setLoading(false);
            } catch (err) {
                // Use mock data on error
                setDrives([
                    { _id: '1', companyName: 'Google', jobProfile: 'Software Engineer L3', date: '2026-03-15', ctcDetails: { ctc: 4500000 }, location: 'Bangalore' },
                    { _id: '2', companyName: 'Microsoft', jobProfile: 'SDE', date: '2026-03-22', ctcDetails: { ctc: 4200000 }, location: 'Hyderabad' },
                    { _id: '3', companyName: 'Amazon', jobProfile: 'SDE-1', date: '2026-04-05', ctcDetails: { ctc: 4000000 }, location: 'Bangalore' },
                    { _id: '4', companyName: 'Adobe', jobProfile: 'MTS', date: '2026-04-12', ctcDetails: { ctc: 3800000 }, location: 'Noida' },
                ]);
                setApplications([
                    { _id: '1', driveId: { companyName: 'Microsoft', jobProfile: 'SDE' }, status: 'shortlisted', appliedDate: '2026-02-01' },
                    { _id: '2', driveId: { companyName: 'Adobe', jobProfile: 'MTS' }, status: 'applied', appliedDate: '2026-01-28' },
                    { _id: '3', driveId: { companyName: 'TCS', jobProfile: 'System Engineer' }, status: 'offered', appliedDate: '2026-01-15' },
                ]);
                setLoading(false);
            }
        };

        fetchData();
        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, 15000);
        return () => clearInterval(interval);
    }, [user]);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: 'Good Morning', color: '#FFB347' };
        if (hour < 17) return { text: 'Good Afternoon', color: '#87CEEB' };
        if (hour < 20) return { text: 'Good Evening', color: '#FF6B6B' };
        return { text: 'Good Night', color: '#6C5CE7' };
    };

    const greeting = getGreeting();
    const userName = stats.profile?.name || user?.email?.split('@')[0] || 'Student';

    const getStatusColor = (status) => {
        const colors = {
            offered: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: '#10B981' },
            shortlisted: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: '#3B82F6' },
            applied: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: '#F59E0B' },
            rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: '#EF4444' },
            round1: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: '#8B5CF6' },
            round2: { bg: 'rgba(14, 165, 233, 0.15)', text: '#0EA5E9', border: '#0EA5E9' },
        };
        return colors[status] || colors.applied;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <style>{`
                /* ========== CSS VARIABLES ========== */
                :root {
                    --maroon-primary: #B1124A;
                    --maroon-secondary: #B1124A;
                    --maroon-light: #D14D72;
                    --maroon-dark: #7A0C32;
                    --maroon-gradient: linear-gradient(135deg, #B1124A 0%, #D14D72 100%);
                    --maroon-subtle: rgba(177, 18, 74, 0.08);
                    --maroon-medium: rgba(177, 18, 74, 0.15);
                    --text-primary: #1a1a1a;
                    --text-secondary: #555;
                    --text-light: #888;
                    --bg-primary: #FFFFFF;
                    --bg-secondary: #F8F9FA;
                    --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
                    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
                    --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
                    --shadow-glow: 0 0 30px rgba(177, 18, 74, 0.2);
                    --radius-sm: 8px;
                    --radius-md: 16px;
                    --radius-lg: 24px;
                    --radius-xl: 32px;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .dashboard-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 50%, #F8F9FA 100%);
                    position: relative;
                    overflow-x: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                /* ========== ANIMATED BACKGROUND ========== */
                .animated-bg-dashboard {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .gradient-orb-d {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.12;
                    animation: float-orb-d 30s ease-in-out infinite;
                }

                .orb-d1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, #B1124A 0%, transparent 70%);
                    top: -200px;
                    right: -100px;
                    animation-delay: 0s;
                }

                .orb-d2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, #B1124A 0%, transparent 70%);
                    bottom: -100px;
                    left: -100px;
                    animation-delay: -10s;
                }

                .orb-d3 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, #D14D72 0%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    animation-delay: -20s;
                }

                @keyframes float-orb-d {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -50px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }



                /* ========== MAIN CONTENT ========== */
                .main-content {
                    position: relative;
                    z-index: 10;
                    padding: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                /* ========== HEADER ========== */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    animation: slideDown 0.6s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .greeting-section h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .greeting-section p {
                    color: var(--text-light);
                    font-size: 1rem;
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .icon-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius-md);
                    border: none;
                    background: white;
                    box-shadow: var(--shadow-sm);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .icon-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                    background: var(--maroon-subtle);
                }

                .icon-btn svg {
                    color: var(--text-secondary);
                    transition: color 0.3s;
                }

                .icon-btn:hover svg {
                    color: var(--maroon-primary);
                }

                .notification-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 20px;
                    height: 20px;
                    background: var(--maroon-gradient);
                    border-radius: 50%;
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse-badge 2s infinite;
                }

                @keyframes pulse-badge {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-md);
                    border: 2px solid var(--maroon-primary);
                    background: transparent;
                    color: var(--maroon-primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .logout-btn:hover {
                    background: var(--maroon-primary);
                    color: white;
                    transform: translateY(-2px);
                }

                /* ========== STATS CARDS ========== */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .tilt-card-d {
                    position: relative;
                    transform-style: preserve-3d;
                }

                .card-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: var(--radius-lg);
                    background: var(--maroon-gradient);
                    opacity: 0.1;
                    filter: blur(20px);
                    z-index: -1;
                }

                .stat-card {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: 1.75rem;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid rgba(0,0,0,0.05);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--maroon-gradient);
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .stat-card:hover::before {
                    opacity: 1;
                }

                .stat-card-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card-icon::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: inherit;
                    filter: blur(10px);
                    opacity: 0.5;
                }

                .stat-card-icon svg {
                    position: relative;
                    z-index: 1;
                }

                .stat-value {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .stat-change {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-top: 0.75rem;
                    padding: 0.35rem 0.75rem;
                    border-radius: 20px;
                }

                .stat-change.positive {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10B981;
                }

                .stat-change.neutral {
                    background: rgba(245, 158, 11, 0.1);
                    color: #F59E0B;
                }

                /* ========== CONTENT GRID ========== */
                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }

                /* ========== GLASS CARD ========== */
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: var(--radius-lg);
                    padding: 1.75rem;
                    box-shadow: var(--shadow-md);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    transition: all 0.3s;
                }

                .glass-card:hover {
                    box-shadow: var(--shadow-lg);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .card-title-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-sm);
                    background: var(--maroon-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card-title-icon svg {
                    color: var(--maroon-primary);
                }

                .view-all-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--maroon-primary);
                    background: var(--maroon-subtle);
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .view-all-btn:hover {
                    background: var(--maroon-primary);
                    color: white;
                    transform: translateX(3px);
                }

                /* ========== ANNOUNCEMENTS ========== */
                .announcements-section {
                    margin-bottom: 2rem;
                }

                .announcement-card {
                    background: linear-gradient(135deg, rgba(177, 18, 74, 0.05) 0%, rgba(255,255,255,1) 100%);
                    border: 1px solid rgba(177, 18, 74, 0.1);
                    border-left: 4px solid var(--maroon-primary);
                    padding: 1rem 1.25rem;
                    border-radius: 0 var(--radius-md) var(--radius-md) 0;
                    margin-bottom: 1rem;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .announcement-card:hover {
                    transform: translateX(5px);
                    box-shadow: var(--shadow-md);
                    border-left-width: 6px;
                }

                .announcement-content {
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    font-weight: 500;
                    line-height: 1.5;
                }

                .announcement-meta {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.75rem;
                    font-size: 0.8rem;
                    color: var(--text-light);
                }

                .announcement-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--maroon-primary);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .announcement-link:hover {
                    text-decoration: underline;
                }

                .no-announcements {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-light);
                }

                .no-announcements svg {
                    opacity: 0.3;
                    margin-bottom: 1rem;
                }

                /* ========== DRIVES LIST ========== */
                .drive-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    margin-bottom: 0.75rem;
                    transition: all 0.3s;
                    cursor: pointer;
                    border: 1px solid transparent;
                }

                .drive-item:hover {
                    background: white;
                    border-color: var(--maroon-medium);
                    transform: translateX(5px);
                    box-shadow: var(--shadow-sm);
                }

                .drive-logo {
                    width: 50px;
                    height: 50px;
                    border-radius: var(--radius-sm);
                    background: var(--maroon-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: white;
                    flex-shrink: 0;
                }

                .drive-info {
                    flex: 1;
                }

                .drive-company {
                    font-weight: 700;
                    color: var(--text-primary);
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }

                .drive-role {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .drive-meta {
                    text-align: right;
                }

                .drive-ctc {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--maroon-primary);
                }

                .drive-date {
                    font-size: 0.8rem;
                    color: var(--text-light);
                }

                /* ========== APPLICATIONS LIST ========== */
                .application-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                    margin-bottom: 0.75rem;
                    transition: all 0.3s;
                }

                .application-item:hover {
                    background: white;
                    box-shadow: var(--shadow-sm);
                }

                .application-company {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }

                .application-role {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .status-badge {
                    padding: 0.4rem 0.9rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border: 1px solid;
                }

                /* ========== SKILL BARS ========== */
                .skill-bar-container {
                    margin-bottom: 1.25rem;
                }

                .skill-bar-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }

                .skill-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .skill-level {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--maroon-primary);
                }

                .skill-bar-track {
                    height: 8px;
                    background: var(--bg-secondary);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .skill-bar-fill {
                    height: 100%;
                    border-radius: 10px;
                    position: relative;
                    transition: width 1s ease-out;
                }

                .skill-bar-glow {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 30px;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }

                /* ========== STREAK WIDGET ========== */
                .streak-widget {
                    background: var(--maroon-gradient);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    color: white;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .streak-widget::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                    animation: rotate-bg 10s linear infinite;
                }

                @keyframes rotate-bg {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .streak-value {
                    font-size: 3rem;
                    font-weight: 800;
                    position: relative;
                    z-index: 1;
                }

                .streak-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }

                .streak-flames {
                    font-size: 1.5rem;
                    margin-top: 0.5rem;
                    position: relative;
                    z-index: 1;
                }

                /* ========== QUICK ACTIONS ========== */
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .quick-action-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1.25rem;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                }

                .quick-action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-md);
                    border-color: var(--maroon-medium);
                }

                .quick-action-btn:hover svg {
                    transform: scale(1.1);
                    color: var(--maroon-primary);
                }

                .quick-action-btn svg {
                    color: var(--text-secondary);
                    transition: all 0.3s;
                }

                .quick-action-btn span {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                /* ========== LOADING SCREEN ========== */
                .loading-screen {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #FFFFFF 0%, #FFF1F4 100%);
                    gap: 2rem;
                }

                .loading-spinner {
                    position: relative;
                    width: 80px;
                    height: 80px;
                }

                .spinner-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                }

                .spinner-ring:nth-child(1) {
                    width: 80px;
                    height: 80px;
                    border-top-color: var(--maroon-primary);
                    animation-delay: -0.3s;
                }

                .spinner-ring:nth-child(2) {
                    width: 60px;
                    height: 60px;
                    top: 10px;
                    left: 10px;
                    border-top-color: var(--maroon-secondary);
                    animation-delay: -0.15s;
                }

                .spinner-ring:nth-child(3) {
                    width: 40px;
                    height: 40px;
                    top: 20px;
                    left: 20px;
                    border-top-color: var(--maroon-light);
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-screen p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    font-weight: 500;
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .content-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 768px) {
                    .main-content { padding: 1rem; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .dashboard-header { flex-direction: column; gap: 1rem; }
                    .greeting-section h1 { font-size: 1.75rem; }
                }
            `}</style>

            <AnimatedBackground />

            <main className="main-content">
                {/* Header */}
                <FadeIn>
                    <header className="dashboard-header">
                        <div className="greeting-section">
                            <h1>
                                {greeting.emoji} {greeting.text}, {userName}!
                            </h1>
                            <p>
                                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} •
                                Let's make today productive!
                            </p>
                        </div>
                        <div className="header-actions">
                            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell size={22} />
                                <span className="notification-badge">{notifications.length}</span>
                            </button>
                            {showNotifications && (
                                <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                            )}
                            <button className="icon-btn">
                                <Settings size={22} />
                            </button>
                            <button className="logout-btn" onClick={logout}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </header>
                </FadeIn>

                {/* Stats Cards */}
                <div className="stats-grid">
                    {[
                        { icon: <Target size={26} />, value: stats.drives?.upcoming || 8, label: 'Upcoming Drives', change: '+3 this week', bg: 'rgba(177, 18, 74, 0.1)', color: '#B1124A' },
                        { icon: <FileText size={26} />, value: stats.applications?.total || 5, label: 'Applications', change: '2 in progress', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' },
                        { icon: <Trophy size={26} />, value: stats.applications?.offered || 1, label: 'Offers Received', change: '🎉 Great job!', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' },
                        { icon: <Flame size={26} />, value: userStreak, label: 'Day Streak', change: 'Keep it up!', bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }
                    ].map((stat, i) => (
                        <FadeIn key={i} delay={i * 100}>
                            <TiltCard>
                                <div className="stat-card">
                                    <div className="stat-card-icon" style={{ background: stat.bg }}>
                                        <div style={{ color: stat.color }}>{stat.icon}</div>
                                    </div>
                                    <div className="stat-value">
                                        <AnimatedCounter end={stat.value} />
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                    <div className="stat-change positive">{stat.change}</div>
                                </div>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>

                {/* Announcements Section */}
                <FadeIn delay={400}>
                    <div className="glass-card announcements-section">
                        <div className="card-header">
                            <div className="card-title">
                                <div className="card-title-icon">
                                    <Megaphone size={20} />
                                </div>
                                Announcements
                                <span className="notification-badge" style={{ position: 'static', marginLeft: '0.5rem' }}>
                                    {announcements.length}
                                </span>
                            </div>
                        </div>
                        {announcements.length > 0 ? (
                            announcements.slice(0, 4).map((ann, i) => (
                                <div key={i} className="announcement-card">
                                    <div className="announcement-content">{ann.content}</div>
                                    <div className="announcement-meta">
                                        <span>{new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        {ann.links && ann.links[0]?.url && (
                                            <a href={ann.links[0].url} target="_blank" rel="noopener noreferrer" className="announcement-link">
                                                <ExternalLink size={12} /> View Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-announcements">
                                <Megaphone size={48} />
                                <p>No announcements yet. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Main Content Grid */}
                <div className="content-grid">
                    {/* Left Column */}
                    <div>
                        {/* Upcoming Drives */}
                        <FadeIn delay={500}>
                            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                                <div className="card-header">
                                    <div className="card-title">
                                        <div className="card-title-icon">
                                            <Briefcase size={20} />
                                        </div>
                                        Upcoming Drives
                                    </div>
                                    <button className="view-all-btn">
                                        View All <ArrowRight size={14} />
                                    </button>
                                </div>
                                {drives.map((drive, i) => (
                                    <div key={drive._id} className="drive-item">
                                        <div className="drive-logo">
                                            {drive.companyName?.charAt(0)}
                                        </div>
                                        <div className="drive-info">
                                            <div className="drive-company">{drive.companyName}</div>
                                            <div className="drive-role">{drive.jobProfile}</div>
                                        </div>
                                        <div className="drive-meta">
                                            <div className="drive-ctc">₹{((drive.ctcDetails?.ctc || 0) / 100000).toFixed(1)} LPA</div>
                                            <div className="drive-date">{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* My Applications */}
                        <FadeIn delay={600}>
                            <div className="glass-card">
                                <div className="card-header">
                                    <div className="card-title">
                                        <div className="card-title-icon">
                                            <FileText size={20} />
                                        </div>
                                        My Applications
                                    </div>
                                    <button className="view-all-btn">
                                        View All <ArrowRight size={14} />
                                    </button>
                                </div>
                                {applications.map((app, i) => {
                                    const statusColors = getStatusColor(app.status);
                                    return (
                                        <div key={app._id} className="application-item">
                                            <div>
                                                <div className="application-company">{app.driveId?.companyName}</div>
                                                <div className="application-role">{app.driveId?.jobProfile}</div>
                                            </div>
                                            <span
                                                className="status-badge"
                                                style={{
                                                    background: statusColors.bg,
                                                    color: statusColors.text,
                                                    borderColor: statusColors.border
                                                }}
                                            >
                                                {app.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Streak Widget */}
                        <FadeIn delay={500}>
                            <div className="streak-widget" style={{ marginBottom: '1.5rem' }}>
                                <div className="streak-value">{userStreak}</div>
                                <div className="streak-label">Day Streak</div>
                                <div className="streak-flames">🔥🔥🔥</div>
                            </div>
                        </FadeIn>

                        {/* Skills Progress */}
                        <FadeIn delay={600}>
                            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                                <div className="card-header">
                                    <div className="card-title">
                                        <div className="card-title-icon">
                                            <Cpu size={20} />
                                        </div>
                                        Skills
                                    </div>
                                </div>
                                {stats.skills?.slice(0, 4).map((skill, i) => (
                                    <AnimatedSkillBar
                                        key={i}
                                        skill={skill.name}
                                        level={skill.level}
                                        delay={i * 150}
                                        color={i % 2 === 0 ? '#B1124A' : '#D14D72'}
                                    />
                                ))}
                            </div>
                        </FadeIn>

                        {/* Quick Actions */}
                        <FadeIn delay={700}>
                            <div className="glass-card">
                                <div className="card-header">
                                    <div className="card-title">
                                        <div className="card-title-icon">
                                            <Zap size={20} />
                                        </div>
                                        Quick Actions
                                    </div>
                                </div>
                                <div className="quick-actions">
                                    <a href="/drives" className="quick-action-btn">
                                        <Briefcase size={24} />
                                        <span>View Drives</span>
                                    </a>
                                    <a href="/prephub" className="quick-action-btn">
                                        <BookOpen size={24} />
                                        <span>Prep Hub</span>
                                    </a>
                                    <a href="/profile" className="quick-action-btn">
                                        <UserCheck size={24} />
                                        <span>Edit Profile</span>
                                    </a>
                                    <a href="/alumni" className="quick-action-btn">
                                        <GraduationCap size={24} />
                                        <span>Alumni Insights</span>
                                    </a>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;