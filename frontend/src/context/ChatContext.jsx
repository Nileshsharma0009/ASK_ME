// frontend/src/context/ChatContext.jsx
import React, { createContext, useState, useRef } from 'react';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  // Core Data Persistent States
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  
  // Dynamic UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState(null);
  
  // FIXED: Shared Global Compliance Gateway State
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);

  // Network Abort Controller tracking reference
  const abortControllerRef = useRef(null);

  return (
    <ChatContext.Provider
      value={{
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
        isComplianceOpen,     // ◄ Exposed to components
        setIsComplianceOpen,  // ◄ Exposed to components
        abortControllerRef
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}