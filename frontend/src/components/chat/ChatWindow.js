import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow(){
  const [messages, setMessages] = useState([
    { id: '1', userId: 'u1', text: 'Bonjour, bienvenue sur la plateforme TILI.', time: '09:00' },
    { id: '2', userId: 'u2', text: 'Merci ! Comment puis-je créer un projet ?', time: '09:02' }
  ]);

  const handleSend = (text) => {
    const next = { id: Date.now().toString(), userId: 'u1', text, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    setMessages(prev => [...prev, next]);
  };

  return (
    <div className="chat-window">
      <ChatHeader title="TILI — Chat interne" subtitle="Equipe — Général" />
      <MessageList messages={messages} currentUserId={'u1'} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
