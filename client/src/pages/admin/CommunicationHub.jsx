/**
 * Mobile: Frontend / Pages / Admin
 * Description: Admin Communication Hub.
 * - Merges Announcements and Ticker Management into one module.
 */
import React, { useState } from 'react';
import AdminAnnouncements from './AdminAnnouncements';
import { Megaphone } from 'lucide-react';

const CommunicationHub = ({ isSubModule = false }) => {

    return (
        <div className={`space-y-6 animate-fade-in-up ${!isSubModule ? 'p-8' : ''}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <Megaphone className="text-amrita-maroon" size={28} />
                        <span style={{ color: '#1A1A1A' }}>Announcements</span> <span style={{ color: '#A4123F' }}>Hub</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-tight">Manage global broadcasts, alerts and ticker stream</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                <AdminAnnouncements isSubModule={isSubModule} />
            </div>
        </div>
    );
};

export default CommunicationHub;

