import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { Send, User, Bot, Sparkles, Zap, Minimize2, Maximize2 } from 'lucide-react';

const AIChatbot = ({ initialContext = null, initialSourceName = null, initialSummary = null }) => {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: user?.role === 'admin' ? "Greetings Admin! Ready to assist with placement insights and logistics." : "Namaste! I am your AI Career Advisor. How can I help you navigate your placement journey today?" }
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

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/chat`, {
                message: input,
                context: context,
                sourceName: sourceName
            }, config);

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            console.error(err);
            const serverMsg = err.response?.data?.error || 'Neural connection lost. Please try again.';
            setMessages(prev => [...prev, { role: 'assistant', content: serverMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const formatMessage = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => {
            if (!line.trim()) return <div key={i} className="h-1"></div>;
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <p key={i} className="mb-1.5 last:mb-0">
                    {parts.map((part, index) => {
                        if (index % 2 === 1) {
                            return <strong key={index} className="font-extrabold text-[#8A0F3C]">{part}</strong>;
                        }
                        const italicParts = part.split(/\*(.*?)\*/g);
                        if (italicParts.length > 1) {
                            return italicParts.map((ip, iIdx) => (
                                iIdx % 2 === 1 ? <em key={iIdx}>{ip}</em> : ip
                            ));
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    const clearContext = () => {
        setContext(null);
        setSourceName(null);
        setMessages(prev => [...prev, { role: 'assistant', content: "Context cleared. I'm now back to general mode." }]);
    }

    return (
        <div className={`flex flex-col bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 overflow-hidden shadow-inner font-bold transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50 h-auto' : 'h-full'}`}>
            {/* Header with maximize toggle */}
            <div className="px-4 py-2 bg-amrita-maroon/5 border-b border-white/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-amrita-maroon" />
                    <span className="text-[10px] text-amrita-maroon uppercase tracking-wider font-black">AI Advisor</span>
                </div>
                <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1.5 hover:bg-amrita-maroon/10 rounded-lg transition-all text-amrita-maroon"
                    title={isMaximized ? 'Minimize' : 'Maximize'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>
            {sourceName && (
                <div className="px-4 py-2 bg-amrita-maroon/10 border-b border-white/40 flex justify-between items-center">
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
                        <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-amrita-maroon text-white rounded-tr-none'
                            : 'bg-white/90 text-gray-800 rounded-tl-none border border-white/50 shadow-md'
                            }`}>
                            <div className="flex items-center gap-2 mb-2 opacity-60 text-[9px] uppercase tracking-widest font-black border-b border-black/10 pb-1 w-max">
                                {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                                {m.role === 'user' ? 'Candidate' : 'Neural Advisor'}
                            </div>
                            <div className="whitespace-pre-wrap font-medium">
                                {m.role === 'user' ? m.content : formatMessage(m.content)}
                            </div>
                        </div >
                    </div >
                ))}
                {
                    loading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-white/50 p-4 rounded-2xl rounded-tl-none">
                                <Zap className="text-amrita-gold animate-spin" size={12} />
                            </div>
                        </div>
                    )
                }
                <div ref={messagesEndRef} />
            </div >

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
        </div >
    );
};

export default AIChatbot;
