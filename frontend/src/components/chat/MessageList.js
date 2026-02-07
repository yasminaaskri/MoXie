import React from 'react';

function Message({ m, mine }){
  return (
    <div className={"message " + (mine ? 'mine' : 'their')}>
      <div className="message-bubble">
        <div className="message-text">{m.text}</div>
        <div className="message-meta">{m.time}</div>
      </div>
    </div>
  );
}

export default function MessageList({ messages, currentUserId }){
  return (
    <div className="message-list">
      {messages.map(m => (
        <Message key={m.id} m={m} mine={m.userId === currentUserId} />
      ))}
    </div>
  );
}
