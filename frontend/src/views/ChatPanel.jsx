import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiAlertCircle, FiActivity } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

function TypewriterText({ text, speed = 30, animate = false }) {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    if (!animate) {
      setVisibleText(text);
      return undefined;
    }

    setVisibleText('');

    if (!text) return undefined;

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, speed);

    return () => window.clearInterval(intervalId);
  }, [text, speed, animate]);

  return <p className="whitespace-pre-wrap">{visibleText}</p>;
}

export default function ChatPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState(searchParams.get('chatId') || '');
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const activeConversationId = searchParams.get('chatId') || '';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!activeConversationId) {
        setConversationId('');
        setMessages([]);
        return;
      }

      setIsLoadingConversation(true);
      try {
        const { data } = await api.get(`/chat/history/${activeConversationId}`);
        setConversationId(data.conversation.id);
        setMessages(data.conversation.messages || []);
      } catch (err) {
        setConversationId('');
        setMessages([]);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    loadConversation();
  }, [activeConversationId]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isThinking) return;

    const optimisticUserMessage = {
      _id: `temp-user-${Date.now()}`,
      sender: 'human',
      text: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const { data } = await api.post('/chat/message', {
        conversationId: conversationId || undefined,
        question: textToSend.trim(),
      });

      setConversationId(data.conversationId);
      setMessages(data.conversation.messages || []);
      setSearchParams({ chatId: data.conversationId });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          _id: `temp-error-${Date.now()}`,
          sender: 'ai',
          text: err.response?.data?.message || 'Error interacting with core medical RAG runtime framework.',
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto h-full flex flex-col justify-between gap-5 min-h-0"
    >
      {isLoadingConversation ? (
        <div className="flex-1 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-500 shadow-sm">
          Loading conversation...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
            <div className="absolute right-6 top-6 text-slate-100/60 select-none pointer-events-none">
              <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>

            <div className="w-32 h-32 bg-gradient-to-b from-primary/5 to-transparent rounded-full flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-white border border-slate-200 shadow-md rounded-full flex flex-col items-center justify-center p-3 relative">
                <div className="w-16 h-10 bg-primary rounded-2xl flex items-center justify-center gap-1.5 relative">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div className="w-1.5 h-3 bg-primary rounded-t-full mt-0.5" />
                <div className="w-4 h-4 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center mt-1">
                  <span className="text-[8px] text-primary font-black">+</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              ASK<span className="text-primary">_ME</span>
            </h3>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
              Clinical Knowledge RAG Engine
            </p>
            <div className="mb-4 rounded-2xl rounded-tl-none border border-primary/15 bg-primary/5 px-5 py-3 text-center shadow-sm">
              <p className="text-base font-bold text-slate-800">
                Hey, how can I help you today?
              </p>
            </div>
            <p className="text-sm text-slate-500 max-w-md text-center leading-relaxed mb-8 font-medium">
              Query verified hospital protocols, medical guidelines, medication policies, or therapeutic step-down actions instantly.
            </p>
{/* 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { title: 'Validated RAG', desc: 'Queries localized node documents', icon: FiMessageSquare },
                { title: 'Evidence-Based', desc: 'Strict factual semantic scanning', icon: MdShield },
                { title: 'Audit Logs', desc: 'Secure history parsing interface', icon: FiActivity },
              ].map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div key={idx} className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary mb-2.5 shadow-sm">
                      <FeatIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-0.5">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 font-bold leading-normal">{feat.desc}</p>
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 md:p-6 overflow-y-auto space-y-4 shadow-sm min-h-[300px]">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={msg._id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.sender === 'human' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 px-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'human'
                      ? 'bg-primary text-white rounded-tr-none font-medium'
                      : msg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-700 rounded-tl-none font-bold'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-medium'
                  }`}
                >
                  {msg.sender === 'ai' && !msg.isError ? (
                    <TypewriterText
                      text={msg.text}
                      animate={index === messages.length - 1 && !isThinking}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-200 p-3 px-4 rounded-2xl rounded-tl-none text-slate-500 text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="tracking-wide">Checking app DB, vector DB, similarity search, and LLM...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="space-y-4 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex items-end gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-150"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Type clinical query or medication verification ask..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent px-3 py-2.5 outline-none text-sm text-slate-800 placeholder-slate-400 font-medium resize-none max-h-[160px] min-h-[42px] leading-relaxed overflow-y-auto align-bottom"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isThinking}
            className="w-11 h-11 bg-primary hover:bg-primary-dark text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 mb-0.5 shadow-md shadow-primary/10"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">Quick Reference Starters:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'What is the ICU sedation protocol?',
              'Verify fallback steps for Medication X',
              'Post-operative therapeutic care guidelines',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 text-slate-500 hover:text-primary px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide shadow-sm transition-all duration-150"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-center justify-center gap-2 text-[11px] text-amber-700 font-bold tracking-wide">
          <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-center">
            Stored chats can be reopened from history and removed by the user whenever needed.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
