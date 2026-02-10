/**
 * Mobile: Frontend / Components
 * Description: Notifications Panel Component.
 * - Displays real-time user notifications in a dropdown panel.
 * - Supports marking notifications as read/unread.
 * - Auto-fetches notifications on open.
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, X, Check, Trash2, Info, AlertTriangle, CheckCircle, ExternalLink, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotificationsPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reload notifications when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Mark a single notification as read
    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    // Helper to get icon based on notification type
    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={18} />;
            case 'error': return <AlertTriangle className="text-red-500" size={18} />;
            case 'drive': return <Briefcase className="text-blue-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-4 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[100] overflow-hidden animate-fade-in-up origin-top-right">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-amrita-maroon" />
                    <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                    <span className="bg-amrita-maroon/10 text-amrita-maroon text-xs px-2 py-0.5 rounded-full font-bold">
                        {notifications.filter(n => !n.isRead).length}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={markAllAsRead} className="text-xs font-bold text-gray-500 hover:text-amrita-maroon" title="Mark all as read">
                        <Check size={16} />
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-2">
                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-3 rounded-xl border border-transparent hover:border-gray-100 transition-all ${notification.isRead ? 'bg-white opacity-60' : 'bg-blue-50/50'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'} mb-1`}>
                                            {notification.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-2">
                                            {notification.message}
                                        </p>
                                        {(notification.relatedDrive || notification.link) && (
                                            <a
                                                href={notification.link || '/drives'}
                                                className="inline-flex items-center gap-1 text-[10px] font-black text-amrita-maroon hover:underline mb-2"
                                            >
                                                <ExternalLink size={10} /> View Details
                                            </a>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-400 font-bold">
                                                {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-[10px] font-bold text-amrita-maroon hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <Bell size={48} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-bold">No notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
