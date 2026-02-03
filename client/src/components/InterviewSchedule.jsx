import React from 'react';
import { Video, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

const InterviewSchedule = () => {
    const interviews = [
        {
            company: 'Microsoft',
            type: 'Technical Round 1',
            date: 'Mar 15, 2026',
            time: '10:00 AM',
            mode: 'Virtual',
            link: '#'
        },
        {
            company: 'Google',
            type: 'HR Interview',
            date: 'Mar 18, 2026',
            time: '2:30 PM',
            mode: 'Virtual',
            link: '#'
        }
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                    <Video className="text-amrita-maroon" size={18} />
                    Upcoming Interviews
                </h3>
                <span className="text-xs font-bold text-amrita-maroon bg-amrita-maroon/10 px-2 py-1 rounded-full">
                    {interviews.length} scheduled
                </span>
            </div>

            <div className="space-y-3">
                {interviews.map((interview, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{interview.company}</h4>
                                <p className="text-xs text-gray-500">{interview.type}</p>
                            </div>
                            <a href={interview.link} className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon hover:bg-amrita-maroon hover:text-white transition-all">
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                                <Calendar size={10} /> {interview.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} /> {interview.time}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={10} /> {interview.mode}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {interviews.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    <Video size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No interviews scheduled</p>
                </div>
            )}
        </div>
    );
};

export default InterviewSchedule;
