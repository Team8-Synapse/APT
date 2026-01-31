import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Sparkles, Zap } from 'lucide-react';

const AIChatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Namaste! I am your AI Career Advisor. How can I help you navigate your placement journey today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/ai/chat`, { message: input });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Neural connection lost. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 overflow-hidden shadow-inner font-bold">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-amrita-maroon text-white rounded-tr-none'
                            : 'bg-white/80 text-gray-800 rounded-tl-none border border-white'
                            }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-[8px] uppercase tracking-widest font-black">
                                {m.role === 'user' ? <User size={8} /> : <Bot size={8} />}
                                {m.role === 'user' ? 'Candidate' : 'Neural Advisor'}
                            </div>
                            {m.content}
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
                        placeholder="Ask about companies, prep strategies..."
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
                        <Sparkles size={8} /> Powered by Amrita AI
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AIChatbot;
