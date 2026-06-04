import React, { useEffect, useRef, useState, useContext } from 'react'; // Added useContext
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowUp, FiPlus, FiSquare } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ChatContext } from '../context/ChatContext'; // Imported global context bridge

/* ==========================================================================
   SUB-COMPONENT: TypingText
   Responsible for the typewriter effect when rendering a completed AI answer.
   ========================================================================== */
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

  return <p className="whitespace-pre-wrap">{visibleText}</p>;
}

/* ==========================================================================
   SUB-COMPONENT: ThinkingPulse
   The loading/waiting animation (three blinking dots) displayed during generation.
   ========================================================================== */
function ThinkingPulse() {
  return (
    <div className="flex items-center gap-1.5 py-1 text-secondary">
      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
      <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:120ms]" />
      <span className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:240ms]" />
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT: ChatPanel
   Main viewport managing state coordination, textareas, scrolling, and api calls.
   ========================================================================== */
export default function ChatPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  /* ==========================================================================
     CORE SHIFT: CONNECT TO THE GLOBAL DATA LAYER
     We replace the standalone useStates with values from the global ChatContext.
     ========================================================================== */
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
    abortControllerRef
  } = useContext(ChatContext);

  // Dynamic async loaders stay local to handle unique UI fetches independently
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const activeConversationId = searchParams.get('chatId') || '';

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isGenerating]);




  /* ==========================================================================
     FIXED: MOUNT PROTECTION LAYER
     Checks if global context holds data before running an accidental wipeout.
     ========================================================================== */
  useEffect(() => {
    const loadConversation = async () => {
      // Scenario A: No active dynamic query param exists in the URL routing track
      if (!activeConversationId) {
        // ONLY reset state if context memory is entirely empty to allow a fresh workspace
        if (messages.length === 0) {
          setConversationId('');
          setMessages([]);
          setAnimatedMessageId(null);
        }
        return;
      }

      // Scenario B: URL has an ID, but it does NOT match what is currently loaded in context memory
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

  // useEffect(() => {
  //   if (!textareaRef.current) return;
  //   textareaRef.current.style.height = 'auto';
  //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  // }, [inputMessage]);

  // useEffect(() => {
  //   const loadConversation = async () => {
  //     if (!activeConversationId) {
  //       setConversationId('');
  //       setMessages([]);
  //       setAnimatedMessageId(null);
  //       return;
  //     }

  //     setIsLoadingConversation(true);
  //     setIsGenerating(false);
  //     abortControllerRef.current = null;

  //     try {
  //       const { data } = await api.get(`/chat/history/${activeConversationId}`);
  //       setConversationId(data.conversation.id);
  //       setMessages(data.conversation.messages || []);
  //       setAnimatedMessageId(null);
  //     } catch (error) {
  //       setConversationId('');
  //       setMessages([]);
  //       setAnimatedMessageId(null);
  //     } finally {
  //       setIsLoadingConversation(false);
  //     }
  //   };

  //   loadConversation();
  // }, [activeConversationId]);

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
        }
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
            text: error.response?.data?.message || 'Unable to complete the RAG response right now.',
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
    'Summarize the ICU sedation protocol.',
    'Check the fallback steps for Medication X.',
    'What are the post-operative care guidelines?',
  ];

  return (
    /* ==========================================================================
       UI BLOCK: MAIN CONTAINER
       The outer framework pinning the full chat interface to your layout.
       ========================================================================== */
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      
      {/* UI DECORATION: Top Fade Overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-app-bg via-app-bg/80 to-transparent" />

      {/* ==========================================================================
         UI BLOCK: VIEWPORT SCROLL WRAPPER
         Contains the loading states, welcome screens, and rendering list of messages.
         ========================================================================== */
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto px-4 pb-40 pt-4 sm:px-6 lg:px-10"
      >
        {isLoadingConversation ? (
          /* ==========================================================================
             UI SUB-BLOCK: ASYNC OVERLAY LOADING SKELETON
             Shown strictly when picking an alternate conversation log from history.
             ========================================================================== */
          <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center text-sm font-semibold text-secondary">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          /* ==========================================================================
             UI BLOCK: EMPTY STATE / WELCOME HERO INTERFACE
             Displays logo graphics, headers, descriptions, and prompt buttons.
             ========================================================================== */
          <div className="mx-auto flex min-h-[75vh] w-full max-w-5xl flex-col items-center justify-center relative px-4 overflow-hidden selection:bg-primary/20">
    
    {/* SYSTEM BACKGROUND ACCENTS: Subtle high-tech background matrix structure */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
    
    {/* SYSTEM BACKGROUND ACCENTS: Ambient layout illumination soft blur core glow */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-primary/8 rounded-full blur-[80px] pointer-events-none -z-10 animate-[pulse_6s_ease-in-out_infinite]" />

    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl flex flex-col items-center"
    >
      {/* HERO DECORATION: Outer Radial Graphic Border Wrapper with layered structural rings */}
      <div className="relative mb-10">
        {/* Pulsing deep shadow background ring layer */}
        <div className="absolute inset-0 rounded-[32px] bg-primary/20 blur-xl scale-95 animate-pulse" />
        
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-card-bg border border-border-default shadow-card ring-4 ring-primary/5"
        >
          {/* HERO DECORATION: Brand Avatar Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-brand-gradient text-xl font-black text-white shadow-xl shadow-primary/30 ring-1 ring-white/20 transform-gpu transition-transform duration-300 hover:rotate-3">
            A
          </div>
        </motion.div>
      </div>

      {/* HERO TYPOGRAPHY: Primary Title Branding Heading */}
      <h1 className="text-5xl font-black tracking-tight text-heading sm:text-6xl text-center font-sans">
        ASK<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-primary-muted">_ME</span>
      </h1>
      
      {/* HERO TYPOGRAPHY: Subtitle Description */}
      <p className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-[16px] font-medium leading-8 text-secondary text-center tracking-normal">
        Ask long-form clinical questions, reopen history, and work in a full-page conversation flow without the chat feeling trapped inside a card.
      </p>

      {/* HORIZONTAL RULE: Elegant structural separator separating body layout from triggers */}
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-border-default to-transparent mt-8 mb-4" />

      {/* HERO QUICK CALL TO ACTIONS: Central Suggestion Chip Grid Layout with Premium Micro-Springs */}
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
          /* ==========================================================================
             UI BLOCK: CORE CHAT FEED MESSAGES LIST
             Iterates through all mapped array records generating user or system bubbles.
             ========================================================================== */
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 pb-10">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'human';
              const isError = Boolean(msg.isError);
              const isPending = Boolean(msg.isPending);
              const isStopped = Boolean(msg.isStopped);

              return (
                /* Motion Layout Frame aligning structural alignments */
                <motion.div
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Sizing box limiting maximum inner content boundaries */}
                  <div className={`w-full ${isUser ? 'max-w-3xl' : 'max-w-4xl'}`}>
                    
                    {/* UI METADATA PANEL: Assistant Title Headings Bar (Skipped for User) */}
                    {!isUser && (
                      <div className="mb-3 flex items-center gap-3">
                        {/* Assistant Avatar Badge */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-white shadow-md shadow-primary/20">
                          A
                        </div>
                        {/* Meta Labels Text Container */}
                        <div>
                          <p className="text-sm font-bold text-heading">ASK_ME</p>
                          <p className="text-xs font-medium text-secondary">
                            {isPending ? 'Generating response' : isStopped ? 'Stopped' : 'Clinical assistant'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ==========================================================================
                       UI COMPONENT BLOCK: INDIVIDUAL MESSAGE BUBBLE SKINS
                       Applies styling variations based on system states (User, Pending, AI, or Error).
                       ========================================================================== */}
                    <div
                      className={`relative ${
                        isUser
                          ? 'ml-auto rounded-[28px] rounded-br-lg bg-slate-900 px-5 py-4 text-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.65)]'
                          : isError
                          ? 'rounded-[30px] rounded-tl-lg border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700'
                          : 'px-1 py-0 text-body'
                      }`}
                    >
                      {/* BUBBLE CONDITION 1: Pending Generator Loader */}
                      {isPending ? (
                        <ThinkingPulse />
                      ) : isUser ? (
                        /* BUBBLE CONDITION 2: User Prompt Text Frame */
                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-7">{msg.text}</p>
                      ) : isError ? (
                        /* BUBBLE CONDITION 3: System Pipeline Error Alert Skin */
                        <p className="whitespace-pre-wrap text-[15px] font-semibold leading-7">{msg.text}</p>
                      ) : (
                        /* BUBBLE CONDITION 4: Standard AI Response Text Area with streaming */
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
}
      {/* UI DECORATION: Bottom Gradient Overlay mask */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-app-bg via-app-bg/95 to-transparent" />

      {/* ==========================================================================
         UI BLOCK: FIXED DECK INPUT CONSOLE STRIP
         Pins the active submission form elements securely above the viewport mask.
         ========================================================================== */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          {/* Main Action Input Panel Structure */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="rounded-[32px] border border-border-default bg-card-bg/95 p-3 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          >
            {/* INPUT ROWS BLOCK: Text Box and Peripheral Action Buttons */}
            <div className="flex items-end gap-3">
              
              {/* INPUT ELEMENT: Attachment / Tool Feature Button Trigger */}
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-default bg-app-bg text-secondary transition-colors hover:border-border-default hover:bg-card-bg hover:text-heading"
                aria-label="New chat tools"
              >
                <FiPlus className="h-4 w-4" />
              </button>

              {/* INPUT ELEMENT: Autogrow Dynamic Input Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message ASK_ME"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-52 min-h-[14px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-3 text-[15px] leading-7 text-heading outline-none placeholder:text-placeholder"
              />

              {/* INPUT ELEMENT: Unified State Action Button (Submit Command vs Abort Generation) */}
              <button
                type={isGenerating ? 'button' : 'submit'}
                onClick={isGenerating ? stopGeneration : undefined}
                disabled={!isGenerating && !inputMessage.trim()}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-all ${
                  isGenerating
                    ? 'bg-heading hover:opacity-90'
                    : 'bg-primary shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40'
                }`}
                aria-label={isGenerating ? 'Stop response' : 'Send message'}
              >
                {isGenerating ? <FiSquare className="h-4 w-4 fill-current" /> : <FiArrowUp className="h-4 w-4" />}
              </button>
            </div>

            {/* ==========================================================================
               UI SUB-BLOCK: CONSOLE FOOTER TOOLS BAR
               Houses inline chip buttons and active operational warning status notes.
               ========================================================================== */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-1 pt-3">
              
              {/* FOOTER CONTROLS: Quick Action Inline Suggestion Chips List */}
              {/* <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-full bg-app-bg px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    {prompt}
                  </button>
                ))}
              </div> */}

              {/* FOOTER INFOBAR: Operational Keyboard Hints and Engine Warnings */}
              <div className="flex items-center gap-2 text-[11px] font-semibold text-secondary">
                <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{isGenerating ? 'Generating. Press Stop to cancel this answer.' : 'Enter to send. Shift + Enter for a new line.'}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}