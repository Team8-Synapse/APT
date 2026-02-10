import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Plus, ThumbsUp, MessageCircle, Briefcase, Calendar,
    CheckCircle, XCircle, User, Award, BookOpen, Filter
} from 'lucide-react';

const InterviewExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '', role: '', verdict: 'Selected', difficulty: 3, tips: '',
        questions: '', description: ''
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/experiences`);
            setExperiences(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/experiences/${id}/like`, {}, { withCredentials: true });
            fetchExperiences(); // Refresh to show new like count
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                rounds: [{
                    roundName: 'Interview Rounds',
                    questions: formData.questions.split('\n').filter(q => q.trim()),
                    description: formData.description || 'User Submitted Experience'
                }]
            };
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/experiences`, payload, { withCredentials: true });
            setIsModalOpen(false);
            fetchExperiences();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit');
        }
    };

    const filtered = experiences.filter(exp =>
        exp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <MessageCircle className="text-amrita-maroon" size={28} />
                        <span style={{ color: '#1A1A1A' }}>Interview</span> <span style={{ color: '#A4123F' }}>Experiences</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Learn from the seniors who cracked it!</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-amrita-maroon text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus size={20} /> Share Experience
                </button>
            </div>

            {/* Search */}
            <div className="glass-card p-4 flex items-center gap-4 sticky top-4 z-10 backdrop-blur-md">
                <Search className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by company (e.g., Google, Amazon)..."
                    className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 font-medium placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Smart Company Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Google', 'Amazon', 'Microsoft', 'Cisco', 'Oracle', 'Zoho', 'TCS', 'Infosys', 'Wipro', 'Accenture'].map(company => (
                    <button
                        key={company}
                        onClick={() => setSearchTerm(company === 'All' ? '' : company)}
                        className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${(company === 'All' && searchTerm === '') || searchTerm.toLowerCase() === company.toLowerCase()
                            ? 'bg-amrita-maroon text-white shadow-amrita-maroon/20'
                            : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        {company}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amrita-maroon"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(exp => (
                        <div key={exp._id} className="glass-card p-6 hover:translate-y-[-4px] transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                        {exp.companyName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white">{exp.companyName}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{exp.role}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${exp.verdict === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {exp.verdict === 'Selected' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {exp.verdict}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <User size={14} />
                                    <span>{exp.studentId?.firstName || 'Anonymous'} {exp.studentId?.lastName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar size={14} />
                                    <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`h-2 w-2 rounded-full ${i < exp.difficulty ? 'bg-orange-400' : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tips Snippet */}
                            {exp.tips && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4 text-xs text-yellow-800 dark:text-yellow-200 italic border border-yellow-100 dark:border-yellow-900/50">
                                    " {exp.tips.substring(0, 80)}{exp.tips.length > 80 ? '...' : ''} "
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => handleLike(exp._id)}
                                    className="flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-amrita-maroon transition-colors"
                                >
                                    <ThumbsUp size={16} /> {exp.likes?.length || 0}
                                </button>
                                <button
                                    onClick={() => setSelectedExperience(exp)}
                                    className="text-sm font-bold text-amrita-maroon hover:underline"
                                >
                                    Read Full Story →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-800">Share Experience</h2>
                            <button onClick={() => setIsModalOpen(false)}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company</label>
                                    <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                        value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} placeholder="e.g. Amazon" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                                    <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. SDE-1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Verdict</label>
                                    <select className="w-full p-2 border border-gray-200 rounded-lg" value={formData.verdict} onChange={e => setFormData({ ...formData, verdict: e.target.value })}>
                                        <option value="Selected">Selected 🟢</option>
                                        <option value="Rejected">Rejected 🔴</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Difficulty (1-5)</label>
                                    <input type="number" min="1" max="5" className="w-full p-2 border border-gray-200 rounded-lg"
                                        value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interview Questions & Rounds</label>
                                <textarea required rows="6" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                    value={formData.questions} onChange={e => setFormData({ ...formData, questions: e.target.value })} placeholder="Describe the rounds and questions asked (one per line)..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Overall Experience</label>
                                <textarea rows="3" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="How was the overall process? (Virtual/Offline, difficulty, etc.)" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tips for Juniors</label>
                                <textarea rows="2" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                    value={formData.tips} onChange={e => setFormData({ ...formData, tips: e.target.value })} placeholder="Any advice?" />
                            </div>

                            <button type="submit" className="w-full bg-amrita-maroon text-white font-bold py-3 rounded-xl hover:bg-amrita-maroon/90 shadow-lg mt-2">
                                Submit Experience
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            {selectedExperience && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                    {selectedExperience.companyName} <span className="text-gray-400 font-medium">| {selectedExperience.role}</span>
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <User size={14} /> Shared by {selectedExperience.studentId?.firstName} • {new Date(selectedExperience.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedExperience(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <XCircle className="text-gray-400 hover:text-gray-600" size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Verdict Banner */}
                            <div className={`p-4 rounded-xl flex items-center gap-4 ${selectedExperience.verdict === 'Selected' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
                                <div className={`p-3 rounded-full ${selectedExperience.verdict === 'Selected' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {selectedExperience.verdict === 'Selected' ? <Award size={24} /> : <XCircle size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Verdict: {selectedExperience.verdict}</h3>
                                    <p className="text-sm opacity-80">Difficulty Rating: {selectedExperience.difficulty}/5</p>
                                </div>
                            </div>

                            {/* Rounds & Questions */}
                            <div>
                                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="text-amrita-maroon" size={20} /> Interview Rounds
                                </h3>
                                <div className="space-y-6">
                                    {selectedExperience.rounds?.map((round, i) => (
                                        <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                            <h4 className="font-bold text-gray-800 mb-2">{round.roundName || `Round ${i + 1}`}</h4>
                                            {round.description && <p className="text-sm text-gray-600 mb-4 italic">{round.description}</p>}

                                            <div className="space-y-3">
                                                {round.questions?.map((q, j) => (
                                                    <div key={j} className="flex gap-3 items-start">
                                                        <span className="min-w-[24px] h-6 rounded-full bg-amrita-maroon/10 text-amrita-maroon text-xs font-bold flex items-center justify-center mt-0.5">
                                                            Q{j + 1}
                                                        </span>
                                                        <p className="text-gray-700 font-medium leading-relaxed">{q}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            {selectedExperience.tips && (
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                        <BookOpen className="text-yellow-600" size={20} /> Tips for Juniors
                                    </h3>
                                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-yellow-900 italic leading-relaxed">
                                        "{selectedExperience.tips}"
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedExperience(null)}
                                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewExperiences;
