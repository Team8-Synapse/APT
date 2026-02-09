import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import campusImg from '../assets/AB1_cbe.png';
import {
    TrendingUp, Award, Users, ArrowRight, ShieldCheck,
    Building2, Globe, Star, CheckCircle, BarChart3,
    Target, Briefcase, Trophy, Rocket, BookOpen,
    ChevronRight, Calendar, MapPin, Mail,
    Bell, Clock, FileText, Video, MessageSquare,
    Sparkles, Database, Shield, Users2, GraduationCap,
    Smartphone, Laptop, Cloud, Lock, Search, Filter,
    Download, Upload, Eye, Heart, ThumbsUp, ExternalLink,
    PieChart, Cpu, LineChart, UserCheck, Play, Zap,
    MousePointer, Layers, Box, Activity, Send
} from 'lucide-react';

// ============= THEME =============
const theme = {
    maroon: { primary: '#8B0000', secondary: '#A52A2A', light: '#C04040', dark: '#5A0000' },
    beige: { primary: '#FFFFFF', secondary: '#F8F9FA' }
};

// ============= 1. PARTICLE UNIVERSE =============
const ParticleUniverse = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        for (let i = 0; i < 80; i++) {
            particlesRef.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p, i) => {
                // Mouse interaction
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.x -= dx * 0.02;
                    p.y -= dy * 0.02;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 0, 0, ${p.opacity})`;
                ctx.fill();

                // Connect nearby particles
                particlesRef.current.slice(i + 1).forEach(p2 => {
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(139, 0, 0, ${0.15 * (1 - d / 120)})`;
                        ctx.stroke();
                    }
                });
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        const handleMouse = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouse);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-canvas" />;
};

// ============= 2. AURORA EFFECT =============
const AuroraEffect = () => (
    <div className="aurora-container">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
    </div>
);

// ============= 3. MORPHING BLOBS =============
const MorphingBlobs = () => (
    <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
    </div>
);

// ============= 4. NOISE GRAIN =============
const NoiseGrain = () => <div className="noise-overlay" />;

// ============= 5. SPOTLIGHT CURSOR =============
const SpotlightCursor = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const move = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <div className="spotlight" style={{
            left: pos.x - 200,
            top: pos.y - 200,
        }} />
    );
};

// ============= 6. SCROLL PROGRESS =============
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProgress((window.scrollY / total) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
};

// ============= 7. MAGNETIC BUTTON =============
const MagneticButton = ({ children, className, ...props }) => {
    const ref = useRef(null);
    const [transform, setTransform] = useState('translate(0, 0)');

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setTransform(`translate(${x * 0.3}px, ${y * 0.3}px)`);
    };

    return (
        <button
            ref={ref}
            className={`magnetic-btn ${className}`}
            style={{ transform }}
            onMouseMove={handleMove}
            onMouseLeave={() => setTransform('translate(0, 0)')}
            {...props}
        >
            {children}
        </button>
    );
};

// ============= 8. TEXT CASCADE =============
const TextCascade = ({ text, className }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <span ref={ref} className={className}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="cascade-char"
                    style={{
                        animationDelay: `${i * 0.03}s`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
};

// ============= 9. GLITCH TEXT =============
const GlitchText = ({ children }) => (
    <span className="glitch-text" data-text={children}>{children}</span>
);

// ============= 10. HOLOGRAPHIC CARD =============
const HolographicCard = ({ children, className }) => {
    const ref = useRef(null);
    const [style, setStyle] = useState({});

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setStyle({ '--mouse-x': `${x}%`, '--mouse-y': `${y}%` });
    };

    return (
        <div ref={ref} className={`holo-card ${className}`} style={style} onMouseMove={handleMove}>
            {children}
        </div>
    );
};

// ============= 11. GLASSMORPHISM CARD =============
const GlassCard = ({ children, className, delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setTimeout(() => setVisible(true), delay);
        }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`glass-card ${className} ${visible ? 'visible' : ''}`}
        >
            {children}
        </div>
    );
};

// ============= 12. 3D TILT CARD =============
const Tilt3DCard = ({ children, className }) => {
    const [style, setStyle] = useState({});
    const ref = useRef(null);

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setStyle({
            transform: `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.05, 1.05, 1.05)`,
            '--shine-x': `${(x + 0.5) * 100}%`,
            '--shine-y': `${(y + 0.5) * 100}%`
        });
    };

    return (
        <div
            ref={ref}
            className={`tilt-3d-card ${className}`}
            style={style}
            onMouseMove={handleMove}
            onMouseLeave={() => setStyle({})}
        >
            {children}
            <div className="shine-overlay" />
        </div>
    );
};

// ============= 13. ANIMATED COUNTER =============
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started) {
                setStarted(true);
                const start = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                animate();
            }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [end, duration, started]);

    return <span ref={ref} className="animated-counter">{count}{suffix}</span>;
};

// ============= 14. PARALLAX IMAGE =============
const ParallaxImage = ({ src, alt, className }) => {
    const [offset, setOffset] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                setOffset(scrolled * 100 - 50);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={ref} className={`parallax-container ${className}`}>
            <img src={src} alt={alt} style={{ transform: `translateY(${offset * 0.3}px) scale(1.2)` }} />
            <div className="parallax-overlay" />
        </div>
    );
};

// ============= 15. FLOATING ELEMENT =============
const FloatingElement = ({ children, delay = 0, amplitude = 10 }) => (
    <div className="floating-element" style={{ animationDelay: `${delay}s`, '--amplitude': `${amplitude}px` }}>
        {children}
    </div>
);

// ============= 16. STAGGERED REVEAL =============
const StaggeredReveal = ({ children, delay = 0, direction = 'up' }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setTimeout(() => setVisible(true), delay);
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [delay]);

    const transforms = {
        up: 'translateY(60px)',
        down: 'translateY(-60px)',
        left: 'translateX(60px)',
        right: 'translateX(-60px)'
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translate(0) scale(1)' : `${transforms[direction]} scale(0.95)`,
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

// ============= 17. RIPPLE BUTTON =============
const RippleButton = ({ children, className, ...props }) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ripple = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now()
        };
        setRipples(prev => [...prev, ripple]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 600);
    };

    return (
        <button className={`ripple-btn ${className}`} onClick={handleClick} {...props}>
            {children}
            {ripples.map(r => (
                <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
            ))}
        </button>
    );
};

// ============= 18. ORBIT BADGES =============
const OrbitBadges = ({ badges }) => (
    <div className="orbit-container">
        {badges.map((badge, i) => (
            <div
                key={i}
                className="orbit-badge"
                style={{ '--angle': `${(360 / badges.length) * i}deg`, '--delay': `${i * 0.5}s` }}
            >
                {badge.icon}
                <span>{badge.text}</span>
            </div>
        ))}
    </div>
);

// ============= 19. ANIMATED PROGRESS BAR =============
const AnimatedProgressBar = ({ percentage, label, delay = 0 }) => {
    const [progress, setProgress] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setTimeout(() => {
                    let start = 0;
                    const step = percentage / 60;
                    const animate = () => {
                        start += step;
                        if (start >= percentage) {
                            setProgress(percentage);
                        } else {
                            setProgress(Math.floor(start));
                            requestAnimationFrame(animate);
                        }
                    };
                    animate();
                }, delay);
            }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [percentage, delay]);

    return (
        <div ref={ref} className="progress-container">
            <div className="progress-header">
                <span>{label}</span>
                <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }}>
                    <div className="progress-glow" />
                </div>
            </div>
        </div>
    );
};

// ============= 20. MARQUEE =============
const Marquee = ({ children, speed = 30, direction = 'left' }) => (
    <div className="marquee-container">
        <div
            className={`marquee-content ${direction === 'right' ? 'marquee-reverse' : ''}`}
            style={{ animationDuration: `${speed}s` }}
        >
            {children}
            {children}
        </div>
    </div>
);


// ============= 22. PULSE RING =============
const PulseRing = ({ children, className }) => (
    <div className={`pulse-ring-container ${className}`}>
        {children}
        <div className="pulse-ring pulse-1" />
        <div className="pulse-ring pulse-2" />
        <div className="pulse-ring pulse-3" />
    </div>
);

