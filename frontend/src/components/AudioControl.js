import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useAudioFeedback } from '../hooks/useAudioFeedback';

export default function AudioControl() {
  const { logout } = useContext(AuthContext);
  const [audioMode, setAudioMode] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const audioFeedback = useAudioFeedback();

  const {
    isListening,
    isSupported,
    lastCommand,
    toggleListening,
    availableCommands
  } = useVoiceCommands({
    onLogout: logout,
    isEnabled: audioMode
  });

  const handleToggleAudioMode = () => {
    const newMode = !audioMode;
    setAudioMode(newMode);
    
    if (newMode) {
      audioFeedback.announceSuccess('Mode audio complet activé. Vous pouvez maintenant utiliser les commandes vocales.');
    } else {
      audioFeedback.announce('Mode audio désactivé');
    }
  };

  const handleToggleCommands = () => {
    setShowCommands(!showCommands);
    audioFeedback.playSound('click');
  };

  const handleTestSound = (type) => {
    audioFeedback.playSound(type);
    audioFeedback.speak(`Son de ${type}`);
  };

  if (!isSupported) {
    return null; // Ne rien afficher si non supporté
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton principal */}
      <div className="flex flex-col items-end gap-2">
        {/* Panneau de contrôle */}
        {showCommands && (
          <div className="bg-white rounded-lg shadow-2xl p-4 w-80 mb-2 border-2 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">🎤 Contrôle Audio</h3>
              <button
                onClick={handleToggleCommands}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fermer le panneau"
              >
                ✕
              </button>
            </div>

            {/* Mode audio */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={audioMode}
                  onChange={handleToggleAudioMode}
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-900">
                  Mode Audio Complet
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Active les commandes vocales et le feedback audio
              </p>
            </div>

            {/* État des commandes vocales */}
            {audioMode && (
              <div className="mb-4">
                <button
                  onClick={toggleListening}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isListening ? '🔴 Écoute active...' : '🎤 Activer les commandes'}
                </button>
                {lastCommand && (
                  <p className="text-xs text-green-600 mt-2 text-center">
                    Dernière commande: "{lastCommand}"
                  </p>
                )}
              </div>
            )}

            {/* Liste des commandes */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                📋 Commandes disponibles:
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                <div className="text-xs space-y-1">
                  <p className="font-medium text-blue-600">Navigation:</p>
                  <p className="pl-2">• "Tableau de bord"</p>
                  <p className="pl-2">• "Ouvrir les utilisateurs"</p>
                  <p className="pl-2">• "Accueil"</p>
                  
                  <p className="font-medium text-blue-600 mt-2">Actions:</p>
                  <p className="pl-2">• "Se déconnecter"</p>
                  <p className="pl-2">• "Déconnexion"</p>
                  
                  <p className="font-medium text-blue-600 mt-2">Contrôle:</p>
                  <p className="pl-2">• "Arrêter"</p>
                  <p className="pl-2">• "Stop"</p>
                </div>
              </div>
            </div>

            {/* Test des sons */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">
                🔊 Tester les sons:
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleTestSound('click')}
                  className="text-xs py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Clic
                </button>
                <button
                  onClick={() => handleTestSound('success')}
                  className="text-xs py-2 px-2 bg-green-100 hover:bg-green-200 rounded"
                >
                  Succès
                </button>
                <button
                  onClick={() => handleTestSound('error')}
                  className="text-xs py-2 px-2 bg-red-100 hover:bg-red-200 rounded"
                >
                  Erreur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bouton flottant */}
        <button
          onClick={handleToggleCommands}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            audioMode ? 'bg-blue-600 animate-pulse' : 'bg-blue-500'
          }`}
          aria-label="Ouvrir le contrôle audio"
          title="Contrôle Audio (Alt + C)"
        >
          <span className="text-2xl">
            {isListening ? '🔴' : '🎤'}
          </span>
        </button>
      </div>
    </div>
  );
}
