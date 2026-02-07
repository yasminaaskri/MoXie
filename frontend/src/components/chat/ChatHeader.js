import React from 'react';

export default function ChatHeader({ title, subtitle }){
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="chat-avatar">T</div>
        <div>
          <div className="chat-title">{title}</div>
          <div className="chat-subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="chat-header-actions">
        <button className="btn small">Nouvel</button>
      </div>
    </div>
  );
}
