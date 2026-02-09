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
    Edit3, Trash2, Save, Upload, Link, Lock, Unlock, EyeOff, Eye as EyeIcon,
    Dribbble, Github, Linkedin, Twitter, Youtube, Instagram, Facebook
} from 'lucide-react';
import NotificationsPanel from '../../components/NotificationsPanel';

// ============= ANIMATED BACKGROUND =============
const AnimatedBackground = () => (
    <div className="animated-bg-dashboard">
        <div className="gradient-orb-d orb-d1"></div>
        <div className="gradient-orb-d orb-d2"></div>
        <div className="gradient-orb-d orb-d3"></div>
        <div className="mesh-gradient-overlay"></div>
        <div className="stars-container-d">
            {[...Array(50)].map((_, i) => (
                <div key={i} className="star-d" style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.5
                }} />
            ))}
        </div>
    </div>
);

// ============= GLASS CARD PREMIUM =============
const GlassCardPremium = ({ children, className = '', delay = 0 }) => (
    <FadeIn delay={delay}>
        <div className={`glass-card-premium ${className}`}>
            <div className="card-shine"></div>
            {children}
            <div className="card-border-glow"></div>
        </div>
    </FadeIn>
);

// ============= AI SUCCESS RADIAL =============
const SuccessRadial = ({ percentage }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="success-radial-container">
            <svg viewBox="0 0 100 100" className="success-radial">
                <circle className="radial-bg" cx="50" cy="50" r={radius} />
                <circle
                    className="radial-fill"
                    cx="50" cy="50" r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="radial-text">
                <span className="radial-value">{percentage}%</span>
                <span className="radial-label">Readiness</span>
            </div>
        </div>
    );
};

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

// ============= MAGNETIC BUTTON =============
const MagneticButton = ({ children, className = '', ...props }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const handleMove = (e) => {
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const x = (e.clientX - centerX) * 0.4;
        const y = (e.clientY - centerY) * 0.4;
        setPos({ x, y });
    };
    return (
        <button
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            className={`magnetic-btn-d ${className}`}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            {...props}
        >
            {children}
        </button>
    );
};

// ============= MINI CALENDAR =============
const MiniCalendar = ({ events = [] }) => {
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    return (
        <div className="mini-calendar-d">
            <style>{`
                .mini-calendar-d { margin-top: 1rem; }
                .event-item-d {
                    display: flex; gap: 1rem; padding: 1rem;
                    background: white; border-radius: 12px;
                    border-left: 4px solid var(--maroon-primary);
                    margin-bottom: 0.75rem; transition: 0.3s;
                }
                .event-item-d:hover { transform: translateX(5px); background: var(--maroon-subtle); }
                .event-date-d {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; min-width: 45px;
                }
                .event-day-d { font-size: 1.1rem; font-weight: 800; color: var(--maroon-primary); line-height: 1; }
                .event-month-d { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #888; }
                .event-info-d { flex: 1; }
                .event-name-d { font-weight: 700; font-size: 0.9rem; color: #333; }
                .event-time-d { font-size: 0.75rem; color: #666; display: flex; align-items: center; gap: 4px; }
            `}</style>
            {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                <div key={i} className="event-item-d">
                    <div className="event-date-d">
                        <span className="event-day-d">{new Date(event.date).getDate()}</span>
                        <span className="event-month-d">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="event-info-d">
                        <div className="event-name-d">{event.title}</div>
                        <div className="event-time-d"><Clock size={12} /> {event.time || '10:00 AM'}</div>
                    </div>
                </div>
            )) : (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', padding: '1rem' }}>No upcoming events.</p>
            )}
        </div>
    );
};

