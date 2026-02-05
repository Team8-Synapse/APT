import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import {
    TrendingUp, Award, Users, ArrowRight, ShieldCheck,
    Building2, Globe, Star, CheckCircle, BarChart3,
    Target, Briefcase, Trophy, Rocket, BookOpen,
    ChevronRight, Calendar, MapPin, Mail,
    Bell, Clock, FileText, Video, MessageSquare,
    Sparkles, Database, Shield, Users2, GraduationCap,
    Smartphone, Laptop, Cloud, Lock, Search, Filter,
    Download, Upload, Eye, Heart, ThumbsUp, ExternalLink,
    PieChart, Cpu, Target as TargetIcon, LineChart,
    UserCheck, FileCheck, TrendingDown, ChevronLeft
} from 'lucide-react';

// ============= MAROON-WHITE MODERN THEME =============
const theme = {
    maroon: {
        primary: '#8B0000',
        secondary: '#A52A2A',
        light: '#C04040',
        dark: '#5A0000',
        gradient: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
        subtle: 'rgba(139, 0, 0, 0.08)',
        medium: 'rgba(139, 0, 0, 0.15)',
        strong: 'rgba(139, 0, 0, 0.25)'
    },
    beige: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        light: '#FFFFFF',
        dark: '#F0F2F5',
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)'
    }
};

// ============= ANIMATED BACKGROUND =============
const AnimatedBackground = () => {
    return (
        <div className="animated-bg">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
            <div className="gradient-orb orb-4"></div>
        </div>
    );
};

// ============= GLOWING ORBS =============
const GlowingOrbs = () => {
    return (
        <>
            <div className="glowing-orb orb-a"></div>
            <div className="glowing-orb orb-b"></div>
            <div className="glowing-orb orb-c"></div>
            <div className="glowing-orb orb-d"></div>
        </>
    );
};

