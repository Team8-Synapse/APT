import React from 'react';
import { BookOpen, Play, FileText, ExternalLink, Star } from 'lucide-react';

const ResourceRecommendations = ({ stats = {} }) => {
    const resources = [
        {
            title: 'DSA Masterclass',
            type: 'Video Course',
            provider: 'YouTube',
            duration: '4 hrs',
            rating: 4.8,
            icon: <Play size={14} />
        },
        {
            title: 'System Design Primer',
            type: 'Article',
            provider: 'GitHub',
            duration: '30 min',
            rating: 4.9,
            icon: <FileText size={14} />
        },
        {
            title: 'Interview Prep Guide',
            type: 'PDF',
            provider: 'Amrita CIR',
            duration: '1 hr',
            rating: 4.7,
            icon: <BookOpen size={14} />
        }
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                    <BookOpen className="text-amrita-maroon" size={18} />
                    Recommended Resources
                </h3>
                <span className="text-xs text-gray-500">
                    {stats.viewed || 0} viewed • {stats.completed || 0} completed
                </span>
            </div>

            <div className="space-y-3">
                {resources.map((resource, i) => (
                    <a key={i} href="#" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-amrita-maroon/10 transition-all group">
                        <div className="p-2 bg-amrita-maroon/10 rounded-lg text-amrita-maroon group-hover:bg-amrita-maroon group-hover:text-white transition-all">
                            {resource.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">{resource.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{resource.type}</span>
                                <span>•</span>
                                <span>{resource.duration}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-amber-500">
                                <Star size={10} fill="currentColor" />
                                {resource.rating}
                            </div>
                            <p className="text-[10px] text-gray-400">{resource.provider}</p>
                        </div>
                    </a>
                ))}
            </div>

            <a href="/resources" className="block mt-4 text-center text-xs font-bold text-amrita-maroon hover:underline">
                Browse All Resources →
            </a>
        </div>
    );
};

export default ResourceRecommendations;
