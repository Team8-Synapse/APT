import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Sparkles, Zap, Maximize2, Minimize2 } from 'lucide-react';

const AIChatbot = ({ initialContext = null, initialSourceName = null, initialSummary = null }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Namaste! I am your AI PrepHub Assistant. How can I help you prepare for your placement journey today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [context, setContext] = useState(initialContext);
    const [sourceName, setSourceName] = useState(initialSourceName);
    const [isMaximized, setIsMaximized] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Handle incoming context updates from parent (PrepHub)
    useEffect(() => {
        if (initialContext) {
            setContext(initialContext);
            setSourceName(initialSourceName);
            if (initialSummary) {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: `📄 Summary of "${initialSourceName}":\n\n${initialSummary}\n\nYou can now ask me questions about this material!` 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: `I've loaded the contents of "${initialSourceName}". You can ask me questions about it or ask for a summary!` 
                }]);
            }
        }
    }, [initialContext, initialSourceName, initialSummary]);

    // Lock body scroll when maximized
    useEffect(() => {
        if (isMaximized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMaximized]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/chat`, { 
                message: input,
                context: context,
                sourceName: sourceName
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Neural connection lost. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    const clearContext = () => {
        setContext(null);
        setSourceName(null);
        setMessages(prev => [...prev, { role: 'assistant', content: "Context cleared. I'm now back to general mode." }]);
    }

    const chatContent = (
        <div className={`flex flex-col bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 overflow-hidden shadow-inner font-bold ${isMaximized ? 'h-full' : 'h-full'}`}>
            {/* Header bar with title and maximize/minimize toggle */}
            <div className="px-4 py-2.5 bg-amrita-maroon/10 border-b border-white/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-amrita-maroon" />
                    <span className="text-[10px] text-amrita-maroon uppercase tracking-wider font-black">AI Assistant</span>
                </div>
                <button
                    onClick={() => setIsMaximized(prev => !prev)}
                    className="p-1.5 hover:bg-amrita-maroon/10 rounded-lg transition-all text-amrita-maroon"
                    title={isMaximized ? 'Restore' : 'Maximize'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>

            {sourceName && (
                <div className="px-4 py-2 bg-amrita-gold/10 border-b border-white/40 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Zap size={10} className="text-amrita-maroon" />
                        <span className="text-[10px] text-amrita-maroon uppercase tracking-wider line-clamp-1">Focusing on: {sourceName}</span>
                    </div>
                    <button onClick={clearContext} className="text-[8px] bg-white/60 px-2 py-0.5 rounded border border-white hover:bg-white transition-colors">CLEAR</button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`${isMaximized ? 'max-w-[60%]' : 'max-w-[85%]'} p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-amrita-maroon text-white rounded-tr-none'
                            : 'bg-white/80 text-gray-800 rounded-tl-none border border-white'
                            }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-[8px] uppercase tracking-widest font-black">
                                {m.role === 'user' ? <User size={8} /> : <Bot size={8} />}
                                {m.role === 'user' ? 'Candidate' : 'Neural Advisor'}
                            </div>
                            <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white/50 p-4 rounded-2xl rounded-tl-none">
                            <Zap className="text-amrita-gold animate-spin" size={12} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white/40 border-t border-white/60">
                <div className="relative group">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={sourceName ? `Ask about ${sourceName}...` : "Ask about companies, prep strategies..."}
                        className="w-full p-4 pr-14 bg-white/90 border border-transparent rounded-2xl text-xs font-bold focus:ring-2 focus:ring-amrita-maroon outline-none transition-all placeholder:text-gray-400 group-hover:bg-white"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-amrita-maroon text-amrita-gold rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="flex justify-center mt-3 gap-4">
                    <p className="text-[8px] text-amrita-maroon/40 italic uppercase tracking-widest flex items-center gap-1">
                        <Sparkles size={8} /> Powered by Amrita AI (Gemini)
                    </p>
                </div>
            </form>
        </div>
    );

    // When maximized, render as a fixed full-screen overlay
    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 lg:p-8" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <div className="w-full h-full max-w-4xl max-h-full flex flex-col" style={{ animation: 'scaleIn 0.2s ease-out' }}>
                    {chatContent}
                </div>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                `}</style>
            </div>
        );
    }

    return chatContent;
};

export default AIChatbot;
