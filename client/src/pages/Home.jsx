import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, Award, Users, ArrowRight, ShieldCheck, GraduationCap, Building2, ChevronRight, Quote, Globe, Heart } from 'lucide-react';

// Custom CountUp Hook
const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return { count, elementRef };
};

// Tilt Component
const TiltCard = ({ children, className }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

    return (
        <div
            className={`perspective-1000 transition-transform duration-200 ease-out ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
            {children}
        </div>
    );
};

// Scroll Reveal Component
const RevealOnScroll = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
            {children}
        </div>
    );
};

const Home = () => {
    const { user, token } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { label: 'Overall Placement', value: 92, suffix: '%', icon: <TrendingUp className="text-amrita-maroon" /> },
        { label: 'Highest Package', value: 56, suffix: ' LPA', icon: <Award className="text-amrita-gold" /> },
        { label: 'B.Tech Success', value: 98, suffix: '%', icon: <GraduationCap className="text-amrita-maroon" /> },
        { label: 'Top Recruiters', value: 200, suffix: '+', icon: <Building2 className="text-amrita-gold" /> },
    ];

    const recruiters = ['Google', 'Microsoft', 'Amazon', 'Cisco', 'McKinsey', 'Bosch', 'Adobe', 'Intel', 'Oracle', 'Samsung'];

    return (
        <div className="min-h-screen bg-white flex flex-col font-bold overflow-hidden selection:bg-amrita-maroon selection:text-white">
            {/* Unified Navigation Header */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'py-8 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-1.5 rounded-lg shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
                            <img src="/amrita-logo.png" alt="Amrita Vishwa Vidyapeetham" className="h-10 w-auto object-contain" />
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                            <span className={`text-xl font-black tracking-tighter transition-colors ${scrolled ? 'text-amrita-maroon' : 'text-white'}`}>AMRITA</span>
                            <span className={`text-[8px] uppercase tracking-[0.3em] font-bold ${scrolled ? 'text-gray-400' : 'text-white/40'}`}>Placement Intelligence</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {token ? (
                            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="btn-premium px-8 py-3 flex items-center gap-2 text-sm shadow-xl">
                                Dashboard <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className={`text-sm font-black transition-colors italic px-4 py-2 ${scrolled ? 'text-gray-600 hover:text-amrita-maroon' : 'text-white/80 hover:text-white'}`}>Sign In</Link>
                                <Link to="/register" className={`px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-xl ${scrolled ? 'bg-amrita-maroon text-white' : 'bg-white text-amrita-maroon'
                                    }`}>Enroll Now</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #fff0f5 0%, #ffc0cb 30%, #b50246 70%, #5b081f 100%)' }}>
                {/* Studio Light Effect */}
                <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-white/40 blur-[100px] rounded-full pointer-events-none mix-blend-overlay" />

                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-10 animate-ken-burns mix-blend-multiply"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10 animate-slide-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
                            <ShieldCheck className="text-amrita-maroon" size={16} />
                            <span className="text-[10px] font-black tracking-widest text-amrita-maroon uppercase italic">Elite Placement Protocol v4.0</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-amrita-maroon leading-[1.1] tracking-tight">
                            Education <br />
                            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amrita-maroon to-amrita-pink drop-shadow-sm italic">Life.</span>
                        </h1>
                        <p className="text-xl text-amrita-maroon/80 max-w-xl font-medium leading-relaxed italic border-l-4 border-amrita-maroon pl-6">
                            Rooted in compassion, driven by intelligence. We don't just place students; we architect careers that change the world.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link to="/register" className="btn-premium px-12 py-6 text-xl flex items-center gap-4 group shadow-xl shadow-amrita-maroon/20 hover:shadow-amrita-maroon/40 border border-white/20">
                                INITIATE SESSION <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </Link>
                            <div className="flex items-center gap-4 text-amrita-maroon/60 font-black tracking-widest text-xs uppercase italic">
                                <span className="w-12 h-[1px] bg-amrita-maroon/30" /> 2,800+ Students Tracked
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block relative perspective-1000">
                        <TiltCard className="glass-card p-4 rotate-3 scale-110 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] border-white/30 backdrop-blur-3xl overflow-hidden group">
                            <div className="rounded-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-amrita-maroon/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
                                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80" alt="Amrita Campus" className="opacity-95 hover:scale-110 transition-transform duration-1000" />
                            </div>
                        </TiltCard>
                        <div className="absolute -bottom-12 -left-12 glass-card p-10 -rotate-6 shadow-2xl border-white/20 animate-float pointer-events-none">
                            <GraduationCap className="text-amrita-gold mb-4" size={40} />
                            <p className="text-5xl font-black text-amrita-maroon tracking-tighter">98%</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black mt-2">B.Tech Placement</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recruiter Marquee */}
            <div className="py-12 bg-gray-50/50 border-y border-gray-100 overflow-hidden relative">
                <div className="flex animate-marquee gap-24 items-center whitespace-nowrap px-12">
                    {[...recruiters, ...recruiters].map((brand, i) => (
                        <div key={i} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 cursor-default group transform hover:scale-110 duration-300">
                            <Building2 className="text-amrita-maroon" size={24} />
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <RevealOnScroll className="delay-0">
                        <ValueCard
                            icon={<Heart className="text-amrita-maroon" />}
                            title="Compassion Driven"
                            desc="Aligned with Amma's mission to alleviate global suffering through technology and human values."
                        />
                    </RevealOnScroll>
                    <RevealOnScroll className="delay-200">
                        <ValueCard
                            icon={<Globe className="text-amrita-maroon" />}
                            title="Global Standards"
                            desc="Bridging Eastern values with Western technology to solve complex societal challenges."
                        />
                    </RevealOnScroll>
                    <RevealOnScroll className="delay-400">
                        <ValueCard
                            icon={<TrendingUp className="text-amrita-maroon" />}
                            title="Measurable Impact"
                            desc="Consistent 90%+ placement rates across all disciplines with industry-leading CTCs."
                        />
                    </RevealOnScroll>
                </div>
            </section>

            {/* Metrics Grid */}
            <section className="py-32 px-6 bg-amrita-maroon/[0.02] relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight italic">By The <span className="text-gradient">Numbers</span></h2>
                        <div className="w-24 h-1 bg-amrita-gold mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((stat, i) => (
                            <TiltCard key={i} className="glass-card p-10 group hover:bg-white cursor-default text-center">
                                <div className="mb-8 p-6 bg-gray-50 rounded-3xl w-fit mx-auto group-hover:bg-amrita-maroon group-hover:text-white transition-all duration-500">
                                    {React.cloneElement(stat.icon, { size: 32, className: 'group-hover:text-white transition-colors' })}
                                </div>
                                <Counter end={stat.value} suffix={stat.suffix} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</p>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Intelligent Feature Showcase */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <TiltCard className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white shadow-[0_30px_100px_-20px_rgba(128,0,0,0.4)] p-12">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-black leading-tight tracking-tight">The Neural Advantage <br />for Modern <span className="text-amrita-gold italic">Engineers.</span></h2>
                                <p className="text-base text-white/70 font-medium leading-relaxed italic">
                                    Our platform isn't just a job board. It's an intelligent core designed to optimize your career path using Amrita's proprietary readiness algorithms.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <FeatureItem label="AI Score Prediction" />
                                    <FeatureItem label="Alumni Memory Vault" />
                                    <FeatureItem label="CIR Unified Dashboard" />
                                    <FeatureItem label="Live Drive Casting" />
                                </div>
                                <Link to="/register" className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-amrita-maroon rounded-xl font-black hover:scale-105 transition-all shadow-xl italic group text-sm">
                                    Gain Access <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </Link>
                            </div>
                            <div className="relative hidden lg:block perspective-1000">
                                <div className="p-6 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl rotate-2 transform hover:rotate-0 transition-transform duration-700">
                                    <div className="space-y-4">
                                        <div className="h-3 w-1/2 bg-white/20 rounded-full" />
                                        <div className="h-10 w-full bg-white/30 rounded-xl" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-24 bg-amrita-gold/40 rounded-2xl animate-pulse" />
                                            <div className="h-24 bg-white/10 rounded-2xl" />
                                        </div>
                                        <div className="h-3 w-3/4 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
                    <RevealOnScroll>
                        <div className="space-y-2">
                            <Quote className="text-amrita-maroon/20 mx-auto" size={48} />
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] italic">Testimonials</h2>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug italic pb-8">
                                "The placement training at Amrita didn't just give me a job at Google—it instilled a sense of purpose that guides how I code every day."
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amrita-maroon to-amrita-burgundy shadow-lg rotate-3 hover:scale-110 transition-transform" />
                                <div className="text-left">
                                    <p className="text-lg font-black text-amrita-maroon leading-none">Aditya K.</p>
                                    <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 mt-1">Software Engineer, Google (Class of '24)</p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-40 text-center relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-amrita-maroon/[0.01] pointer-events-none" />
                <div className="relative z-10 space-y-12">
                    <RevealOnScroll>
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter">Initiate Your <br /><span className="text-gradient">Legacy.</span></h2>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.4em] italic text-sm mt-4">Institutional SSO Credentials Required</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                            <Link to="/register" className="btn-premium px-16 py-7 text-xl shadow-[0_20px_60px_-15px_rgba(128,0,0,0.3)]">Establish Credentials</Link>
                            <Link to="/login" className="px-12 py-7 font-black text-gray-600 hover:text-amrita-maroon transition-colors italic">Existing Access</Link>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="py-16 bg-gray-900 text-white selection:bg-amrita-gold selection:text-amrita-maroon">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amrita-maroon rounded-lg flex items-center justify-center shadow-lg hover:rotate-180 transition-transform duration-700">
                                    <Sparkles className="text-amrita-gold" size={16} />
                                </div>
                                <span className="text-xl font-black tracking-tighter">AMRITA <span className="text-amrita-gold">INTELLIGENCE</span></span>
                            </div>
                            <p className="max-w-md text-white/40 font-medium italic leading-relaxed">
                                Our mission is to provide education for life and emphasis on compassion driven research. The Placement Intelligence Suite is an extension of this vision for the digital age.
                            </p>
                        </div>
                        <div className="space-y-6 text-bold">
                            <h4 className="text-[10px] uppercase tracking-widest text-amrita-gold font-black">Quick Access</h4>
                            <div className="flex flex-col gap-4 text-sm text-white/60">
                                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                                <Link to="/register" className="hover:text-white transition-colors">Establish ID</Link>
                                <a href="#" className="hover:text-white transition-colors">Placement Policy</a>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-widest text-amrita-gold font-black">CIR Support</h4>
                            <div className="flex flex-col gap-4 text-sm text-white/60">
                                <a href="#" className="hover:text-white transition-colors italic font-bold">corporate@amrita.edu</a>
                                <p className="text-[10px] text-white/20 uppercase tracking-widest">Available 9AM - 5PM IST</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <div className="flex items-center gap-3 italic">
                            <ShieldCheck size={16} />
                            Official Amrita Vishwa Vidyapeetham Placement Network
                        </div>
                        <p>© 2026 CIR Digital Labs. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Counter = ({ end, suffix }) => {
    const { count, elementRef } = useCountUp(end);
    return (
        <span ref={elementRef}>
            <p className="text-5xl font-black text-gray-900 mb-2 tracking-tighter tabular-nums">
                {count}{suffix}
            </p>
        </span>
    );
};

const ValueCard = ({ icon, title, desc }) => (
    <div className="space-y-6 group cursor-default">
        <div className="w-16 h-16 bg-amrita-maroon/5 rounded-2xl flex items-center justify-center group-hover:bg-amrita-maroon transition-all duration-500 group-hover:scale-110">
            {React.cloneElement(icon, { size: 32, className: 'group-hover:text-white transition-colors' })}
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="text-gray-500 font-medium italic leading-relaxed">{desc}</p>
    </div>
);

const FeatureItem = ({ label }) => (
    <div className="flex items-center gap-3">
        <div className="p-1.5 bg-amrita-gold rounded-full"><ChevronRight size={14} className="text-amrita-maroon" /></div>
        <span className="font-black text-sm tracking-tight text-white/90">{label}</span>
    </div>
);

export default Home;
