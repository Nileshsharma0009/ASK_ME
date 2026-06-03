import React, { createContext, useState } from 'react';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
