import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowUp, FiPlus, FiSquare } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

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
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(searchParams.get('chatId') || '');
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState(null);

  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const activeConversationId = searchParams.get('chatId') || '';

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [inputMessage]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!activeConversationId) {
        setConversationId('');
        setMessages([]);
        setAnimatedMessageId(null);
        return;
      }

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
    };

    loadConversation();
  }, [activeConversationId]);

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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-app-bg via-app-bg/80 to-transparent" />

      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto px-4 pb-40 pt-4 sm:px-6 lg:px-10"
      >
        {isLoadingConversation ? (
          <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center text-sm font-semibold text-secondary">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_top,#ffffff,rgba(255,255,255,0.7)_35%,rgba(108,77,255,0.12)_100%)] shadow-[0_24px_60px_-28px_rgba(108,77,255,0.45)] ring-1 ring-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-brand-gradient text-lg font-black text-white shadow-lg shadow-primary/20">
                  A
                </div>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-heading sm:text-5xl">
                ASK<span className="text-primary">_ME</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
                Ask long-form clinical questions, reopen history, and work in a full-page conversation flow without the chat feeling trapped inside a card.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-full border border-border-default bg-card-bg/90 px-4 py-2.5 text-sm font-semibold text-body shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    {prompt}
                  </button>
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-white shadow-md shadow-primary/20">
                          A
                        </div>
                        <div>
                          <p className="text-sm font-bold text-heading">ASK_ME</p>
                          <p className="text-xs font-medium text-secondary">
                            {isPending ? 'Generating response' : isStopped ? 'Stopped' : 'Clinical assistant'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative ${
                        isUser
                          ? 'ml-auto rounded-[28px] rounded-br-lg bg-slate-900 px-5 py-4 text-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.65)]'
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-app-bg via-app-bg/95 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="rounded-[32px] border border-border-default bg-card-bg/95 p-3 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl"
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
                placeholder="Message ASK_ME"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="max-h-52 min-h-[14px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-3 text-[15px] leading-7 text-heading outline-none placeholder:text-placeholder"
              />

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

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-1 pt-3">
              <div className="flex flex-wrap gap-2">
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
              </div>

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
