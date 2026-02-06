import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    User, Save, Plus, X, GraduationCap, Award, BookOpen, Sparkles,
    Briefcase, Link2, Github, Linkedin, MapPin, Phone, Mail, FileText,
    Building2, Calendar, Star, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Download
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumeDocument from '../../components/Resume/ResumeDocument';

const StudentProfile = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('personal');
    const [profile, setProfile] = useState({
        // Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        rollNumber: '',
        // Academic
        department: '',
        course: 'B.Tech',
        section: 'A',
        cgpa: '',
        batch: '',
        backlogs: 0,
        tenthPercentage: '',
        twelfthPercentage: '',
        diplomaPercentage: '',
        gap: 0,
        // Professional
        skills: [],
        certifications: [],
        internships: [],
        projects: [],
        achievements: [],
        // Links
        linkedIn: '',
        github: '',
        resumeUrl: '',
        portfolio: '',
        // Preferences
        preferredRoles: [],
        preferredLocations: [],
        expectedCTC: ''
    });

    const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' });
    const [newCert, setNewCert] = useState('');
    const [newAchievement, setNewAchievement] = useState('');
    const [newInternship, setNewInternship] = useState({ company: '', role: '', duration: '', description: '' });
    const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', link: '' });
    const [newRole, setNewRole] = useState('');
    const [newLocation, setNewLocation] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [completionScore, setCompletionScore] = useState(0);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    useEffect(() => {
        calculateCompletion();
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const userId = user?._id || user?.id;
            if (!userId) {
                setLoading(false);
                return;
            }
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/profile/${userId}`);
            if (res.data) {
                setProfile(prev => ({ ...prev, ...res.data }));
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const calculateCompletion = () => {
        let score = 0;
        const checks = [
            profile.firstName && profile.lastName, // 10
            profile.email, // 5
            profile.phone, // 5
            profile.rollNumber, // 5
            profile.department, // 5
            profile.cgpa, // 10
            profile.batch, // 5
            profile.skills?.length > 0, // 15
            profile.skills?.length >= 3, // 5
            profile.certifications?.length > 0, // 5
            profile.internships?.length > 0, // 10
            profile.projects?.length > 0, // 10
            profile.linkedIn, // 5
            profile.github, // 5
            profile.resumeUrl, // 5
        ];
        const weights = [10, 5, 5, 5, 5, 10, 5, 15, 5, 5, 10, 10, 5, 5, 5];
        checks.forEach((check, i) => {
            if (check) score += weights[i];
        });
        setCompletionScore(score);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProfile({
            ...profile,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        });
    };

    const handleAddSkill = () => {
        if (newSkill.name.trim()) {
            setProfile({ ...profile, skills: [...(profile.skills || []), newSkill] });
            setNewSkill({ name: '', level: 'Intermediate' });
        }
    };

    const handleRemoveSkill = (index) => {
        setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) });
    };

    const handleAddCert = () => {
        if (newCert.trim()) {
            setProfile({ ...profile, certifications: [...(profile.certifications || []), newCert] });
            setNewCert('');
        }
    };

    const handleRemoveCert = (index) => {
        setProfile({ ...profile, certifications: profile.certifications.filter((_, i) => i !== index) });
    };

    const handleAddAchievement = () => {
        if (newAchievement.trim()) {
            setProfile({ ...profile, achievements: [...(profile.achievements || []), newAchievement] });
            setNewAchievement('');
        }
    };

    const handleRemoveAchievement = (index) => {
        setProfile({ ...profile, achievements: profile.achievements.filter((_, i) => i !== index) });
    };

    const handleAddInternship = () => {
        if (newInternship.company && newInternship.role) {
            setProfile({ ...profile, internships: [...(profile.internships || []), newInternship] });
            setNewInternship({ company: '', role: '', duration: '', description: '' });
        }
    };

    const handleRemoveInternship = (index) => {
        setProfile({ ...profile, internships: profile.internships.filter((_, i) => i !== index) });
    };

    const handleAddProject = () => {
        if (newProject.title.trim()) {
            const projectToAdd = {
                ...newProject,
                technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t)
            };
            setProfile({ ...profile, projects: [...(profile.projects || []), projectToAdd] });
            setNewProject({ title: '', description: '', technologies: '', link: '' });
        }
    };

    const handleRemoveProject = (index) => {
        setProfile({ ...profile, projects: profile.projects.filter((_, i) => i !== index) });
    };

    const handleAddRole = () => {
        if (newRole.trim()) {
            setProfile({ ...profile, preferredRoles: [...(profile.preferredRoles || []), newRole] });
            setNewRole('');
        }
    };

    const handleRemoveRole = (index) => {
        setProfile({ ...profile, preferredRoles: profile.preferredRoles.filter((_, i) => i !== index) });
    };

    const handleAddLocation = () => {
        if (newLocation.trim()) {
            setProfile({ ...profile, preferredLocations: [...(profile.preferredLocations || []), newLocation] });
            setNewLocation('');
        }
    };

    const handleRemoveLocation = (index) => {
        setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Frontend Validation
        const requiredFields = ['firstName', 'lastName', 'rollNumber', 'department', 'cgpa', 'batch'];
        const missingFields = requiredFields.filter(field => !profile[field]);

        if (missingFields.length > 0) {
            setMessage({
                type: 'error',
                text: `Please fill in all required fields: ${missingFields.join(', ')}`
            });
            window.scrollTo(0, 0);
            return;
        }

        setSaving(true);
        const userId = user?._id || user?.id;
        if (!userId) {
            setMessage({ type: 'error', text: 'User not logged in' });
            setSaving(false);
            return;
        }

        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/profile/${userId}`, profile);
            setMessage({ type: 'success', text: 'Profile saved successfully!' });
            window.scrollTo(0, 0);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save profile' });
            window.scrollTo(0, 0);
        } finally {
            setSaving(false);
        }
    };

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'academic', label: 'Academics', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: BookOpen },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: Star },
        { id: 'links', label: 'Links', icon: Link2 },
        { id: 'preferences', label: 'Preferences', icon: MapPin },
    ];

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A4123F' }}></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 page-enter pb-12">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="animate-pulse" size={20} style={{ color: '#D4AF37' }} />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#A4123F' }}>
                            Placement Profile
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">
                        <span style={{ color: '#1f2937' }}>My</span>{' '}
                        <span style={{ color: '#A4123F' }}>Profile</span>
                    </h1>
                    <p style={{ color: '#6b7280' }} className="font-medium mt-1">
                        Complete your profile to apply for placement drives
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <PDFDownloadLink
                        document={<ResumeDocument profile={profile} />}
                        fileName={`${profile.firstName || 'Student'}_Amrita_Resume.pdf`}
                        className="no-underline"
                    >
                        {({ loading }) => (
                            <button
                                className="flex items-center gap-2 text-white px-5 py-3 rounded-xl transition-all shadow-md font-bold text-sm hover:scale-105 active:scale-95"
                                style={{ backgroundColor: '#1f2937' }}
                            >
                                {loading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                ) : (
                                    <Download size={18} />
                                )}
                                <span>Download PDF Resume</span>
                            </button>
                        )}
                    </PDFDownloadLink>

                    {/* Completion Score */}
                    <div className="glass-card p-4 flex items-center gap-4 border border-white/40 shadow-sm">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                <circle
                                    cx="32" cy="32" r="28"
                                    stroke={completionScore >= 80 ? '#16a34a' : completionScore >= 50 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray={`${completionScore * 1.76} 176`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-black" style={{ color: '#1f2937' }}>
                                {completionScore}%
                            </span>
                        </div>
                        <div>
                            <p className="font-bold text-sm" style={{ color: '#374151' }}>Profile Strength</p>
                            <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: completionScore >= 80 ? '#16a34a' : completionScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                                {completionScore >= 80 ? 'Excellent' : completionScore >= 50 ? 'Good' : 'Improve'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Message */}
            {message.text && (
                <div
                    className="p-4 rounded-xl flex items-center gap-3 font-bold"
                    style={{
                        backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: message.type === 'success' ? '#16a34a' : '#dc2626'
                    }}
                >
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="glass-card p-4 lg:sticky lg:top-24">
                        <nav className="space-y-1">
                            {sections.map(section => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                                        style={{
                                            backgroundColor: activeSection === section.id ? '#A4123F' : 'transparent',
                                            color: activeSection === section.id ? 'white' : '#6b7280'
                                        }}
                                    >
                                        <Icon size={18} />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: '#A4123F' }}
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 space-y-6">
                    {/* Personal Info */}
                    {activeSection === 'personal' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <User size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} required placeholder="John" />
                                <InputField label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} required placeholder="Doe" />
                                <InputField label="Roll Number" name="rollNumber" value={profile.rollNumber} onChange={handleChange} required placeholder="CB.EN.U4CSE21XXX" />
                                <InputField label="Email" name="email" type="email" value={profile.email} onChange={handleChange} placeholder="john@amrita.edu" icon={<Mail size={16} />} />
                                <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} placeholder="+91 9876543210" icon={<Phone size={16} />} />
                            </div>
                        </section>
                    )}

                    {/* Academic Info */}
                    {activeSection === 'academic' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <GraduationCap size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Academic Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <SelectField
                                    label="Department"
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    options={[
                                        { value: '', label: 'Select Department' },
                                        { value: 'CSE', label: 'Computer Science' },
                                        { value: 'ECE', label: 'Electronics & Communication' },
                                        { value: 'EEE', label: 'Electrical & Electronics' },
                                        { value: 'ME', label: 'Mechanical' },
                                        { value: 'CE', label: 'Civil' },
                                        { value: 'AIE', label: 'AI & Data Science' },
                                    ]}
                                    required
                                />
                                <SelectField
                                    label="Course"
                                    name="course"
                                    value={profile.course}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'B.Tech', label: 'B.Tech' },
                                        { value: 'M.Tech', label: 'M.Tech' },
                                        { value: 'MCA', label: 'MCA' },
                                    ]}
                                />
                                <InputField label="Section" name="section" value={profile.section} onChange={handleChange} placeholder="A" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <InputField label="CGPA" name="cgpa" type="number" step="0.01" min="0" max="10" value={profile.cgpa} onChange={handleChange} required placeholder="8.5" />
                                <InputField label="Batch" name="batch" value={profile.batch} onChange={handleChange} required placeholder="2026" />
                                <InputField label="Backlogs" name="backlogs" type="number" min="0" value={profile.backlogs} onChange={handleChange} placeholder="0" />
                                <InputField label="Gap Years" name="gap" type="number" min="0" value={profile.gap} onChange={handleChange} placeholder="0" />
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="font-bold mb-4" style={{ color: '#374151' }}>Previous Education</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputField label="10th Percentage" name="tenthPercentage" type="number" step="0.01" min="0" max="100" value={profile.tenthPercentage} onChange={handleChange} placeholder="92.5" />
                                    <InputField label="12th Percentage" name="twelfthPercentage" type="number" step="0.01" min="0" max="100" value={profile.twelfthPercentage} onChange={handleChange} placeholder="89.0" />
                                    <InputField label="Diploma %" name="diplomaPercentage" type="number" step="0.01" min="0" max="100" value={profile.diplomaPercentage} onChange={handleChange} placeholder="N/A" />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Skills Section */}
                    {activeSection === 'skills' && (
                        <div className="space-y-6">
                            {/* Skills */}
                            <section className="glass-card p-8 space-y-6">
                                <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                        <BookOpen size={20} style={{ color: '#A4123F' }} />
                                    </div>
                                    Technical Skills
                                </h2>

                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        placeholder="Skill name (e.g., Python, React.js)"
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    />
                                    <select
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400"
                                        value={newSkill.level}
                                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="p-3 rounded-xl text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#A4123F' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map((skill, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-white"
                                            style={{ backgroundColor: skill.level === 'Advanced' ? '#16a34a' : skill.level === 'Intermediate' ? '#2563eb' : '#6b7280' }}
                                        >
                                            {skill.name}
                                            <span className="text-xs opacity-75">({skill.level})</span>
                                            <button type="button" onClick={() => handleRemoveSkill(i)} className="ml-1 hover:text-red-200">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Certifications */}
                            <section className="glass-card p-8 space-y-6">
                                <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                        <Award size={20} style={{ color: '#A4123F' }} />
                                    </div>
                                    Certifications
                                </h2>

                                <div className="flex gap-3">
                                    <input
                                        placeholder="E.g., AWS Certified Developer, Google Cloud Associate"
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
                                        value={newCert}
                                        onChange={(e) => setNewCert(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCert}
                                        className="p-3 rounded-xl text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#A4123F' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {profile.certifications?.map((cert, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium" style={{ color: '#374151' }}>{cert}</span>
                                            <button type="button" onClick={() => handleRemoveCert(i)} className="hover:text-red-500 transition-colors" style={{ color: '#9ca3af' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Achievements */}
                            <section className="glass-card p-8 space-y-6">
                                <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                        <Star size={20} style={{ color: '#A4123F' }} />
                                    </div>
                                    Achievements
                                </h2>

                                <div className="flex gap-3">
                                    <input
                                        placeholder="E.g., Won inter-college hackathon 2024"
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
                                        value={newAchievement}
                                        onChange={(e) => setNewAchievement(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAchievement}
                                        className="p-3 rounded-xl text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#A4123F' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {profile.achievements?.map((achievement, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium" style={{ color: '#374151' }}>{achievement}</span>
                                            <button type="button" onClick={() => handleRemoveAchievement(i)} className="hover:text-red-500 transition-colors" style={{ color: '#9ca3af' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Experience Section */}
                    {activeSection === 'experience' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <Briefcase size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Internship Experience
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <InputField label="Company" value={newInternship.company} onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })} placeholder="Google" />
                                <InputField label="Role" value={newInternship.role} onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })} placeholder="Software Engineer Intern" />
                                <InputField label="Duration" value={newInternship.duration} onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })} placeholder="May - July 2024" />
                                <InputField label="Description" value={newInternship.description} onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })} placeholder="Brief description" />
                                <div className="md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={handleAddInternship}
                                        className="w-full py-3 border-2 border-dashed rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white"
                                        style={{ borderColor: '#A4123F', color: '#A4123F' }}
                                    >
                                        <Plus size={18} /> Add Internship
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {profile.internships?.map((intern, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-white">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold" style={{ color: '#1f2937' }}>{intern.role}</h4>
                                                <p className="text-sm" style={{ color: '#A4123F' }}>{intern.company}</p>
                                                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{intern.duration}</p>
                                                {intern.description && <p className="text-sm mt-2" style={{ color: '#4b5563' }}>{intern.description}</p>}
                                            </div>
                                            <button type="button" onClick={() => handleRemoveInternship(i)} className="hover:text-red-500 transition-colors" style={{ color: '#9ca3af' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects Section */}
                    {activeSection === 'projects' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <Star size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Projects
                            </h2>

                            <div className="grid grid-cols-1 gap-4 p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                <InputField label="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="E-commerce Platform" />
                                <InputField label="Technologies (comma-separated)" value={newProject.technologies} onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
                                <InputField label="Project Link" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://github.com/..." />
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: '#6b7280' }}>Description</label>
                                    <textarea
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all resize-none"
                                        rows={3}
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Brief project description..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddProject}
                                    className="w-full py-3 border-2 border-dashed rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white"
                                    style={{ borderColor: '#A4123F', color: '#A4123F' }}
                                >
                                    <Plus size={18} /> Add Project
                                </button>
                            </div>

                            <div className="space-y-4">
                                {profile.projects?.map((project, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold" style={{ color: '#1f2937' }}>{project.title}</h4>
                                                    {project.link && (
                                                        <a href={project.link} target="_blank" rel="noreferrer" className="hover:opacity-70" style={{ color: '#A4123F' }}>
                                                            <Link2 size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.technologies?.map((tech, j) => (
                                                        <span key={j} className="px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                {project.description && <p className="text-sm mt-2" style={{ color: '#4b5563' }}>{project.description}</p>}
                                            </div>
                                            <button type="button" onClick={() => handleRemoveProject(i)} className="hover:text-red-500 transition-colors" style={{ color: '#9ca3af' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Links Section */}
                    {activeSection === 'links' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <Link2 size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Professional Links
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="LinkedIn Profile"
                                    name="linkedIn"
                                    value={profile.linkedIn}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                    icon={<Linkedin size={16} />}
                                />
                                <InputField
                                    label="GitHub Profile"
                                    name="github"
                                    value={profile.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                    icon={<Github size={16} />}
                                />
                                <InputField
                                    label="Resume URL"
                                    name="resumeUrl"
                                    value={profile.resumeUrl}
                                    onChange={handleChange}
                                    placeholder="https://drive.google.com/..."
                                    icon={<FileText size={16} />}
                                />
                                <InputField
                                    label="Portfolio Website"
                                    name="portfolio"
                                    value={profile.portfolio}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                    icon={<Link2 size={16} />}
                                />
                            </div>
                        </section>
                    )}

                    {/* Preferences Section */}
                    {activeSection === 'preferences' && (
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xl font-black flex items-center gap-3" style={{ color: '#1f2937' }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(164, 18, 63, 0.1)' }}>
                                    <MapPin size={20} style={{ color: '#A4123F' }} />
                                </div>
                                Job Preferences
                            </h2>

                            {/* Expected CTC */}
                            <InputField
                                label="Expected CTC (LPA)"
                                name="expectedCTC"
                                type="number"
                                step="0.5"
                                min="0"
                                value={profile.expectedCTC}
                                onChange={handleChange}
                                placeholder="6.5"
                            />

                            {/* Preferred Roles */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Preferred Roles</label>
                                <div className="flex gap-3">
                                    <input
                                        placeholder="E.g., Software Developer, Data Analyst"
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddRole}
                                        className="p-3 rounded-xl text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#A4123F' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.preferredRoles?.map((role, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                                            {role}
                                            <button type="button" onClick={() => handleRemoveRole(i)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preferred Locations */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Preferred Locations</label>
                                <div className="flex gap-3">
                                    <input
                                        placeholder="E.g., Bangalore, Chennai, Remote"
                                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddLocation}
                                        className="p-3 rounded-xl text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: '#A4123F' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.preferredLocations?.map((location, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                                            <MapPin size={14} />
                                            {location}
                                            <button type="button" onClick={() => handleRemoveLocation(i)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </form>
        </div>
    );
};

// Input Component
const InputField = ({ label, icon, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#6b7280' }}>{label}</label>
        <div className="relative">
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                    {icon}
                </span>
            )}
            <input
                {...props}
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all placeholder:text-gray-300 ${icon ? 'pl-10' : ''}`}
                style={{ color: '#1f2937' }}
            />
        </div>
    </div>
);

// Select Component
const SelectField = ({ label, options, ...props }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#6b7280' }}>{label}</label>
        <select
            {...props}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium focus:border-gray-400 transition-all"
            style={{ color: '#1f2937' }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export default StudentProfile;
