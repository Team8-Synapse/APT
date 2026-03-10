import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Brain, Mic, MicOff, Send, PhoneOff, Settings, Volume2, VolumeX, Building, Code, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIMockInterview = () => {
    // Setup State
    const [phase, setPhase] = useState('setup'); // setup, interview, summary
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [type, setType] = useState('Technical');

    // Interview State
    const [chatHistory, setChatHistory] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [finalReview, setFinalReview] = useState(null);
    const [isComplete, setIsComplete] = useState(false);

    // Audio / Speech State
    const [isRecording, setIsRecording] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    transcript += event.results[i][0].transcript;
                }
                setCurrentAnswer(prev => {
                    // Overwrite the last chunk of dictation smoothly
                    return transcript; // Simplified for demo, append to actual cursor pos in pro version
                });
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            setCurrentAnswer('');
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const speakText = (text) => {
        if (!ttsEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Clear queue
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        // Try to find a good English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading]);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes max

    // Timer Effect
    useEffect(() => {
        if (phase === 'interview' && !isComplete && !loading) {
            const int = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endInterviewEarly();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(int);
        }
    }, [phase, isComplete, loading]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const startInterview = async (e) => {
        e.preventDefault();
        if (!company || !role) return;

        setPhase('interview');

        // Ensure absolutely everything starts fresh
        setChatHistory([]);
        setCurrentAnswer('');
        setQuestionCount(0);
        setIsComplete(false);
        setFinalReview(null);
        setTimeLeft(15 * 60); // Reset timer to 15m

        await sendTurn(null, 0); // Trigger first question
    };

    const sendTurn = async (answerText, currentCount) => {
        setLoading(true);
        try {
            const historyPayload = chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/mock-interview-chat`,
                {
                    company,
                    role,
                    type,
                    chatHistory: historyPayload,
                    currentAnswer: answerText,
                    questionCount: currentCount
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data;
            let aiMessageContent = "";

            if (data.feedback) {
                aiMessageContent += `**Feedback on previous answer:** ${data.feedback}\n\n`;
            }

            if (data.isComplete) {
                setFinalReview({
                    score: data.finalScore,
                    summary: data.feedback // The system maps the final feedback here
                });
                setIsComplete(true);
                setPhase('summary');
                speakText("The interview is now complete. Let's review your performance.");
            } else {
                aiMessageContent += data.nextQuestion;
                setChatHistory(prev => [...prev, { role: 'model', content: aiMessageContent, timestamp: new Date() }]);
                setQuestionCount(currentCount + 1);
                speakText(data.nextQuestion);
            }
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, { role: 'model', content: "Network anomaly detected. Could you repeat that?", timestamp: new Date() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!currentAnswer.trim()) return;

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }

        const answer = currentAnswer;
        setCurrentAnswer('');

        // Add user msg to UI
        setChatHistory(prev => [...prev, { role: 'user', content: answer, timestamp: new Date() }]);

        await sendTurn(answer, questionCount);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading) handleSendMessage();
        }
    };

    const endInterviewEarly = () => {
        if (window.confirm("Are you sure you want to end the interview early?")) {
            setPhase('setup');
            window.speechSynthesis.cancel();
        }
    };

    // SETUP VIEW
    if (phase === 'setup') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 page-enter font-outfit mt-10">
                <div className="glass-card p-12 text-center animate-fade-in-up border-t-4 border-t-amrita-maroon relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
                        <Brain size={300} />
                    </div>

                    <div className="w-24 h-24 bg-gradient-to-br from-amrita-maroon to-[#6E0B30] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amrita-maroon/20">
                        <Brain className="text-white" size={40} />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Interactive AI Interview</h1>
                    <p className="text-gray-500 font-medium mb-10 max-w-xl mx-auto text-lg">
                        Engage in a live, conversational interview with a Neural Evaluator. Practice your speech, technical concepts, and behavioral responses.
                    </p>

                    <form onSubmit={startInterview} className="space-y-6 max-w-lg mx-auto relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative text-left">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Company</label>
                                <div className="relative">
                                    <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text" required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amrita-maroon focus:ring-4 focus:ring-amrita-maroon/10 outline-none font-bold transition-all"
                                        placeholder="Google"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative text-left">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Role</label>
                                <div className="relative">
                                    <Code size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text" required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amrita-maroon focus:ring-4 focus:ring-amrita-maroon/10 outline-none font-bold transition-all"
                                        placeholder="SDE II"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative text-left">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1 mb-2 block">Interview Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Technical', 'HR / Behavioral', 'Case Study'].map(t => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${type === t ? 'border-amrita-maroon bg-amrita-maroon/5 text-amrita-maroon' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mt-4"
                        >
                            <PlayCircle size={24} /> Enter Interview Room
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // INTERVIEW VIEW (Immersive)
    if (phase === 'interview') {
        return (
            <div className="fixed inset-0 z-50 bg-[#0f1115] flex flex-col font-outfit overflow-hidden">
                {/* Immersive Header */}
                <header className="bg-[#1a1d24] border-b border-gray-800 p-4 px-6 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amrita-maroon flex items-center justify-center shadow-[0_0_15px_rgba(164,18,63,0.5)]">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h2 className="font-black text-lg leading-tight flex items-center gap-2">
                                Neural Evaluator <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            </h2>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{company} • {role} • {type}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-center flex-1">
                        <div className={`px-4 py-2 rounded-full font-mono font-bold text-lg border ${timeLeft < 180 ? 'text-red-400 border-red-500/30 bg-red-500/10 animate-pulse' : 'text-amrita-gold border-amrita-gold/30 bg-amrita-gold/10'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setTtsEnabled(!ttsEnabled);
                                if (ttsEnabled) window.speechSynthesis.cancel();
                            }}
                            className={`p-2 rounded-full ${ttsEnabled ? 'bg-gray-800 text-blue-400' : 'bg-gray-800 text-gray-500'} hover:bg-gray-700 transition-colors`}
                            title="Toggle AI Voice"
                        >
                            {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                        <div className="h-6 w-px bg-gray-700"></div>
                        <button
                            onClick={endInterviewEarly}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            <PhoneOff size={16} /> End Call
                        </button>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 #1f2937' }}>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <AnimatePresence>
                            {chatHistory.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 border border-gray-700 text-amrita-gold'}`}>
                                        {msg.role === 'user' ? <span className="font-bold text-sm">YOU</span> : <Brain size={20} />}
                                    </div>
                                    <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
                                        <div className={`p-5 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-none leading-relaxed whitespace-pre-wrap'
                                            }`}>
                                            {/* Light markdown formatting support for bold text */}
                                            {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-amrita-gold'}>{text}</strong> : text)}
                                        </div>
                                        <div className={`text-[10px] text-gray-500 font-bold uppercase mt-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-amrita-gold">
                                    <Brain size={20} className="animate-pulse" />
                                </div>
                                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-[#1a1d24] border-t border-gray-800 p-4 sm:p-6 shrink-0 relative z-10">
                    <div className="max-w-4xl mx-auto flex items-end gap-3">
                        <button
                            onClick={toggleRecording}
                            disabled={loading}
                            className={`p-4 rounded-full flex-shrink-0 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>

                        <div className="flex-1 bg-gray-800 rounded-3xl border border-gray-700 focus-within:border-amrita-gold focus-within:ring-1 focus-within:ring-amrita-gold transition-all overflow-hidden relative">
                            {isRecording && (
                                <div className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center px-4">
                                    <span className="text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">Listening... Speak now</span>
                                </div>
                            )}
                            <textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder={isRecording ? "" : "Type your answer... (or use the microphone)"}
                                className={`w-full max-h-48 min-h-[56px] bg-transparent text-white placeholder-gray-500 outline-none p-4 resize-none block ${isRecording ? 'opacity-0 focus:opacity-100' : ''}`}
                                rows="1"
                                style={{
                                    height: 'auto'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={loading || !currentAnswer.trim()}
                            className="p-4 rounded-full flex-shrink-0 bg-amrita-gold text-gray-900 font-bold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:shadow-none"
                        >
                            <Send size={24} className="ml-1" />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Question {questionCount} of 5</span>
                    </div>
                </div>
            </div>
        );
    }

    // SUMMARY VIEW
    if (phase === 'summary' && finalReview) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 page-enter font-outfit mt-10">
                <div className="glass-card p-12 text-center animate-fade-in-up object-cover overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Brain size={250} />
                    </div>

                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{company} • {role} • {type}</p>
                    <h2 className="text-4xl font-black text-gray-900 mb-8 border-b pb-8">Interview Performance Report</h2>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
                        <div className="relative flex items-center justify-center shrink-0">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                                <circle
                                    cx="80" cy="80" r="70" fill="transparent"
                                    stroke={finalReview.score >= 80 ? '#10b981' : finalReview.score >= 60 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="12"
                                    strokeDasharray="439.8"
                                    strokeDashoffset={(439.8 * (100 - (finalReview.score || 0))) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={`text-5xl font-black ${finalReview.score >= 80 ? 'text-green-500' : finalReview.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {finalReview.score}
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
                            </div>
                        </div>

                        <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100 flex-1 relative z-10 max-h-80 overflow-y-auto w-full">
                            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 border-b pb-2">Final Evaluation</h3>
                            <div className="text-gray-700 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                                {finalReview.summary.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className="text-gray-900">{text}</strong> : text)}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setPhase('setup');
                            setCompany('');
                            setRole('');
                        }}
                        className="px-10 py-4 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                    >
                        Start Next Interview Target
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default AIMockInterview;
