import React, { useState } from 'react';

export default function SimpleVoiceTest() {
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testVoice = () => {
    addLog('🔊 TEST: Début du test vocal');
    
    try {
      // Annuler toute parole en cours
      window.speechSynthesis.cancel();
      addLog('✅ speechSynthesis.cancel() appelé');
      
      // Créer l'utterance
      const utterance = new SpeechSynthesisUtterance('Bonjour, ceci est un test');
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      addLog('✅ Utterance créée');
      
      utterance.onstart = () => {
        addLog('✅ VOIX DÉMARRÉE - Vous devriez entendre maintenant !');
      };
      
      utterance.onend = () => {
        addLog('✅ VOIX TERMINÉE');
      };
      
      utterance.onerror = (event) => {
        addLog(`❌ ERREUR: ${event.error}`);
      };
      
      // Parler
      window.speechSynthesis.speak(utterance);
      addLog('📤 speechSynthesis.speak() appelé');
      
    } catch (error) {
      addLog(`❌ EXCEPTION: ${error.message}`);
    }
  };

  const testRecognition = () => {
    addLog('🎤 TEST: Début reconnaissance vocale');
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        addLog('❌ Reconnaissance vocale non supportée');
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      
      recognition.onstart = () => {
        addLog('✅ ÉCOUTE DÉMARRÉE - Parlez maintenant !');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addLog(`✅ VOUS AVEZ DIT: "${transcript}"`);
        
        // Répéter ce qui a été dit
        const utterance = new SpeechSynthesisUtterance(`Vous avez dit: ${transcript}`);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      };
      
      recognition.onerror = (event) => {
        addLog(`❌ ERREUR RECONNAISSANCE: ${event.error}`);
      };
      
      recognition.onend = () => {
        addLog('🛑 ÉCOUTE TERMINÉE');
      };
      
      recognition.start();
      addLog('📤 recognition.start() appelé');
      
    } catch (error) {
      addLog(`❌ EXCEPTION: ${error.message}`);
    }
  };

  const clearLog = () => {
    setLog([]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '600px',
      background: 'white',
      border: '3px solid #4CAF50',
      borderRadius: '10px',
      padding: '20px',
      zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#4CAF50' }}>
        🧪 Test Vocal Simple
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testVoice}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '15px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          🔊 Test Synthèse Vocale
        </button>
        
        <button
          onClick={testRecognition}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '15px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          🎤 Test Reconnaissance Vocale
        </button>
        
        <button
          onClick={clearLog}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🗑️ Effacer les logs
        </button>
      </div>
      
      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        {log.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>
            Aucun log pour le moment
          </p>
        ) : (
          log.map((entry, index) => (
            <div key={index} style={{ 
              marginBottom: '5px',
              padding: '5px',
              background: entry.includes('❌') ? '#ffebee' : 
                         entry.includes('✅') ? '#e8f5e9' : 'white',
              borderRadius: '3px'
            }}>
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
