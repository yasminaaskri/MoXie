import { useCallback, useRef, useState, useEffect } from 'react';

// Contexte audio global (créé après interaction utilisateur)
let globalAudioContext = null;

// Initialiser le contexte audio après interaction utilisateur
const initAudioContext = () => {
  if (!globalAudioContext) {
    try {
      globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('✅ AudioContext initialisé');
    } catch (error) {
      console.warn('❌ Impossible de créer AudioContext:', error);
    }
  }
  
  // Reprendre le contexte s'il est suspendu
  if (globalAudioContext && globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().then(() => {
      console.log('✅ AudioContext repris');
    });
  }
  
  return globalAudioContext;
};

// Sons de feedback (utilisant Web Audio API)
const createBeep = (frequency, duration, type = 'sine') => {
  const audioContext = initAudioContext();
  
  if (!audioContext) {
    console.warn('AudioContext non disponible');
    return;
  }

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Erreur création son:', error);
  }
};

export const useAudioFeedback = () => {
  const synthRef = useRef(window.speechSynthesis);
  const isSpeakingRef = useRef(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Initialiser l'audio au premier clic
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isAudioReady) {
        initAudioContext();
        setIsAudioReady(true);
        console.log('🎵 Audio prêt après interaction utilisateur');
      }
    };

    // Écouter le premier clic ou toucher
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isAudioReady]);

  // Sons de feedback
  const sounds = {
    click: () => createBeep(800, 0.1),
    success: () => {
      createBeep(523, 0.1); // Do
      setTimeout(() => createBeep(659, 0.1), 100); // Mi
      setTimeout(() => createBeep(784, 0.15), 200); // Sol
    },
    error: () => {
      createBeep(400, 0.15);
      setTimeout(() => createBeep(350, 0.15), 150);
    },
    warning: () => {
      createBeep(600, 0.1);
      setTimeout(() => createBeep(600, 0.1), 150);
    },
    navigation: () => createBeep(1000, 0.08),
    focus: () => createBeep(1200, 0.05),
  };

  // Parler avec synthèse vocale
  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current || isSpeakingRef.current) return;

    // Annuler toute parole en cours
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'fr-FR';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.8;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    synthRef.current.speak(utterance);
  }, []);

  // Arrêter la parole
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      isSpeakingRef.current = false;
    }
  }, []);

  // Feedback pour les actions
  const playSound = useCallback((soundType) => {
    try {
      if (sounds[soundType]) {
        sounds[soundType]();
      }
    } catch (error) {
      console.warn('Erreur lecture son:', error);
    }
  }, []);

  // Annoncer une action
  const announce = useCallback((message, soundType = null) => {
    if (soundType) {
      playSound(soundType);
    }
    speak(message);
  }, [speak, playSound]);

  // Feedback pour navigation
  const announceNavigation = useCallback((pageName) => {
    playSound('navigation');
    speak(`Navigation vers ${pageName}`);
  }, [speak, playSound]);

  // Feedback pour succès
  const announceSuccess = useCallback((message) => {
    playSound('success');
    speak(message);
  }, [speak, playSound]);

  // Feedback pour erreur
  const announceError = useCallback((message) => {
    playSound('error');
    speak(message);
  }, [speak, playSound]);

  // Feedback pour avertissement
  const announceWarning = useCallback((message) => {
    playSound('warning');
    speak(message);
  }, [speak, playSound]);

  // Décrire un élément visuel
  const describeElement = useCallback((description) => {
    speak(description, { rate: 0.9 });
  }, [speak]);

  return {
    speak,
    stopSpeaking,
    playSound,
    announce,
    announceNavigation,
    announceSuccess,
    announceError,
    announceWarning,
    describeElement,
    isSpeaking: isSpeakingRef.current
  };
};
