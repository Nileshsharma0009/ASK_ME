import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiAlertCircle } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'human', text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      // === BACKEND (later) ===
      // const { data } = await api.post('/chat/query', { question: textToSend });
      // setMessages((prev) => [...prev, { sender: 'ai', text: data.response, references: data.references }]);

      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Kendra Hospital clinical criteria verified. ICU Sedation guidelines require continuous monitoring of parameters.',
            timestamp: new Date(),
          },
        ]);
      }, 1200);
    } catch {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error interacting with core RAG runtime framework.', isError: true },
      ]);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto h-full flex flex-col justify-between gap-6 min-h-0"
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-full bg-card-bg border border-border-default rounded-card p-8 shadow-card relative overflow-hidden flex flex-col items-center">
            <div className="absolute right-6 top-6 text-primary/[0.03] select-none pointer-events-none">
              <svg width="120" height="120" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>

            <div className="w-40 h-40 bg-gradient-to-b from-primary/5 to-transparent rounded-full flex items-center justify-center mb-4">
              <div className="w-28 h-28 bg-white border border-border-default/80 shadow-card rounded-full flex flex-col items-center justify-center p-4 relative">
                <div className="w-20 h-12 bg-primary rounded-3xl flex items-center justify-center gap-2 relative">
                  <span className="w-3 h-3 bg-cyan-300 rounded-full animate-pulse" />
                  <span className="w-3 h-3 bg-cyan-300 rounded-full animate-pulse" />
                  <div className="absolute bottom-2 w-8 h-1 bg-white rounded-full opacity-60" />
                </div>
                <div className="w-1.5 h-4 bg-primary rounded-t-full mt-1" />
                <div className="w-4 h-4 bg-primary/20 rounded-full border border-primary/40 flex items-center justify-center mt-1">
                  <span className="text-[8px] text-primary font-bold">+</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-heading mb-1.5">
              I am <span className="text-primary">ASK_ME</span>
            </h3>
            <p className="text-sm font-bold text-secondary tracking-wide mb-2">
              Your AI Assistant for Healthcare.
            </p>
            <p className="text-xs text-secondary/80 max-w-md text-center leading-relaxed mb-8">
              Ask me anything about protocols, procedures, medications, policies, or medical
              guidelines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {[
                { title: 'Hospital RAG', desc: 'Search hospital knowledge base', icon: FiMessageSquare },
                { title: 'Smart Answers', desc: 'Get accurate, evidence-based responses', icon: MdShield },
                { title: 'Global Fallback', desc: 'Powered by global medical knowledge', icon: FiAlertCircle },
              ].map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-border-default/60 rounded-xl p-4 flex flex-col items-center text-center shadow-inner"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-border-default/80 flex items-center justify-center text-primary mb-2.5 shadow-sm">
                      <FeatIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-heading mb-0.5">{feat.title}</h4>
                    <p className="text-[11px] text-secondary font-medium leading-normal">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-card-bg rounded-card border border-border-default p-4 md:p-6 overflow-y-auto space-y-4 shadow-sm min-h-[360px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'human' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-bubble shadow-sm text-sm leading-relaxed ${
                  msg.sender === 'human'
                    ? 'bg-primary text-white rounded-tr-none font-semibold'
                    : 'bg-slate-50 border border-border-default text-body rounded-tl-none font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-border-default p-4 rounded-bubble rounded-tl-none text-secondary text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Running vector verification scan...</span>
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
          className="flex items-center gap-2 bg-card-bg p-2 rounded-xl border border-border-default shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-150"
        >
          <input
            type="text"
            placeholder="Ask your question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-body placeholder-placeholder font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-11 h-11 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-card disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-2">
          <p className="text-xs font-bold text-secondary tracking-wide">Example questions you can ask:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'What is the ICU sedation protocol?',
              'Fallback procedure for Medication X?',
              'Post-operative care guidelines',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="bg-white border border-border-default/80 hover:border-primary hover:bg-primary-light/40 text-secondary hover:text-primary px-4 py-2 rounded-xl text-xs font-semibold tracking-wide shadow-sm transition-all duration-150"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 flex items-center justify-center gap-2 text-[11px] text-amber-700 font-semibold tracking-wide shadow-inner">
          <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Responses are for informational purposes only. Always follow hospital policies.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
