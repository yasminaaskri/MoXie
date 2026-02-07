import React, { useState, useEffect } from 'react';

const TextToSpeech = ({ text, documentName }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    // Charger les voix disponibles
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Sélectionner une voix française par défaut
      const frenchVoice = availableVoices.find(voice => 
        voice.lang.startsWith('fr')
      );
      setSelectedVoice(frenchVoice || availableVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text) {
      alert('Aucun texte à lire');
      return;
    }

    // Arrêter toute lecture en cours
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'fr-FR';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Erreur de synthèse vocale:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="text-to-speech" role="region" aria-label="Lecteur audio du document">
      <div className="tts-header">
        <h3>🔊 Écouter le document</h3>
        {documentName && <p className="tts-doc-name">{documentName}</p>}
      </div>

      <div className="tts-controls">
        {!isSpeaking ? (
          <button 
            onClick={speak} 
            className="tts-btn tts-btn-play"
            aria-label="Lire le document à voix haute"
          >
            ▶️ Lire
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button 
                onClick={pause} 
                className="tts-btn tts-btn-pause"
                aria-label="Mettre en pause la lecture"
              >
                ⏸️ Pause
              </button>
            ) : (
              <button 
                onClick={resume} 
                className="tts-btn tts-btn-resume"
                aria-label="Reprendre la lecture"
              >
                ▶️ Reprendre
              </button>
            )}
            <button 
              onClick={stop} 
              className="tts-btn tts-btn-stop"
              aria-label="Arrêter la lecture"
            >
              ⏹️ Arrêter
            </button>
          </>
        )}
      </div>

      <div className="tts-settings">
        <div className="tts-setting">
          <label htmlFor="voice-select">Voix :</label>
          <select 
            id="voice-select"
            value={voices.indexOf(selectedVoice)}
            onChange={(e) => setSelectedVoice(voices[e.target.value])}
            className="tts-select"
            disabled={isSpeaking}
            aria-label="Sélectionner la voix de lecture"
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="tts-setting">
          <label htmlFor="rate-slider">
            Vitesse : {rate.toFixed(1)}x
          </label>
          <input 
            id="rate-slider"
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="tts-slider"
            disabled={isSpeaking}
            aria-label="Ajuster la vitesse de lecture"
          />
        </div>

        <div className="tts-setting">
          <label htmlFor="pitch-slider">
            Tonalité : {pitch.toFixed(1)}
          </label>
          <input 
            id="pitch-slider"
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="tts-slider"
            disabled={isSpeaking}
            aria-label="Ajuster la tonalité de la voix"
          />
        </div>
      </div>

      {isSpeaking && (
        <div className="tts-status" role="status" aria-live="polite">
          <div className="tts-wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>{isPaused ? '⏸️ En pause' : '🔊 Lecture en cours...'}</p>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