// ============= WAVY SEPARATOR =============
const WavySeparator = ({ inverted = false }) => {
    return (
        <div className={`wavy-separator ${inverted ? 'inverted' : ''}`}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
            </svg>
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

// ============= TILT CARD =============
const TiltCard = ({ children, className = '' }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * -5;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.3s ease-out'
            }}
        >
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
            { threshold: 0.1, rootMargin: '-50px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    const directions = {
        up: 'translateY(60px)',
        down: 'translateY(-60px)',
        left: 'translateX(60px)',
        right: 'translateX(-60px)'
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0) scale(1)' : `${directions[direction]} scale(0.9)`,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

// ============= ANIMATED PROGRESS BAR =============
const AnimatedProgressBar = ({ percentage, label, delay = 0 }) => {
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
                        const increment = percentage / 100;
                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= percentage) {
                                setProgress(percentage);
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
    }, [percentage, delay, hasAnimated]);

    return (
        <div ref={ref} className="progress-bar-container">
            <div className="progress-bar-label">
                <span>{label}</span>
                <span className="progress-bar-percentage">{progress}%</span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${progress}%`,
                        background: theme.maroon.gradient
                    }}
                ></div>
            </div>
        </div>
    );
};

// ============= MAIN HOME COMPONENT =============
const Home = () => {
    const { token } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab(prev => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Trust badges data
    const trustBadges = [
        { icon: <ShieldCheck size={18} />, text: 'Institution-Backed' },
        { icon: <Lock size={18} />, text: 'Data-Secure' },
        { icon: <Cpu size={18} />, text: 'AI-Powered' },
        { icon: <Database size={18} />, text: 'Real-Time Analytics' }
    ];

    // Problem awareness data
    const placementProblems = [
        {
            title: 'Missed Communication',
            description: 'Important updates get lost in overflowing emails and group chats',
            icon: <Mail size={24} />,
            issues: ['Overflowing inboxes', 'Important emails missed', 'No centralized communication']
        },
        {
            title: 'Zero Visibility',
            description: 'No real-time tracking of placement progress and opportunities',
            icon: <Eye size={24} />,
            issues: ['No application tracking', 'Unclear interview status', 'No progress monitoring']
        },
        {
            title: 'Manual Chaos',
            description: 'Multiple disconnected systems causing confusion and errors',
            icon: <FileText size={24} />,
            issues: ['Multiple spreadsheets', 'WhatsApp group chaos', 'PDF forms everywhere']
        },
        {
            title: 'No Analytics',
            description: 'Lack of data-driven insights for performance improvement',
            icon: <BarChart3 size={24} />,
            issues: ['No performance metrics', 'No skill gap analysis', 'No trend analysis']
        }
    ];

    // Solution steps
    const solutionSteps = [
        {
            step: 1,
            title: 'Track Everything',
            description: 'Monitor all placement activities, applications, and communications in one unified dashboard',
            icon: <LineChart size={32} />,
            color: theme.maroon.primary
        },
        {
            step: 2,
            title: 'Analyze Performance',
            description: 'Get actionable insights with AI-powered analytics and performance metrics',
            icon: <PieChart size={32} />,
            color: theme.maroon.secondary
        },
        {
            step: 3,
            title: 'Improve Continuously',
            description: 'Enhance your skills and performance with personalized recommendations',
            icon: <TrendingUp size={32} />,
            color: theme.maroon.light
        }
    ];

    // Placement metrics - Based on Amrita official data
    const placementMetrics = [
        {
            value: 100,
            suffix: '%',
            label: 'Internship Opportunity',
            description: 'Guaranteed for all students',
            icon: <TrendingUp size={24} />,
            trend: { value: 'Every Student', direction: 'up' }
        },
        {
            value: 56,
            suffix: ' LPA',
            label: 'Highest Package',
            description: 'Top tier placements',
            icon: <Trophy size={24} />,
            trend: { value: 'New Record', direction: 'up' }
        },
        {
            value: 500,
            suffix: '+',
            label: 'Recruiting Partners',
            description: 'Global companies across domains',
            icon: <Building2 size={24} />,
            trend: { value: '+45 this year', direction: 'up' }
        },
        {
            value: 6,
            suffix: ' Campuses',
            label: 'Unified Network',
            description: 'All campuses, same opportunities',
            icon: <GraduationCap size={24} />,
            trend: { value: 'Equal Access', direction: 'up' }
        }
    ];

    // Unified platform explanation
    const unifiedPlatform = {
        students: [
            'Track applications and progress',
            'Access learning resources',
            'Practice mock interviews',
            'Get AI recommendations'
        ],
        placementCell: [
            'Manage all company drives',
            'Generate comprehensive reports',
            'Track student progress',
            'Coordinate communications'
        ],
        institution: [
            'Centralized data management',
            'Accreditation compliance',
            'Strategic analytics',
            'Performance tracking'
        ]
    };

    // Branch-wise placement stats
    const branchStats = [
        { branch: 'Computer Science', placement: 99.2, avgPackage: 18.5, color: theme.maroon.primary },
        { branch: 'Electronics', placement: 96.8, avgPackage: 12.3, color: theme.maroon.secondary },
        { branch: 'Mechanical', placement: 92.4, avgPackage: 9.8, color: theme.maroon.light },
        { branch: 'Civil', placement: 89.7, avgPackage: 8.2, color: theme.maroon.dark }
    ];

    // Company types breakdown
    const companyTypes = [
        { type: 'Product Companies', percentage: 85, companies: ['Google', 'Microsoft', 'Amazon', 'Adobe'], color: theme.maroon.primary },
        { type: 'Service Companies', percentage: 95, companies: ['TCS', 'Infosys', 'Wipro', 'Accenture'], color: theme.maroon.secondary },
        { type: 'Core Engineering', percentage: 45, companies: ['Bosch', 'L&T', 'Siemens', 'Schneider'], color: theme.maroon.light },
        { type: 'Emerging Startups', percentage: 20, companies: ['Zoho', 'Freshworks', 'Chargebee', 'Postman'], color: theme.maroon.dark }
    ];

    // Drive lifecycle stages
    const driveStages = [
        { stage: 'Announcement', description: 'Company details and role announcements', icon: <Bell size={20} /> },
        { stage: 'Registration', description: 'Student registration and eligibility check', icon: <UserCheck size={20} /> },
        { stage: 'Pre-Placement Talk', description: 'Company presentations and interactions', icon: <Video size={20} /> },
        { stage: 'Aptitude Test', description: 'Online assessment and screening', icon: <FileText size={20} /> },
        { stage: 'Technical Interview', description: 'Technical skills evaluation', icon: <Code size={20} /> },
        { stage: 'HR Interview', description: 'Final discussion and offer', icon: <Users size={20} /> }
    ];

    // AI features
    const aiFeatures = [
        {
            title: 'Predictive Analytics',
            description: 'Forecast placement probabilities using historical data and performance patterns',
            capabilities: ['Success probability', 'Trend analysis', 'Pattern recognition'],
            icon: <LineChart size={28} />
        },
        {
            title: 'Skill Gap Analysis',
            description: 'Identify and bridge competency gaps with personalized learning recommendations',
            capabilities: ['Skill assessment', 'Learning paths', 'Progress tracking'],
            icon: <Target size={28} />
        },
        {
            title: 'Personalized Roadmaps',
            description: 'Get tailored preparation plans based on your goals and target companies',
            capabilities: ['Custom schedules', 'Resource recommendations', 'Milestone tracking'],
            icon: <MapPin size={28} />
        },
        {
            title: 'Smart Notifications',
            description: 'Never miss deadlines or opportunities with intelligent alerts and reminders',
            capabilities: ['Deadline alerts', 'Opportunity matches', 'Progress updates'],
            icon: <Bell size={28} />
        }
    ];

    // Student benefits
    const studentBenefits = [
        { benefit: 'Complete Transparency', description: 'Clear visibility into every stage of placement process' },
        { benefit: 'Confidence Building', description: 'Reduced anxiety through structured preparation and tracking' },
        { benefit: 'Strategic Clarity', description: 'Data-driven insights for focused effort allocation' },
        { benefit: 'Long-term Growth', description: 'Skills and experience that accelerate career progression' }
    ];

    // Institution benefits
    const institutionBenefits = [
        { benefit: 'Centralized Management', description: 'Single platform for all placement activities' },
        { benefit: 'Accurate Reporting', description: 'Comprehensive analytics for accreditation and rankings' },
        { benefit: 'Compliance Ready', description: 'Built-in features for NAAC and accreditation requirements' },
        { benefit: 'Process Efficiency', description: 'Reduced administrative overhead and manual errors' }
    ];

    // FAQ
    const faqs = [
        {
            question: 'Who can register for this platform?',
            answer: 'All current students of Amrita Vishwa Vidyapeetham can register using their institutional email credentials. Access is verified through our student database.'
        },
        {
            question: 'Is my placement data secure?',
            answer: 'Yes, we implement enterprise-grade encryption, role-based access control, secure infrastructure, and strict data privacy protocols to protect all information.'
        },
        {
            question: 'Is using this platform mandatory?',
            answer: 'While strongly recommended for optimal placement outcomes, participation follows institutional guidelines and is encouraged for all placement-eligible students.'
        },
        {
            question: 'How do I get access to the platform?',
            answer: 'Use your institutional email (.edu) for registration. Access is verified through our authentication system and enabled based on your academic standing.'
        }
    ];

    return (
        <div className="home-container">
            <style>{`
                /* ========== THEME VARIABLES ========== */
                :root {
                    --maroon-primary: ${theme.maroon.primary};
                    --maroon-secondary: ${theme.maroon.secondary};
                    --maroon-light: ${theme.maroon.light};
                    --maroon-dark: ${theme.maroon.dark};
                    --maroon-gradient: ${theme.maroon.gradient};
                    --maroon-subtle: ${theme.maroon.subtle};
                    --maroon-medium: ${theme.maroon.medium};
                    --maroon-strong: ${theme.maroon.strong};
                    
                    --beige-primary: ${theme.beige.primary};
                    --beige-secondary: ${theme.beige.secondary};
                    --beige-light: ${theme.beige.light};
                    --beige-dark: ${theme.beige.dark};
                    --beige-gradient: ${theme.beige.gradient};
                    
                    --text-primary: #1a1a1a;
                    --text-secondary: #444444;
                    --text-light: #666666;
                    
                    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
                    --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.12);
                    --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.15);
                    --shadow-glow: 0 0 40px rgba(139, 0, 0, 0.15);
                    
                    --radius-sm: 8px;
                    --radius-md: 16px;
                    --radius-lg: 24px;
                    --radius-xl: 32px;
                    
                    --transition-fast: 0.2s ease;
                    --transition-normal: 0.3s ease;
                    --transition-slow: 0.5s ease;
                    --transition-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    color: var(--text-primary);
                    background: var(--beige-primary);
                    overflow-x: hidden;
                    line-height: 1.6;
                }

                /* ========== ANIMATED BACKGROUND ========== */
                .animated-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: float-orb 25s ease-in-out infinite;
                }

                .orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, var(--maroon-primary) 0%, transparent 70%);
                    top: -200px;
                    right: -200px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, var(--maroon-secondary) 0%, transparent 70%);
                    bottom: -150px;
                    left: -150px;
                    animation-delay: -8s;
                }

                .orb-3 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--maroon-light) 0%, transparent 70%);
                    top: 40%;
                    left: 10%;
                    animation-delay: -16s;
                }

                .orb-4 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, var(--maroon-dark) 0%, transparent 70%);
                    bottom: 30%;
                    right: 20%;
                    animation-delay: -12s;
                }

                @keyframes float-orb {
                    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    33% { transform: translate(40px, -40px) scale(1.05) rotate(120deg); }
                    66% { transform: translate(-40px, 40px) scale(0.95) rotate(240deg); }
                }

                /* ========== GLOWING ORBS ========== */
                .glowing-orb {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1;
                    animation: glow-pulse 4s ease-in-out infinite;
                }

                .orb-a {
                    width: 20px;
                    height: 20px;
                    background: var(--maroon-primary);
                    top: 20%;
                    left: 10%;
                    box-shadow: 0 0 40px var(--maroon-primary);
                    animation-delay: 0s;
                }

                .orb-b {
                    width: 15px;
                    height: 15px;
                    background: var(--maroon-secondary);
                    top: 60%;
                    right: 15%;
                    box-shadow: 0 0 30px var(--maroon-secondary);
                    animation-delay: -1s;
                }

                .orb-c {
                    width: 25px;
                    height: 25px;
                    background: var(--maroon-light);
                    bottom: 20%;
                    left: 20%;
                    box-shadow: 0 0 50px var(--maroon-light);
                    animation-delay: -2s;
                }

                .orb-d {
                    width: 18px;
                    height: 18px;
                    background: var(--maroon-dark);
                    top: 30%;
                    right: 25%;
                    box-shadow: 0 0 35px var(--maroon-dark);
                    animation-delay: -3s;
                }

                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                /* ========== WAVY SEPARATOR ========== */
                .wavy-separator {
                    position: relative;
                    width: 100%;
                    height: 120px;
                    color: var(--beige-primary);
                    overflow: hidden;
                }

                .wavy-separator.inverted {
                    transform: rotate(180deg);
                }

                .wavy-separator svg {
                    width: 100%;
                    height: 100%;
                }

                /* ========== NAVIGATION ========== */
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 1.5rem 5%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    background: transparent;
                }

                .navbar.scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-md);
                    padding: 0.000001rem 5%;
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    transition: transform var(--transition-bounce);
                }

                .nav-brand:hover {
                    transform: scale(1.05);
                }



                .nav-logo-img {
                    width: 180px;
                    height: 180px;
                    object-fit: contain;
                    transition: all var(--transition-bounce);
                }

                .nav-brand:hover .nav-logo-img {
                    transform: scale(1.1) rotate(-5deg);
                }

                .nav-brand-text h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--maroon-primary);
                    letter-spacing: -0.02em;
                }

                .nav-brand-text p {
                    font-size: 1.0rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 700;
                }

                .nav-menu {
                    display: flex;
                    gap: 2.5rem;
                    list-style: none;
                }

                .nav-link {
                    color: var(--text-primary);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.95rem;
                    position: relative;
                    padding: 0.5rem 0;
                    transition: color var(--transition-normal);
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--maroon-gradient);
                    transition: width var(--transition-normal);
                }

                .nav-link:hover {
                    color: var(--maroon-primary);
                }

                .nav-link:hover::after {
                    width: 100%;
                }

                .nav-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .btn {
                    padding: 0.75rem 1.75rem;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all var(--transition-bounce);
                    border: 2px solid transparent;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.7s;
                }

                .btn:hover::before {
                    left: 100%;
                }

                .btn-primary {
                    background: var(--maroon-gradient);
                    color: var(--beige-primary);
                    box-shadow: var(--shadow-md);
                }

                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lg);
                }

                .btn-secondary {
                    background: transparent;
                    color: var(--text-primary);
                    border-color: var(--maroon-medium);
                }

                .btn-secondary:hover {
                    background: var(--maroon-subtle);
                    color: var(--maroon-primary);
                    transform: translateY(-3px);
                }

                .btn-lg {
                    padding: 1rem 2.5rem;
                    font-size: 1.1rem;
                }

                /* ========== HERO SECTION ========== */
                .hero-section {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 140px 5% 80px;
                    background: linear-gradient(135deg, var(--beige-light) 0%, var(--beige-primary) 50%, var(--beige-light) 100%);
                    position: relative;
                    overflow: hidden;
                }

                .hero-pattern {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 60%;
                    height: 100%;
                    background-image: radial-gradient(circle at 2px 2px, var(--maroon-subtle) 1px, transparent 0);
                    background-size: 40px 40px;
                    opacity: 0.4;
                    animation: pattern-move 30s linear infinite;
                }

                @keyframes pattern-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 40px; }
                }

                .hero-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                }

                .hero-text {
                    max-width: 650px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1.25rem;
                    background: var(--maroon-subtle);
                    border: 1px solid var(--maroon-medium);
                    border-radius: 50px;
                    margin-bottom: 1.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--maroon-primary);
                    animation: badge-pulse 3s ease-in-out infinite;
                }

                @keyframes badge-pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 4px 12px var(--maroon-subtle); }
                    50% { transform: scale(1.05); box-shadow: 0 6px 20px var(--maroon-medium); }
                }

                .hero-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--maroon-primary);
                    border-radius: 50%;
                    animation: dot-pulse 2s ease-in-out infinite;
                }

                @keyframes dot-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }

                .hero-title {
                    font-size: clamp(2.5rem, 5vw, 4.5rem);
                    font-weight: 900;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    color: var(--text-primary);
                    letter-spacing: -0.03em;
                }

                .hero-title span {
                    background: var(--maroon-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: 1.2rem;
                    line-height: 1.7;
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    max-width: 560px;
                }

                .hero-cta {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-bottom: 3rem;
                }

                .hero-trust-badges {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                }

                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: var(--beige-secondary);
                    border: 1px solid var(--maroon-subtle);
                    border-radius: var(--radius-md);
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--maroon-primary);
                }

                .hero-visual {
                    position: relative;
                }

                .hero-card-container {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-radius: var(--radius-xl);
                    padding: 2rem;
                    box-shadow: var(--shadow-xl), var(--shadow-glow);
                    border: 1px solid rgba(139, 0, 0, 0.1);
                }

                .hero-card {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .metric-card {
                    background: var(--beige-secondary);
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--maroon-subtle);
                    transition: all var(--transition-normal);
                }

                .metric-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--maroon-medium);
                    box-shadow: var(--shadow-md);
                }

                .metric-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--maroon-primary);
                    margin-bottom: 0.25rem;
                }

                .metric-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }

                .metric-trend {
                    font-size: 0.8rem;
                    color: var(--maroon-dark);
                    font-weight: 600;
                    margin-top: 0.5rem;
                }

                /* ========== PROBLEM AWARENESS ========== */
                .problems-section {
                    padding: 6rem 5%;
                    background: var(--beige-primary);
                    position: relative;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .section-subtitle {
                    font-size: 0.9rem;
                    color: var(--maroon-primary);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 1rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-subtitle::before,
                .section-subtitle::after {
                    content: '';
                    width: 30px;
                    height: 2px;
                    background: var(--maroon-gradient);
                }

                .section-title {
                    font-size: clamp(2rem, 4vw, 3.5rem);
                    font-weight: 900;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }

                .section-title span {
                    color: var(--maroon-primary);
                }

                .section-description {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                .problems-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .problem-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(139, 0, 0, 0.1);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    transition: all var(--transition-normal);
                    position: relative;
                    overflow: hidden;
                }

                .problem-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: var(--maroon-gradient);
                    transform: scaleX(0);
                    transition: transform var(--transition-normal);
                }

                .problem-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--maroon-medium);
                    box-shadow: var(--shadow-lg);
                }

                .problem-card:hover::before {
                    transform: scaleX(1);
                }

                .problem-icon {
                    width: 60px;
                    height: 60px;
                    background: var(--maroon-subtle);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--maroon-primary);
                    margin-bottom: 1.5rem;
                    transition: all var(--transition-normal);
                }

                .problem-card:hover .problem-icon {
                    background: var(--maroon-gradient);
                    color: var(--beige-primary);
                    transform: rotate(-8deg) scale(1.1);
                }

                .problem-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: var(--text-primary);
                }

                .problem-description {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                }

                .problem-issues {
                    list-style: none;
                    padding-left: 0;
                }

                .problem-issues li {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .problem-issues li::before {
                    content: '•';
                    color: var(--maroon-primary);
                }

                /* ========== SOLUTION OVERVIEW ========== */
                .solution-section {
                    padding: 6rem 5%;
                    background: var(--beige-secondary);
                    position: relative;
                }

                .solution-steps {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .step-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(139, 0, 0, 0.1);
                    border-radius: var(--radius-lg);
                    padding: 2.5rem 2rem;
                    text-align: center;
                    transition: all var(--transition-normal);
                    position: relative;
                }

                .step-card:hover {
                    transform: translateY(-10px);
                    border-color: var(--maroon-medium);
                    box-shadow: var(--shadow-xl);
                }

                .step-number {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 40px;
                    background: var(--maroon-gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--beige-primary);
                    font-weight: 800;
                    font-size: 1rem;
                    box-shadow: var(--shadow-md);
                }

                .step-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: var(--maroon-subtle);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--maroon-primary);
                    transition: all var(--transition-normal);
                }

                .step-card:hover .step-icon {
                    background: var(--maroon-gradient);
                    color: var(--beige-primary);
                    transform: scale(1.1);
                }

                .step-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .step-description {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                /* ========== UNIFIED PLATFORM ========== */
                .platform-section {
                    padding: 6rem 5%;
                    background: var(--beige-primary);
                }

                .platform-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .platform-card {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(139, 0, 0, 0.1);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    transition: all var(--transition-normal);
                }

                .platform-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }

                .platform-card h3 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: var(--maroon-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .platform-features {
                    list-style: none;
                    padding-left: 0;
                }

                .platform-features li {
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                    padding-left: 1.5rem;
                    position: relative;
                }

                .platform-features li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--maroon-primary);
                    font-weight: bold;
                }

                /* ========== METRICS SECTION ========== */
                .metrics-section {
                    padding: 6rem 5%;
                    background: var(--maroon-primary);
                    color: var(--beige-primary);
                    position: relative;
                }

                .metrics-section .section-subtitle {
                    color: var(--beige-primary);
                }

                .metrics-section .section-title {
                    color: var(--beige-primary);
                }

                .metrics-section .section-description {
                    color: rgba(245, 245, 220, 0.9);
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .metric-item {
                    text-align: center;
                    padding: 2.5rem 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-normal);
                }

                .metric-item:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .metric-icon {
                    width: 70px;
                    height: 70px;
                    background: var(--beige-primary);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--maroon-primary);
                    margin: 0 auto 1.5rem;
                    transition: all var(--transition-normal);
                }

                .metric-item:hover .metric-icon {
                    transform: rotate(-10deg) scale(1.1);
                }

                .metric-value-large {
                    font-size: 3rem;
                    font-weight: 900;
                    margin-bottom: 0.5rem;
                    line-height: 1;
                }

                .metric-label-large {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .metric-description {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                /* ========== BRANCH STATISTICS ========== */
                .branch-section {
                    padding: 6rem 5%;
                    background: var(--beige-secondary);
                }

                .branch-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .branch-card {
                    background: var(--beige-primary);
                    border: 2px solid var(--maroon-subtle);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                }

                .branch-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .branch-name {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .branch-percentage {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--maroon-primary);
                }

                .progress-bar-container {
                    margin-top: 1rem;
                }

                .progress-bar-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .progress-bar-percentage {
                    font-weight: 700;
                    color: var(--maroon-primary);
                }

                .progress-bar-track {
                    height: 8px;
                    background: var(--maroon-subtle);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 2s ease-out;
                }

                /* ========== AI FEATURES ========== */
                .ai-section {
                    padding: 6rem 5%;
                    background: var(--beige-primary);
                }

                .ai-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .ai-card {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(139, 0, 0, 0.1);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    transition: all var(--transition-normal);
                }

                .ai-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--maroon-medium);
                    box-shadow: var(--shadow-lg);
                }

                .ai-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .ai-icon {
                    width: 60px;
                    height: 60px;
                    background: var(--maroon-subtle);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--maroon-primary);
                    transition: all var(--transition-normal);
                }

                .ai-card:hover .ai-icon {
                    background: var(--maroon-gradient);
                    color: var(--beige-primary);
                    transform: rotate(-8deg);
                }

                .ai-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .ai-description {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }

                .ai-capabilities {
                    list-style: none;
                    padding-left: 0;
                }

                .ai-capabilities li {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .ai-capabilities li::before {
                    content: '→';
                    color: var(--maroon-primary);
                }

                /* ========== BENEFITS SECTION ========== */
                .benefits-section {
                    padding: 6rem 5%;
                    background: var(--beige-secondary);
                }

                .benefits-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .benefit-card {
                    background: var(--beige-primary);
                    border: 2px solid var(--maroon-subtle);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                }

                .benefit-card h3 {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--maroon-primary);
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .benefit-list {
                    list-style: none;
                    padding-left: 0;
                }

                .benefit-list li {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                    position: relative;
                }

                .benefit-list li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--maroon-primary);
                    font-weight: bold;
                }

                /* ========== TRUST & SECURITY ========== */
                .trust-section {
                    padding: 6rem 5%;
                    background: var(--beige-primary);
                }

                .trust-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .trust-card {
                    text-align: center;
                    padding: 2rem;
                }

                .trust-icon {
                    width: 80px;
                    height: 80px;
                    background: var(--maroon-subtle);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--maroon-primary);
                    margin: 0 auto 1.5rem;
                    transition: all var(--transition-normal);
                }

                .trust-card:hover .trust-icon {
                    background: var(--maroon-gradient);
                    color: var(--beige-primary);
                    transform: scale(1.1);
                }

                .trust-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: var(--text-primary);
                }

                .trust-description {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                /* ========== FAQ SECTION ========== */
                .faq-section {
                    padding: 6rem 5%;
                    background: var(--beige-secondary);
                }

                .faq-grid {
                    max-width: 800px;
                    margin: 3rem auto 0;
                }

                .faq-item {
                    background: var(--beige-primary);
                    border: 2px solid var(--maroon-subtle);
                    border-radius: var(--radius-md);
                    margin-bottom: 1rem;
                    overflow: hidden;
                }

                .faq-question {
                    padding: 1.5rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background-color var(--transition-normal);
                }

                .faq-question:hover {
                    background: var(--maroon-subtle);
                }

                .faq-answer {
                    padding: 0 1.5rem;
                    max-height: 0;
                    overflow: hidden;
                    transition: all var(--transition-normal);
                    color: var(--text-secondary);
                }

                .faq-item.active .faq-answer {
                    padding: 0 1.5rem 1.5rem;
                    max-height: 500px;
                }

                /* ========== CTA SECTION ========== */
                .cta-section {
                    padding: 6rem 5%;
                    background: var(--maroon-primary);
                    color: var(--beige-primary);
                    text-align: center;
                    position: relative;
                }

                .cta-title {
                    font-size: clamp(2rem, 4vw, 3.5rem);
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                }

                .cta-description {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    max-width: 700px;
                    margin: 0 auto 3rem;
                    line-height: 1.7;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-white {
                    background: var(--beige-primary);
                    color: var(--maroon-primary);
                }

                .btn-white:hover {
                    background: transparent;
                    color: var(--beige-primary);
                    border-color: var(--beige-primary);
                }

                .btn-outline-white {
                    background: transparent;
                    color: var(--beige-primary);
                    border-color: var(--beige-primary);
                }

                .btn-outline-white:hover {
                    background: var(--beige-primary);
                    color: var(--maroon-primary);
                }

                /* ========== FOOTER ========== */
                .footer {
                    background: var(--text-primary);
                    color: var(--beige-primary);
                    padding: 4rem 5% 2rem;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 3rem;
                    margin-bottom: 3rem;
                }

                .footer-brand h3 {
                    font-size: 1.5rem;
                    font-weight: 900;
                    background: var(--maroon-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1rem;
                }

                .footer-brand p {
                    color: rgba(245, 245, 220, 0.7);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }

                .footer-social {
                    display: flex;
                    gap: 0.75rem;
                }

                .social-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(245, 245, 220, 0.1);
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--beige-primary);
                    transition: all var(--transition-normal);
                    text-decoration: none;
                }

                .social-icon:hover {
                    background: var(--maroon-gradient);
                    transform: translateY(-3px);
                }

                .footer-column h4 {
                    font-size: 2.0rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .footer-links a {
                    color: rgba(245, 245, 220, 0.7);
                    text-decoration: none;
                    transition: all var(--transition-normal);
                }

                .footer-links a:hover {
                    color: var(--beige-primary);
                    padding-left: 0.5rem;
                }

                .footer-bottom {
                    padding-top: 2rem;
                    border-top: 1px solid rgba(245, 245, 220, 0.1);
                    text-align: center;
                    color: rgba(245, 245, 220, 0.5);
                    font-size: 0.9rem;
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 1024px) {
                    .hero-content {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    
                    .nav-menu {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .hero-section, .problems-section, .solution-section, 
                    .metrics-section, .ai-section, .benefits-section, 
                    .trust-section, .faq-section, .cta-section {
                        padding: 4rem 5%;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .section-title {
                        font-size: 2rem;
                    }

                    .cta-buttons {
                        flex-direction: column;
                    }

                    .btn, .btn-lg {
                        width: 100%;
                        justify-content: center;
                    }

                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                }

                /* ========== TILT CARD ========== */
                .tilt-card {
                    transition: transform 0.3s ease-out;
                }
            `}</style>

            <AnimatedBackground />
            <GlowingOrbs />

            {/* NAVIGATION */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="nav-brand">
                    <img src={logoImg} alt="Amrita Logo" className="nav-logo-img" />
                    <div className="nav-brand-text">
                        <h3>AMRITA</h3>
                        <p>Placement Tracker</p>
                    </div>
                </Link>

                <ul className="nav-menu">
                    <li><a href="#problem" className="nav-link">The Problem</a></li>
                    <li><a href="#solution" className="nav-link">Solution</a></li>
                    <li><a href="#metrics" className="nav-link">Metrics</a></li>
                    <li><a href="#features" className="nav-link">Features</a></li>
                    <li><a href="#benefits" className="nav-link">Benefits</a></li>
                    <li><a href="#faq" className="nav-link">FAQ</a></li>
                </ul>

                <div className="nav-actions">
                    <>
                        <Link to="/login" className="btn btn-secondary">Sign In</Link>
                        <Link to="/register" className="btn btn-primary">Register Now</Link>
                    </>

                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-pattern"></div>
                <div className="hero-content">
                    <FadeIn>
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Shape Your <span>Career Destiny</span><br />
                                with Precision
                            </h1>

                            <p className="hero-description">
                                The official placement intelligence system of Amrita Vishwa Vidyapeetham.
                                Track opportunities, prepare smarter, and connect with leading companies
                                worldwide—all in one unified platform.
                            </p>

                            <div className="hero-cta">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Now <ArrowRight size={20} />
                                </Link>
                                <a href="#features" className="btn btn-secondary btn-lg">
                                    Explore Features
                                </a>
                            </div>

                            <div className="hero-trust-badges">
                                {trustBadges.map((badge, i) => (
                                    <div key={i} className="trust-badge">
                                        {badge.icon}
                                        <span>{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={200} direction="right">
                        <TiltCard className="hero-visual">
                            <div className="hero-card-container">
                                <div className="hero-image-wrapper" style={{
                                    marginBottom: '1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-md)'
                                }}>
                                </div>
                                <div className="hero-card">
                                    {placementMetrics.slice(0, 4).map((metric, i) => (
                                        <div key={i} className="metric-card">
                                            <div className="metric-value">
                                                <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                                            </div>
                                            <div className="metric-label">{metric.label}</div>
                                            <div className="metric-trend">
                                                {metric.trend.direction === 'up' ? '↑' : '↓'} {metric.trend.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Real-time placement intelligence dashboard
                                </div>
                            </div>
                        </TiltCard>
                    </FadeIn>
                </div>
            </section>

            <WavySeparator />

            {/* PROBLEM AWARENESS SECTION */}
            <section id="problem" className="problems-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">The Placement Problem</div>
                        <h2 className="section-title">Before <span>Placement Tracker</span></h2>
                        <p className="section-description">
                            Traditional placement processes create unnecessary complexity, missed opportunities,
                            and information chaos for both students and placement cells.
                        </p>
                    </FadeIn>
                </div>

                <div className="problems-grid">
                    {placementProblems.map((problem, i) => (
                        <FadeIn key={i} delay={i * 100}>
                            <div className="problem-card">
                                <div className="problem-icon">{problem.icon}</div>
                                <h3 className="problem-title">{problem.title}</h3>
                                <p className="problem-description">{problem.description}</p>
                                <ul className="problem-issues">
                                    {problem.issues.map((issue, j) => (
                                        <li key={j}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <WavySeparator inverted />

            {/* SOLUTION OVERVIEW */}
            <section id="solution" className="solution-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Our Solution</div>
                        <h2 className="section-title">How It <span>Works</span></h2>
                        <p className="section-description">
                            A simple yet powerful 3-step process to transform your placement journey
                        </p>
                    </FadeIn>
                </div>

                <div className="solution-steps">
                    {solutionSteps.map((step, i) => (
                        <FadeIn key={i} delay={i * 150}>
                            <TiltCard className="step-card">
                                <div className="step-number">{step.step}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* UNIFIED PLATFORM */}
            <section className="platform-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Unified Platform</div>
                        <h2 className="section-title">One Platform, <span>Multiple Benefits</span></h2>
                        <p className="section-description">
                            Serving students, placement cells, and institutions on a single integrated platform
                        </p>
                    </FadeIn>
                </div>

                <div className="platform-grid">
                    <FadeIn>
                        <div className="platform-card">
                            <h3><Users size={20} /> For Students</h3>
                            <ul className="platform-features">
                                {unifiedPlatform.students.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <div className="platform-card">
                            <h3><Building2 size={20} /> For Placement Cell</h3>
                            <ul className="platform-features">
                                {unifiedPlatform.placementCell.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <div className="platform-card">
                            <h3><GraduationCap size={20} /> For Institution</h3>
                            <ul className="platform-features">
                                {unifiedPlatform.institution.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                </div>
            </section>

            <WavySeparator />

            {/* METRICS SECTION */}
            <section id="metrics" className="metrics-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Outcomes & Impact</div>
                        <h2 className="section-title">By The Numbers</h2>
                        <p className="section-description">
                            Real measurable outcomes from structured placement management
                        </p>
                    </FadeIn>
                </div>

                <div className="metrics-grid">
                    {placementMetrics.map((metric, i) => (
                        <FadeIn key={i} delay={i * 100}>
                            <TiltCard className="metric-item">
                                <div className="metric-icon">{metric.icon}</div>
                                <div className="metric-value-large">
                                    <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                                </div>
                                <div className="metric-label-large">{metric.label}</div>
                                <div className="metric-description">{metric.description}</div>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <WavySeparator inverted />

            {/* BRANCH STATISTICS */}
            <section className="branch-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Branch Performance</div>
                        <h2 className="section-title">Placement <span>Statistics</span></h2>
                        <p className="section-description">
                            Consistent excellence across all engineering disciplines
                        </p>
                    </FadeIn>
                </div>

                <div className="branch-grid">
                    {branchStats.map((branch, i) => (
                        <FadeIn key={i} delay={i * 100}>
                            <div className="branch-card">
                                <div className="branch-header">
                                    <div className="branch-name">{branch.branch}</div>
                                    <div className="branch-percentage">{branch.placement}%</div>
                                </div>
                                <AnimatedProgressBar
                                    percentage={branch.placement}
                                    label={`Avg Package: ₹${branch.avgPackage}L`}
                                    delay={i * 200}
                                />
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* AI FEATURES */}
            <section id="features" className="ai-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">AI & Smart Features</div>
                        <h2 className="section-title">Intelligent <span>Placement Intelligence</span></h2>
                        <p className="section-description">
                            AI-powered insights for superior placement outcomes
                        </p>
                    </FadeIn>
                </div>

                <div className="ai-grid">
                    {aiFeatures.map((feature, i) => (
                        <FadeIn key={i} delay={i * 100}>
                            <TiltCard className="ai-card">
                                <div className="ai-header">
                                    <div className="ai-icon">{feature.icon}</div>
                                    <h3 className="ai-title">{feature.title}</h3>
                                </div>
                                <p className="ai-description">{feature.description}</p>
                                <ul className="ai-capabilities">
                                    {feature.capabilities.map((capability, j) => (
                                        <li key={j}>{capability}</li>
                                    ))}
                                </ul>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <WavySeparator />

            {/* BENEFITS SECTION */}
            <section id="benefits" className="benefits-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Benefits</div>
                        <h2 className="section-title">What You <span>Gain</span></h2>
                        <p className="section-description">
                            Comprehensive benefits for students and institutions
                        </p>
                    </FadeIn>
                </div>

                <div className="benefits-grid">
                    <FadeIn>
                        <div className="benefit-card">
                            <h3><GraduationCap size={20} /> Student Benefits</h3>
                            <ul className="benefit-list">
                                {studentBenefits.map((benefit, i) => (
                                    <li key={i}>
                                        <strong>{benefit.benefit}:</strong> {benefit.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <div className="benefit-card">
                            <h3><Building2 size={20} /> Institution Benefits</h3>
                            <ul className="benefit-list">
                                {institutionBenefits.map((benefit, i) => (
                                    <li key={i}>
                                        <strong>{benefit.benefit}:</strong> {benefit.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* TRUST & SECURITY */}
            <section className="trust-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Trust & Security</div>
                        <h2 className="section-title">Enterprise-Grade <span>Security</span></h2>
                        <p className="section-description">
                            Your placement journey is protected with the highest security standards
                        </p>
                    </FadeIn>
                </div>

                <div className="trust-grid">
                    <FadeIn>
                        <div className="trust-card">
                            <div className="trust-icon">
                                <Lock size={32} />
                            </div>
                            <h3 className="trust-title">Data Privacy & Ethics</h3>
                            <p className="trust-description">
                                Enterprise-grade encryption and strict ethical data handling protocols
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <div className="trust-card">
                            <div className="trust-icon">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="trust-title">Role-Based Access</h3>
                            <p className="trust-description">
                                Verified institutional access with strict permission controls
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <div className="trust-card">
                            <div className="trust-icon">
                                <Database size={32} />
                            </div>
                            <h3 className="trust-title">Secure Infrastructure</h3>
                            <p className="trust-description">
                                Cloud-based with 99.9% uptime, automatic backups, and data integrity
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            <WavySeparator inverted />

            {/* FAQ SECTION */}
            <section id="faq" className="faq-section">
                <div className="section-header">
                    <FadeIn>
                        <div className="section-subtitle">Support & Clarity</div>
                        <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
                        <p className="section-description">
                            Common questions about the Placement Tracker platform
                        </p>
                    </FadeIn>
                </div>

                <div className="faq-grid">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i} delay={i * 50}>
                            <FAQItem question={faq.question} answer={faq.answer} />
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
                <FadeIn>
                    <h2 className="cta-title">Your placement journey deserves structure</h2>
                    <p className="cta-description">
                        Join thousands of Amrita students who have transformed their placement
                        experience with structured tracking, intelligent insights, and complete clarity.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="btn btn-white btn-lg">
                            Establish Credentials <ArrowRight size={22} />
                        </Link>
                        <Link to="/login" className="btn btn-outline-white btn-lg">
                            Existing Access
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>AMRITA Placement Tracker</h3>
                        <p>
                            The official placement management system of Amrita Vishwa Vidyapeetham,
                            empowering students to achieve their career aspirations through innovation and technology.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon"><Mail size={18} /></a>
                            <a href="#" className="social-icon"><MapPin size={18} /></a>
                            <a href="#" className="social-icon"><Phone size={18} /></a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Quick Access</h4>
                        <div className="footer-links">
                            <Link to="/login">Sign In</Link>
                            <Link to="/register">Get Started</Link>
                            <a href="#problem">The Problem</a>
                            <a href="#solution">Solution</a>
                            <a href="#metrics">Metrics</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Resources</h4>
                        <div className="footer-links">
                            <a href="https://www.amrita.edu/placements/" target="_blank" rel="noopener noreferrer">Official Placements ↗</a>
                            <a href="https://www.amrita.edu/department/cir/" target="_blank" rel="noopener noreferrer">CIR Department ↗</a>
                            <a href="#">Help Center</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Contact CIR</h4>
                        <div className="footer-links">
                            <a href="mailto:placement@amrita.edu">placement@amrita.edu</a>
                            <a href="tel:+914712345678">+91 471 234 5678</a>
                            <a href="#">Amritapuri Campus</a>
                            <a href="#">Coimbatore Campus</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Amrita Vishwa Vidyapeetham - Corporate and Industry Relations. All rights reserved.</p>
                    <p>Official placement network • Institutional credentials required</p>
                </div>
            </footer>
        </div>
    );
};

// ============= FAQ ITEM COMPONENT =============
const FAQItem = ({ question, answer }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={`faq-item ${isActive ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => setIsActive(!isActive)}>
                {question}
                <ChevronRight style={{ transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
            <div className="faq-answer">{answer}</div>
        </div>
    );
};

// ============= PHONE & MAP PIN ICONS =============
const Phone = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const Code = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

export default Home;