// ============= 23. FLIP CARD =============
const FlipCard = ({ front, back, className }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className={`flip-card ${className} ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="flip-card-inner">
                <div className="flip-card-front">{front}</div>
                <div className="flip-card-back">{back}</div>
            </div>
        </div>
    );
};

// ============= 24. TYPEWRITER =============
const Typewriter = ({ texts, className }) => {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = texts[index];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setText(current.slice(0, text.length + 1));
                if (text === current) setTimeout(() => setIsDeleting(true), 2000);
            } else {
                setText(current.slice(0, text.length - 1));
                if (text === '') {
                    setIsDeleting(false);
                    setIndex((index + 1) % texts.length);
                }
            }
        }, isDeleting ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [text, isDeleting, index, texts]);

    return <span className={`typewriter ${className}`}>{text}<span className="cursor">|</span></span>;
};

// ============= FAQ ITEM =============
const FAQItem = ({ question, answer }) => {
    const [active, setActive] = useState(false);
    return (
        <div className={`faq-item ${active ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => setActive(!active)}>
                {question}
                <ChevronRight style={{ transform: active ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.3s' }} />
            </div>
            <div className="faq-answer">{answer}</div>
        </div>
    );
};

// ============= PHONE & CODE ICONS =============
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

// ============= 25. WAVE BACKGROUND =============
const WaveBackground = () => (
    <div className="wave-bg">
        <svg className="wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(139,0,0,0.1)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg className="wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(139,0,0,0.05)" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,181.3C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
    </div>
);

// ============= 26. GRADIENT TEXT =============
const GradientText = ({ children, className = '' }) => (
    <span className={`gradient-text ${className}`}>{children}</span>
);

// ============= 27. SKELETON LOADER =============
const SkeletonLoader = ({ width = '100%', height = '20px' }) => (
    <div className="skeleton-loader" style={{ width, height }} />
);

// ============= 28. COUNTDOWN TIMER =============
const CountdownTimer = ({ targetDate }) => {
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        const update = () => {
            const diff = new Date(targetDate) - Date.now();
            if (diff > 0) {
                setTime({
                    days: Math.floor(diff / 86400000),
                    hours: Math.floor((diff % 86400000) / 3600000),
                    mins: Math.floor((diff % 3600000) / 60000),
                    secs: Math.floor((diff % 60000) / 1000)
                });
            }
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown">
            {Object.entries(time).map(([key, val]) => (
                <div key={key} className="countdown-item">
                    <span className="countdown-value">{val.toString().padStart(2, '0')}</span>
                    <span className="countdown-label">{key}</span>
                </div>
            ))}
        </div>
    );
};

// ============= 29. LIVE INDICATOR =============
const LiveIndicator = ({ active = true }) => (
    <div className={`live-indicator ${active ? 'active' : ''}`}>
        <span className="live-dot" />
        <span>LIVE</span>
    </div>
);

// ============= 30. SPLIT TEXT =============
const SplitText = ({ text, className = '' }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <span ref={ref} className={`split-text ${className} ${visible ? 'visible' : ''}`}>
            {text.split('').map((char, i) => (
                <span key={i} style={{ '--char-index': i }}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
        </span>
    );
};

// ============= 31. ANIMATED BORDER =============
const AnimatedBorder = ({ children, className = '' }) => (
    <div className={`animated-border ${className}`}>
        <div className="border-content">{children}</div>
    </div>
);

// ============= 32. NEON GLOW =============
const NeonGlow = ({ children, color = '#8B0000' }) => (
    <span className="neon-glow" style={{ '--neon-color': color }}>{children}</span>
);

// ============= 33. PARTICLE TRAIL =============
const ParticleTrail = () => {
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        const handleMove = (e) => {
            const trail = { x: e.clientX, y: e.clientY, id: Date.now() };
            setTrails(prev => [...prev.slice(-15), trail]);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div className="particle-trail-container">
            {trails.map((t, i) => (
                <div key={t.id} className="trail-particle" style={{ left: t.x, top: t.y, '--index': i }} />
            ))}
        </div>
    );
};

// ============= 34. MORPH ICON =============
const MorphIcon = ({ icon1, icon2, trigger }) => (
    <div className={`morph-icon ${trigger ? 'morphed' : ''}`}>
        <span className="icon-1">{icon1}</span>
        <span className="icon-2">{icon2}</span>
    </div>
);

// ============= 35. SMOOTH SCROLL LINK =============
const SmoothScrollLink = ({ to, children, className = '' }) => {
    const handleClick = (e) => {
        e.preventDefault();
        document.querySelector(to)?.scrollIntoView({ behavior: 'smooth' });
    };
    return <a href={to} onClick={handleClick} className={className}>{children}</a>;
};

// ============= 36. TOAST NOTIFICATION =============
const ToastNotification = ({ message, type = 'success', visible, onClose }) => (
    <div className={`toast-notification ${type} ${visible ? 'visible' : ''}`}>
        <span>{message}</span>
        <button onClick={onClose}>×</button>
    </div>
);

// ============= 37. TYPING INDICATOR =============
const TypingIndicator = () => (
    <div className="typing-indicator">
        <span /><span /><span />
    </div>
);

// ============= 38. SUCCESS CHECK =============
const SuccessCheck = ({ active }) => (
    <div className={`success-check ${active ? 'active' : ''}`}>
        <svg viewBox="0 0 52 52">
            <circle className="check-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="check-mark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
    </div>
);

// ============= 39. LOADING SPINNER =============
const LoadingSpinner = ({ size = 40 }) => (
    <div className="loading-spinner" style={{ width: size, height: size }}>
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
    </div>
);

// ============= 40. RADIAL PROGRESS =============
const RadialProgress = ({ percentage, size = 100 }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="radial-progress" width={size} height={size} viewBox="0 0 100 100">
            <circle className="radial-bg" cx="50" cy="50" r="40" />
            <circle className="radial-fill" cx="50" cy="50" r="40"
                strokeDasharray={circumference} strokeDashoffset={offset} />
            <text x="50" y="55" className="radial-text">{percentage}%</text>
        </svg>
    );
};

// ============= 41. BOUNCING DOTS =============
const BouncingDots = () => (
    <div className="bouncing-dots">
        <span style={{ '--delay': '0s' }} />
        <span style={{ '--delay': '0.1s' }} />
        <span style={{ '--delay': '0.2s' }} />
    </div>
);

// ============= 42. WAVEFORM VISUALIZER =============
const WaveformVisualizer = ({ active }) => (
    <div className={`waveform ${active ? 'active' : ''}`}>
        {[...Array(5)].map((_, i) => (
            <span key={i} style={{ '--bar-index': i }} />
        ))}
    </div>
);

// ============= 43. GRADIENT MESH BACKGROUND =============
const GradientMesh = () => (
    <div className="gradient-mesh">
        <div className="mesh-1" />
        <div className="mesh-2" />
        <div className="mesh-3" />
        <div className="mesh-4" />
    </div>
);

// ============= 44. LIQUID BUTTON =============
const LiquidButton = ({ children, className = '', ...props }) => (
    <button className={`liquid-btn ${className}`} {...props}>
        <span className="liquid-content">{children}</span>
        <span className="liquid-blob" />
    </button>
);

// ============= 45. TEXT REVEAL =============
const TextReveal = ({ text, className = '' }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <span ref={ref} className={`text-reveal ${className} ${visible ? 'visible' : ''}`}>
            <span className="reveal-inner">{text}</span>
        </span>
    );
};

// ============= 46. IMAGE REVEAL =============
const ImageReveal = ({ src, alt, className = '' }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`image-reveal ${className} ${visible ? 'visible' : ''}`}>
            <img src={src} alt={alt} />
        </div>
    );
};

// ============= 47. INFINITE SCROLL INDICATOR =============
const InfiniteScrollIndicator = () => (
    <div className="infinite-scroll-indicator">
        <div className="scroll-arrow" />
        <span>Scroll for more</span>
    </div>
);

// ============= 48. CARD STACK =============
const CardStack = ({ cards }) => {
    const [active, setActive] = useState(0);

    return (
        <div className="card-stack">
            {cards.map((card, i) => (
                <div key={i} className={`stack-card ${i === active ? 'active' : ''}`}
                    style={{ '--offset': i - active }}
                    onClick={() => setActive(i)}>
                    {card}
                </div>
            ))}
        </div>
    );
};

// ============= 49. ZOOM ON SCROLL =============
const ZoomOnScroll = ({ children, className = '' }) => {
    const [scale, setScale] = useState(0.8);
    const ref = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const progress = 1 - (rect.top / window.innerHeight);
                setScale(Math.min(1, Math.max(0.8, 0.8 + progress * 0.2)));
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={ref} className={`zoom-on-scroll ${className}`} style={{ transform: `scale(${scale})` }}>
            {children}
        </div>
    );
};

// ============= 50. ELASTIC ELEMENT =============
const ElasticElement = ({ children, className = '' }) => {
    const [style, setStyle] = useState({});

    const handleHover = () => setStyle({ transform: 'scale(1.1)' });
    const handleLeave = () => setStyle({ transform: 'scale(1)' });

    return (
        <div className={`elastic-element ${className}`} style={style}
            onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            {children}
        </div>
    );
};

// ============= 51. SHIMMER EFFECT =============
const ShimmerEffect = ({ width = '100%', height = '50px' }) => (
    <div className="shimmer-effect" style={{ width, height }} />
);

// ============= 52. GRADIENT BORDER =============
const GradientBorder = ({ children, className = '' }) => (
    <div className={`gradient-border-wrapper ${className}`}>
        <div className="gradient-border-content">{children}</div>
    </div>
);

// ============= 53. HOVER LIFT =============
const HoverLift = ({ children, className = '' }) => (
    <div className={`hover-lift ${className}`}>{children}</div>
);

// ============= 54. MAGNETIC LINK =============
const MagneticLink = ({ children, href, className = '' }) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        setOffset({
            x: (e.clientX - rect.left - rect.width / 2) * 0.2,
            y: (e.clientY - rect.top - rect.height / 2) * 0.2
        });
    };

    return (
        <a ref={ref} href={href} className={`magnetic-link ${className}`}
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            onMouseMove={handleMove} onMouseLeave={() => setOffset({ x: 0, y: 0 })}>
            {children}
        </a>
    );
};

// ============= 55. REVEAL ON HOVER =============
const RevealOnHover = ({ children, hiddenContent, className = '' }) => (
    <div className={`reveal-on-hover ${className}`}>
        <span className="visible-content">{children}</span>
        <span className="hidden-content">{hiddenContent}</span>
    </div>
);

// ============= 56. SCRAMBLE TEXT =============
const ScrambleText = ({ text, className = '' }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const handleHover = () => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(text.split('').map((char, i) =>
                i < iteration ? text[i] : chars[Math.floor(Math.random() * chars.length)]
            ).join(''));
            iteration += 1 / 3;
            if (iteration >= text.length) clearInterval(interval);
        }, 30);
    };

    return <span className={`scramble-text ${className}`} onMouseEnter={handleHover}>{display}</span>;
};

// ============= 57. ROTATING WORDS =============
const RotatingWords = ({ words }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setIndex(i => (i + 1) % words.length), 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className="rotating-words">
            {words.map((word, i) => (
                <span key={i} className={i === index ? 'active' : ''}>{word}</span>
            ))}
        </span>
    );
};

// ============= 58. UNDERLINE LINK =============
const UnderlineLink = ({ children, href, className = '' }) => (
    <a href={href} className={`underline-link ${className}`}>{children}</a>
);

// ============= 59. SLIDE REVEAL =============
const SlideReveal = ({ children, direction = 'left', className = '' }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`slide-reveal ${direction} ${className} ${visible ? 'visible' : ''}`}>
            {children}
        </div>
    );
};

// ============= 60. BREATHING ELEMENT =============
const BreathingElement = ({ children, className = '' }) => (
    <div className={`breathing-element ${className}`}>{children}</div>
);

// ============= 61. ICON BOX =============
const IconBox = ({ icon, title, desc, className = '' }) => (
    <div className={`icon-box ${className}`}>
        <div className="icon-box-icon">{icon}</div>
        <h4>{title}</h4>
        <p>{desc}</p>
    </div>
);

// ============= 62. FEATURE CARD =============
const FeatureCard = ({ icon, title, desc, color = '#8B0000' }) => (
    <div className="feature-card-enhanced" style={{ '--accent-color': color }}>
        <div className="feature-icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="feature-hover-effect" />
    </div>
);

// ============= 63. STAT CARD =============
const StatCard = ({ value, label, icon, trend }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {trend && <div className="stat-trend">{trend}</div>}
        </div>
    </div>
);

// ============= 64. TIMELINE ITEM =============
const TimelineItem = ({ year, title, desc, active }) => (
    <div className={`timeline-item ${active ? 'active' : ''}`}>
        <div className="timeline-marker">{year}</div>
        <div className="timeline-content">
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>
);

// ============= 65. TESTIMONIAL CARD =============
const TestimonialCard = ({ quote, author, role, avatar }) => (
    <div className="testimonial-card">
        <div className="quote-mark">"</div>
        <p className="testimonial-quote">{quote}</p>
        <div className="testimonial-author">
            <div className="author-avatar">{avatar}</div>
            <div className="author-info">
                <strong>{author}</strong>
                <span>{role}</span>
            </div>
        </div>
    </div>
);

// ============= 66. PRICING CARD =============
const PricingCard = ({ title, price, features, popular }) => (
    <div className={`pricing-card ${popular ? 'popular' : ''}`}>
        {popular && <div className="popular-badge">Most Popular</div>}
        <h3>{title}</h3>
        <div className="price">{price}</div>
        <ul>{features.map((f, i) => <li key={i}><CheckCircle size={16} /> {f}</li>)}</ul>
        <button className="pricing-btn">Get Started</button>
    </div>
);

// ============= 67. STEP INDICATOR =============
const StepIndicator = ({ steps, current }) => (
    <div className="step-indicator">
        {steps.map((step, i) => (
            <div key={i} className={`step ${i <= current ? 'active' : ''} ${i < current ? 'completed' : ''}`}>
                <div className="step-circle">{i < current ? <CheckCircle size={16} /> : i + 1}</div>
                <span className="step-label">{step}</span>
            </div>
        ))}
    </div>
);

