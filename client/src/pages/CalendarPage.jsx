import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Building2, MapPin, IndianRupee } from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const drivesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/student/drives`, {
                withCredentials: true
            });

            const driveEvents = drivesRes.data.map(drive => ({
                id: drive._id,
                title: drive.companyName,
                date: new Date(drive.date),
                type: 'drive',
                location: drive.location || 'TBA',
                ctc: drive.ctcDetails?.ctc || 'N/A',
                color: 'bg-amrita-maroon text-white'
            }));

            // Add deadlines from actual registrationDeadline
            const deadlineEvents = drivesRes.data
                .filter(drive => drive.registrationDeadline)
                .map(drive => ({
                    id: `deadline-${drive._id}`,
                    title: `Deadline: ${drive.companyName}`,
                    date: new Date(drive.registrationDeadline),
                    type: 'deadline',
                    color: 'bg-amber-500 text-white',
                    companyName: drive.companyName // Passed for logo
                }));

            setEvents([...driveEvents, ...deadlineEvents]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const getEventsForDay = (day) => {
        return events.filter(e =>
            e.date.getDate() === day &&
            e.date.getMonth() === currentDate.getMonth() &&
            e.date.getFullYear() === currentDate.getFullYear()
        );
    };

    const getSelectedEvents = () => {
        return events.filter(e =>
            e.date.getDate() === selectedDate.getDate() &&
            e.date.getMonth() === selectedDate.getMonth() &&
            e.date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    return (
        <div className="max-w-7xl mx-auto animate-fade-in pb-20">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-2">
                <CalendarIcon className="text-amrita-maroon" size={28} />
                <span style={{ color: '#1A1A1A' }}>Placement</span> <span style={{ color: '#A4123F' }}>Schedule</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    {/* Header */}
                    <div className="p-6 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-black text-gray-800 dark:text-white">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 p-4 gap-2 text-center border-b border-gray-100 dark:border-gray-700">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 p-4 gap-2">
                        {Array.from({ length: firstDayOfMonth(currentDate) }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24" />
                        ))}

                        {Array.from({ length: daysInMonth(currentDate) }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const dayEvents = getEventsForDay(day);
                            const isToday = isSameDay(new Date(), date);
                            const isSelected = isSameDay(selectedDate, date);

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDate(date)}
                                    className={`
                                        h-24 rounded-2xl border transition-all cursor-pointer relative group
                                        ${isSelected ? 'bg-amrita-maroon text-white border-amrita-maroon shadow-lg transform scale-105 z-10' :
                                            isToday ? 'bg-amrita-gold/20 border-amrita-gold text-amrita-maroon' :
                                                'bg-white dark:bg-gray-800/50 border-gray-50 dark:border-gray-700 hover:border-amrita-maroon/30 hover:bg-gray-50'}
                                    `}
                                >
                                    <div className={`p-2 font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day}</div>

                                    {/* Event Dots */}
                                    <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap content-end">
                                        {dayEvents.map((evt, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 w-2 rounded-full ${evt.type === 'drive' ? (isSelected ? 'bg-white' : 'bg-amrita-maroon') : (isSelected ? 'bg-amber-100' : 'bg-amber-500')}`}
                                                title={evt.title}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Selected Day Details */}
                <div className="space-y-6">
                    <div className="glass-card p-6 bg-white border-0 shadow-xl sticky top-24 min-h-[400px]" style={{ backgroundColor: '#ffffff' }}>
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule For</p>
                            <h2 className="text-3xl font-black" style={{ color: '#1f2937' }}>
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {getSelectedEvents().length > 0 ? getSelectedEvents().map((evt, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className={`text-[10px] font-black uppercase tracking-wider mb-2 inline-block px-2 py-1 rounded-lg ${evt.type === 'drive' ? 'bg-amrita-maroon/10 text-amrita-maroon' : 'bg-amber-100 text-amber-700'}`}>
                                        {evt.type === 'drive' ? 'Placement Drive' : 'Application Deadline'}
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <CompanyLogo name={evt.type === 'drive' ? evt.title : evt.companyName || evt.title.replace('Deadline: ', '')} size="md" className="rounded-lg shadow-sm" />
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{evt.title}</h3>
                                    </div>

                                    {evt.type === 'drive' && (
                                        <div className="space-y-2 text-sm text-gray-600 mt-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-gray-400" /> {evt.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={14} className="text-gray-400" /> {evt.ctc} CTC
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No events scheduled</p>
                                    <p className="text-xs mt-1">Select another date to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
