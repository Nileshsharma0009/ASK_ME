// frontend/src/components/ChatPanel.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowUp, FiPlus, FiSquare } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext'; // ◄ FIXED: Import AuthContext here
import ComplianceModal from '../components/Chat/ComplianceModal';
import ReactMarkdown from 'react-markdown';

function TypingText({ text, animate = false, speed = 12 }) {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    if (!animate) {
      setVisibleText(text);
      return undefined;
    }

    setVisibleText('');
    if (!text) return undefined;

    let index = 0;
    const timeoutId = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timeoutId);
      }
    }, speed);

    return () => window.clearInterval(timeoutId);
  }, [text, animate, speed]);

  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => <p className="mb-3 leading-7 text-body" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-heading" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-body" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1 text-body" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-body" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-heading" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2 text-heading" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-2 mb-1 text-heading" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/40 pl-4 italic my-3 text-secondary" {...props} />,
        code: ({ node, inline, ...props }) =>
          inline
            ? <code className="bg-border-default/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />
            : <pre className="bg-border-default/20 p-4 rounded-xl overflow-x-auto my-3 font-mono text-sm border border-border-default"><code {...props} /></pre>
      }}
    >
      {visibleText}
    </ReactMarkdown>
  );
}

function ThinkingPulse() {
  return (
    <div className="flex items-center gap-1.5 py-1 text-secondary">
      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
      <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:120ms]" />
      <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:240ms]" />
    </div>
  );
}

