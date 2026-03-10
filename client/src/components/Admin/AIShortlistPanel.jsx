import React, { useState } from 'react';
import api from '../../api';
import {
    Sparkles, Zap, Download, X, CheckCircle,
    AlertCircle, Loader2, Users2, Brain, FileSpreadsheet,
    ChevronDown, ChevronUp, RotateCcw
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const EXAMPLE_PROMPTS = [
    '2027 batch students with CGPA > 8 and no backlogs',
    'CSE students from 2024 and 2025 batches',
    'Placed students from 2023 batch',
    '2026 batch AIE department, CGPA > 8.5, not placed',
    '2025 batch ECE students with no backlogs',
];

const STATUS_COLORS = {
    'Placed': 'bg-green-100 text-green-700 border-green-200',
    'Not Placed': 'bg-red-100 text-red-700 border-red-200',
    'In Process': 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function AIShortlistPanel() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const handleShortlist = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await api.post(`/ai-shortlist/query`, { prompt });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'AI shortlisting failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!result?.students?.length) return;
        setDownloading(true);
        try {
            const res = await api.post(
                `/ai-shortlist/download`,
                { students: result.students, filename: `AI_Shortlist_${Date.now()}` },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `AI_Shortlist.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Download failed');
        } finally {
            setDownloading(false);
        }
    };

    const handleReset = () => {
        setPrompt('');
        setResult(null);
        setError('');
    };

    const getFilterChips = (filters) => {
        if (!filters) return [];
        const chips = [];
        if (filters.batch) chips.push({ label: `Batch: ${filters.batch}`, color: 'bg-blue-100 text-blue-700' });
        if (filters.department) chips.push({ label: `Dept: ${filters.department}`, color: 'bg-purple-100 text-purple-700' });
        if (filters.section) chips.push({ label: `Section: ${filters.section}`, color: 'bg-indigo-100 text-indigo-700' });
        if (filters.minCgpa != null) chips.push({ label: `CGPA ≥ ${filters.minCgpa}`, color: 'bg-green-100 text-green-700' });
        if (filters.maxCgpa != null) chips.push({ label: `CGPA ≤ ${filters.maxCgpa}`, color: 'bg-green-100 text-green-700' });
        if (filters.maxBacklogs != null) chips.push({ label: `Backlogs ≤ ${filters.maxBacklogs}`, color: 'bg-orange-100 text-orange-700' });
        if (filters.placementStatus) chips.push({ label: `Status: ${filters.placementStatus}`, color: 'bg-pink-100 text-pink-700' });
        return chips;
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1a0a14 0%, #2d0f1f 35%, #1a0a14 100%)',
            borderRadius: '1.5rem',
            padding: '2px',
            marginBottom: '2rem',
            boxShadow: '0 8px 40px rgba(139,0,0,0.25)',
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #fff 0%, #fdf2f5 100%)',
                borderRadius: 'calc(1.5rem - 2px)',
                padding: '1.5rem',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #8B0000, #A4123F)',
                            borderRadius: '0.75rem',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Brain size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1a1a1a', margin: 0 }}>
                                AI-Powered Student Shortlisting
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                                Powered by Gemini AI • Natural language filtering
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {result && (
                            <button
                                onClick={handleReset}
                                title="Reset"
                                style={{
                                    padding: '0.4rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e5e7eb',
                                    background: 'white',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                <RotateCcw size={14} color="#666" />
                            </button>
                        )}
                        <button
                            onClick={() => setExpanded(e => !e)}
                            style={{
                                padding: '0.4rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center',
                            }}
                        >
                            {expanded ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
                        </button>
                    </div>
                </div>

                {expanded && (
                    <>
                        {/* Prompt Input */}
                        <div style={{ marginBottom: '1rem' }}>
                            <textarea
                                id="ai-shortlist-prompt"
                                rows={3}
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleShortlist(); }}
                                placeholder="Describe the students you want to shortlist... e.g. '2026 batch CSE students with CGPA > 8 and no backlogs'"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '0.875rem',
                                    border: '2px solid #f0d4da',
                                    background: 'white',
                                    fontSize: '0.9rem',
                                    color: '#1a1a1a',
                                    resize: 'vertical',
                                    outline: 'none',
                                    fontFamily: 'Inter, sans-serif',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#A4123F'}
                                onBlur={e => e.target.style.borderColor = '#f0d4da'}
                            />
                            <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.4rem' }}>
                                Tip: Press <kbd style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: '3px', fontSize: '0.7rem' }}>Ctrl+Enter</kbd> to run
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <button
                                id="ai-shortlist-run-btn"
                                onClick={handleShortlist}
                                disabled={loading || !prompt.trim()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: loading || !prompt.trim()
                                        ? '#ccc'
                                        : 'linear-gradient(135deg, #8B0000, #A4123F)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.875rem',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: loading || !prompt.trim() ? 'none' : '0 4px 20px rgba(139,0,0,0.35)',
                                }}
                            >
                                {loading ? (
                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analysing...</>
                                ) : (
                                    <><Zap size={16} /> Run AI Shortlist</>
                                )}
                            </button>

                            {result?.students?.length > 0 && (
                                <button
                                    id="ai-shortlist-download-btn"
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'white',
                                        color: '#15803d',
                                        border: '2px solid #16a34a',
                                        borderRadius: '0.875rem',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        cursor: downloading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseOver={e => { if (!downloading) { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = 'white'; } }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#15803d'; }}
                                >
                                    {downloading ? (
                                        <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Downloading...</>
                                    ) : (
                                        <><FileSpreadsheet size={16} /> Download Excel ({result.count})</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.875rem 1rem', borderRadius: '0.875rem',
                                background: '#fef2f2', border: '1px solid #fecaca',
                                marginBottom: '1rem',
                            }}>
                                <AlertCircle size={16} color="#dc2626" />
                                <span style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: 600 }}>{error}</span>
                            </div>
                        )}

                        {/* Results */}
                        {result && (
                            <div>
                                {/* Stats row */}
                                <div style={{
                                    display: 'flex', gap: '1rem', marginBottom: '1rem',
                                    flexWrap: 'wrap', alignItems: 'center',
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 1rem', borderRadius: '0.75rem',
                                        background: 'rgba(139,0,0,0.08)', border: '1px solid rgba(139,0,0,0.15)',
                                    }}>
                                        <Users2 size={16} color="#8B0000" />
                                        <span style={{ fontWeight: 800, color: '#8B0000', fontSize: '1rem' }}>{result.count}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#8B0000', fontWeight: 600 }}>Students Found</span>
                                    </div>

                                    {/* Filter summary text */}
                                    {result.filterSummary && result.filterSummary !== 'No specific filters (showing all)' && (
                                        <div style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '0.75rem',
                                            background: '#f0fdf4',
                                            border: '1px solid #86efac',
                                            fontSize: '0.78rem',
                                            color: '#15803d',
                                            fontWeight: 700,
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        }}>
                                            <CheckCircle size={13} />
                                            {result.filterSummary}
                                        </div>
                                    )}
                                </div>

                                {result.count === 0 ? (
                                    <div style={{
                                        textAlign: 'center', padding: '2rem',
                                        background: '#f9fafb', borderRadius: '1rem',
                                        border: '2px dashed #e5e7eb',
                                    }}>
                                        <Sparkles size={32} color="#ccc" style={{ marginBottom: '0.75rem' }} />
                                        <p style={{ color: '#888', fontWeight: 600 }}>No students match your criteria.</p>
                                        <p style={{ color: '#aaa', fontSize: '0.8rem' }}>Try adjusting your prompt for broader results.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid #f0d4da' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ background: 'linear-gradient(135deg, #8B0000, #A4123F)' }}>
                                                    {['#', 'Roll No.', 'Name', 'Dept', 'Batch', 'CGPA', 'Backlogs', 'Status'].map(h => (
                                                        <th key={h} style={{
                                                            padding: '0.75rem 1rem',
                                                            textAlign: 'left',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                            fontSize: '0.75rem',
                                                            letterSpacing: '0.05em',
                                                            textTransform: 'uppercase',
                                                            whiteSpace: 'nowrap',
                                                        }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.students.map((s, i) => (
                                                    <tr
                                                        key={i}
                                                        style={{
                                                            background: i % 2 === 0 ? 'white' : '#fdf8f9',
                                                            transition: 'background 0.15s',
                                                        }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#fef2f5'}
                                                        onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fdf8f9'}
                                                    >
                                                        <td style={{ padding: '0.65rem 1rem', color: '#888', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#555', fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.rollNumber}</td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{s.fullName}</td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <span style={{
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '0.4rem',
                                                                background: '#f0d4da',
                                                                color: '#8B0000',
                                                                fontWeight: 700,
                                                                fontSize: '0.75rem',
                                                            }}>{s.department}</span>
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#555' }}>{s.batch}</td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 900, color: '#8B0000', fontSize: '0.95rem' }}>{s.cgpa?.toFixed(2)}</td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: s.backlogs > 0 ? '#dc2626' : '#16a34a' }}>{s.backlogs}</td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <span style={{
                                                                padding: '0.2rem 0.65rem',
                                                                borderRadius: '999px',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 700,
                                                                border: '1px solid',
                                                            }} className={STATUS_COLORS[s.placementStatus] || 'bg-gray-100 text-gray-600'}>
                                                                {s.placementStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

