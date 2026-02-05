import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XCircle, User, Building2, Briefcase, Mail, Linkedin, School, Calendar } from 'lucide-react';

const AddAlumniModal = ({ isOpen, onClose, onRefresh, editAlumni }) => {
    const [formData, setFormData] = useState({
        name: '', company: '', role: '', batch: new Date().getFullYear(),
        department: 'CSE', email: '', linkedin: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && editAlumni) {
            setFormData({
                name: editAlumni.name || '',
                company: editAlumni.company || '',
                role: editAlumni.role || '',
                batch: editAlumni.batch || new Date().getFullYear(),
                department: editAlumni.department || 'CSE',
                email: editAlumni.email || '',
                linkedin: editAlumni.linkedin || ''
            });
        } else if (isOpen && !editAlumni) {
            setFormData({
                name: '', company: '', role: '', batch: new Date().getFullYear(),
                department: 'CSE', email: '', linkedin: ''
            });
        }
    }, [isOpen, editAlumni]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editAlumni) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/member/${editAlumni._id}`, formData, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/alumni/member`, formData, {
                    withCredentials: true // For admin auth check
                });
            }
            onRefresh && onRefresh();
            onClose();
            // Reset form
            setFormData({ name: '', company: '', role: '', batch: new Date().getFullYear(), department: 'CSE', email: '', linkedin: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to add alumni");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        <User className="text-amrita-maroon" /> {editAlumni ? 'Edit Alumni Member' : 'Add Alumni Member'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input required name="name" type="text" placeholder="e.g. Rahul Sharma"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-bold text-gray-800"
                                value={formData.name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input required name="company" type="text" placeholder="e.g. Google"
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-bold"
                                    value={formData.company} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input required name="role" type="text" placeholder="e.g. SDE-1"
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-bold"
                                    value={formData.role} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch (Year)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input required name="batch" type="number" placeholder="2024"
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-bold"
                                    value={formData.batch} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                            <div className="relative">
                                <School className="absolute left-3 top-3 text-gray-400" size={16} />
                                <select name="department" className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-bold"
                                    value={formData.department} onChange={handleChange}>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ME">ME</option>
                                    <option value="AI">AI</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">LinkedIn URL</label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..."
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-medium"
                                value={formData.linkedin} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Optional)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input name="email" type="email" placeholder="contact@example.com"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon outline-none font-medium"
                                value={formData.email} onChange={handleChange} />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-amrita-maroon text-white font-bold py-4 rounded-xl hover:bg-amrita-maroon/90 shadow-lg mt-2 transition-transform active:scale-95 disabled:opacity-50">
                        {loading ? 'Saving...' : (editAlumni ? 'Update Alumni Member' : 'Add Alumni to Directory')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAlumniModal;
