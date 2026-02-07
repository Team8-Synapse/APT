import React, { useState } from 'react';
import { X, LayoutList, Kanban, Eye, ExternalLink } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import StudentDetailModal from './StudentDetailModal';

const DriveApplicantsModal = ({
    isOpen,
    onClose,
    drive,
    applicants,
    updateStatus,
    fetchApplications
}) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (!isOpen || !drive) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amrita-maroon to-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-amrita-maroon/20">
                                {drive.companyName?.[0]}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                {drive.companyName} - Applicants
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">
                                {drive.jobProfile}
                            </span>
                            <span>•</span>
                            <span>{applicants.length} applicants</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Toggles */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <LayoutList size={16} /> List
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'board'
                                    ? 'bg-white dark:bg-gray-700 text-amrita-maroon shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Kanban size={16} /> Board
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 relative">
                    {viewMode === 'list' ? (
                        <div className="h-full overflow-y-auto p-6 md:p-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">Student</th>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">Department</th>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">CGPA</th>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">Applied On</th>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {applicants.map((app) => (
                                            <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {app.studentId?.firstName} {app.studentId?.lastName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                            <span>{app.studentId?.rollNumber}</span>
                                                        </div>
                                                        <button
                                                            className="text-[10px] font-bold text-amrita-maroon mt-1 flex items-center gap-1 hover:underline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedStudent(app.studentId);
                                                            }}
                                                        >
                                                            <Eye size={10} /> Click to view profile
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {app.studentId?.department}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-sm font-bold ${app.studentId?.cgpa >= 9 ? 'text-green-600' :
                                                        app.studentId?.cgpa >= 8 ? 'text-blue-600' : 'text-orange-600'
                                                        }`}>
                                                        {app.studentId?.cgpa}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-500">
                                                    {new Date(app.appliedDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide
                                                        ${app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                                                            app.status === 'shortlisted' ? 'bg-indigo-100 text-indigo-700' :
                                                                app.status === 'offered' ? 'bg-green-100 text-green-700' :
                                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                        }
                                                    `}>
                                                        {app.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <select
                                                        value={app.status || 'applied'}
                                                        onChange={(e) => updateStatus(app._id, e.target.value)}
                                                        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 text-xs rounded-lg focus:ring-amrita-maroon focus:border-amrita-maroon block w-full p-2 font-bold cursor-pointer hover:bg-white transition-colors"
                                                    >
                                                        <option value="applied">Applied</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="round1">Round 1</option>
                                                        <option value="round2">Round 2</option>
                                                        <option value="hr_round">HR Round</option>
                                                        <option value="offered">Offered</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        {applicants.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center text-gray-500">
                                                    No applicants found for this drive yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full p-6 md:p-8 overflow-hidden">
                            <div className="h-full overflow-x-auto pb-4">
                                <KanbanBoard
                                    applications={applicants}
                                    driveId={drive._id}
                                    fetchApplications={() => fetchApplications(drive._id)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default DriveApplicantsModal;
