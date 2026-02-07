import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { t } from '../utils/translations';

const VoiceInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  className = '',
  autoFocus = false,
  language = 'ar-TN', // Langue par défaut
  ...props 
}) => {
  const { isListening, transcript, isSupported: speechSupported, startListening, stopListening, currentLanguage, switchLanguage } = useSpeechRecognition(language);
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Protection contre les clics multiples

  // Appliquer le transcript à la valeur du champ
  useEffect(() => {
    if (transcript && isVoiceMode) {
      onChange({ target: { value: transcript } });
      setIsVoiceMode(false);
      setIsProcessing(false); // Réinitialiser l'état de traitement
    }
  }, [transcript, onChange, isVoiceMode]);

  // Nettoyer l'état quand l'écoute se termine
  useEffect(() => {
    if (!isListening && isVoiceMode) {
      setTimeout(() => {
        setIsVoiceMode(false);
        setIsProcessing(false);
      }, 1000); // Délai pour permettre au transcript d'arriver
    }
  }, [isListening, isVoiceMode]);

  // Annoncer le label quand le champ reçoit le focus
  const handleFocus = () => {
    if (speechSupported) {
      // Utiliser les traductions pour les annonces
      const fieldKey = label.toLowerCase().includes('nom') ? 'field_name' :
                      label.toLowerCase().includes('email') ? 'field_email' :
                      label.toLowerCase().includes('mot de passe') || label.toLowerCase().includes('password') ? 'field_password' :
                      'field_name';
      
      const announcement = t(`voice_instructions.${fieldKey}`, currentLanguage);
      speak(announcement, { lang: currentLanguage });
    }
  };

  // Gérer les raccourcis clavier
  const handleKeyDown = (e) => {
    // Alt + V pour activer la reconnaissance vocale
    if (e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      handleVoiceInput();
    }
    // Échap pour arrêter l'écoute
    if (e.key === 'Escape' && isListening) {
      stopListening();
      setIsVoiceMode(false);
    }
  };

  const handleVoiceInput = () => {
    if (!speechSupported || isProcessing) {
      if (!speechSupported) {
        const errorMessage = t('voice_not_supported', currentLanguage);
        speak(errorMessage, { lang: currentLanguage });
      }
      return;
    }

    setIsProcessing(true);

    if (isListening) {
      stopListening();
      setIsVoiceMode(false);
      setTimeout(() => setIsProcessing(false), 500);
    } else {
      // Vérifier qu'on n'est pas déjà en train d'écouter
      if (!isVoiceMode) {
        setIsVoiceMode(true);
        
        // Utiliser les traductions pour les invites vocales
        const fieldKey = label.toLowerCase().includes('nom') ? 'field_name' :
                        label.toLowerCase().includes('email') ? 'field_email' :
                        label.toLowerCase().includes('mot de passe') || label.toLowerCase().includes('password') ? 'field_password' :
                        'field_name';
        
        const prompt = t(`voice_instructions.${fieldKey}`, currentLanguage);
        speak(prompt, { lang: currentLanguage });
        
        setTimeout(() => {
          if (!isListening) { // Double vérification avant de démarrer
            startListening();
          }
          setIsProcessing(false);
        }, 1500); // Attendre que l'annonce se termine
      } else {
        setIsProcessing(false);
      }
    }
  };

  const getVoiceButtonLabel = () => {
    if (isListening) return 'Arrêter l\'écoute';
    if (isSpeaking) return 'En cours de lecture...';
    return `Saisie vocale pour ${label}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="obligatoire">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            isListening ? 'ring-2 ring-red-500 border-red-500' : ''
          } ${className}`}
          aria-describedby={`${label}-help`}
          {...props}
        />
        
        {/* Bouton de reconnaissance vocale */}
        {speechSupported && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {/* Sélecteur de langue */}
            <select
              value={currentLanguage}
              onChange={(e) => switchLanguage(e.target.value)}
              className="text-xs bg-gray-100 border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Changer la langue de reconnaissance vocale"
            >
              <option value="ar-TN">🇹🇳 تونسي</option>
              <option value="fr-FR">🇫🇷 FR</option>
              <option value="ar">🇸🇦 عربي</option>
            </select>
            
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isSpeaking || isProcessing}
              className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${(isSpeaking || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={getVoiceButtonLabel()}
              title={getVoiceButtonLabel()}
            >
              {isListening ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Instructions d'aide */}
      <div id={`${label}-help`} className="text-xs text-gray-600">
        {speechSupported ? (
          <span>
            {t('voice_help', currentLanguage)}
            {isListening && <span className="text-red-600 font-medium ml-2">{t('speak_now', currentLanguage)}</span>}
            <span className="ml-2 text-blue-600">
              Langue: {currentLanguage === 'ar-TN' ? 'تونسي' : currentLanguage === 'fr-FR' ? 'Français' : 'عربي'}
            </span>
          </span>
        ) : (
          <span>{t('voice_not_supported', currentLanguage)}</span>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;