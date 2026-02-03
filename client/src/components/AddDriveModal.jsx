import React, { useState } from 'react';
import axios from 'axios';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const AddDriveModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        jobProfile: '',
        date: '',
        ctc: '',
        baseSalary: '',
        workLocation: '',
        description: '',
        minCgpa: 0,
        allowedDepartments: [],
        status: 'upcoming'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeptChange = (dept) => {
        setFormData(prev => {
            const depts = prev.allowedDepartments.includes(dept)
                ? prev.allowedDepartments.filter(d => d !== dept)
                : [...prev.allowedDepartments, dept];
            return { ...prev, allowedDepartments: depts };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                ctcDetails: {
                    ctc: parseFloat(formData.ctc) * 100000, // Convert Lakhs to absolute
                    baseSalary: parseFloat(formData.baseSalary) * 100000
                },
                eligibility: {
                    minCgpa: parseFloat(formData.minCgpa),
                    allowedDepartments: formData.allowedDepartments
                }
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive`, payload);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create drive');
        } finally {
            setLoading(false);
        }
    };

    const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'AI', 'CB'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Add New Placement Drive</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                required
                                className="input-field"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">Job Profile</label>
                            <input
                                type="text"
                                name="jobProfile"
                                required
                                className="input-field"
                                value={formData.jobProfile}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="input-field"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">Work Location</label>
                            <input
                                type="text"
                                name="workLocation"
                                className="input-field"
                                value={formData.workLocation}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">CTC (in Lakhs)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="ctc"
                                required
                                className="input-field"
                                placeholder="e.g. 12.5"
                                value={formData.ctc}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-500">Base Salary (in Lakhs)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="baseSalary"
                                className="input-field"
                                placeholder="e.g. 10.0"
                                value={formData.baseSalary}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Eligibility Criteria</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-500">Min CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="minCgpa"
                                    className="input-field"
                                    value={formData.minCgpa}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-500">Allowed Departments</label>
                                <div className="flex flex-wrap gap-2">
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => handleDeptChange(dept)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.allowedDepartments.includes(dept)
                                                    ? 'bg-amrita-maroon text-white shadow-md'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-500">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            className="input-field min-h-[100px]"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 font-bold text-gray-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium px-8 py-3 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Create Drive'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriveModal;
