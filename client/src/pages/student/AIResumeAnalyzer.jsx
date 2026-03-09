import React, { useState } from 'react';
import axios from 'axios';
import { Target, FileText, Upload, Sparkles, AlertTriangle, CheckCircle, Brain, ArrowRight, Zap, RefreshCw, File as FileIcon } from 'lucide-react';

const AIResumeAnalyzer = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Please upload a valid PDF file.');
                return;
            }
            setResumeFile(file);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resumeFile || !targetRole.trim()) {
            alert("Please provide both a target role and a resume PDF.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('targetRole', targetRole);

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/analyze-resume`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setAnalysis(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to analyze resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 page-enter font-outfit">
            <header className="flex justify-between items-center bg-white/40 p-6 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <div className="p-3 bg-amrita-maroon/10 rounded-2xl">
                            <FileText className="text-amrita-maroon" size={28} />
                        </div>
                        <span style={{ color: '#1A1A1A' }}>AI Resume</span> <span style={{ color: '#A4123F' }}>Analyzer</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest">Optimize your CV for ATS Systems</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="glass-card p-8 border-t-4 border-t-[#6E0B30]">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6">
                        <Upload size={20} className="text-amrita-maroon" /> Input Resume Data
                    </h2>

                    <form onSubmit={handleAnalyze} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Target Role / Designation</label>
                            <div className="relative">
                                <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text" required
                                    className="w-full pl-12 pr-4 py-3 bg-white/70 border border-white rounded-xl focus:ring-2 focus:ring-amrita-maroon/20 outline-none font-bold shadow-inner"
                                    placeholder="e.g. Data Scientist, Full Stack Developer"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Upload Resume <span className="lowercase text-[8px] opacity-70">(PDF only)</span></label>
                            <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 bg-white/50 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group overflow-hidden">
                                <input
                                    type="file"
                                    required
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {resumeFile ? (
                                    <div className="flex flex-col items-center gap-2 text-amrita-maroon relative z-0">
                                        <FileIcon size={32} />
                                        <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{resumeFile.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Click to change file</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-amrita-maroon transition-colors relative z-0">
                                        <Upload size={32} />
                                        <span className="text-sm font-bold text-gray-600">Click or drag PDF here</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !resumeFile}
                            className={`w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors ${loading || !resumeFile ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <><RefreshCw size={18} className="animate-spin" /> Analyzing Report...</>
                            ) : (
                                <><Brain size={18} /> Generate ATS Report</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Analysis Results Section */}
                <div className="relative">
                    {!analysis && !loading ? (
                        <div className="h-full glass-card border border-white/60 flex flex-col items-center justify-center p-12 text-center opacity-60">
                            <Brain size={64} className="text-gray-300 mb-6" />
                            <h3 className="text-xl font-black text-gray-900">Awaiting Neural Input</h3>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 max-w-[250px]">Paste your resume on the left to begin ATS analysis</p>
                        </div>
                    ) : analysis ? (
                        <div className="h-full glass-card p-8 bg-gradient-to-br from-white/90 to-amrita-maroon/5 border-amrita-maroon/20 shadow-xl relative animate-fade-in-up">

                            {/* Score Header */}
                            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-100">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">ATS Compatibility Score</h3>
                                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                        Optimization Match <Sparkles size={20} className="text-amrita-gold" />
                                    </h2>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="#f0f0f0" strokeWidth="8" />
                                        <circle
                                            cx="48" cy="48" r="40" fill="transparent"
                                            stroke={analysis.score > 80 ? '#22c55e' : analysis.score > 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="8"
                                            strokeDasharray="251.2"
                                            strokeDashoffset={(251.2 * (100 - (analysis.score || 0))) / 100}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-black text-gray-900">{analysis.score || 0}</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Strengths */}
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" /> Key Strengths Found
                                    </h4>
                                    <ul className="space-y-3">
                                        {analysis.strengths?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-red-500" /> Improvement Areas (Missing Keywords)
                                    </h4>
                                    <ul className="space-y-3">
                                        {analysis.weaknesses?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700 bg-red-50/50 p-3 border border-red-100 rounded-xl">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actionable Tips */}
                                <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-2xl overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 opacity-10">
                                        <Brain size={150} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase text-amrita-gold tracking-widest mb-4 flex items-center gap-2 relative z-10">
                                        <Zap size={14} /> AI Action Plan
                                    </h4>
                                    <ul className="space-y-4 relative z-10">
                                        {analysis.tips?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-200">
                                                <ArrowRight size={16} className="text-amrita-maroon mt-0.5 flex-shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full glass-card border border-white/60 flex flex-col items-center justify-center p-12 text-center">
                            <RefreshCw size={48} className="text-amrita-maroon animate-spin mb-6" />
                            <h3 className="text-xl font-black text-gray-900">Running ATS Algorithms...</h3>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 max-w-[250px]">Matching target role keywords against neural patterns</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIResumeAnalyzer;