// ============= RECOMMENDED RESOURCES =============
const RecommendedResources = ({ resources = [] }) => {
    return (
        <div className="resources-list-d">
            <style>{`
                .resource-item-d {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 1rem; border-radius: 12px; margin-bottom: 0.75rem;
                    background: #fdfdfd; border: 1px solid #eee; transition: 0.3s;
                }
                .resource-item-d:hover { transform: translateX(5px); border-color: var(--maroon-primary); }
                .resource-icon-d {
                    width: 36px; height: 36px; border-radius: 8px;
                    background: var(--maroon-subtle); color: var(--maroon-primary);
                    display: flex; align-items: center; justify-content: center;
                }
                .resource-info-d { flex: 1; }
                .resource-title-d { font-weight: 700; font-size: 0.9rem; color: #333; }
                .resource-type-d { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
            `}</style>
            {resources.length > 0 ? resources.slice(0, 3).map((res, i) => (
                <div key={i} className="resource-item-d">
                    <div className="resource-icon-d">
                        {res.type === 'pdf' ? <FileText size={18} /> :
                            res.type === 'video' ? <Play size={18} /> :
                                <BookOpen size={18} />}
                    </div>
                    <div className="resource-info-d">
                        <div className="resource-title-d">{res.title}</div>
                        <div className="resource-type-d">{res.category || 'Preparation'} • {res.type}</div>
                    </div>
                </div>
            )) : (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', padding: '1rem' }}>No resources available.</p>
            )}
        </div>
    );
};

