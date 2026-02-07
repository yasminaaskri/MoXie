import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import '../styles/chat.css';

export default function Chat(){
  return (
    <div style={{maxWidth:960,margin:'2rem auto'}}>
      <ChatWindow />
    </div>
  );
}
