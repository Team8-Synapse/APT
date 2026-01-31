import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Save, Plus, X, GraduationCap, Award, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const StudentProfile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        department: '',
        cgpa: '',
        batch: '',
        backlogs: 0,
        skills: [],
        certifications: []
    });
    const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
    const [newCert, setNewCert] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/profile`);
                if (res.data) setProfile(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAddSkill = () => {
        if (newSkill.name) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill] });
            setNewSkill({ name: '', level: 'Beginner' });
        }
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = profile.skills.filter((_, i) => i !== index);
        setProfile({ ...profile, skills: updatedSkills });
    };

    const handleAddCert = () => {
        if (newCert) {
            setProfile({ ...profile, certifications: [...profile.certifications, newCert] });
            setNewCert('');
        }
    };

    const handleRemoveCert = (index) => {
        const updatedCerts = profile.certifications.filter((_, i) => i !== index);
        setProfile({ ...profile, certifications: updatedCerts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/profile`, profile);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 page-enter pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-amrita-gold animate-pulse" size={20} />
                        <span className="text-[10px] font-black tracking-[0.2em] text-amrita-maroon uppercase">Academic Excellence</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Student <span className="text-gradient">Profile</span></h1>
                    <p className="text-gray-500 font-medium mt-2">Manage your academic credentials and professional skills</p>
                </div>
                {message && (
                    <div className="glass-card !bg-green-50/80 !rounded-xl px-4 py-2 text-green-700 text-sm font-bold border-green-200 animate-fade-in flex items-center gap-2">
                        <Save size={16} /> {message}
                    </div>
                )}
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Academic Foundation */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8 space-y-6">
                        <h2 className="text-xl font-black flex items-center gap-3 text-gray-900">
                            <div className="p-2 bg-amrita-maroon/10 rounded-lg"><GraduationCap className="text-amrita-maroon" /></div>
                            Academic Foundation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} required />
                            <InputGroup label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} required />
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">Department</label>
                                <select name="department" value={profile.department} onChange={handleChange} required className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-amrita-maroon outline-none font-bold transition-all hover:bg-white">
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="ME">ME</option>
                                    <option value="EEE">EEE</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <InputGroup label="CGPA" name="cgpa" type="number" step="0.01" value={profile.cgpa} onChange={handleChange} required placeholder="9.5" />
                                <InputGroup label="Batch" name="batch" value={profile.batch} onChange={handleChange} required placeholder="2026" />
                                <InputGroup label="Backlogs" name="backlogs" type="number" value={profile.backlogs} onChange={handleChange} required />
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-8 space-y-6">
                        <h2 className="text-xl font-black flex items-center gap-3 text-gray-900">
                            <div className="p-2 bg-amrita-maroon/10 rounded-lg"><Award className="text-amrita-maroon" /></div>
                            Professional Certifications
                        </h2>
                        <div className="flex gap-3">
                            <input
                                placeholder="E.g. AWS Certified Developer"
                                className="flex-1 p-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-bold focus:bg-white transition-all"
                                value={newCert}
                                onChange={(e) => setNewCert(e.target.value)}
                            />
                            <button type="button" onClick={handleAddCert} className="p-3 bg-amrita-maroon text-white rounded-xl hover:bg-amrita-burgundy transition-all shadow-md">
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {profile.certifications.map((cert, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white/50 border border-white rounded-xl group hover:shadow-sm transition-all">
                                    <span className="font-bold text-gray-700">{cert}</span>
                                    <button type="button" onClick={() => handleRemoveCert(i)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Skill Matrix */}
                <div className="space-y-8">
                    <section className="glass-card p-8 space-y-6 sticky top-28">
                        <h2 className="text-xl font-black flex items-center gap-3 text-gray-900">
                            <div className="p-2 bg-amrita-maroon/10 rounded-lg"><BookOpen className="text-amrita-maroon" /></div>
                            Skill Matrix
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <input
                                    placeholder="Skill Name"
                                    className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-bold focus:bg-white transition-all"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                />
                                <select
                                    className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-bold focus:bg-white transition-all"
                                    value={newSkill.level}
                                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                                <button type="button" onClick={handleAddSkill} className="w-full p-3 border-2 border-dashed border-amrita-maroon text-amrita-maroon font-black rounded-xl hover:bg-amrita-maroon hover:text-white transition-all">
                                    Add to Matrix
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4">
                                {profile.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-amrita-maroon text-white text-[11px] font-black rounded-lg shadow-sm">
                                        {skill.name.toUpperCase()}
                                        <button type="button" onClick={() => handleRemoveSkill(i)}><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/40">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full btn-premium flex items-center justify-center gap-3 py-4"
                            >
                                <Save size={20} />
                                {saving ? 'SYNCING...' : 'SYNC CHANGES'}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 font-bold mt-4 uppercase tracking-tighter italic">Last synced: Just now</p>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
};

const InputGroup = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 ml-1">{label}</label>
        <input
            {...props}
            className="w-full p-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-amrita-maroon outline-none font-bold transition-all hover:bg-white placeholder:text-gray-300"
        />
    </div>
);

export default StudentProfile;
