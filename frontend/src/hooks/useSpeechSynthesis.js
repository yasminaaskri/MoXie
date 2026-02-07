import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !text) return;

    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configuration par défaut avec support tunisien
    utterance.lang = options.lang || 'ar-TN'; // Arabe tunisien par défaut
    utterance.rate = options.rate || 0.8; // Plus lent pour l'arabe
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Fallback si arabe tunisien non supporté
    utterance.onerror = (event) => {
      if (event.error === 'language-not-supported') {
        // Essayer avec l'arabe standard
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
      }
    };

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
};