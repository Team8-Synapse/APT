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
    Dribbble, Github, Linkedin, Twitter, Youtube, Instagram, Facebook, LayoutDashboard
} from 'lucide-react';
import NotificationsPanel from '../../components/NotificationsPanel';
import { motion } from 'framer-motion';



// ============= TILT CARD MAX =============
const TiltCard = ({ children, delay = 0, className = "" }) => {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rX = ((y - centerY) / centerY) * -10;
        const rY = ((x - centerX) / centerX) * 10;

        setRotateX(rX);
        setRotateY(rY);
        setGlarePosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100
        });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setOpacity(0);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
            }}
            className={`glass-card-premium ${className}`}
        >
            <div className="card-shine-max" style={{
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, transparent 80%)`,
                opacity: opacity
            }} />
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
            <div className="card-border-glow-max"></div>
        </div>
    );
};

// ============= GLASS CARD PREMIUM (Tilt Variant) =============
const GlassCardPremium = ({ children, className = '', delay = 0 }) => (
    <TiltCard delay={delay} className={className}>
        {children}
    </TiltCard>
);

// ============= AI SUCCESS RADIAL =============
const SuccessRadial = ({ percentage }) => {
    const radius = 45;
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


// ============= RADAR CHART COMPONENT =============
const RadarChart = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const radius = size * 0.35;
    const angleStep = (Math.PI * 2) / data.length;

    const points = data.map((d, i) => {
        const r = (d.value / 100) * radius;
        const x = center + r * Math.sin(i * angleStep);
        const y = center - r * Math.cos(i * angleStep);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
            <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%' }}>
                {/* Background Polygons */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                    <polygon
                        key={i}
                        points={data.map((_, j) => {
                            const r = scale * radius;
                            const x = center + r * Math.sin(j * angleStep);
                            const y = center - r * Math.cos(j * angleStep);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {data.map((_, i) => {
                    const x = center + radius * Math.sin(i * angleStep);
                    const y = center - radius * Math.cos(i * angleStep);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#f0f0f0" strokeWidth="1" />;
                })}

                {/* Data Polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    points={points}
                    fill="rgba(164, 18, 63, 0.2)"
                    stroke="#A4123F"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const r = (d.value / 100) * radius;
                    const x = center + r * Math.sin(i * angleStep);
                    const y = center - r * Math.cos(i * angleStep);
                    return <circle key={i} cx={x} cy={y} r="4" fill="#A4123F" />;
                })}
            </svg>

            {/* Labels */}
            {data.map((d, i) => {
                const x = center + (radius + 20) * Math.sin(i * angleStep);
                const y = center - (radius + 20) * Math.cos(i * angleStep);
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '11px',
                        fontWeight: '900',
                        color: '#777',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        letterSpacing: '0.02em'
                    }}>
                        {d.label}
                    </div>
                );
            })}
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
    const userName = fullProfile?.firstName || user?.email?.split('@')?.[0] || 'Student';

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
                    background: #f8f9fa;
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
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(25px) saturate(200%);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: 32px;
                    padding: 2.5rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.04);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .glass-card-premium:hover {
                    border-color: rgba(164, 18, 63, 0.4);
                    box-shadow: 0 30px 60px rgba(164, 18, 63, 0.1);
                }

                .card-shine-max {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 10;
                    mix-blend-mode: overlay;
                    transition: opacity 0.5s;
                }

                @keyframes shine-flow {
                    0% { background-position: 200% 200%; }
                    100% { background-position: -200% -200%; }
                }

                .holographic-glow {
                    background: linear-gradient(135deg, #1A1A1A 0%, #A4123F 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 8px rgba(164, 18, 63, 0.15));
                    font-weight: 900 !important;
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

                .success-radial-container { position: relative; width: 180px; height: 180px; margin: 0 auto; }
                .success-radial { transform: rotate(-90deg); width: 100%; height: 100%; }
                .radial-bg { fill: none; stroke: #f0f0f0; stroke-width: 10; }
                .radial-fill { 
                    fill: none; stroke: var(--maroon-primary); stroke-width: 10; 
                    stroke-linecap: round; transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .radial-text {
                    position: absolute; inset: 0; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 4px;
                }
                .radial-value { font-size: 2.75rem; font-weight: 950; color: var(--maroon-primary); line-height: 1; }
                .radial-label { font-size: 0.9rem; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.15em; }

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

                .bento-grid-container {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    grid-auto-rows: 260px;
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                /* RESTORED GRID UTILITY CLASSES */
                .bento-card { height: 100%; display: flex; flex-direction: column; overflow: hidden;x}
                .span-12 { grid-column: span 12; }
                .span-8 { grid-column: span 8; }
                .span-4 { grid-column: span 4; }
                .row-2 { grid-row: span 2; }

                /* RESPONSIVE LAYOUT LOGIC */
                @media (max-width: 1280px) {
                    .bento-grid-container { grid-template-columns: repeat(8, 1fr); }
                    .span-4 { grid-column: span 4; }
                    .span-8 { grid-column: span 8; }
                    .span-12 { grid-column: span 8; }
                }

                @media (max-width: 1024px) {
                    .bento-grid-container { grid-template-columns: repeat(4, 1fr); }
                    .span-4 { grid-column: span 4; }
                    .span-8 { grid-column: span 4; }
                    .span-12 { grid-column: span 4; }
                    .row-2 { grid-row: auto; }
                    .bento-grid-container { grid-auto-rows: auto; }
                }

                @media (max-width: 640px) {
                    .bento-grid-container { grid-template-columns: 1fr; }
                    .span-4, .span-8, .span-12 { grid-column: span 1; }
                }

                .stat-card-compact {
                    padding: 2rem !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .stat-label { font-size: 0.95rem !important; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem !important; }
                .stat-value { font-size: 3.5rem !important; font-weight: 900 !important; color: var(--maroon-primary) !important; line-height: 1 !important; margin-bottom: 1rem !important; }

                .card-title { font-size: 1.25rem !important; font-weight: 900 !important; margin-bottom: 2rem !important; display: flex; align-items: center; gap: 1rem; color: #1A1A1A; }
                .card-title-icon { width: 2.75rem !important; height: 2.75rem !important; display: flex; items-center justify-center; background: var(--maroon-subtle); color: var(--maroon-primary); border-radius: 14px; font-size: 1.25rem !important; }

                .tab-btn-d {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: var(--text-light);
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .tab-btn-d:hover {
                    background: var(--maroon-subtle);
                    color: var(--maroon-primary);
                }

                .tab-btn-d.active {
                    background: var(--maroon-primary);
                    color: white;
                    box-shadow: var(--shadow-glow);
                }
            `}</style>



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
                            <h2 className="text-sm font-black uppercase tracking-widest mb-1 flex items-center gap-2 opacity-60">
                                <LayoutDashboard size={14} className="text-amrita-maroon" />
                                <span style={{ color: '#1A1A1A' }}>Student</span> <span style={{ color: '#A4123F' }}>Dashboard</span>
                            </h2>
                            <h1 className="text-4xl font-black tracking-tight" style={{ color: '#A4123F' }}>
                                {greeting.text}, {userName}
                                <span className="block text-sm font-bold text-gray-400 mt-1">
                                    {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                            </h1>
                        </div>
                    </header>
                </FadeIn>


                <div className="animate-fade-in-up bento-grid-container">
                    {/* TIER 1: Readiness + Applied + Eligible */}
                    <div className="span-4 row-2">
                        <TiltCard delay={100} className="bento-card h-full !p-8">
                            <div className="card-title">
                                <div className="card-title-icon"><Target size={24} /></div>
                                Readiness
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <SuccessRadial percentage={stats.readinessScore || 0} />
                            </div>
                            <div className="mt-4 p-5 bg-amrita-maroon/5 rounded-2xl border border-amrita-maroon/10">
                                <p className="text-[11px] font-black text-amrita-maroon uppercase tracking-widest mb-1">Coach Insight</p>
                                <p className="text-sm text-gray-500 font-bold leading-tight">Focus on Technical MCQ to reach benchmark.</p>
                            </div>
                        </TiltCard>
                    </div>

                    <div className="span-4">
                        <TiltCard delay={200} className="bento-card stat-card-compact">
                            <div className="stat-label">Applied</div>
                            <div className="stat-value holographic-glow"><AnimatedCounter end={stats.applications?.total || 0} /></div>
                            <div className="text-[11px] font-extrabold text-[#10B981] flex items-center gap-2">
                                <TrendingUp size={14} /> Tracking History
                            </div>
                        </TiltCard>
                    </div>

                    <div className="span-4">
                        <TiltCard delay={300} className="bento-card stat-card-compact">
                            <div className="stat-label">Eligible</div>
                            <div className="stat-value holographic-glow"><AnimatedCounter end={stats.drives?.eligible || 0} /></div>
                            <div className="text-[11px] font-extrabold text-[#3B82F6] flex items-center gap-2">
                                <CheckCircle size={14} /> Ready to Apply
                            </div>
                        </TiltCard>
                    </div>

                    {/* TIER 2: (Readiness continues) + CGPA + Activity */}
                    <div className="span-4">
                        <TiltCard delay={400} className="bento-card stat-card-compact">
                            <div className="stat-label">CGPA</div>
                            <div className="stat-value holographic-glow">{stats.profile?.cgpa || 0}</div>
                            <div className="text-[11px] font-extrabold text-[#B1124A] flex items-center gap-2">
                                <GraduationCap size={14} /> Academic Record
                            </div>
                        </TiltCard>
                    </div>

                    <div className="span-4">
                        <GlassCardPremium delay={700} className="bento-card h-full !p-6">
                            <div className="card-title !mb-4">
                                <div className="card-title-icon !w-8 !h-8"><Activity size={16} /></div>
                                Activity
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto">
                                {applications.slice(0, 3).map((app, i) => (
                                    <div key={i} onClick={() => window.location.href = '/applications'} className="flex items-center gap-3 p-2 bg-white/50 rounded-xl hover:bg-white border border-transparent hover:border-amrita-maroon/20 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 flex-shrink-0 bg-amrita-maroon/10 text-amrita-maroon rounded-lg group-hover:bg-amrita-maroon group-hover:text-white transition-all flex items-center justify-center">
                                            <Briefcase size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-gray-800 truncate">{app.companyName}</p>
                                            <p className="text-[9px] text-gray-400 font-black uppercase">{new Date(app.appliedDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCardPremium>
                    </div>

                    {/* TIER 3: Announcements + Recommended (Balanced Rectangle) */}
                    <div className="span-4 row-2">
                        <GlassCardPremium delay={500} className="bento-card h-full !p-6">
                            <div className="card-title !mb-6">
                                <div className="card-title-icon"><Megaphone size={22} /></div>
                                Bulletins
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '420px' }}>
                                {announcements.length > 0 ? announcements.map((ann, i) => (
                                    <div key={i} className="announcement-card !p-5 !mb-5">
                                        <div className="announcement-content !text-sm !leading-relaxed">{ann.content}</div>
                                        <div className="announcement-meta !mt-4">
                                            <span className="!text-[11px]"><Calendar size={14} className="inline mr-2" /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                                            {ann.links?.length > 0 && (
                                                <a href={ann.links[0].url} className="announcement-link !text-[11px]" target="_blank" rel="noopener noreferrer">
                                                    Open <ExternalLink size={12} className="inline ml-1" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
                                        <BellRing size={40} className="mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Alerts</p>
                                    </div>
                                )}
                            </div>
                        </GlassCardPremium>
                    </div>

                    <div className="span-8 row-2">
                        <GlassCardPremium delay={600} className="bento-card h-full !p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="card-title !mb-0">
                                    <div className="card-title-icon"><Briefcase size={20} /></div>
                                    Top Recommendations
                                </div>
                                <button onClick={() => window.location.href = '/drives'} className="text-[10px] font-black text-amrita-maroon uppercase bg-amrita-maroon/10 px-4 py-2 rounded-xl hover:bg-amrita-maroon hover:text-white transition-all">All Drives</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {drives.slice(0, 4).map((drive, i) => (
                                    <div key={i} onClick={() => window.location.href = '/drives'} className="drive-item !mb-0 !p-4 border border-gray-100 rounded-2xl hover:border-amrita-maroon transition-all flex items-center gap-4 cursor-pointer group bg-white/40">
                                        <div className="w-10 h-10 bg-amrita-maroon/10 text-amrita-maroon rounded-xl flex items-center justify-center font-black group-hover:bg-amrita-maroon group-hover:text-white transition-all">{drive.companyName.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm truncate">{drive.companyName}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold">₹{((drive.ctcDetails?.ctc || 0) / 100000).toFixed(1)} LPA • {drive.jobProfile}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-amrita-maroon" />
                                    </div>
                                ))}
                            </div>
                        </GlassCardPremium>
                    </div>

                    {/* TIER 4: Quick Links + Calendar + Radar */}
                    <div className="span-4">
                        <GlassCardPremium delay={900} className="bento-card h-full !p-6 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button onClick={() => window.location.href = '/prephub'} className="flex flex-col items-center gap-3 group p-4 hover:bg-amrita-maroon/5 rounded-2xl transition-all">
                                    <div className="w-12 h-12 bg-amrita-maroon/10 text-amrita-maroon rounded-2xl flex items-center justify-center group-hover:bg-amrita-maroon group-hover:text-white transition-all"><Brain size={20} /></div>
                                    <span className="text-[11px] font-black uppercase">Prep</span>
                                </button>
                                <button onClick={() => window.location.href = '/profile'} className="flex flex-col items-center gap-3 group p-4 hover:bg-amrita-maroon/5 rounded-2xl transition-all">
                                    <div className="w-12 h-12 bg-amrita-maroon/10 text-amrita-maroon rounded-2xl flex items-center justify-center group-hover:bg-amrita-maroon group-hover:text-white transition-all"><Users size={20} /></div>
                                    <span className="text-[11px] font-black uppercase">User</span>
                                </button>
                                <button onClick={() => window.location.href = '/calendar'} className="flex flex-col items-center gap-3 group p-4 hover:bg-amrita-maroon/5 rounded-2xl transition-all">
                                    <div className="w-12 h-12 bg-amrita-maroon/10 text-amrita-maroon rounded-2xl flex items-center justify-center group-hover:bg-amrita-maroon group-hover:text-white transition-all"><Calendar size={20} /></div>
                                    <span className="text-[11px] font-black uppercase">Date</span>
                                </button>
                                <button onClick={() => window.location.href = '/drives'} className="flex flex-col items-center gap-3 group p-4 hover:bg-amrita-maroon/5 rounded-2xl transition-all">
                                    <div className="w-12 h-12 bg-amrita-maroon/10 text-amrita-maroon rounded-2xl flex items-center justify-center group-hover:bg-amrita-maroon group-hover:text-white transition-all"><Briefcase size={20} /></div>
                                    <span className="text-[11px] font-black uppercase">Jobs</span>
                                </button>
                            </div>
                        </GlassCardPremium>
                    </div>

                    <div className="span-4">
                        <GlassCardPremium delay={800} className="bento-card h-full !p-6">
                            <div className="card-title !mb-4">
                                <div className="card-title-icon !w-8 !h-8"><CalendarDays size={16} /></div>
                                Events
                            </div>
                            <div className="flex-1 scale-90 origin-top">
                                <MiniCalendar events={events} />
                            </div>
                        </GlassCardPremium>
                    </div>

                    <div className="span-4">
                        <TiltCard delay={1000} className="bento-card h-full !p-6">
                            <div className="card-title !mb-4">
                                <div className="card-title-icon !w-8 !h-8"><Activity size={16} /></div>
                                Radar
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <RadarChart data={
                                    fullProfile?.skills?.slice(0, 6)?.map(s => ({
                                        label: s.name,
                                        value: getSkillLevel(s.level)
                                    })) || [
                                        { label: 'Technical', value: 80 },
                                        { label: 'Aptitude', value: 70 },
                                        { label: 'Soft Skills', value: 60 }
                                    ]
                                } />
                            </div>
                        </TiltCard>
                    </div>

                    {/* TIER 5: Intelligence Matrix (Full Width Solid Base) */}
                    <div className="span-12">
                        <TiltCard delay={1100} className="bento-card !p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 w-full">
                                    <div className="card-title !mb-8">
                                        <div className="card-title-icon"><Cpu size={24} /></div>
                                        Skill Intelligence Matrix
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {fullProfile?.skills?.slice(0, 4).map((skill, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                                                    <span>{skill.name}</span>
                                                    <span className="text-amrita-maroon">{getSkillLevel(skill.level)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amrita-maroon" style={{ width: `${getSkillLevel(skill.level)}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:w-64 p-6 bg-amrita-maroon/5 rounded-3xl border border-amrita-maroon/10 self-stretch flex flex-col justify-center">
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest text-center">AI Projection</p>
                                    <p className="text-sm font-black text-amrita-maroon text-center">Solutions Architect (92%)</p>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>
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