// ============= MAIN DASHBOARD COMPONENT =============
const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        readinessScore: 0,
        profile: { name: '', department: '', cgpa: 0, placementStatus: 'not_placed', batch: '' },
        applications: { total: 0, inProgress: 0, offered: 0, rejected: 0 },
        drives: { upcoming: 0, eligible: 0 }
    });
    const [fullProfile, setFullProfile] = useState(null);
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [tickers, setTickers] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const fetchData = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
                const [dashboardRes, drivesRes, applicationsRes, announcementsRes, profileRes, notifRes, eventsRes, resourcesRes, tickerRes] = await Promise.all([
                    axios.get(`${apiBase}/student/dashboard-stats/${userId}`),
                    axios.get(`${apiBase}/student/eligible-drives/${userId}`),
                    axios.get(`${apiBase}/applications/my-applications/${userId}`),
                    axios.get(`${apiBase}/announcements`),
                    axios.get(`${apiBase}/student/profile/${userId}`),
                    axios.get(`${apiBase}/notifications`),
                    axios.get(`${apiBase}/schedule`),
                    axios.get(`${apiBase}/resources`),
                    axios.get(`${apiBase}/ticker`)
                ]);

                setStats(dashboardRes.data);
                setDrives(drivesRes.data.slice(0, 5));
                setApplications(applicationsRes.data.slice(0, 5));
                setAnnouncements(announcementsRes.data || []);
                setFullProfile(profileRes.data);
                setNotifications(notifRes.data || []);
                setEvents(eventsRes.data || []);
                setResources(resourcesRes.data || []);
                console.log("Ticker Response:", tickerRes.data); // DEBUG LOG
                setTickers(Array.isArray(tickerRes.data) ? tickerRes.data : []);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: 'Good Morning' };
        if (hour < 17) return { text: 'Good Afternoon' };
        if (hour < 20) return { text: 'Good Evening' };
        return { text: 'Good Night' };
    };

    const greeting = getGreeting();
    const userName = fullProfile?.firstName || user?.email?.split('@')[0] || 'Student';

    // Helper to map skill level strings to numbers
    const getSkillLevel = (lv) => {
        const map = { 'Beginner': 40, 'Intermediate': 70, 'Advanced': 95 };
        return map[lv] || 50;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                </div>
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <style>{`
                :root {
                    --maroon-primary: #A4123F;
                    --maroon-secondary: #8A0F3C;
                    --maroon-light: #C04040;
                    --maroon-dark: #6E0B30;
                    --maroon-subtle: rgba(164, 18, 63, 0.05);
                    --maroon-gradient: linear-gradient(135deg, #A4123F 0%, #8A0F3C 100%);
                    --glass-bg: rgba(255, 255, 255, 0.75);
                    --glass-border: rgba(255, 255, 255, 0.5);
                    --text-primary: #1A1A1A;
                    --text-secondary: #4A4A4A;
                    --text-light: #717171;
                    --shadow-premium: 0 20px 40px rgba(0,0,0,0.08);
                    --shadow-glow: 0 0 25px rgba(177, 18, 74, 0.25);
                    --radius-inner: 12px;
                    --radius-outer: 24px;
                }

                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

                .dashboard-container {
                    min-height: 100vh;
                    background: #FFF5F7;
                    font-family: 'Outfit', sans-serif;
                    color: var(--text-primary);
                }

                .main-content {
                    position: relative;
                    z-index: 10;
                    padding: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3rem;
                }

                .greeting-section h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    background: var(--maroon-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }

                .header-actions { display: flex; gap: 1rem; align-items: center; }

                .icon-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: var(--radius-inner);
                    background: white;
                    border: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.3s;
                    position: relative;
                }

                .icon-btn:hover { border-color: var(--maroon-primary); transform: translateY(-3px); }

                .notification-badge {
                    position: absolute;
                    top: -5px; right: -5px;
                    background: var(--maroon-primary);
                    color: white;
                    font-size: 0.65rem;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid white;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-inner);
                    background: white;
                    color: var(--maroon-primary);
                    border: 2px solid var(--maroon-primary);
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .logout-btn:hover {
                    background: var(--maroon-primary);
                    color: white;
                }

                .glass-card-premium {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px) saturate(180%);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-outer);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-premium);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .glass-card-premium:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px rgba(177, 18, 74, 0.12);
                    border-color: var(--maroon-primary);
                }

                .card-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%);
                    background-size: 250% 250%;
                    animation: shine-flow 5s infinite linear;
                    pointer-events: none;
                }

                @keyframes shine-flow {
                    0% { background-position: 200% 200%; }
                    100% { background-position: -200% -200%; }
                }

                .card-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                }

                .card-title-icon {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    background: var(--maroon-gradient);
                    color: white;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 16px rgba(177, 18, 74, 0.2);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .stat-value { font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0; }
                .stat-label { font-size: 0.85rem; color: var(--text-light); font-weight: 600; text-transform: uppercase; }

                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 3rem;
                }

                .announcement-card {
                    padding: 1.5rem;
                    border-radius: 16px;
                    background: white;
                    border: 1px solid #eee;
                    margin-bottom: 1.25rem;
                    transition: 0.3s;
                }

                .announcement-card:hover {
                    border-color: var(--maroon-primary);
                    transform: translateX(5px);
                }

                .announcement-content { font-size: 1rem; color: #333; line-height: 1.6; }
                .announcement-meta { display: flex; justify-content: space-between; margin-top: 1rem; font-size: 0.8rem; color: #888; }
                .announcement-link { color: var(--maroon-primary); font-weight: 700; text-decoration: none; }

                .drive-item {
                    display: flex; align-items: center; gap: 1.5rem;
                    padding: 1.25rem; border-radius: 16px;
                    background: white; margin-bottom: 1rem;
                    transition: 0.3s; border: 1px solid #f0f0f0;
                }
                .drive-item:hover { transform: scale(1.02); border-color: var(--maroon-primary); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                
                .drive-logo {
                    width: 56px; height: 56px; border-radius: 14px;
                    background: var(--maroon-gradient); color: white;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem; font-weight: 800;
                    box-shadow: 0 6px 12px rgba(177, 18, 74, 0.2);
                }

                .success-radial-container { position: relative; width: 160px; height: 160px; margin: 0 auto; }
                .success-radial { transform: rotate(-90deg); width: 100%; height: 100%; }
                .radial-bg { fill: none; stroke: #f0f0f0; stroke-width: 10; }
                .radial-fill { 
                    fill: none; stroke: var(--maroon-primary); stroke-width: 10; 
                    stroke-linecap: round; transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .radial-text {
                    position: absolute; inset: 0; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                }
                .radial-value { font-size: 2rem; font-weight: 800; color: var(--maroon-primary); }
                .radial-label { font-size: 0.75rem; font-weight: 600; color: var(--text-light); }

                .magnetic-btn-d {
                    padding: 1.25rem 2.5rem; border-radius: 16px;
                    background: var(--maroon-gradient); color: white; border: none;
                    font-weight: 800; cursor: pointer; box-shadow: var(--shadow-glow);
                    display: inline-flex; align-items: center; gap: 0.75rem;
                    font-size: 1rem; transition: 0.1s;
                }

                @keyframes star-twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
                .star-d { position: absolute; width: 3px; height: 3px; background: var(--maroon-primary); border-radius: 50%; animation: star-twinkle 3s infinite; }

                .ticker-d {
                    background: var(--maroon-dark); color: white; padding: 1rem;
                    position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .ticker-content-d { display: flex; gap: 4rem; animation: ticker-move 40s linear infinite; white-space: nowrap; }
                @keyframes ticker-move { from { transform: translateX(100%); } to { transform: translateX(-100%); } }

                .animated-bg-dashboard { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; background: #FFF5F7; }
                .mesh-gradient-overlay { position: absolute; inset: 0; background-image: radial-gradient(at 0% 0%, rgba(177, 18, 74, 0.05) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(177, 18, 74, 0.03) 0, transparent 50%); }

                .skill-bar-container { margin-bottom: 2rem; }
                .skill-bar-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
                .skill-name { font-weight: 700; font-size: 0.95rem; }
                .skill-level { font-weight: 800; color: var(--maroon-primary); }
                .skill-bar-track { height: 10px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
                .skill-bar-fill { height: 100%; transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 10px; position: relative; }
                .skill-bar-glow { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmer 2s infinite; }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

                .loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 2rem; }
                .loading-spinner { position: relative; width: 80px; height: 80px; }
                .spinner-ring { position: absolute; inset: 0; border: 4px solid transparent; border-top-color: var(--maroon-primary); border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <AnimatedBackground />

            {tickers.length > 0 && (
                <div className="ticker-d">
                    <div className="ticker-content-d">
                        {/* Loop through tickers and repeat to ensure continuous flow */}
                        {[...Array(5)].flatMap((_, i) => (
                            tickers.map((t, index) => (
                                <span key={`${i}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontWeight: 'bold' }}>
                                    <Megaphone size={18} className="animate-pulse" /> ADMIN ALERT: {t.message} •
                                </span>
                            ))
                        ))}
                    </div>
                </div>
            )}

            <main className="main-content">
                <FadeIn>
                    <header className="dashboard-header">
                        <div className="greeting-section">
                            <h1>{greeting.text}, {userName}</h1>
                            <p>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} • Student Portal</p>
                        </div>
                    </header>
                </FadeIn>

                <div className="stats-grid">
                    <GlassCardPremium delay={100}>
                        <div className="stat-label">Placement Readiness</div>
                        <SuccessRadial percentage={stats.readinessScore || 0} />
                    </GlassCardPremium>
                    <GlassCardPremium delay={200}>
                        <div className="stat-label">Applied Drives</div>
                        <div className="stat-value"><AnimatedCounter end={stats.applications?.total || 0} /></div>
                        <div style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} /> Total Applications
                        </div>
                    </GlassCardPremium>
                    <GlassCardPremium delay={300}>
                        <div className="stat-label">Eligible Drives</div>
                        <div className="stat-value"><AnimatedCounter end={stats.drives?.eligible || 0} /></div>
                        <div style={{ color: '#3B82F6', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={16} /> Ready to Apply
                        </div>
                    </GlassCardPremium>
                    <GlassCardPremium delay={400}>
                        <div className="stat-label">Academic CGPA</div>
                        <div className="stat-value">{stats.profile?.cgpa || 0}</div>
                        <div style={{ color: '#B1124A', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <GraduationCap size={16} /> {stats.profile?.department || 'Student'}
                        </div>
                    </GlassCardPremium>
                </div>

                <div className="content-grid">
                    <div className="left-col">
                        <GlassCardPremium delay={500}>
                            <div className="card-title">
                                <div className="card-title-icon"><Megaphone size={20} /></div>
                                Live Announcements
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                {announcements.length > 0 ? announcements.map((ann, i) => (
                                    <div key={i} className="announcement-card">
                                        <div className="announcement-content">{ann.content}</div>
                                        <div className="announcement-meta">
                                            <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                                            {ann.links && ann.links.length > 0 && (
                                                <a href={ann.links[0]?.url} className="announcement-link" target="_blank" rel="noopener noreferrer">
                                                    View Details <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                        <BellRing size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>No new announcements today.</p>
                                    </div>
                                )}
                            </div>
                        </GlassCardPremium>

                        <div style={{ marginTop: '3rem' }}>
                            <GlassCardPremium delay={600}>
                                <div className="card-title">
                                    <div className="card-title-icon"><Briefcase size={20} /></div>
                                    Recommended Placements
                                </div>
                                {drives.map((drive, i) => (
                                    <div key={i} className="drive-item">
                                        <div className="drive-logo">{drive.companyName.charAt(0)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{drive.companyName}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                <Target size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {drive.jobProfile} •
                                                <MapPin size={14} style={{ verticalAlign: 'middle', margin: '0 4px 0 8px' }} /> {drive.location}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: '#B1124A', fontSize: '1.2rem' }}>₹{((drive.ctcDetails?.ctc || 0) / 100000).toFixed(1)} LPA</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>Deadline: {new Date(drive.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                                <MagneticButton style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} onClick={() => window.location.href = '/student/drives'}>
                                    Explore Job Board <ArrowRight size={20} />
                                </MagneticButton>
                            </GlassCardPremium>
                        </div>
                    </div>

                    <div className="right-col">

                        <div style={{ marginTop: '0' }}>
                            <GlassCardPremium delay={600}>
                                <div className="card-title">
                                    <div className="card-title-icon"><CalendarDays size={20} /></div>
                                    Mini Calendar
                                </div>
                                <MiniCalendar events={events} />
                                <button
                                    onClick={() => window.location.href = '/student/schedule'}
                                    style={{ width: '100%', marginTop: '1.5rem', background: 'none', border: 'none', color: '#B1124A', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    Full Schedule <ArrowRight size={18} />
                                </button>
                            </GlassCardPremium>
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <GlassCardPremium delay={700}>
                                <div className="card-title">
                                    <div className="card-title-icon"><BookOpen size={20} /></div>
                                    Recommended Resources
                                </div>
                                <RecommendedResources resources={resources} />
                                <button
                                    onClick={() => window.location.href = '/student/resources'}
                                    style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#B1124A', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    Browse all resources <ChevronRight size={18} />
                                </button>
                            </GlassCardPremium>
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <GlassCardPremium delay={800}>
                                <div className="card-title">
                                    <div className="card-title-icon"><Cpu size={20} /></div>
                                    Skill Analytics
                                </div>
                                {fullProfile?.skills?.length > 0 ? fullProfile.skills.map((skill, i) => (
                                    <AnimatedSkillBar
                                        key={i}
                                        skill={skill.name}
                                        level={getSkillLevel(skill.level)}
                                        delay={i * 150}
                                        color={i % 2 === 0 ? '#B1124A' : '#D14D72'}
                                    />
                                )) : (
                                    <p style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem' }}>No skills added yet. Update your profile!</p>
                                )}
                            </GlassCardPremium>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <FadeIn delay={1000}>
                    <div style={{ marginTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                            <Linkedin size={24} style={{ color: '#888', cursor: 'pointer' }} />
                            <Github size={24} style={{ color: '#888', cursor: 'pointer' }} />
                            <Globe size={24} style={{ color: '#888', cursor: 'pointer' }} />
                            <Twitter size={24} style={{ color: '#888', cursor: 'pointer' }} />
                        </div>
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>© 2026 Academic Placement Tracker • Empowering Careers</p>
                    </div>
                </FadeIn>
            </main>

            <NotificationsPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
            />
        </div>
    );
};

export default StudentDashboard;