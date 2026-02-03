import React, { useState, useEffect } from 'react';
import { Timer, Calendar, Briefcase } from 'lucide-react';

const PlacementCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Target date - next major placement drive
    const targetDate = new Date('2026-03-15T09:00:00');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="glass-card p-6 bg-gradient-to-br from-amrita-maroon/10 to-amrita-pink/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amrita-maroon/10 rounded-xl">
                    <Timer className="text-amrita-maroon" size={20} />
                </div>
                <div>
                    <h3 className="font-black text-gray-800 dark:text-white text-sm">Next Major Drive</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase size={10} /> Google - SDE L3
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <TimeBlock value={timeLeft.days} label="Days" />
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <TimeBlock value={timeLeft.seconds} label="Secs" />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                    <Calendar size={10} className="inline mr-1" />
                    March 15, 2026 • 9:00 AM
                </p>
                <a href="/drives" className="text-xs font-bold text-amrita-maroon hover:underline">
                    View Details →
                </a>
            </div>
        </div>
    );
};

const TimeBlock = ({ value, label }) => (
    <div className="text-center bg-white dark:bg-gray-800 p-3 rounded-xl">
        <p className="text-2xl font-black text-amrita-maroon">{String(value).padStart(2, '0')}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
    </div>
);

export default PlacementCountdown;
