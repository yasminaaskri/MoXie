import React, { useState } from 'react';

export default function MessageInput({ onSend }){
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form className="message-input" onSubmit={submit}>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Écrire un message..." />
      <button type="submit" className="btn">Envoyer</button>
    </form>
  );
}
