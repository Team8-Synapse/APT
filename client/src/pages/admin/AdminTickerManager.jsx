import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Save, Trash2, AlertCircle, CheckCircle, Smartphone, Plus } from 'lucide-react';

const AdminTickerManager = () => {
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('normal');
    const [tickers, setTickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickers();
    }, []);

    const fetchTickers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ticker`);
            setTickers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ticker`, {
                message,
                priority
            });
            setTickers([res.data, ...tickers]);
            setMessage('');
            setSuccess('Ticker message added successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add ticker.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this ticker message?')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ticker/${id}`);
            setTickers(tickers.filter(t => t._id !== id));
            setSuccess('Ticker message removed.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to remove ticker.');
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex items-center gap-2 mb-8">
                <Megaphone className="text-amrita-maroon" size={28} />
                <div>
                    <h1 className="text-3xl font-black">
                        <span style={{ color: '#1A1A1A' }}>Ticker</span> <span style={{ color: '#A4123F' }}>Manager</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Manage scrolling messages on the student dashboard.</p>
                </div>
            </div>

            {/* Preview Section */}
            <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Smartphone size={20} /> Live Preview
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 opacity-50 z-0"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Student Dashboard Footer</p>
                        <div className="bg-[#6E0B30] text-white p-4 rounded-xl shadow-lg flex items-center gap-4 overflow-hidden">
                            <Megaphone size={20} className="shrink-0 animate-pulse" />
                            <div className="whitespace-nowrap overflow-hidden flex gap-8">
                                <span className="animate-marquee inline-flex gap-8">
                                    {tickers.length > 0 ? tickers.map((t, i) => (
                                        <span key={i} className="flex items-center gap-2 font-bold text-white">
                                            ADMIN ALERT: {t.message} •
                                        </span>
                                    )) : "No active messages..."}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Section */}
            <div className="glass-card p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md mb-8">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            New Message Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amrita-maroon outline-none transition-all font-medium h-24 resize-none"
                            placeholder="Enter a new announcement..."
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {['normal', 'urgent'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setPriority(type)}
                                    className={`py-2 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${priority === type
                                        ? type === 'urgent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="px-6 py-2 bg-amrita-maroon text-white hover:bg-amrita-maroon/90 rounded-xl font-bold shadow-lg shadow-amrita-maroon/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    <Plus size={18} /> Add Message
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Feedback Messages */}
                {success && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle size={18} />
                        <span className="font-bold text-sm">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
                        <AlertCircle size={18} />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* Active Tickers List */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Active Messages ({tickers.length})</h3>
                {tickers.length === 0 && (
                    <p className="text-gray-400 italic">No active ticker messages.</p>
                )}
                {tickers.map((ticker) => (
                    <div key={ticker._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`w-2 h-2 rounded-full ${ticker.priority === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{ticker.message}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-400">
                                {new Date(ticker.createdAt).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => handleDelete(ticker._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Delete message"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTickerManager;
