import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import voiceManager from '../utils/voiceManager';

export default function VoiceAssistant() {
  const { user, login, register, logout } = useContext(AuthContext);
  
  const {
    isActive,
    isListening,
    isSupported,
    conversation,
    currentStep,
    startConversation,
    stopConversation
  } = useVoiceAssistant({
    onLogin: login,
    onRegister: register,
    onLogout: logout,
    user
  });

  const handleTestVoice = () => {
    console.log('🔊 TEST GOOGLE TTS');
    voiceManager.speak('Bonjour, ceci est un test avec Google Translate. Si vous entendez ce message, le système vocal fonctionne correctement.');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Bouton flottant principal */}
      <div className="fixed bottom-20 left-4 z-50">
        <button
          onClick={isActive ? stopConversation : startConversation}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 ${
            isActive
              ? isListening
                ? 'bg-red-500 animate-pulse focus:ring-red-300'
                : 'bg-green-500 focus:ring-green-300'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-purple-300'
          }`}
          aria-label={isActive ? 'Arrêter l\'assistant vocal' : 'Démarrer l\'assistant vocal'}
          title={isActive ? 'Arrêter l\'assistant vocal' : 'Démarrer l\'assistant vocal (Alt + A)'}
        >
          {isActive ? (
            isListening ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          )}
        </button>

        {/* Indicateur d'état */}
        {isActive && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            {isListening ? (
              <span className="text-red-500 text-xs font-bold animate-pulse">●</span>
            ) : (
              <span className="text-green-500 text-xs font-bold">●</span>
            )}
          </div>
        )}
      </div>

      {/* Panneau de conversation */}
      {isActive && (
        <div className="fixed bottom-40 left-4 w-96 max-h-96 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden border-2 border-purple-500">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Assistant Vocal TILI</h3>
                  <p className="text-xs text-white/80">
                    {isListening ? '🎤 En écoute...' : '💬 En attente'}
                  </p>
                </div>
              </div>
              <button
                onClick={stopConversation}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Fermer l'assistant"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-64 bg-gray-50">
            {conversation.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Conversation en cours...</p>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 shadow-sm rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pied de page */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {isListening ? '🎤 Parlez maintenant...' : '⏸️ En pause'}
              </span>
              <span className="text-purple-600 font-medium">
                Étape: {currentStep}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Dites "aide" pour l'assistance • "annuler" pour arrêter
            </div>
          </div>
        </div>
      )}

      {/* Badge d'information */}
      {!isActive && (
        <div className="fixed bottom-40 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-40 border-l-4 border-purple-500">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Assistant Vocal</p>
              <p className="text-xs text-gray-600 mt-1">
                Cliquez pour démarrer une conversation guidée par la voix
              </p>
              <button
                onClick={handleTestVoice}
                className="mt-2 w-full py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                🔊 Tester la voix
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
