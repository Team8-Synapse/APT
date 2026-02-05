import React from 'react';
import {
    X, User, GraduationCap, Briefcase, Award, BookOpen, Link2, Mail, Phone,
    MapPin, Github, Linkedin, FileText, Star, CheckCircle, XCircle, Calendar
} from 'lucide-react';

const StudentDetailModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                            style={{ backgroundColor: '#A4123F' }}
                        >
                            {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black" style={{ color: '#1f2937' }}>
                                {student.firstName} {student.lastName}
                            </h2>
                            <p className="text-sm" style={{ color: '#6b7280' }}>{student.rollNumber}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span
                                    className="px-2 py-0.5 rounded-md text-xs font-bold"
                                    style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
                                >
                                    {student.department}
                                </span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-xs font-bold"
                                    style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                                >
                                    CGPA: {student.cgpa?.toFixed(2)}
                                </span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-xs font-bold"
                                    style={{ backgroundColor: student.backlogs === 0 ? '#dcfce7' : '#fee2e2', color: student.backlogs === 0 ? '#16a34a' : '#dc2626' }}
                                >
                                    {student.backlogs} Backlogs
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} style={{ color: '#6b7280' }} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {student.email && (
                            <a href={`mailto:${student.email}`} className="flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-gray-50" style={{ color: '#4b5563' }}>
                                <Mail size={18} style={{ color: '#A4123F' }} />
                                <span className="text-sm font-medium truncate">{student.email}</span>
                            </a>
                        )}
                        {student.phone && (
                            <a href={`tel:${student.phone}`} className="flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-gray-50" style={{ color: '#4b5563' }}>
                                <Phone size={18} style={{ color: '#A4123F' }} />
                                <span className="text-sm font-medium">{student.phone}</span>
                            </a>
                        )}
                        {student.batch && (
                            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ color: '#4b5563' }}>
                                <Calendar size={18} style={{ color: '#A4123F' }} />
                                <span className="text-sm font-medium">Batch: {student.batch}</span>
                            </div>
                        )}
                    </div>

                    {/* Academic Details */}
                    <Section title="Academic Details" icon={<GraduationCap size={18} />}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox label="CGPA" value={student.cgpa?.toFixed(2)} />
                            <StatBox label="10th %" value={student.tenthPercentage ? `${student.tenthPercentage}%` : 'N/A'} />
                            <StatBox label="12th %" value={student.twelfthPercentage ? `${student.twelfthPercentage}%` : 'N/A'} />
                            <StatBox label="Gap Years" value={student.gap || 0} />
                        </div>
                    </Section>

                    {/* Skills */}
                    {student.skills?.length > 0 && (
                        <Section title="Technical Skills" icon={<BookOpen size={18} />}>
                            <div className="flex flex-wrap gap-2">
                                {student.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 rounded-lg text-sm font-bold text-white"
                                        style={{
                                            backgroundColor: skill.level === 'Advanced' ? '#16a34a' :
                                                skill.level === 'Intermediate' ? '#2563eb' : '#6b7280'
                                        }}
                                    >
                                        {skill.name} <span className="opacity-75 text-xs">({skill.level})</span>
                                    </span>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Internships */}
                    {student.internships?.length > 0 && (
                        <Section title="Internship Experience" icon={<Briefcase size={18} />}>
                            <div className="space-y-3">
                                {student.internships.map((intern, i) => (
                                    <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-bold" style={{ color: '#1f2937' }}>{intern.role}</p>
                                                <p className="text-sm" style={{ color: '#A4123F' }}>{intern.company}</p>
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{intern.duration}</span>
                                        </div>
                                        {intern.description && (
                                            <p className="text-sm mt-2" style={{ color: '#4b5563' }}>{intern.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Projects */}
                    {student.projects?.length > 0 && (
                        <Section title="Projects" icon={<Star size={18} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {student.projects.map((project, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="font-bold" style={{ color: '#1f2937' }}>{project.title}</p>
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noreferrer" style={{ color: '#A4123F' }}>
                                                    <Link2 size={14} />
                                                </a>
                                            )}
                                        </div>
                                        {project.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {project.technologies.map((tech, j) => (
                                                    <span key={j} className="px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {project.description && (
                                            <p className="text-sm" style={{ color: '#6b7280' }}>{project.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Certifications */}
                    {student.certifications?.length > 0 && (
                        <Section title="Certifications" icon={<Award size={18} />}>
                            <div className="space-y-2">
                                {student.certifications.map((cert, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#fef3c7' }}>
                                        <CheckCircle size={16} style={{ color: '#d97706' }} />
                                        <span className="font-medium" style={{ color: '#92400e' }}>{cert}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Achievements */}
                    {student.achievements?.length > 0 && (
                        <Section title="Achievements" icon={<Star size={18} />}>
                            <ul className="space-y-2">
                                {student.achievements.map((achievement, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Star size={14} className="mt-1" style={{ color: '#f59e0b' }} />
                                        <span style={{ color: '#374151' }}>{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {/* Professional Links */}
                    <Section title="Professional Links" icon={<Link2 size={18} />}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {student.linkedIn && (
                                <a
                                    href={student.linkedIn}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl transition-all hover:opacity-80"
                                    style={{ backgroundColor: '#0077b5', color: 'white' }}
                                >
                                    <Linkedin size={18} />
                                    <span className="text-sm font-bold">LinkedIn</span>
                                </a>
                            )}
                            {student.github && (
                                <a
                                    href={student.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl transition-all hover:opacity-80"
                                    style={{ backgroundColor: '#333', color: 'white' }}
                                >
                                    <Github size={18} />
                                    <span className="text-sm font-bold">GitHub</span>
                                </a>
                            )}
                            {student.resumeUrl && (
                                <a
                                    href={student.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl transition-all hover:opacity-80"
                                    style={{ backgroundColor: '#dc2626', color: 'white' }}
                                >
                                    <FileText size={18} />
                                    <span className="text-sm font-bold">Resume</span>
                                </a>
                            )}
                            {student.portfolio && (
                                <a
                                    href={student.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl transition-all hover:opacity-80"
                                    style={{ backgroundColor: '#7c3aed', color: 'white' }}
                                >
                                    <Link2 size={18} />
                                    <span className="text-sm font-bold">Portfolio</span>
                                </a>
                            )}
                        </div>
                        {!student.linkedIn && !student.github && !student.resumeUrl && !student.portfolio && (
                            <p className="text-sm italic" style={{ color: '#9ca3af' }}>No professional links provided</p>
                        )}
                    </Section>

                    {/* Preferences */}
                    {(student.preferredRoles?.length > 0 || student.preferredLocations?.length > 0 || student.expectedCTC) && (
                        <Section title="Job Preferences" icon={<MapPin size={18} />}>
                            <div className="space-y-4">
                                {student.expectedCTC && (
                                    <div>
                                        <p className="text-xs font-bold uppercase mb-1" style={{ color: '#6b7280' }}>Expected CTC</p>
                                        <p className="font-bold text-lg" style={{ color: '#16a34a' }}>₹{student.expectedCTC} LPA</p>
                                    </div>
                                )}
                                {student.preferredRoles?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold uppercase mb-2" style={{ color: '#6b7280' }}>Preferred Roles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.preferredRoles.map((role, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {student.preferredLocations?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold uppercase mb-2" style={{ color: '#6b7280' }}>Preferred Locations</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.preferredLocations.map((loc, i) => (
                                                <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                                                    <MapPin size={12} /> {loc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Components
const Section = ({ title, icon, children }) => (
    <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2" style={{ color: '#374151' }}>
            <span style={{ color: '#A4123F' }}>{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);

const StatBox = ({ label, value }) => (
    <div className="p-3 rounded-xl text-center" style={{ backgroundColor: '#f3f4f6' }}>
        <p className="text-xl font-black" style={{ color: '#1f2937' }}>{value}</p>
        <p className="text-xs font-medium" style={{ color: '#6b7280' }}>{label}</p>
    </div>
);

export default StudentDetailModal;
