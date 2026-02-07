import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = (language = 'ar-TN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const recognitionRef = useRef(null);

  // Langues supportées avec fallbacks
  const supportedLanguages = {
    'ar-TN': ['ar-TN', 'ar-SA', 'ar', 'fr-FR'], // Tunisien avec fallbacks
    'fr-FR': ['fr-FR', 'fr'],
    'ar': ['ar-SA', 'ar', 'ar-TN']
  };

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est supportée
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Essayer les langues dans l'ordre de préférence
      const tryLanguages = supportedLanguages[currentLanguage] || [currentLanguage];
      recognition.lang = tryLanguages[0];
      
      recognition.onstart = () => {
        console.log('Reconnaissance vocale démarrée');
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        console.log('Résultat reconnaissance:', result);
        setTranscript(result);
      };
      
      recognition.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        
        // Si erreur de langue, essayer la suivante
        if (event.error === 'language-not-supported') {
          const tryLanguages = supportedLanguages[currentLanguage] || [currentLanguage];
          const currentIndex = tryLanguages.indexOf(recognition.lang);
          if (currentIndex < tryLanguages.length - 1) {
            recognition.lang = tryLanguages[currentIndex + 1];
            console.log('Tentative avec langue:', recognition.lang);
            return;
          }
        }
        
        // Réinitialiser l'état en cas d'erreur
        setIsListening(false);
      };
      
      recognition.onend = () => {
        console.log('Reconnaissance vocale terminée');
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage, supportedLanguages]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Erreur lors du démarrage de la reconnaissance:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erreur lors de l\'arrêt de la reconnaissance:', error);
        setIsListening(false);
      }
    }
  };

  const switchLanguage = (newLanguage) => {
    if (supportedLanguages[newLanguage]) {
      setCurrentLanguage(newLanguage);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    currentLanguage,
    startListening,
    stopListening,
    switchLanguage,
    supportedLanguages: Object.keys(supportedLanguages)
  };
};