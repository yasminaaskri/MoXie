import { useState, useEffect, useRef, useCallback } from 'react';

// Langues supportées avec fallbacks (défini en dehors du hook)
const SUPPORTED_LANGUAGES = {
  'ar-TN': ['ar-TN', 'ar-SA', 'ar', 'fr-FR'],
  'fr-FR': ['fr-FR', 'fr'],
  'ar': ['ar-SA', 'ar', 'ar-TN']
};

export const useSpeechRecognition = (language = 'ar-TN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est supportée
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('La reconnaissance vocale n\'est pas supportée par ce navigateur');
      setIsSupported(false);
      return;
    }

    if (isInitializedRef.current) {
      return; // Déjà initialisé
    }

    try {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      // Définir la langue
      const tryLanguages = SUPPORTED_LANGUAGES[currentLanguage] || [currentLanguage];
      recognition.lang = tryLanguages[0];
      
      console.log('Reconnaissance vocale initialisée avec langue:', recognition.lang);
      
      recognition.onstart = () => {
        console.log('🎤 Reconnaissance vocale démarrée');
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log('✅ Résultat reconnaissance:', result);
        setTranscript(result);
        setError(null);
      };
      
      recognition.onerror = (event) => {
        console.error('❌ Erreur reconnaissance vocale:', event.error);
        setError(event.error);
        
        // Messages d'erreur spécifiques
        if (event.error === 'not-allowed') {
          alert('⚠️ Permission microphone refusée. Veuillez autoriser l\'accès au microphone dans les paramètres de votre navigateur.');
        } else if (event.error === 'no-speech') {
          console.log('Aucune parole détectée');
        } else if (event.error === 'audio-capture') {
          alert('⚠️ Aucun microphone détecté. Veuillez connecter un microphone.');
        } else if (event.error === 'network') {
          alert('⚠️ Erreur réseau. Vérifiez votre connexion internet.');
        }
        
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log('🛑 Reconnaissance vocale terminée');
        setIsListening(false);
      };

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la reconnaissance vocale:', error);
      setIsSupported(false);
      setError(error.message);
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.warn('Erreur lors de l\'arrêt de la reconnaissance:', e);
        }
      }
    };
  }, [currentLanguage]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Reconnaissance vocale non initialisée');
      return;
    }

    if (isListening) {
      console.log('Déjà en écoute');
      return;
    }

    setTranscript('');
    setError(null);
    
    try {
      console.log('🎤 Démarrage de l\'écoute...');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
      
      // Si déjà démarré, on réessaie après un court délai
      if (error.message.includes('already started')) {
        setTimeout(() => {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
            }, 100);
          } catch (e) {
            console.error('Impossible de redémarrer:', e);
          }
        }, 100);
      } else {
        setError(error.message);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('🛑 Arrêt de l\'écoute...');
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erreur lors de l\'arrêt:', error);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const switchLanguage = useCallback((newLanguage) => {
    if (SUPPORTED_LANGUAGES[newLanguage]) {
      console.log('Changement de langue vers:', newLanguage);
      setCurrentLanguage(newLanguage);
      
      // Mettre à jour la langue de reconnaissance
      if (recognitionRef.current) {
        const tryLanguages = SUPPORTED_LANGUAGES[newLanguage] || [newLanguage];
        recognitionRef.current.lang = tryLanguages[0];
      }
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    currentLanguage,
    error,
    startListening,
    stopListening,
    switchLanguage,
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES)
  };
};