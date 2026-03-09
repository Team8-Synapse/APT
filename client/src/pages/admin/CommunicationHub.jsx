/**
 * Mobile: Frontend / Pages / Admin
 * Description: Admin Communication Hub.
 * - Merges Announcements and Ticker Management into one module.
 */
import React, { useState } from 'react';
import AdminAnnouncements from './AdminAnnouncements';
import AdminTickerManager from './AdminTickerManager';
import { Megaphone, MessageSquare, Bell, Zap } from 'lucide-react';

const CommunicationHub = ({ isSubModule = false }) => {
    const [subTab, setSubTab] = useState('announcements');

    return (
        <div className={`space-y-6 animate-fade-in-up ${!isSubModule ? 'p-8' : ''}`}>
            {/* Header / Sub-tab Selector */}
            <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <div className="p-3 bg-amrita-maroon/10 rounded-2xl text-amrita-maroon">
                            <Megaphone size={24} />
                        </div>
                        <span className="dark:text-white">Communication</span>
                        <span className="text-amrita-maroon">Hub</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage global broadcasts, alerts, and scrolling tickers.</p>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setSubTab('announcements')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${subTab === 'announcements'
                            ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Bell size={18} />
                        ANNOUNCEMENTS
                    </button>
                    <button
                        onClick={() => setSubTab('ticker')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${subTab === 'ticker'
                            ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-md'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <MessageSquare size={18} />
                        TICKER
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {subTab === 'announcements' ? (
                    <AdminAnnouncements isSubModule={isSubModule} />
                ) : (
                    <AdminTickerManager isSubModule={isSubModule} />
                )}
            </div>
        </div>
    );
};

export default CommunicationHub;
