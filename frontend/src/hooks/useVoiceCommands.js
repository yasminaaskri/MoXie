import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoiceCommands = ({ onLogout, isEnabled = true }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Commandes vocales disponibles
  const commands = {
    // Navigation
    'tableau de bord': () => navigate('/'),
    'aller au tableau de bord': () => navigate('/'),
    'accueil': () => navigate('/'),
    'utilisateurs': () => navigate('/users'),
    'ouvrir les utilisateurs': () => navigate('/users'),
    'liste des utilisateurs': () => navigate('/users'),
    'connexion': () => navigate('/login'),
    'inscription': () => navigate('/register'),
    
    // Actions
    'déconnexion': () => onLogout && onLogout(),
    'se déconnecter': () => onLogout && onLogout(),
    'déconnecter': () => onLogout && onLogout(),
    
    // Contrôle
    'arrêter': () => stopListening(),
    'stop': () => stopListening(),
    'annuler': () => stopListening(),
  };

  useEffect(() => {
    if (!isEnabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Commandes vocales non supportées');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log('🎤 Écoute des commandes vocales activée');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const results = event.results[event.results.length - 1];
      
      // Essayer toutes les alternatives
      for (let i = 0; i < results.length; i++) {
        const transcript = results[i].transcript.toLowerCase().trim();
        console.log(`Commande détectée (${i}): "${transcript}"`);
        
        // Chercher une commande correspondante
        const matchedCommand = Object.keys(commands).find(cmd => 
          transcript.includes(cmd)
        );

        if (matchedCommand) {
          console.log(`✅ Commande reconnue: "${matchedCommand}"`);
          setLastCommand(matchedCommand);
          
          // Feedback audio
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(`Commande ${matchedCommand} exécutée`);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.2;
            window.speechSynthesis.speak(utterance);
          }
          
          // Exécuter la commande
          commands[matchedCommand]();
          break;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Erreur commande vocale:', event.error);
      if (event.error === 'not-allowed') {
        alert('⚠️ Permission microphone refusée pour les commandes vocales.');
      }
    };

    recognition.onend = () => {
      console.log('🛑 Écoute des commandes vocales arrêtée');
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn('Erreur arrêt reconnaissance:', e);
        }
      }
    };
  }, [isEnabled, navigate, onLogout]);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) {
      console.warn('Commandes vocales non disponibles');
      return;
    }

    try {
      recognitionRef.current.start();
      
      // Feedback audio
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('Commandes vocales activées. Dites une commande.');
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Erreur démarrage commandes:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erreur arrêt commandes:', error);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    isSupported,
    lastCommand,
    startListening,
    stopListening,
    toggleListening,
    availableCommands: Object.keys(commands)
  };
};
