import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Mail, Briefcase, Calendar, Save } from 'lucide-react';

const EditStudentModal = ({ student, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (student) {
            setFormData({
                rollNumber: student.rollNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                department: student.department || 'CSE',
                section: student.section || 'A',
                batch: student.batch || '2026',
                cgpa: student.cgpa || 0,
                backlogs: student.backlogs || 0,
                placementStatus: student.placementStatus || 'not_placed',
                originalData: student.originalData
            });
        }
    }, [student]);

    if (!isOpen || !student) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <User className="text-amrita-maroon" />
                        Edit Student Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Roll Number</label>
                            <input
                                type="text"
                                value={formData.rollNumber}
                                disabled
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 focus:border-amrita-maroon transition-all"
                            />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <GraduationCap size={18} className="text-amrita-maroon" />
                            Academic Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20"
                                >
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ME">ME</option>
                                    <option value="AI">AI</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Batch</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    name="cgpa"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Backlogs</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="backlogs"
                                    value={formData.backlogs}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Placement Status */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase size={18} className="text-amrita-maroon" />
                            Placement Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Current Status</label>
                                <select
                                    name="placementStatus"
                                    value={formData.placementStatus}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 font-medium"
                                >
                                    <option value="not_placed">Not Placed</option>
                                    <option value="in_process">In Process</option>
                                    <option value="placed">Placed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl font-bold text-white bg-amrita-maroon hover:bg-amrita-maroon/90 transition-colors flex items-center gap-2 shadow-lg shadow-amrita-maroon/30"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