export default function ChatPanel() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ◄ FIXED: Consume AuthContext directly right here to fix the 'auth is not defined' crash
  const auth = useContext(AuthContext);

  const {
    messages,
    setMessages,
    conversationId,
    setConversationId,
    inputMessage,
    setInputMessage,
    isGenerating,
    setIsGenerating,
    animatedMessageId,
    setAnimatedMessageId,
    isComplianceOpen,
    setIsComplianceOpen,
    abortControllerRef
  } = useContext(ChatContext);

  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const activeConversationId = searchParams.get('chatId') || '';

  // 1. Core Scroll Vector Management Track
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isGenerating]);

  // 2. MOUNT PROTECTION LAYER
  useEffect(() => {
    const loadConversation = async () => {
      if (!activeConversationId) {
        if (messages.length === 0) {
          setConversationId('');
          setMessages([]);
          setAnimatedMessageId(null);
        }
        return;
      }

      if (activeConversationId !== conversationId) {
        setIsLoadingConversation(true);
        setIsGenerating(false);
        abortControllerRef.current = null;

        try {
          const { data } = await api.get(`/chat/history/${activeConversationId}`);
          setConversationId(data.conversation.id);
          setMessages(data.conversation.messages || []);
          setAnimatedMessageId(null);
        } catch (error) {
          setConversationId('');
          setMessages([]);
          setAnimatedMessageId(null);
        } finally {
          setIsLoadingConversation(false);
        }
      }
    };

    loadConversation();
  }, [activeConversationId, conversationId, messages.length]);

  // 3. FIXED CRITICAL SESSION GATEWAY HOOK
  useEffect(() => {
    // Safely reads from your real database token structure now
    const userHasPermanentlyMuted = auth?.user?.hasMutedCompliance === true;
    const isAcknowledgedThisSession = sessionStorage.getItem('VANI_session_compliance_viewed') === 'true';

    if (userHasPermanentlyMuted) {
      setIsComplianceOpen(false);
    } else if (!isAcknowledgedThisSession) {
      setIsComplianceOpen(true);
    }
  }, [setIsComplianceOpen, activeConversationId, messages.length, auth?.user?.hasMutedCompliance]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsGenerating(false);
    setAnimatedMessageId(null);

    setMessages((prev) => {
      const next = [...prev];
      if (next[next.length - 1]?.isPending) {
        next[next.length - 1] = {
          ...next[next.length - 1],
          text: 'Response stopped.',
          isPending: false,
          isStopped: true,
        };
      }
      return next;
    });
  };

  const handleSendMessage = async (textToSend) => {
    const prompt = textToSend.trim();
    if (!prompt) return;

    if (isGenerating) {
      stopGeneration();
    }

    const userMessageId = `temp-user-${Date.now()}`;
    const assistantMessageId = `temp-ai-${Date.now()}`;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAnimatedMessageId(null);
    setInputMessage('');
    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      {
        _id: userMessageId,
        sender: 'human',
        text: prompt,
        createdAt: new Date().toISOString(),
      },
      {
        _id: assistantMessageId,
        sender: 'ai',
        text: '',
        isPending: true,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const { data } = await api.post(
        '/chat/message',
        {
          conversationId: conversationId || undefined,
          question: prompt,
        },
        {
          signal: controller.signal,
        }
      );

      const responseMessages = data.conversation.messages || [];
      const latestAiMessage = [...responseMessages].reverse().find(
        (message) => message.sender === 'ai' && !message.isError
      );

      setConversationId(data.conversationId);
      setMessages(responseMessages);
      setAnimatedMessageId(latestAiMessage?._id || null);
      setSearchParams({ chatId: data.conversationId });
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return;
      }

      setMessages((prev) => {
        const next = prev.filter((message) => !message.isPending);
        return [
          ...next,
          {
            _id: `temp-error-${Date.now()}`,
            sender: 'ai',
            text: error.response?.data?.message || 'Unable to complete the  response right now try again after some time.',
            isError: true,
          },
        ];
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

const quickPrompts = [
  'Which doctor should I consult for my symptoms?',
  'How can I book an appointment?',
  'What are the MRI and CT scan charges?',
  'Where can I collect my reports?',
  'What tests require fasting before sample collection?',
  'How do I get admitted to the hospital?',
];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">



      {/* VIEWPORT SCROLL WRAPPER (Locks clicks and blurs if modal is active) */}
      <div
        ref={scrollContainerRef}
        className={`relative flex-1 overflow-y-auto px-4 pb-40 pt-4 sm:px-6 lg:px-10 transition-all duration-300 ${isComplianceOpen ? 'blur-sm pointer-events-none filter select-none opacity-40' : 'blur-0 opacity-100'
          }`}
      >
        {isLoadingConversation ? (
          <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center text-sm font-semibold text-secondary">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="mx-auto flex min-h-[75vh] w-full max-w-5xl flex-col items-center justify-center relative px-4 overflow-hidden selection:bg-primary/20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-primary/8 rounded-full blur-[80px] pointer-events-none -z-10 animate-[pulse_6s_ease-in-out_infinite]" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] opacity-[0.035] pointer-events-none select-none -z-20 mix-blend-luminosity">
              <img src="/logo.png" alt="" className="w-full h-full object-contain animate-[spin_120s_linear_infinite]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl flex flex-col items-center relative z-10"
            >
              <div className="relative mb-10">
                <div className="absolute inset-0 rounded-[32px] bg-primary/20 blur-xl scale-95 animate-pulse" />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-card-bg border border-border-default shadow-card ring-4 ring-primary/5 overflow-hidden"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-[24px] overflow-hidden bg-white shadow-xl shadow-primary/30 ring-1 ring-white/20 transform-gpu transition-transform duration-300 hover:rotate-3">
                    <img src="/logo2.png" alt="Hospital Logo Badge" className="w-full h-full object-cover scale-120 -m-2 select-none pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              <h1 className="text-5xl font-black tracking-tight text-heading sm:text-6xl text-center font-sans">
                VA<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-primary-muted">NI</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-[16px] font-medium leading-8 text-secondary text-center tracking-normal">
  Hey! I'm your AI hospital assistant, here to help with appointments, doctors, lab tests, reports, hospital support, and healthcare services.
</p>

              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-border-default to-transparent mt-8 mb-4" />

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5 max-w-2xl">
                {quickPrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    type="button"
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-2xl border border-border-default/80 bg-card-bg/70 backdrop-blur-sm px-5 py-3 text-sm font-bold text-body shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-gradient-to-br hover:from-card-bg hover:to-primary/5 hover:text-primary hover:shadow-md hover:shadow-primary/5 cursor-pointer text-left sm:text-center"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-10">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'human';
              const isError = Boolean(msg.isError);
              const isPending = Boolean(msg.isPending);
              const isStopped = Boolean(msg.isStopped);

              return (
                <motion.div
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`w-full ${isUser ? 'max-w-3xl' : 'max-w-4xl'}`}>
                    {!isUser && (
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-white shadow-md shadow-primary/20 overflow-hidden">
                          <img src="/logo.png" alt="AI" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-heading">VANI</p>
                          <p className="text-xs font-medium text-secondary">
                            {isPending ? ' Reviewing your query' : isStopped ? 'Stopped' : 'Clinical assistant'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative ${isUser
                          ? 'ml-auto rounded-[28px] rounded-br-lg bg-black px-5 py-4 text-white shadow-sm'
                          : isError
                            ? 'rounded-[30px] rounded-tl-lg border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700'
                            : 'px-1 py-0 text-body'
                        }`}
                    >
                      {isPending ? (
                        <ThinkingPulse />
                      ) : isUser ? (
                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-7">{msg.text}</p>
                      ) : isError ? (
                        <p className="whitespace-pre-wrap text-[15px] font-semibold leading-7">{msg.text}</p>
                      ) : (
                        <div className="text-[15px] leading-8 text-body">
                          <TypingText text={msg.text} animate={msg._id === animatedMessageId} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>



      {/* FIXED FOOTER CONTROL INPUT CONSOLE STRIP */}
      <div className={`absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 lg:px-10 z-20 transition-all duration-300 ${isComplianceOpen ? 'opacity-20 pointer-events-none scale-98' : 'opacity-100 scale-100'
        }`}>
        <div className="mx-auto w-full max-w-4xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="rounded-[32px] border border-border-default bg-card-bg/95 p-3 bg-card-bg "
          >
            <div className="flex items-end gap-3">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-default bg-app-bg text-secondary transition-colors hover:border-border-default hover:bg-card-bg hover:text-heading"
                aria-label="New chat tools"
              >
                <FiPlus className="h-4 w-4" />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message VANI"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-52 min-h-[10px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-3 text-[15px] leading-7 text-heading outline-none placeholder:text-placeholder"
              />

              <button
                type={isGenerating ? 'button' : 'submit'}
                onClick={isGenerating ? stopGeneration : undefined}
                disabled={!isGenerating && !inputMessage.trim()}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-all ${isGenerating
                    ? 'bg-heading hover:opacity-90'
                    : 'bg-primary shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40'
                  }`}
                aria-label={isGenerating ? 'Stop response' : 'Send message'}
              >
                {isGenerating ? <FiSquare className="h-4 w-4 fill-current" /> : <FiArrowUp className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-1 pt-3">
              <div className="flex items-center justify-center text-center gap-2 text-[11px] font-semibold text-secondary w-full px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl">
                  <FiAlertCircle className="h-3.5 w-3.5 shrink-0 text-error/70" />
                  <span>
                    {isGenerating
                      ? 'Generating. Press Stop to cancel this answer.'
                      : 'Vani cannot provide diagnosis or medical treatment advice.'}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* COMPLIANCE TERMS PORTAL */}
      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

    </div>
  );
}