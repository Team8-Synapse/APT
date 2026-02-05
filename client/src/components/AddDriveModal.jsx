import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CheckCircle, AlertCircle, Save, Plus } from 'lucide-react';

const AddDriveModal = ({ isOpen, onClose, onSuccess, editDrive = null }) => {
    const isEditMode = !!editDrive;

    const defaultFormData = {
        companyName: '',
        jobProfile: '',
        jobType: 'Full Time',
        date: '',
        registrationDeadline: '',
        ctc: '',
        baseSalary: '',
        workLocation: '',
        description: '',
        minCgpa: 0,
        maxBacklogs: 0,
        allowedDepartments: [],
        totalPositions: '',
        mode: 'Offline',
        venue: 'Campus',
        status: 'upcoming',
        contactEmail: '',
        coordinator: ''
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (editDrive) {
            setFormData({
                _id: editDrive._id,
                companyName: editDrive.companyName || '',
                jobProfile: editDrive.jobProfile || '',
                jobType: editDrive.jobType || 'Full Time',
                date: editDrive.date ? new Date(editDrive.date).toISOString().split('T')[0] : '',
                registrationDeadline: editDrive.registrationDeadline ? new Date(editDrive.registrationDeadline).toISOString().split('T')[0] : '',
                ctc: editDrive.ctcDetails?.ctc ? (editDrive.ctcDetails.ctc / 100000).toString() : '',
                baseSalary: editDrive.ctcDetails?.baseSalary ? (editDrive.ctcDetails.baseSalary / 100000).toString() : '',
                workLocation: editDrive.workLocation || '',
                description: editDrive.description || '',
                minCgpa: editDrive.eligibility?.minCgpa || 0,
                maxBacklogs: editDrive.eligibility?.maxBacklogs || 0,
                allowedDepartments: editDrive.eligibility?.allowedDepartments || [],
                totalPositions: editDrive.totalPositions || '',
                mode: editDrive.mode || 'Offline',
                venue: editDrive.venue || 'Campus',
                status: editDrive.status || 'upcoming',
                contactEmail: editDrive.contactEmail || '',
                coordinator: editDrive.coordinator || ''
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [editDrive, isOpen]);

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
        setSuccess(false);

        try {
            const payload = {
                ...formData,
                ctcDetails: {
                    ctc: parseFloat(formData.ctc) * 100000,
                    baseSalary: parseFloat(formData.baseSalary || 0) * 100000
                },
                eligibility: {
                    minCgpa: parseFloat(formData.minCgpa),
                    maxBacklogs: parseInt(formData.maxBacklogs || 0),
                    allowedDepartments: formData.allowedDepartments
                },
                totalPositions: parseInt(formData.totalPositions) || undefined
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/drive`, payload);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} drive`);
        } finally {
            setLoading(false);
        }
    };

    const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'AI', 'CB', 'IT', 'CSBS'];
    const jobTypes = ['Full Time', 'Internship', 'Internship + FTE'];
    const modes = ['Online', 'Offline', 'Hybrid'];
    const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="flex min-h-full items-start justify-center p-4 py-8">
                <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white z-10" style={{ backgroundColor: '#ffffff' }}>
                        <div>
                            <h2 className="text-xl font-black" style={{ color: '#1f2937' }}>
                                {isEditMode ? 'Edit Placement Drive' : 'Add New Placement Drive'}
                            </h2>
                            <p className="text-sm" style={{ color: '#6b7280' }}>
                                {isEditMode ? 'Update drive details' : 'Fill in the details to create a new drive'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <X size={20} style={{ color: '#6b7280' }} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-2 text-sm font-bold" style={{ color: '#dc2626' }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-2 text-sm font-bold" style={{ color: '#16a34a' }}>
                                <CheckCircle size={18} /> Drive {isEditMode ? 'updated' : 'created'} successfully!
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#374151' }}>Company Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Company Name *</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="e.g. Google, Microsoft"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Job Profile *</label>
                                    <input
                                        type="text"
                                        name="jobProfile"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.jobProfile}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Job Type</label>
                                    <select
                                        name="jobType"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.jobType}
                                        onChange={handleChange}
                                    >
                                        {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Status</label>
                                    <select
                                        name="status"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Date & Location */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#374151' }}>Schedule & Location</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Drive Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Registration Deadline</label>
                                    <input
                                        type="date"
                                        name="registrationDeadline"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.registrationDeadline}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Mode</label>
                                    <select
                                        name="mode"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.mode}
                                        onChange={handleChange}
                                    >
                                        {modes.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Work Location</label>
                                    <input
                                        type="text"
                                        name="workLocation"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.workLocation}
                                        onChange={handleChange}
                                        placeholder="e.g. Bangalore, Hyderabad"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Venue</label>
                                    <input
                                        type="text"
                                        name="venue"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.venue}
                                        onChange={handleChange}
                                        placeholder="e.g. Main Auditorium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Total Positions</label>
                                    <input
                                        type="number"
                                        name="totalPositions"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.totalPositions}
                                        onChange={handleChange}
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Compensation */}
                        <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#16a34a' }}>💰 Compensation</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>CTC (in Lakhs) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="ctc"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        placeholder="e.g. 12.5"
                                        value={formData.ctc}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Base Salary (in Lakhs)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="baseSalary"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors bg-white"
                                        style={{ color: '#1f2937' }}
                                        placeholder="e.g. 10.0"
                                        value={formData.baseSalary}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Eligibility */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#374151' }}>Eligibility Criteria</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Minimum CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="minCgpa"
                                        min="0"
                                        max="10"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.minCgpa}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Max Backlogs Allowed</label>
                                    <input
                                        type="number"
                                        name="maxBacklogs"
                                        min="0"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.maxBacklogs}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Allowed Departments</label>
                                <div className="flex flex-wrap gap-2">
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => handleDeptChange(dept)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.allowedDepartments.includes(dept)
                                                ? 'bg-amrita-maroon text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                                                }`}
                                            style={{ color: formData.allowedDepartments.includes(dept) ? 'white' : '#6b7280' }}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs" style={{ color: '#9ca3af' }}>Leave empty to allow all departments</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#374151' }}>Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Coordinator Name</label>
                                    <input
                                        type="text"
                                        name="coordinator"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.coordinator}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors"
                                        style={{ color: '#1f2937' }}
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        placeholder="e.g. placement@college.edu"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase" style={{ color: '#6b7280' }}>Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amrita-maroon focus:outline-none transition-colors min-h-[100px]"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add any additional details about the drive..."
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                style={{ color: '#6b7280' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: '#A4123F' }}
                            >
                                {loading ? (
                                    'Saving...'
                                ) : isEditMode ? (
                                    <><Save size={18} /> Update Drive</>
                                ) : (
                                    <><Plus size={18} /> Create Drive</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDriveModal;
