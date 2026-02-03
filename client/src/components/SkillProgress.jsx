import React from 'react';

const SkillProgress = ({ skills = [] }) => {
    const defaultSkills = [
        { name: 'Data Structures', level: 85 },
        { name: 'Algorithms', level: 78 },
        { name: 'System Design', level: 65 },
        { name: 'React', level: 90 },
        { name: 'Node.js', level: 82 }
    ];

    const displaySkills = skills.length > 0 ? skills : defaultSkills;

    const getColorByLevel = (level) => {
        if (level >= 80) return 'from-green-500 to-emerald-400';
        if (level >= 60) return 'from-blue-500 to-cyan-400';
        if (level >= 40) return 'from-yellow-500 to-amber-400';
        return 'from-red-500 to-orange-400';
    };

    return (
        <div className="space-y-4">
            {displaySkills.slice(0, 5).map((skill, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="font-bold text-gray-900 dark:text-white">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getColorByLevel(skill.level)} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${skill.level}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillProgress;
