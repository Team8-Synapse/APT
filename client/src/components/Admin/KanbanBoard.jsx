import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { User, GripVertical, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

// Define the columns in order
const COLUMN_ORDER = ['applied', 'shortlisted', 'round1', 'round2', 'hr_round', 'offered', 'rejected'];

const COLUMN_CONFIG = {
    applied: { title: 'Applied', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    shortlisted: { title: 'Shortlisted', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    round1: { title: 'Round 1', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    round2: { title: 'Round 2', color: 'bg-pink-50 border-pink-200 text-pink-700' },
    hr_round: { title: 'HR Round', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    offered: { title: 'Offered', color: 'bg-green-50 border-green-200 text-green-700' },
    rejected: { title: 'Rejected', color: 'bg-red-50 border-red-200 text-red-700' }
};

const KanbanBoard = ({ applications, driveId, fetchApplications, onViewStudent }) => {
    const [columns, setColumns] = useState({});

    // Group applications by status when props change
    useEffect(() => {
        const newColumns = {};
        COLUMN_ORDER.forEach(key => {
            newColumns[key] = [];
        });

        applications.forEach(app => {
            if (newColumns[app.status]) {
                newColumns[app.status].push(app);
            } else {
                // Fallback for unknown status
                if (!newColumns['applied']) newColumns['applied'] = [];
                newColumns['applied'].push(app);
            }
        });
        setColumns(newColumns);
    }, [applications]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside or same place
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Optimistic Update
        const startColumn = columns[source.droppableId];
        const finishColumn = columns[destination.droppableId];

        // Moving within same list
        if (startColumn === finishColumn) {
            const newIds = Array.from(startColumn);
            const [moved] = newIds.splice(source.index, 1);
            newIds.splice(destination.index, 0, moved);

            setColumns({
                ...columns,
                [source.droppableId]: newIds
            });
            return; // No backend update needed for reorder usually, unless we track rank
        }

        // Moving to different list
        const startIds = Array.from(startColumn);
        const [movedApp] = startIds.splice(source.index, 1);
        const finishIds = Array.from(finishColumn);

        // Update the app status locally
        const updatedApp = { ...movedApp, status: destination.droppableId };
        finishIds.splice(destination.index, 0, updatedApp);

        setColumns({
            ...columns,
            [source.droppableId]: startIds,
            [destination.droppableId]: finishIds
        });

        // Backend Call
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/admin/application/${draggableId}`, {
                status: destination.droppableId
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (destination.droppableId === 'offered') {
                import('canvas-confetti').then((module) => {
                    const confetti = module.default;
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                    });
                });
            }

            // Sync with server
            if (fetchApplications) fetchApplications();
        } catch (err) {
            console.error("Failed to update status", err);
            // Ideally revert state here, but for MVP we assume success
            alert("Failed to update status. Please refresh.");
        }
    };

    return (
        <div className="overflow-x-auto h-full pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 h-full min-w-[1200px]">
                    {COLUMN_ORDER.map(columnId => {
                        const column = columns[columnId] || [];
                        const config = COLUMN_CONFIG[columnId];

                        return (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-shrink-0 w-80 rounded-xl p-4 flex flex-col h-full bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border ${snapshot.isDraggingOver ? 'border-amrita-maroon bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}
                                    >
                                        <div className={`p-3 rounded-lg mb-4 flex justify-between items-center ${config.color} border`}>
                                            <h3 className="font-bold text-sm uppercase tracking-wider">{config.title}</h3>
                                            <span className="bg-white/50 px-2 py-1 rounded text-xs font-bold">{column.length}</span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto min-h-[100px] space-y-3 p-1">
                                            {column.map((app, index) => (
                                                <Draggable key={app._id} draggableId={app._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-amrita-maroon' : ''}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{app.studentId?.firstName} {app.studentId?.lastName}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.studentId?.rollNumber}</p>
                                                                    <div className="flex items-center gap-1 mt-2">
                                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                                                            CGPA: {app.studentId?.cgpa}
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => onViewStudent && onViewStudent(app.studentId)}
                                                                        className="mt-2 text-[10px] font-bold text-amrita-maroon flex items-center gap-1 hover:underline"
                                                                    >
                                                                        <Eye size={12} /> Click to view profile
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
