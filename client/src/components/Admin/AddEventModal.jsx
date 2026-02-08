import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Type, FileText, XCircle } from 'lucide-react';

const AddEventModal = ({ isOpen, onClose, onSuccess, initialDate }) => {
    const [formData, setFormData] = useState({
        title: '', date: initialDate || '', time: '', type: 'other', description: ''
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen && initialDate) {
            setFormData(prev => ({ ...prev, date: initialDate }));
        }
    }, [isOpen, initialDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/schedule`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onSuccess();
            onClose();
            setFormData({ title: '', date: '', time: '', type: 'other', description: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add event');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        <Calendar className="text-amrita-maroon" /> Add Schedule Event
                    </h2>
                    <button onClick={onClose}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Title</label>
                        <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg"
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                            <input required type="date" className="w-full p-2 border border-gray-200 rounded-lg"
                                value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                            <input type="time" className="w-full p-2 border border-gray-200 rounded-lg"
                                value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select className="w-full p-2 border border-gray-200 rounded-lg"
                            value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                            <option value="other">General</option>
                            <option value="drive">Placement Drive</option>
                            <option value="prep">Prep Workshop</option>
                            <option value="alumni">Alumni Meet</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-amrita-maroon text-white font-bold py-3 rounded-xl hover:bg-amrita-maroon/90 shadow-lg mt-2">
                        {loading ? 'Saving...' : 'Add to Schedule'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