// ============= 68. BADGE =============
const Badge = ({ children, variant = 'default' }) => (
    <span className={`badge badge-${variant}`}>{children}</span>
);

// ============= 69. CHIP =============
const Chip = ({ label, onRemove, avatar }) => (
    <span className="chip">
        {avatar && <span className="chip-avatar">{avatar}</span>}
        {label}
        {onRemove && <button onClick={onRemove}>×</button>}
    </span>
);

// ============= 70. TOOLTIP =============
const Tooltip = ({ children, content, position = 'top' }) => (
    <div className={`tooltip-wrapper tooltip-${position}`}>
        {children}
        <span className="tooltip-content">{content}</span>
    </div>
);

// ============= 71. ACCORDION =============
const Accordion = ({ items }) => {
    const [open, setOpen] = useState(null);
    return (
        <div className="accordion">
            {items.map((item, i) => (
                <div key={i} className={`accordion-item ${open === i ? 'open' : ''}`}>
                    <div className="accordion-header" onClick={() => setOpen(open === i ? null : i)}>
                        {item.title}
                        <ChevronRight className="accordion-icon" />
                    </div>
                    <div className="accordion-body">{item.content}</div>
                </div>
            ))}
        </div>
    );
};

// ============= 72. TABS =============
const Tabs = ({ tabs }) => {
    const [active, setActive] = useState(0);
    return (
        <div className="tabs-container">
            <div className="tabs-header">
                {tabs.map((tab, i) => (
                    <button key={i} className={`tab-btn ${i === active ? 'active' : ''}`}
                        onClick={() => setActive(i)}>{tab.label}</button>
                ))}
            </div>
            <div className="tabs-content">{tabs[active]?.content}</div>
        </div>
    );
};

