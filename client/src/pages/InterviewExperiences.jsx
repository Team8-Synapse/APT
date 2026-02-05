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
    const [formData, setFormData] = useState({
        companyName: '', role: '', verdict: 'Selected', difficulty: 3, tips: '',
        questions: '' // Simplified for MVP: just a text block or multiline
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
                rounds: [{ roundName: 'General', questions: formData.questions.split('\n'), description: 'User Submitted' }]
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
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageCircle className="text-amrita-maroon" /> Interview Experiences
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
                                <button className="text-sm font-bold text-amrita-maroon hover:underline">
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
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interview Questions</label>
                                <textarea required rows="4" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none"
                                    value={formData.questions} onChange={e => setFormData({ ...formData, questions: e.target.value })} placeholder="Describe the rounds and questions asked..." />
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
        </div>
    );
};

export default InterviewExperiences;
