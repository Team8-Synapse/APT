import React from 'react';
import { Code, Clock, CheckCircle, Target, Flame } from 'lucide-react';

const DailyChallenge = ({ streak = 0 }) => {
    const challenge = {
        title: "Two Sum - Easy",
        category: "Arrays",
        difficulty: "Easy",
        timeLimit: "20 min",
        points: 50
    };

    return (
        <div className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-sm">
                    <Code className="text-purple-600" size={18} />
                    Daily Challenge
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
                    <Flame size={14} />
                    {streak} day streak
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{challenge.category}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                        }`}>
                        {challenge.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {challenge.timeLimit}
                    </span>
                    <span className="flex items-center gap-1">
                        <Target size={12} /> {challenge.points} pts
                    </span>
                </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm">
                Start Challenge
            </button>
        </div>
    );
};

export default DailyChallenge;