// ============= 73. MODAL =============
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// ============= 74. DRAWER =============
const Drawer = ({ isOpen, onClose, children, position = 'right' }) => (
    <div className={`drawer drawer-${position} ${isOpen ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={onClose} />
        <div className="drawer-content">{children}</div>
    </div>
);

// ============= MAIN HOME COMPONENT =============
const Home = () => {
    const { token } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Data
    const trustBadges = [
        { icon: <ShieldCheck size={18} />, text: 'NAAC A++ Accredited' },
        { icon: <Award size={18} />, text: 'NIRF Top 10' },
        { icon: <Globe size={18} />, text: '6 Campus Network' },
        { icon: <Trophy size={18} />, text: '₹80.4 LPA Highest CTC' }
    ];

    const metrics = [
        { value: 98, suffix: '%', label: 'Placement Rate', desc: 'Industry-leading success', icon: <TrendingUp size={24} />, trend: '↑ 2024 record' },
        { value: 80.4, suffix: ' LPA', label: 'Highest CTC', desc: 'Amazon, Google, Microsoft', icon: <Award size={24} />, trend: '↑ 2024 peak' },
        { value: 9.08, suffix: ' LPA', label: 'Average CTC', desc: 'Across all branches', icon: <BarChart3 size={24} />, trend: '↑ 12% increase' },
        { value: 400, suffix: '+', label: 'Recruiting Partners', desc: 'MNCs & Startups', icon: <Building2 size={24} />, trend: '↑ +50 this year' },
        { value: 6, suffix: ' Campuses', label: 'Pan-India Network', desc: 'CBE, BLR, CHN, KCH, MYS, AMP', icon: <GraduationCap size={24} />, trend: '→ Unified Portal' },
        { value: 15000, suffix: '+', label: 'Students Placed', desc: 'Since 2020', icon: <Users size={24} />, trend: '↑ Growing YoY' }
    ];

    const problems = [
        { title: 'Missed Opportunities', desc: 'Important company deadlines lost in email chaos', icon: <Mail size={24} />, issues: ['Overflowing inboxes', 'Missed application deadlines', 'No centralized notifications'] },
        { title: 'Zero Real-time Visibility', desc: 'Cannot track application status or rounds', icon: <Eye size={24} />, issues: ['No live tracking', 'Unclear selection status', 'No interview schedules'] },
        { title: 'Manual Data Chaos', desc: 'Scattered across multiple disconnected systems', icon: <FileText size={24} />, issues: ['Multiple Excel sheets', 'WhatsApp group confusion', 'Paper forms & PDFs'] },
        { title: 'No Data-Driven Insights', desc: 'Lack of analytics for improvement', icon: <BarChart3 size={24} />, issues: ['No placement metrics', 'No skill gap analysis', 'No trend predictions'] }
    ];

    const platformFeatures = [
        { title: 'Placement Drives', desc: 'Centralized hub to track and apply for various company drives with real-time status updates.', icon: <Rocket size={32} /> },
        { title: 'Smart Eligibility', desc: 'Automated verification of CGPA, department, and backlogs against company requirements.', icon: <ShieldCheck size={32} /> },
        { title: 'Interview Experiences', desc: 'A rich repository of interview stories and strategies shared by seniors and alumni.', icon: <Users2 size={32} /> },
        { title: 'Preparation Hub', desc: 'Access curated resources, coding sheets, and previous question papers for top companies.', icon: <BookOpen size={32} /> },
        { title: 'AI Assistant', desc: 'Placement-focused AI chat for instant support and personalized preparation insights.', icon: <Sparkles size={32} /> },
        { title: 'Live Tracking', desc: 'Visual timeline of your application journey from shortlisting to the final HR round.', icon: <Activity size={32} /> }
    ];

    const aiFeatures = [
        { title: 'Placement Predictor', desc: 'Neural network model analyzing 10,000+ historical records to forecast your placement success rate.', icon: <LineChart size={28} />, caps: ['Success Probability %', 'Ideal Company Matching', 'CTC Bracket Prediction'] },
        { title: 'AI Resume Auditor', desc: 'Real-time ATS-compliance scoring and semantic analysis to highlight your hidden professional strengths.', icon: <Sparkles size={28} />, caps: ['ATS Score Optimization', 'Keyword Extraction', 'Tone & Impact Analysis'] },
        { title: 'Smart Pre-Prep Engine', desc: 'Generative AI creating personalized mock interview scenarios based on specific job descriptions.', icon: <Cpu size={28} />, caps: ['Custom Mock Interviews', 'Real-time Voice Feedback', 'Behavioral Question Prep'] },
        { title: 'Strategic Roadmap', desc: 'Dynamic learning paths that evolve as you complete certifications and projects.', icon: <MapPin size={28} />, caps: ['Milestone Tracking', 'Curated Skill Paths', 'Certification Validation'] }
    ];

    const branchStats = [
        { branch: 'Computer Science & Engineering', placement: 99.2, pkg: 18.5, highest: 80.4, students: 480 },
        { branch: 'Electronics & Communication', placement: 96.8, pkg: 12.3, highest: 33.0, students: 360 },
        { branch: 'Electrical & Electronics', placement: 94.5, pkg: 10.8, highest: 28.0, students: 240 },
        { branch: 'Mechanical Engineering', placement: 92.4, pkg: 9.8, highest: 19.0, students: 300 },
        { branch: 'Civil Engineering', placement: 89.7, pkg: 8.2, highest: 19.0, students: 180 },
        { branch: 'Chemical Engineering', placement: 88.5, pkg: 7.8, highest: 16.0, students: 120 }
    ];

    // Real company data with clearbit logos
    const companies = [
        { name: 'Google', logo: 'https://logo.clearbit.com/google.com', tier: 'dream' },
        { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', tier: 'dream' },
        { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', tier: 'dream' },
        { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', tier: 'dream' },
        { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', tier: 'dream' },
        { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', tier: 'dream' },
        { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com', tier: 'dream' },
        { name: 'Oracle', logo: 'https://logo.clearbit.com/oracle.com', tier: 'super' },
        { name: 'SAP', logo: 'https://logo.clearbit.com/sap.com', tier: 'super' },
        { name: 'Intel', logo: 'https://logo.clearbit.com/intel.com', tier: 'super' },
        { name: 'Cisco', logo: 'https://logo.clearbit.com/cisco.com', tier: 'super' },
        { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com', tier: 'super' },
        { name: 'Dell', logo: 'https://logo.clearbit.com/dell.com', tier: 'super' },
        { name: 'HP', logo: 'https://logo.clearbit.com/hp.com', tier: 'super' },
        { name: 'Nvidia', logo: 'https://logo.clearbit.com/nvidia.com', tier: 'dream' },
        { name: 'PayPal', logo: 'https://logo.clearbit.com/paypal.com', tier: 'super' },
        { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', tier: 'dream' },
        { name: 'Atlassian', logo: 'https://logo.clearbit.com/atlassian.com', tier: 'dream' },
        { name: 'Intuit', logo: 'https://logo.clearbit.com/intuit.com', tier: 'dream' },
        { name: 'ServiceNow', logo: 'https://logo.clearbit.com/servicenow.com', tier: 'super' },
        { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com', tier: 'regular' },
        { name: 'Infosys', logo: 'https://logo.clearbit.com/infosys.com', tier: 'regular' },
        { name: 'Wipro', logo: 'https://logo.clearbit.com/wipro.com', tier: 'regular' },
        { name: 'Cognizant', logo: 'https://logo.clearbit.com/cognizant.com', tier: 'regular' },
        { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com', tier: 'regular' },
        { name: 'Capgemini', logo: 'https://logo.clearbit.com/capgemini.com', tier: 'regular' },
        { name: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com', tier: 'super' },
        { name: 'KPMG', logo: 'https://logo.clearbit.com/kpmg.com', tier: 'super' },
        { name: 'EY', logo: 'https://logo.clearbit.com/ey.com', tier: 'super' },
        { name: 'PwC', logo: 'https://logo.clearbit.com/pwc.com', tier: 'super' },
        { name: 'Bosch', logo: 'https://logo.clearbit.com/bosch.com', tier: 'super' },
        { name: 'Siemens', logo: 'https://logo.clearbit.com/siemens.com', tier: 'super' },
        { name: 'HCL', logo: 'https://logo.clearbit.com/hcltech.com', tier: 'regular' },
        { name: 'Tech Mahindra', logo: 'https://logo.clearbit.com/techmahindra.com', tier: 'regular' },
        { name: 'Zoho', logo: 'https://logo.clearbit.com/zoho.com', tier: 'super' },
        { name: 'Freshworks', logo: 'https://logo.clearbit.com/freshworks.com', tier: 'super' },
        { name: 'Flipkart', logo: 'https://logo.clearbit.com/flipkart.com', tier: 'dream' },
        { name: 'Swiggy', logo: 'https://logo.clearbit.com/swiggy.com', tier: 'super' },
        { name: 'Razorpay', logo: 'https://logo.clearbit.com/razorpay.com', tier: 'dream' },
        { name: 'PhonePe', logo: 'https://logo.clearbit.com/phonepe.com', tier: 'super' }
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'SDE @ Amazon', batch: '2024', quote: 'APT helped me track every application and prepare strategically. Got my dream offer of ₹44 LPA!', rating: 5 },
        { name: 'Rahul Menon', role: 'Analyst @ Goldman Sachs', batch: '2024', quote: 'The skill gap analysis showed me exactly what to learn. Three months of focused prep landed me the job.', rating: 5 },
        { name: 'Sneha Krishnan', role: 'ML Engineer @ Microsoft', batch: '2023', quote: 'Real-time notifications meant I never missed a deadline. The interview prep resources were invaluable.', rating: 5 }
    ];

    const timeline = [
        { year: 'Jul-Aug', title: 'Pre-Placement Training', desc: 'Aptitude, coding, and soft skills workshops' },
        { year: 'Sep-Oct', title: 'Dream Company Drives', desc: 'Google, Microsoft, Amazon, and 50+ MNCs visit' },
        { year: 'Nov-Dec', title: 'Super Dream Offers', desc: 'Product companies with 15+ LPA packages' },
        { year: 'Jan-Mar', title: 'Regular Placements', desc: 'Mass recruiters and core companies' },
        { year: 'Apr-May', title: 'Internship Drives', desc: 'PPO conversions and summer internships' }
    ];

    const faqs = [
        { q: 'Who can access the Amrita Placement Tracker?', a: 'All enrolled students of Amrita Vishwa Vidyapeetham across all 6 campuses with valid institutional credentials.' },
        { q: 'Is my personal data secure?', a: 'Absolutely. We use enterprise-grade AES-256 encryption, follow GDPR compliance, and your data is never shared with third parties.' },
        { q: 'How does the AI skill prediction work?', a: 'Our ML models analyze your profile against 5+ years of placement data, company requirements, and market trends to provide personalized insights.' },
        { q: 'Is registration mandatory for placements?', a: 'While not mandatory, registering on APT is strongly recommended by the Placement Cell for optimal tracking and opportunities.' },
        { q: 'Can I track off-campus placements?', a: 'Yes! APT supports tracking of both on-campus and off-campus placement activities, including internships and PPOs.' },
        { q: 'What companies recruit through Amrita?', a: 'Over 400+ companies including Google, Microsoft, Amazon, TCS, Infosys, Deloitte, and many more visit annually.' }
    ];

    return (
        <div className="home-ultimate">
            <style>{styles}</style>

            {/* Background Effects */}
            <ParticleUniverse />
            <AuroraEffect />
            <MorphingBlobs />
            <NoiseGrain />
            <SpotlightCursor />
            <ScrollProgress />

            {/* Navigation */}
            <nav className={`nav-ultimate ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="nav-brand">
                    <FloatingElement amplitude={5}>
                        <img src={logoImg} alt="Amrita" className="nav-logo" />
                    </FloatingElement>
                    <div className="nav-text">
                        <span> AMRITA</span>
                        <span> Placement Tracker</span>
                    </div>
                </Link>
                <ul className="nav-links">
                    {['Problem', 'Solution', 'Metrics', 'Features', 'FAQ'].map(item => (
                        <li key={item}><a href={`#${item.toLowerCase()}`} className="nav-link">{item}</a></li>
                    ))}
                </ul>
                <div className="nav-actions">
                    <MagneticButton className="btn-primary">
                        <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Login
                        </Link>
                    </MagneticButton>
                    <MagneticButton className="btn-primary">
                        <Link to="/register" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Register
                        </Link>
                    </MagneticButton>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-ultimate">
                <div className="hero-bg">
                    <ParallaxImage src={campusImg} alt="Amrita Campus" className="hero-campus" />
                </div>
                <div className="hero-content">
                    <StaggeredReveal>
                        <div className="hero-text">
                            <div className="hero-badge">
                                <span>Official Placement Intelligence System</span>
                            </div>
                            <h1 className="hero-title">
                                <TextCascade text="Because  your " className="title-white" />
                                <GradientText>Placement  Journey</GradientText>
                                <TextCascade text="     deserves  structure" className="title-white" />
                            </h1>
                            <p className="hero-desc">
                                <Typewriter texts={['Track opportunities in real-time.', 'AI-powered placement insights.', 'Connect with 500+ companies.']} />
                            </p>
                            <div className="hero-cta">
                                <RippleButton className="btn-hero-primary">
                                    <Link to="/register">Get Started <ArrowRight size={20} /></Link>
                                </RippleButton>
                            </div>
                            <div className="hero-badges">
                                {trustBadges.map((b, i) => (
                                    <FloatingElement key={i} delay={i * 0.2} amplitude={8}>
                                        <div className="trust-badge">{b.icon}<span>{b.text}</span></div>
                                    </FloatingElement>
                                ))}
                            </div>
                        </div>
                    </StaggeredReveal>
                    <StaggeredReveal delay={200} direction="right">
                        <HolographicCard className="hero-card">
                            <div className="hero-metrics">
                                {metrics.map((m, i) => (
                                    <Tilt3DCard key={i} className="metric-card">
                                        <div className="metric-icon">{m.icon}</div>
                                        <div className="metric-value"><AnimatedCounter end={m.value} suffix={m.suffix} /></div>
                                        <div className="metric-label">{m.label}</div>
                                        <div className="metric-trend">{m.trend}</div>
                                    </Tilt3DCard>
                                ))}
                            </div>
                        </HolographicCard>
                    </StaggeredReveal>
                </div>
                <div className="scroll-indicator">
                    <div className="mouse"><div className="wheel" /></div>
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* Problem Section */}
            <section id="problem" className="section-problems">
                <div className="section-header">
                    <StaggeredReveal>
                        <span className="section-tag">The Challenge</span>
                        <h2>Before <GradientText>Placement Tracker</GradientText></h2>
                        <p>Traditional processes create unnecessary complexity and missed opportunities.</p>
                    </StaggeredReveal>
                </div>
                <div className="problems-grid">
                    {problems.map((p, i) => (
                        <StaggeredReveal key={i} delay={i * 100}>
                            <GlassCard className="problem-card" delay={i * 100}>
                                <div className="problem-icon">{p.icon}</div>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <ul>{p.issues.map((issue, j) => <li key={j}>{issue}</li>)}</ul>
                            </GlassCard>
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* Features Showcase Section */}
            <section id="solution" className="section-solution">
                <div className="section-header">
                    <StaggeredReveal>
                        <span className="section-tag">Platform Excellence</span>
                        <h2>What It <GradientText>Features</GradientText></h2>
                        <p>A comprehensive ecosystem designed to power every stage of your career growth.</p>
                    </StaggeredReveal>
                </div>
                <div className="solution-steps">
                    {platformFeatures.map((f, i) => (
                        <StaggeredReveal key={i} delay={i * 100}>
                            <Tilt3DCard className="solution-card">
                                <div className="step-number">{i + 1}</div>
                                <div className="step-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </Tilt3DCard>
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* Metrics Section */}
            <section id="metrics" className="section-metrics">
                <div className="section-header light">
                    <StaggeredReveal>
                        <span className="section-tag">Impact</span>
                        <h2>By The Numbers</h2>
                        <p>Real measurable outcomes from structured placement management.</p>
                    </StaggeredReveal>
                </div>
                <div className="metrics-grid">
                    {metrics.map((m, i) => (
                        <StaggeredReveal key={i} delay={i * 100}>
                            <GlassCard className="metric-item">
                                <div className="metric-icon-lg">{m.icon}</div>
                                <div className="metric-value-lg"><AnimatedCounter end={m.value} suffix={m.suffix} /></div>
                                <div className="metric-label-lg">{m.label}</div>
                                <div className="metric-desc">{m.desc}</div>
                            </GlassCard>
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* Company Marquee - Simple & Clean */}
            <section className="section-companies">
                <div className="section-header" style={{ padding: '2rem 5% 1rem' }}>
                    <span className="section-tag">Trusted By 400+ Companies</span>
                    <h2>Top <GradientText>Recruiters</GradientText></h2>
                </div>
                <Marquee speed={60}>
                    {companies.map((c, i) => (
                        <div key={i} className="company-logo">
                            <Building2 size={20} />
                            <span>{c.name}</span>
                        </div>
                    ))}
                </Marquee>
                <Marquee speed={50} direction="right">
                    {[...companies].reverse().map((c, i) => (
                        <div key={i} className="company-logo">
                            <Building2 size={20} />
                            <span>{c.name}</span>
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* Branch Stats */}
            <section className="section-branches">
                <div className="section-header">
                    <StaggeredReveal>
                        <span className="section-tag">Performance</span>
                        <h2>Branch-wise <GradientText>Statistics</GradientText></h2>
                        <p>Comprehensive placement data across all engineering branches for 2024</p>
                    </StaggeredReveal>
                </div>
                <div className="branch-grid">
                    {branchStats.map((b, i) => (
                        <StaggeredReveal key={i} delay={i * 100}>
                            <GlassCard className="branch-card">
                                <div className="branch-header">
                                    <span>{b.branch}</span>
                                    <span className="branch-pct">{b.placement}%</span>
                                </div>
                                <AnimatedProgressBar percentage={b.placement} label={`Avg: ₹${b.pkg}L`} delay={i * 200} />
                            </GlassCard>
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* AI Features */}
            <section id="features" className="section-features">
                <div className="section-header">
                    <StaggeredReveal>
                        <span className="section-tag">AI Features</span>
                        <h2>Intelligent <GradientText>Insights</GradientText></h2>
                    </StaggeredReveal>
                </div>
                <div className="features-grid">
                    {aiFeatures.map((f, i) => (
                        <StaggeredReveal key={i} delay={i * 100}>
                            <FlipCard
                                className="feature-flip"
                                front={
                                    <div className="feature-front">
                                        <div className="feature-icon">{f.icon}</div>
                                        <h3>{f.title}</h3>
                                        <p>{f.desc}</p>
                                    </div>
                                }
                                back={
                                    <div className="feature-back">
                                        <h4>Capabilities</h4>
                                        <ul>{f.caps.map((c, j) => <li key={j}><CheckCircle size={14} /> {c}</li>)}</ul>
                                    </div>
                                }
                            />
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="section-faq">
                <div className="section-header">
                    <StaggeredReveal>
                        <span className="section-tag">Support</span>
                        <h2>Frequently Asked <GradientText>Questions</GradientText></h2>
                    </StaggeredReveal>
                </div>
                <div className="faq-grid">
                    {faqs.map((f, i) => (
                        <StaggeredReveal key={i} delay={i * 50}>
                            <FAQItem question={f.q} answer={f.a} />
                        </StaggeredReveal>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-cta">
                <div className="cta-content">
                    <StaggeredReveal>
                        <h2>Your Placement Journey Deserves Structure</h2>
                        <p>Join thousands who transformed their experience with intelligent tracking.</p>
                        <div className="cta-buttons">
                            <RippleButton className="btn-cta-primary">
                                <Link to="/register">Start Your Journey <ArrowRight size={20} /></Link>
                            </RippleButton>
                            <RippleButton className="btn-cta-secondary">
                                <Link to="/login">Sign In</Link>
                            </RippleButton>
                        </div>
                    </StaggeredReveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-ultimate">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <img src={logoImg} alt="Amrita" className="footer-logo" />
                        <h3>Placement Tracker</h3>
                        <p>Official placement management system of Amrita Vishwa Vidyapeetham.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Access</h4>
                        <Link to="/login">Sign In</Link>
                        <Link to="/register">Register</Link>
                        <a href="#problem">The Problem</a>
                        <a href="#solution">Solution</a>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <a href="https://www.amrita.edu/placements/" target="_blank" rel="noopener noreferrer">Official Placements ↗</a>
                        <a href="https://www.amrita.edu/department/cir/" target="_blank" rel="noopener noreferrer">CIR Department ↗</a>
                        <a href="#">Help Center</a>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href="mailto:placement@amrita.edu">placement@amrita.edu</a>
                        <a href="tel:+914712345678">+91 471 234 5678</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Amrita Vishwa Vidyapeetham. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// ============= STYLES =============
const styles = `
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap');

/* Base */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
    background: #fff; 
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
}

/* Typography System */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', 'Sora', sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #1a1a1a;
}

.hero-title {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 900 !important;
    letter-spacing: -0.03em !important;
    text-shadow: 0 2px 20px rgba(139,0,0,0.08);
    font-feature-settings: 'ss01' on, 'ss02' on;
}

.glitch-text {
    font-family: 'Space Grotesk', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: -0.01em;
}

.section-title {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 800 !important;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
    -webkit-background-clip: text;
    background-clip: text;
}

.section-desc, .hero-desc, p {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    line-height: 1.7;
    letter-spacing: -0.01em;
}

/* Number & Data Typography */
.metric-value, .animated-counter, .countdown-value, .stat-value, .price {
    font-family: 'Space Grotesk', 'Outfit', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
}

/* Button & UI Typography */
.ripple-btn, .magnetic-btn, .liquid-btn, .pricing-btn, .tab-btn, button {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em;
}

/* Badge & Label Typography */
.badge, .chip, .hero-badge, .trust-badge, .popular-badge {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-weight: 600 !important;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-size: 0.75rem !important;
}

/* Card Title Typography */
.problem-card h3, .solution-card h3, .feature-front h3, .feature-card-enhanced h3, .icon-box h4, .pricing-card h3, .testimonial-author strong {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: -0.015em;
}

/* Nav Typography */
.nav-link {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-weight: 500 !important;
    letter-spacing: 0em;
}

/* Enhanced Text Effects */
.text-glow {
    text-shadow: 0 0 20px rgba(139,0,0,0.3), 0 0 40px rgba(139,0,0,0.1);
}

.text-elegant {
    font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
}

.text-mono {
    font-family: 'Space Grotesk', 'JetBrains Mono', monospace;
    font-variant-numeric: tabular-nums;
}

.home-ultimate { position: relative; min-height: 100vh; }

/* Particle Canvas */
.particle-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }

/* Aurora Effect */
.aurora-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
.aurora { position: absolute; width: 200%; height: 200%; border-radius: 50%; filter: blur(100px); opacity: 0.15; animation: aurora-float 20s ease-in-out infinite; }
.aurora-1 { background: radial-gradient(circle, #8B0000 0%, transparent 70%); top: -50%; left: -50%; animation-delay: 0s; }
.aurora-2 { background: radial-gradient(circle, #A52A2A 0%, transparent 70%); bottom: -50%; right: -50%; animation-delay: -7s; }
.aurora-3 { background: radial-gradient(circle, #C04040 0%, transparent 70%); top: 30%; left: 30%; animation-delay: -14s; }
@keyframes aurora-float { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(50px, 30px) scale(1.1); } }

/* Morphing Blobs */
.blob-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.1; animation: blob-morph 25s ease-in-out infinite; }
.blob-1 { width: 500px; height: 500px; background: #8B0000; top: 10%; right: -10%; }
.blob-2 { width: 400px; height: 400px; background: #A52A2A; bottom: 10%; left: -10%; animation-delay: -8s; }
.blob-3 { width: 300px; height: 300px; background: #C04040; top: 50%; left: 30%; animation-delay: -16s; }
@keyframes blob-morph { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg); } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(180deg); } }

/* Noise Grain */
.noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }

/* Spotlight Cursor */
.spotlight { position: fixed; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(139,0,0,0.08) 0%, transparent 70%); pointer-events: none; z-index: 1; transition: left 0.1s, top 0.1s; }

/* Scroll Progress */
.scroll-progress { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #8B0000, #C04040); z-index: 9999; transition: width 0.1s; }

/* Navigation */
.nav-ultimate { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 1rem 5%; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); background: rgba(0,0,0,0.2); backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
.nav-ultimate.scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 30px rgba(0,0,0,0.1); padding: 0.5rem 5%; border-bottom: 1px solid rgba(139,0,0,0.1); }
.nav-brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
.nav-logo { height: 60px; width: auto; transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.nav-text { display: flex; flex-direction: column; }
.nav-text span:first-child { font-size: 1.4rem; font-weight: 800; color: #fff; text-shadow: 0 2px 10px rgba(139,0,0,0.8), 0 0 20px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.5); transition: color 0.4s, text-shadow 0.4s; }
.nav-ultimate.scrolled .nav-text span:first-child { color: #8B0000; text-shadow: none; }
.nav-text span:last-child { font-size: 0.8rem; color: #eee; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; text-shadow: 0 1px 4px rgba(139,0,0,0.6), 0 2px 8px rgba(0,0,0,0.8); transition: color 0.4s, text-shadow 0.4s; }
.nav-ultimate.scrolled .nav-text span:last-child { color: #666; text-shadow: none; }
.nav-links { display: flex; gap: 2.5rem; list-style: none; }
.nav-link { color: #fff; text-decoration: none; font-weight: 700; font-size: 1.1rem; position: relative; padding: 0.5rem 0; text-shadow: 0 2px 8px rgba(139,0,0,0.6), 0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5); transition: color 0.4s, text-shadow 0.4s; }
.nav-ultimate.scrolled .nav-link { color: #333; text-shadow: none; }
.nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #8B0000, #C04040); transition: width 0.3s; }
.nav-link:hover::after { width: 100%; }
.nav-actions { display: flex; gap: 1rem; align-items: center; }
.btn-ghost { padding: 0.75rem 1.5rem; background: transparent; border: 2px solid transparent; color: #fff; font-weight: 700; text-decoration: none; border-radius: 12px; transition: all 0.3s; text-shadow: 0 1px 4px rgba(139,0,0,0.6), 0 2px 12px rgba(0,0,0,0.5); }
.nav-ultimate.scrolled .btn-ghost { color: #333; text-shadow: none; }
.btn-ghost:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); }
.nav-ultimate.scrolled .btn-ghost:hover { border-color: rgba(139,0,0,0.2); background: rgba(139,0,0,0.05); }
.btn-primary, .magnetic-btn { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #8B0000, #A52A2A); color: #fff !important; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 4px 15px rgba(139,0,0,0.3); }
.btn-primary:hover, .magnetic-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(139,0,0,0.4); }

/* Hero Section */
.hero-ultimate { min-height: 100vh; display: flex; align-items: center; position: relative; padding: 120px 5% 80px; overflow: hidden; }
.hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.parallax-container { width: 100%; height: 100%; overflow: hidden; position: relative; }
.parallax-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.1s; filter: brightness(1.15) contrast(1.05); }
.parallax-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 40%, transparent 100%); }
.hero-content { max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 2; }
.hero-text { max-width: 600px; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.6rem 1.5rem; background: rgba(139,0,0,0.85); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); border-radius: 50px; margin-bottom: 1.5rem; font-size: 0.8rem; color: #fff; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
.hero-title { font-family: 'Syne', 'Outfit', sans-serif; font-size: clamp(2rem, 4.5vw, 4rem); font-weight: 850; line-height: 1.1; margin-bottom: 2rem; color: #fff; letter-spacing: -0.05em; text-shadow: 0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(139,0,0,0.5), 0 2px 10px rgba(0,0,0,0.9), 0 0 15px rgba(139,0,0,0.4); }
.hero-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.35rem; color: #fff; margin-bottom: 2rem; min-height: 2rem; line-height: 1.6; font-weight: 700; letter-spacing: -0.01em; text-shadow: 0 2px 12px rgba(0,0,0,0.9), 0 4px 20px rgba(139,0,0,0.5), 0 0 10px rgba(0,0,0,0.5); }
.hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
.hero-badges { display: flex; gap: 1rem; flex-wrap: wrap; }
.trust-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(0,0,0,0.55); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; font-size: 0.85rem; font-weight: 700; color: #fff; text-shadow: 0 1px 6px rgba(139,0,0,0.8); }

/* Glitch Text - High Visibility White with Maroon Glow */
.glitch-text { position: relative; color: #fff; font-weight: inherit; text-shadow: 0 2px 15px rgba(139,0,0,0.8), 0 0 30px rgba(0,0,0,0.6); }
.glitch-text::before, .glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.glitch-text::before { animation: glitch-1 2s infinite linear alternate-reverse; clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); transform: translateX(-2px); color: #fff; opacity: 0.8; }
.glitch-text::after { animation: glitch-2 3s infinite linear alternate-reverse; clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); transform: translateX(2px); color: #fff; opacity: 0.8; }
@keyframes glitch-1 { 0%, 100% { opacity: 1; } 33% { opacity: 0.5; } }
@keyframes glitch-2 { 0%, 100% { opacity: 0; } 66% { opacity: 0.8; } }

/* Typewriter Visibility - Maroon Shadowed */
.typewriter { color: #fff; font-weight: 700; text-shadow: 0 2px 15px rgba(139,0,0,0.8), 0 4px 20px rgba(0,0,0,0.7); }
.cursor { color: #fff; animation: blink 1s step-end infinite; text-shadow: 0 0 15px #8B0000, 0 0 25px rgba(139,0,0,0.5); }
@keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }

/* Text Cascade */
.cascade-char { display: inline-block; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

/* Buttons */
.ripple-btn { position: relative; overflow: hidden; padding: 1rem 2rem; border: none; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
.ripple-btn a { color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
.btn-hero-primary { background: linear-gradient(135deg, #8B0000, #A52A2A); color: #fff; box-shadow: 0 8px 30px rgba(139,0,0,0.3); }
.btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(139,0,0,0.4); }
.btn-hero-secondary { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); color: #8B0000; border: 2px solid rgba(139,0,0,0.2); }
.btn-hero-secondary:hover { background: #8B0000; color: #fff; }
.ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4); animation: ripple-anim 0.6s linear; pointer-events: none; }
@keyframes ripple-anim { from { width: 0; height: 0; opacity: 1; } to { width: 300px; height: 300px; opacity: 0; margin-left: -150px; margin-top: -150px; } }

/* Hero Metrics Wrapper - Invisible Outer BG */
.hero-card { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: 0; padding: 0.5rem; border: none; box-shadow: none; }
.hero-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
.metric-card { background: rgba(255,255,255,0.12); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.25); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.metric-card:hover { border-color: rgba(139,0,0,0.3); box-shadow: 0 10px 30px rgba(139,0,0,0.1); }
.metric-icon { width: 50px; height: 50px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.metric-value { font-size: 2.2rem; font-weight: 900; color: #fff; text-shadow: 0 2px 15px rgba(139,0,0,0.7), 0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3); }
.metric-label { font-size: 1rem; color: #eee; font-weight: 700; margin-top: 0.25rem; text-shadow: 0 1px 10px rgba(139,0,0,0.6), 0 2px 12px rgba(0,0,0,0.6); }
.metric-trend { font-size: 0.85rem; color: #fff; margin-top: 0.5rem; font-weight: 800; background: rgba(139,0,0,0.8); padding: 2px 10px; border-radius: 6px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }

/* Holographic Card */
.holo-card { position: relative; overflow: hidden; }
.holo-card::before { content: ''; position: absolute; top: var(--mouse-y, 50%); left: var(--mouse-x, 50%); width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%); transform: translate(-50%, -50%); pointer-events: none; opacity: 0; transition: opacity 0.3s; }
.holo-card:hover::before { opacity: 1; }

/* Tilt 3D Card */
.tilt-3d-card { transition: transform 0.3s ease-out; position: relative; transform-style: preserve-3d; }
.shine-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%); background-size: 200% 200%; background-position: var(--shine-x, 0%) var(--shine-y, 0%); pointer-events: none; border-radius: inherit; opacity: 0; transition: opacity 0.3s; }
.tilt-3d-card:hover .shine-overlay { opacity: 1; }

/* Glass Card - Fully Transparent */
.glass-card { background: transparent; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 2rem; opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.glass-card.visible { opacity: 1; transform: translateY(0); }
.glass-card:hover { border-color: rgba(255,255,255,0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.2); transform: translateY(-5px); }

/* Floating Element */
.floating-element { animation: float 4s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(calc(-1 * var(--amplitude, 10px))); } }

/* Pulse Ring */
.pulse-ring-container { position: relative; display: inline-flex; align-items: center; justify-content: center; }
.pulse-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid #8B0000; animation: pulse-expand 2s ease-out infinite; }
.pulse-1 { animation-delay: 0s; }
.pulse-2 { animation-delay: 0.5s; }
.pulse-3 { animation-delay: 1s; }
@keyframes pulse-expand { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }

/* Scroll Indicator */
.scroll-indicator { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: #666; font-size: 0.8rem; animation: bounce 2s infinite; }
.mouse { width: 24px; height: 36px; border: 2px solid #8B0000; border-radius: 12px; position: relative; }
.wheel { width: 4px; height: 8px; background: #8B0000; border-radius: 2px; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); animation: scroll-wheel 1.5s infinite; }
@keyframes scroll-wheel { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(10px); } }
@keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }

/* Sections */
.section-problems, .section-solution, .section-branches, .section-features, .section-faq { padding: 6rem 5%; background: #fff; position: relative; z-index: 2; }
.section-metrics { padding: 6rem 5%; background: linear-gradient(135deg, rgba(139,0,0,0.85), rgba(90,0,0,0.85)); backdrop-filter: blur(10px); position: relative; z-index: 2; }
.section-companies { padding: 3rem 0; background: rgba(139,0,0,0.03); overflow: hidden; position: relative; z-index: 2; }
.section-cta { padding: 6rem 5%; background: linear-gradient(135deg, #8B0000, #A52A2A); position: relative; z-index: 2; }

.section-header { text-align: center; margin-bottom: 4rem; }
.section-header.light h2, .section-header.light p { color: #fff; }
.section-tag { display: inline-block; padding: 0.5rem 1.25rem; background: rgba(139,0,0,0.08); color: #8B0000; border-radius: 50px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1.25rem; }
.section-header h2 { font-family: 'Outfit', sans-serif; font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 800; color: #0f0f0f; margin-bottom: 1.25rem; letter-spacing: -0.03em; line-height: 1.1; }
.section-header p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; color: #5a5a5a; max-width: 600px; margin: 0 auto; line-height: 1.7; letter-spacing: -0.01em; font-weight: 400; }

/* Grids - Force single row */
.problems-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
.solution-steps { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
    gap: 2rem; 
    max-width: 1400px; 
    margin: 0 auto; 
}
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1200px; margin: 0 auto; }
.branch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
.faq-grid { max-width: 800px; margin: 0 auto; }

/* Problem Card - Animated & Glassmorphed */
.problem-card { 
    background: rgba(255,255,255,0.7); 
    backdrop-filter: blur(10px); 
    border: 1px solid rgba(139,0,0,0.08); 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fade-in-up 0.6s ease-out backwards;
}
.problem-card:nth-child(1) { animation-delay: 0.1s; }
.problem-card:nth-child(2) { animation-delay: 0.2s; }
.problem-card:nth-child(3) { animation-delay: 0.3s; }
.problem-card:nth-child(4) { animation-delay: 0.4s; }
.problem-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(139,0,0,0.15); border-color: rgba(139,0,0,0.2); }
.problem-card .problem-icon { width: 60px; height: 60px; background: linear-gradient(135deg, rgba(139,0,0,0.1), rgba(139,0,0,0.05)); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #8B0000; margin-bottom: 1.5rem; transition: all 0.4s; }
.problem-card:hover .problem-icon { background: linear-gradient(135deg, #8B0000, #A52A2A); color: #fff; transform: rotate(-5deg) scale(1.1); }
.problem-card h3 { font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.75rem; }
.problem-card p { color: #666; margin-bottom: 1rem; }
.problem-card ul { list-style: none; }
.problem-card li { color: #888; font-size: 1rem; padding-left: 1rem; position: relative; margin-bottom: 0.5rem; }
.problem-card li::before { content: '•'; position: absolute; left: 0; color: #8B0000; }
@keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* Solution Card - Animated */
.solution-card { 
    background: rgba(255,255,255,0.85); 
    backdrop-filter: blur(12px); 
    border: 1px solid rgba(139,0,0,0.1); 
    border-radius: 24px; 
    padding: 2.5rem 2rem; 
    text-align: center; 
    position: relative; 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fade-in-up 0.6s ease-out backwards;
}
.solution-card:nth-child(1) { animation-delay: 0.1s; }
.solution-card:nth-child(2) { animation-delay: 0.2s; }
.solution-card:nth-child(3) { animation-delay: 0.3s; }
.solution-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(139,0,0,0.2); }
.step-number { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: linear-gradient(135deg, #8B0000, #A52A2A); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; box-shadow: 0 4px 15px rgba(139,0,0,0.3); transition: all 0.3s; }
.solution-card:hover .step-number { transform: translateX(-50%) scale(1.15); }
.step-icon { width: 80px; height: 80px; background: rgba(139,0,0,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #8B0000; margin: 1rem auto 1.5rem; transition: all 0.4s; }
.solution-card:hover .step-icon { background: linear-gradient(135deg, #8B0000, #A52A2A); color: #fff; transform: scale(1.1) rotate(5deg); }
.solution-card h3 { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.75rem; }
.solution-card p { color: #666; }

/* Metrics Items - Fully Transparent & Movable */
.metric-item { 
    background: transparent !important; 
    backdrop-filter: blur(8px); 
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2); 
    border-radius: 20px; 
    padding: 2rem; 
    text-align: center; 
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: float-subtle 4s ease-in-out infinite;
}
.metric-item:nth-child(1) { animation-delay: 0s; }
.metric-item:nth-child(2) { animation-delay: 0.5s; }
.metric-item:nth-child(3) { animation-delay: 1s; }
.metric-item:nth-child(4) { animation-delay: 1.5s; }
.metric-item:nth-child(5) { animation-delay: 2s; }
.metric-item:nth-child(6) { animation-delay: 2.5s; }
.metric-item:hover { transform: translateY(-12px) scale(1.02); background: rgba(255,255,255,0.12); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
@keyframes float-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.metric-icon-lg { width: 70px; height: 70px; background: rgba(255,255,255,0.9); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #8B0000; margin: 0 auto 1.5rem; }
.metric-value-lg { font-size: 3rem; font-weight: 900; color: #fff; }
.metric-label-lg { font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 0.5rem; }
.metric-desc { font-size: 1rem; color: rgba(255,255,255,0.8); margin-top: 0.5rem; }

/* Marquee */
.marquee-container { overflow: hidden; width: 100%; }
.marquee-content { display: flex; gap: 3rem; animation: marquee linear infinite; width: max-content; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.company-logo { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: rgba(255,255,255,0.8); border-radius: 12px; color: #8B0000; font-weight: 600; white-space: nowrap; }

/* Branch Card */
.branch-card .branch-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.branch-card .branch-header span:first-child { font-weight: 700; color: #1a1a1a; }
.branch-pct { font-size: 1.5rem; font-weight: 900; color: #8B0000; }

/* Progress Bar */
.progress-container { margin-top: 1rem; }
.progress-header { display: flex; justify-content: space-between; font-size: 1rem; color: #666; margin-bottom: 0.5rem; }
.progress-value { font-weight: 700; color: #8B0000; }
.progress-track { height: 8px; background: rgba(139,0,0,0.1); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #8B0000, #C04040); border-radius: 4px; position: relative; transition: width 1.5s ease-out; }
.progress-glow { position: absolute; right: 0; top: 0; width: 20px; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5)); animation: progress-shine 1.5s ease-out; }
@keyframes progress-shine { 0% { opacity: 1; } 100% { opacity: 0; } }

/* Flip Card */
.flip-card { perspective: 1000px; height: 300px; cursor: pointer; }
.flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
.flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
.flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; justify-content: center; }
.flip-card-front { background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(139,0,0,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.flip-card-back { background: linear-gradient(135deg, #8B0000 0%, #5A0000 100%); color: #fff; transform: rotateY(180deg); box-shadow: 0 15px 35px rgba(139,0,0,0.3); }
.feature-front .feature-icon { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(139,0,0,0.1), rgba(139,0,0,0.05)); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: #8B0000; margin-bottom: 1.5rem; transition: all 0.4s; box-shadow: 0 5px 15px rgba(139,0,0,0.05); }
.feature-flip:hover .feature-icon { transform: scale(1.1) rotate(5deg); background: #8B0000; color: #fff; box-shadow: 0 10px 20px rgba(139,0,0,0.2); }
.feature-front h3 { font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.75rem; }
.feature-front p { color: #666; }
.feature-back h4 { font-size: 1.1rem; margin-bottom: 1rem; }
.feature-back ul { list-style: none; }
.feature-back li { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.95rem; }

/* FAQ */
.faq-item { background: rgba(255,255,255,0.95); border: 1px solid rgba(139,0,0,0.1); border-radius: 20px; margin-bottom: 1.25rem; overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid #8B0000; }
.faq-item:hover { transform: translateX(8px); border-color: rgba(139,0,0,0.3); box-shadow: 0 10px 25px rgba(139,0,0,0.1); }
.faq-question { padding: 1.75rem 2rem; font-weight: 700; color: #1a1a1a; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s; font-size: 1.1rem; }
.faq-item.active .faq-question { color: #8B0000; background: rgba(139,0,0,0.03); }
.faq-question:hover { background: rgba(139,0,0,0.05); }
.faq-answer { padding: 0 2rem; max-height: 0; overflow: hidden; transition: all 0.4s ease; color: #555; line-height: 1.8; font-size: 1rem; }
.faq-item.active .faq-answer { padding: 0.5rem 2rem 2rem; max-height: 300px; border-top: 1px solid rgba(139,0,0,0.05); }

/* CTA */
.cta-content { text-align: center; max-width: 800px; margin: 0 auto; }
.cta-content h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #fff; margin-bottom: 1.5rem; }
.cta-content p { font-size: 1.2rem; color: rgba(255,255,255,0.9); margin-bottom: 2.5rem; }
.cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-cta-primary { background: #fff; color: #8B0000 !important; }
.btn-cta-primary a { color: #8B0000; }
.btn-cta-primary:hover { background: transparent; border: 2px solid #fff; color: #fff !important; }
.btn-cta-primary:hover a { color: #fff; }
.btn-cta-secondary { background: transparent; border: 2px solid #fff; color: #fff !important; }
.btn-cta-secondary a { color: #fff; }
.btn-cta-secondary:hover { background: #fff; color: #8B0000 !important; }
.btn-cta-secondary:hover a { color: #8B0000; }

/* Confetti */
.confetti-container { position: fixed; top: 50%; left: 50%; pointer-events: none; z-index: 9999; }
.confetti { position: absolute; width: 10px; height: 10px; background: var(--color); animation: confetti-fall 1s ease-out forwards; animation-delay: var(--delay); }
@keyframes confetti-fall { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; } }

/* Footer */
.footer-ultimate { background: #1a1a1a; color: #fff; padding: 4rem 5% 2rem; position: relative; z-index: 2; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
.footer-brand .footer-logo { height: 60px; margin-bottom: 1rem; }
.footer-brand h3 { font-size: 1.5rem; font-weight: 900; color: #8B0000; margin-bottom: 1rem; }
.footer-brand p { color: rgba(255,255,255,0.7); line-height: 1.6; }
.footer-col h4 { font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff; }
.footer-col a { display: block; color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 0.75rem; transition: all 0.3s; }
.footer-col a:hover { color: #fff; padding-left: 0.5rem; }
.footer-bottom { padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; color: rgba(255,255,255,0.5); font-size: 0.9rem; }

/* Responsive */
@media (max-width: 1024px) {
    .hero-content { grid-template-columns: 1fr; gap: 3rem; }
    .nav-links { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
    .hero-ultimate, .section-problems, .section-solution, .section-metrics, .section-features, .section-faq, .section-cta { padding: 4rem 5%; }
    .hero-title { font-size: 2.5rem; }
    .hero-cta, .cta-buttons { flex-direction: column; }
    .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}

/* ============= NEW 50 EFFECTS STYLES ============= */

/* Wave Background */
.wave-bg { position: absolute; bottom: 0; left: 0; width: 100%; overflow: hidden; z-index: 0; }
.wave { position: absolute; bottom: 0; width: 100%; height: 200px; animation: wave-move 10s linear infinite; }
.wave-2 { animation-delay: -5s; opacity: 0.5; }
@keyframes wave-move { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Gradient Text - Clean Professional */
.gradient-text { 
    background: linear-gradient(135deg, #8B0000 0%, #C04040 50%, #8B0000 100%); 
    -webkit-background-clip: text; 
    background-clip: text; 
    color: transparent; 
    font-weight: inherit;
    display: inline;
    text-shadow: none !important;
}

/* Company Logo - Simple & Clean */
.company-logo { 
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem; margin: 0 0.5rem; 
    background: #fff; border-radius: 50px;
    font-size: 0.9rem; font-weight: 600; color: #333;
    border: 1px solid rgba(139,0,0,0.1);
    white-space: nowrap; transition: all 0.3s;
}
.company-logo svg { color: #8B0000; }
.company-logo:hover { border-color: #8B0000; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139,0,0,0.1); }

/* Marquee with direction support */
.marquee-container { overflow: hidden; padding: 0.75rem 0; }
.marquee-content { display: flex; animation: marquee var(--duration, 30s) linear infinite; width: max-content; }
.marquee-reverse { animation-direction: reverse; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Skeleton Loader */
.skeleton-loader { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s infinite; border-radius: 8px; }
@keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

/* Countdown */
.countdown { display: flex; gap: 1rem; }
.countdown-item { text-align: center; padding: 1rem; background: rgba(139,0,0,0.1); border-radius: 12px; min-width: 70px; }
.countdown-value { display: block; font-size: 2rem; font-weight: 900; color: #8B0000; }
.countdown-label { font-size: 0.8rem; color: #666; text-transform: capitalize; }

/* Live Indicator */
.live-indicator { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #1a1a1a; color: #fff; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
.live-dot { width: 8px; height: 8px; background: #ff4444; border-radius: 50%; animation: live-pulse 1.5s ease-in-out infinite; }
.live-indicator.active .live-dot { background: #00ff00; }
@keyframes live-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }

/* Split Text */
.split-text span { display: inline-block; opacity: 0; transform: translateY(20px) rotateX(-90deg); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.split-text.visible span { opacity: 1; transform: translateY(0) rotateX(0); transition-delay: calc(var(--char-index) * 0.03s); }

/* Animated Border */
.animated-border { position: relative; padding: 3px; background: linear-gradient(90deg, #8B0000, #C04040, #FFD700, #8B0000); background-size: 300% 100%; animation: border-gradient 3s linear infinite; border-radius: 16px; }
.border-content { background: #fff; border-radius: 13px; padding: 1.5rem; }
@keyframes border-gradient { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }

/* Neon Glow */
.neon-glow { color: var(--neon-color); text-shadow: 0 0 10px var(--neon-color), 0 0 20px var(--neon-color), 0 0 40px var(--neon-color); animation: neon-flicker 2s infinite alternate; }
@keyframes neon-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }

/* Particle Trail */
.particle-trail-container { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; }
.trail-particle { position: fixed; width: 8px; height: 8px; background: #8B0000; border-radius: 50%; opacity: calc(1 - var(--index) * 0.06); transform: translate(-50%, -50%) scale(calc(1 - var(--index) * 0.05)); transition: opacity 0.3s, transform 0.3s; }

/* Morph Icon */
.morph-icon { position: relative; width: 24px; height: 24px; }
.morph-icon span { position: absolute; inset: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.morph-icon .icon-1 { opacity: 1; transform: scale(1) rotate(0deg); }
.morph-icon .icon-2 { opacity: 0; transform: scale(0.5) rotate(-180deg); }
.morph-icon.morphed .icon-1 { opacity: 0; transform: scale(0.5) rotate(180deg); }
.morph-icon.morphed .icon-2 { opacity: 1; transform: scale(1) rotate(0deg); }

/* Toast Notification */
.toast-notification { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: #1a1a1a; color: #fff; border-radius: 12px; display: flex; align-items: center; gap: 1rem; transform: translateX(150%); transition: transform 0.3s; z-index: 9999; }
.toast-notification.visible { transform: translateX(0); }
.toast-notification.success { border-left: 4px solid #00c853; }
.toast-notification.error { border-left: 4px solid #ff1744; }
.toast-notification button { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }

/* Typing Indicator */
.typing-indicator { display: flex; gap: 4px; padding: 0.75rem 1rem; background: rgba(139,0,0,0.1); border-radius: 20px; }
.typing-indicator span { width: 8px; height: 8px; background: #8B0000; border-radius: 50%; animation: typing-bounce 1.4s infinite ease-in-out; }
.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }

/* Success Check */
.success-check { width: 52px; height: 52px; }
.success-check svg { width: 100%; height: 100%; }
.check-circle { stroke: #00c853; stroke-width: 2; stroke-dasharray: 166; stroke-dashoffset: 166; transform-origin: center; animation: none; }
.check-mark { stroke: #00c853; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 48; stroke-dashoffset: 48; }
.success-check.active .check-circle { animation: check-circle-anim 0.6s ease-out forwards; }
.success-check.active .check-mark { animation: check-mark-anim 0.4s 0.4s ease-out forwards; }
@keyframes check-circle-anim { to { stroke-dashoffset: 0; } }
@keyframes check-mark-anim { to { stroke-dashoffset: 0; } }

/* Loading Spinner */
.loading-spinner { position: relative; }
.spinner-ring { position: absolute; inset: 0; border: 3px solid transparent; border-radius: 50%; }
.spinner-ring:nth-child(1) { border-top-color: #8B0000; animation: spinner-rotate 1s linear infinite; }
.spinner-ring:nth-child(2) { border-right-color: #A52A2A; animation: spinner-rotate 1.5s linear infinite reverse; }
.spinner-ring:nth-child(3) { border-bottom-color: #C04040; animation: spinner-rotate 2s linear infinite; }
@keyframes spinner-rotate { to { transform: rotate(360deg); } }

/* Radial Progress */
.radial-progress { transform: rotate(-90deg); }
.radial-bg { fill: none; stroke: rgba(139,0,0,0.1); stroke-width: 8; }
.radial-fill { fill: none; stroke: #8B0000; stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 1s ease-out; }
.radial-text { fill: #8B0000; font-size: 20px; font-weight: 700; text-anchor: middle; transform: rotate(90deg); transform-origin: center; }

/* Bouncing Dots */
.bouncing-dots { display: flex; gap: 4px; }
.bouncing-dots span { width: 10px; height: 10px; background: #8B0000; border-radius: 50%; animation: bounce-dot 0.6s infinite alternate; animation-delay: var(--delay); }
@keyframes bounce-dot { to { transform: translateY(-10px); opacity: 0.5; } }

/* Waveform */
.waveform { display: flex; align-items: flex-end; gap: 3px; height: 30px; }
.waveform span { width: 4px; background: #8B0000; border-radius: 2px; height: 5px; }
.waveform.active span { animation: waveform-bar 0.8s ease-in-out infinite; animation-delay: calc(var(--bar-index) * 0.1s); }
@keyframes waveform-bar { 0%, 100% { height: 5px; } 50% { height: 25px; } }

/* Gradient Mesh */
.gradient-mesh { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.gradient-mesh div { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
.mesh-1 { width: 600px; height: 600px; background: #8B0000; top: -200px; left: -200px; animation: mesh-float 20s ease-in-out infinite; }
.mesh-2 { width: 500px; height: 500px; background: #A52A2A; bottom: -200px; right: -200px; animation: mesh-float 25s ease-in-out infinite reverse; }
.mesh-3 { width: 400px; height: 400px; background: #C04040; top: 50%; left: 50%; animation: mesh-float 30s ease-in-out infinite; }
.mesh-4 { width: 300px; height: 300px; background: #FFD700; top: 30%; right: 20%; animation: mesh-float 22s ease-in-out infinite reverse; }
@keyframes mesh-float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(50px, 50px); } }

/* Liquid Button */
.liquid-btn { position: relative; padding: 1rem 2rem; background: transparent; border: 2px solid #8B0000; color: #8B0000; font-weight: 700; border-radius: 50px; cursor: pointer; overflow: hidden; transition: color 0.3s; }
.liquid-btn:hover { color: #fff; }
.liquid-content { position: relative; z-index: 1; }
.liquid-blob { position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: #8B0000; border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.4s, height 0.4s; }
.liquid-btn:hover .liquid-blob { width: 300px; height: 300px; }

/* Text Reveal */
.text-reveal { position: relative; display: inline-block; overflow: hidden; }
.text-reveal .reveal-inner { display: inline-block; transform: translateY(100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.text-reveal.visible .reveal-inner { transform: translateY(0); }

/* Image Reveal */
.image-reveal { position: relative; overflow: hidden; }
.image-reveal::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #8B0000; transform: translateX(0); transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.image-reveal.visible::after { transform: translateX(100%); }
.image-reveal img { width: 100%; height: auto; }

/* Card Stack */
.card-stack { position: relative; width: 300px; height: 200px; }
.stack-card { position: absolute; width: 100%; height: 100%; background: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.4s, opacity 0.4s; cursor: pointer; transform: translateY(calc(var(--offset) * 20px)) scale(calc(1 - (var(--offset) * 0.05))); opacity: calc(1 - (var(--offset) * 0.2)); z-index: calc(10 - var(--offset)); }

/* Zoom On Scroll */
.zoom-on-scroll { transition: transform 0.3s ease-out; }

/* Elastic Element */
.elastic-element { transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

/* Shimmer Effect */
.shimmer-effect { background: linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 20%, #f0f0f0 40%, #f0f0f0 100%); background-size: 800% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
@keyframes shimmer { 0% { background-position: -400% 0; } 100% { background-position: 400% 0; } }

/* Gradient Border */
.gradient-border-wrapper { padding: 2px; background: linear-gradient(135deg, #8B0000, #C04040, #FFD700); border-radius: 16px; }
.gradient-border-content { background: #fff; border-radius: 14px; padding: 1.5rem; }

/* Hover Lift */
.hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
.hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }

/* Magnetic Link */
.magnetic-link { display: inline-block; transition: transform 0.3s ease-out; text-decoration: none; }

/* Reveal On Hover */
.reveal-on-hover { position: relative; overflow: hidden; }
.reveal-on-hover .visible-content { transition: transform 0.3s, opacity 0.3s; }
.reveal-on-hover .hidden-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, 10px); opacity: 0; transition: transform 0.3s, opacity 0.3s; }
.reveal-on-hover:hover .visible-content { transform: translateY(-10px); opacity: 0; }
.reveal-on-hover:hover .hidden-content { transform: translate(-50%, -50%); opacity: 1; }

/* Scramble Text */
.scramble-text { font-family: monospace; cursor: pointer; }

/* Rotating Words */
.rotating-words { position: relative; display: inline-block; height: 1.2em; overflow: hidden; }
.rotating-words span { position: absolute; left: 0; opacity: 0; transform: translateY(100%); transition: transform 0.5s, opacity 0.5s; }
.rotating-words span.active { opacity: 1; transform: translateY(0); }

/* Underline Link */
.underline-link { position: relative; text-decoration: none; color: #8B0000; }
.underline-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #8B0000, #C04040); transition: width 0.3s; }
.underline-link:hover::after { width: 100%; }

/* Slide Reveal */
.slide-reveal { opacity: 0; transition: transform 0.8s, opacity 0.8s; }
.slide-reveal.left { transform: translateX(-60px); }
.slide-reveal.right { transform: translateX(60px); }
.slide-reveal.visible { opacity: 1; transform: translateX(0); }

/* Breathing Element */
.breathing-element { animation: breathing 3s ease-in-out infinite; }
@keyframes breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

/* Icon Box */
.icon-box { text-align: center; padding: 2rem; background: #fff; border-radius: 16px; border: 1px solid rgba(139,0,0,0.1); transition: all 0.3s; }
.icon-box:hover { border-color: #8B0000; transform: translateY(-5px); }
.icon-box-icon { width: 60px; height: 60px; margin: 0 auto 1rem; background: rgba(139,0,0,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #8B0000; }
.icon-box h4 { font-size: 1.1rem; margin-bottom: 0.5rem; color: #1a1a1a; }
.icon-box p { color: #666; font-size: 0.9rem; }

/* Feature Card Enhanced */
.feature-card-enhanced { position: relative; padding: 2rem; background: #fff; border-radius: 20px; border: 1px solid rgba(139,0,0,0.1); overflow: hidden; transition: all 0.3s; }
.feature-card-enhanced:hover { border-color: var(--accent-color); }
.feature-card-enhanced:hover .feature-hover-effect { opacity: 1; }
.feature-icon-wrapper { width: 60px; height: 60px; background: rgba(139,0,0,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #8B0000; margin-bottom: 1.5rem; }
.feature-card-enhanced h3 { font-size: 1.2rem; margin-bottom: 0.75rem; color: #1a1a1a; }
.feature-card-enhanced p { color: #666; }
.feature-hover-effect { position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: linear-gradient(135deg, transparent, rgba(139,0,0,0.05)); opacity: 0; transition: opacity 0.3s; }

/* Stat Card */
.stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: #fff; border-radius: 16px; border: 1px solid rgba(139,0,0,0.1); }
.stat-icon { width: 50px; height: 50px; background: rgba(139,0,0,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #8B0000; }
.stat-value { font-size: 1.5rem; font-weight: 900; color: #8B0000; }
.stat-label { color: #666; font-size: 0.9rem; }
.stat-trend { font-size: 0.8rem; color: #00c853; font-weight: 600; }

/* Timeline */
.timeline-item { display: flex; gap: 1.5rem; padding: 1.5rem 0; border-left: 2px solid rgba(139,0,0,0.2); padding-left: 1.5rem; position: relative; }
.timeline-item.active { border-color: #8B0000; }
.timeline-marker { position: absolute; left: -10px; width: 20px; height: 20px; background: #fff; border: 2px solid #8B0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; color: #8B0000; }
.timeline-content h4 { font-size: 1rem; margin-bottom: 0.5rem; color: #1a1a1a; }
.timeline-content p { color: #666; font-size: 0.9rem; }

/* Testimonial Card */
.testimonial-card { padding: 2rem; background: #fff; border-radius: 20px; border: 1px solid rgba(139,0,0,0.1); position: relative; }
.quote-mark { font-size: 4rem; color: rgba(139,0,0,0.1); position: absolute; top: 0.5rem; left: 1rem; line-height: 1; }
.testimonial-quote { font-size: 1.1rem; color: #333; margin-bottom: 1.5rem; font-style: italic; }
.testimonial-author { display: flex; align-items: center; gap: 1rem; }
.author-avatar { width: 50px; height: 50px; background: rgba(139,0,0,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #8B0000; }
.author-info { display: flex; flex-direction: column; }
.author-info strong { color: #1a1a1a; }
.author-info span { color: #666; font-size: 0.85rem; }

/* Pricing Card */
.pricing-card { padding: 2.5rem; background: #fff; border-radius: 24px; border: 1px solid rgba(139,0,0,0.1); text-align: center; position: relative; transition: all 0.3s; }
.pricing-card.popular { border-color: #8B0000; transform: scale(1.05); }
.popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #8B0000; color: #fff; padding: 0.5rem 1.5rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
.pricing-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: #1a1a1a; }
.price { font-size: 3rem; font-weight: 900; color: #8B0000; margin-bottom: 1.5rem; }
.pricing-card ul { list-style: none; margin-bottom: 2rem; }
.pricing-card li { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 0; color: #555; }
.pricing-btn { width: 100%; padding: 1rem; background: #8B0000; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
.pricing-btn:hover { background: #5A0000; }

/* Step Indicator */
.step-indicator { display: flex; justify-content: space-between; align-items: center; }
.step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex: 1; position: relative; }
.step:not(:last-child)::after { content: ''; position: absolute; top: 15px; left: 50%; width: 100%; height: 2px; background: rgba(139,0,0,0.2); }
.step.active::after { background: #8B0000; }
.step-circle { width: 30px; height: 30px; background: rgba(139,0,0,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #8B0000; z-index: 1; transition: all 0.3s; }
.step.active .step-circle { background: #8B0000; color: #fff; }
.step-label { font-size: 0.8rem; color: #666; }

/* Badge */
.badge { display: inline-flex; align-items: center; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 50px; }
.badge-default { background: rgba(139,0,0,0.1); color: #8B0000; }
.badge-success { background: rgba(0,200,83,0.1); color: #00c853; }
.badge-warning { background: rgba(255,193,7,0.1); color: #ff9800; }
.badge-error { background: rgba(255,23,68,0.1); color: #ff1744; }

/* Chip */
.chip { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(139,0,0,0.1); border-radius: 50px; font-size: 0.85rem; }
.chip-avatar { width: 24px; height: 24px; background: #8B0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.7rem; }
.chip button { background: none; border: none; cursor: pointer; color: #8B0000; font-size: 1.2rem; }

/* Tooltip */
.tooltip-wrapper { position: relative; display: inline-block; }
.tooltip-content { position: absolute; background: #1a1a1a; color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s; z-index: 100; }
.tooltip-top .tooltip-content { bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; }
.tooltip-wrapper:hover .tooltip-content { opacity: 1; visibility: visible; }

/* Accordion */
.accordion { display: flex; flex-direction: column; gap: 0.5rem; }
.accordion-item { background: #fff; border: 1px solid rgba(139,0,0,0.1); border-radius: 12px; overflow: hidden; }
.accordion-header { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.accordion-header:hover { background: rgba(139,0,0,0.03); }
.accordion-icon { transition: transform 0.3s; }
.accordion-item.open .accordion-icon { transform: rotate(90deg); }
.accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.3s, padding 0.3s; padding: 0 1.5rem; color: #666; }
.accordion-item.open .accordion-body { max-height: 200px; padding: 0 1.5rem 1rem; }

/* Tabs */
.tabs-container { width: 100%; }
.tabs-header { display: flex; border-bottom: 2px solid rgba(139,0,0,0.1); margin-bottom: 1.5rem; }
.tab-btn { padding: 1rem 2rem; background: none; border: none; cursor: pointer; font-weight: 600; color: #666; position: relative; transition: color 0.3s; }
.tab-btn.active { color: #8B0000; }
.tab-btn.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: #8B0000; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fade-in 0.2s; }
.modal-content { background: #fff; border-radius: 20px; max-width: 500px; width: 90%; max-height: 80vh; overflow: auto; animation: modal-slide 0.3s; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid rgba(139,0,0,0.1); }
.modal-header h3 { font-size: 1.2rem; color: #1a1a1a; }
.modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; }
.modal-body { padding: 1.5rem; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes modal-slide { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

/* Drawer */
.drawer { position: fixed; inset: 0; z-index: 9999; visibility: hidden; }
.drawer.open { visibility: visible; }
.drawer-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s; }
.drawer.open .drawer-overlay { opacity: 1; }
.drawer-content { position: absolute; top: 0; height: 100%; width: 320px; background: #fff; transition: transform 0.3s; }
.drawer-right .drawer-content { right: 0; transform: translateX(100%); }
.drawer-right.open .drawer-content { transform: translateX(0); }
.drawer-left .drawer-content { left: 0; transform: translateX(-100%); }
.drawer-left.open .drawer-content { transform: translateX(0); }
`;

export default Home;