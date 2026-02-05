import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCheck, Trash2, Clock, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications`, {
                withCredentials: true
            });
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/${id}`, {}, {
                withCredentials: true
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/read-all`, {}, {
                withCredentials: true
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = notifications.filter(n => filter === 'all' ? true : !n.isRead);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" />;
            case 'error': return <XCircle className="text-red-500" />;
            case 'warning': return <AlertTriangle className="text-amber-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    const getBg = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            default: return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Bell className="text-amrita-maroon" /> Notifications
                    </h1>
                    <p className="text-gray-500 font-medium">Stay updated with your placement journey</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <CheckCheck size={18} /> Mark all as read
                </button>
            </header>

            <div className="flex gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'all' ? 'bg-amrita-maroon text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'unread' ? 'bg-amrita-maroon text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    Unread
                </button>
            </div>

            <div className="space-y-4">
                {filtered.length > 0 ? filtered.map(n => (
                    <div
                        key={n._id}
                        onClick={() => !n.isRead && markAsRead(n._id)}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer ${getBg(n.type)} ${!n.isRead ? 'shadow-md scale-[1.01]' : 'opacity-75'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 transform scale-125">
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold text-lg mb-1 ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {n.title}
                                        {!n.isRead && <span className="ml-3 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                    {n.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 text-gray-400">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
