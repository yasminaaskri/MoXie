import React, { useState, useEffect, useRef } from 'react';
import './VoiceAIAssistant.css';

const VoiceAIAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Changed to false - stop after one phrase
      recognitionRef.current.interimResults = false; // Changed to false - only final results
      recognitionRef.current.lang = 'fr-FR'; // French

      recognitionRef.current.onresult = (event) => {
        const finalTranscript = event.results[0][0].transcript;
        setTranscript(finalTranscript);
        
        // Process only when we have a final result
        if (finalTranscript.trim().length > 0) {
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setAiResponse('Erreur de reconnaissance vocale. Veuillez réessayer.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setAiResponse('');
      setIsListening(true);
      recognitionRef.current.start();
      speak('Je vous écoute. Dites le sujet du document.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const processVoiceCommand = async (command) => {
    console.log('🎤 Commande vocale reçue:', command);
    const lowerCommand = command.toLowerCase();

    // Clear/Reset
    if (lowerCommand.includes('effacer') || lowerCommand.includes('recommencer') || lowerCommand.includes('annuler')) {
      setPdfTitle('');
      setPdfContent('');
      setTranscript('');
      setAiResponse('Prêt à créer un nouveau document. Dites simplement le sujet.');
      speak('Prêt à créer un nouveau document. Dites simplement le sujet.');
      return;
    }

    // Any other command is treated as a topic - Generate immediately!
    if (command.trim().length > 5) {
      console.log('✅ Traitement du sujet:', command);
      setIsProcessing(true);
      setAiResponse(`Génération du document sur "${command}" en cours...`);
      speak('Je génère le document pour vous. Veuillez patienter.');
      
      await generateContentAndPDF(command);
    } else {
      console.log('⚠️ Commande trop courte:', command);
      setAiResponse('Commande trop courte. Veuillez répéter le sujet.');
      speak('Commande trop courte. Veuillez répéter le sujet.');
    }
  };

  const generateContentAndPDF = async (topic) => {
    try {
      console.log('🎯 Génération du contenu pour:', topic);
      
      // Call AI to generate content
      const response = await fetch('http://localhost:5000/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      console.log('📡 Réponse reçue:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur serveur:', errorData);
        throw new Error('Erreur lors de la génération du contenu');
      }

      const data = await response.json();
      console.log('✅ Contenu généré:', data);
      
      setPdfTitle(data.title);
      setPdfContent(data.content);
      setAiResponse(`Contenu généré ! Titre : "${data.title}". Création du PDF...`);
      speak(`Contenu généré. Création du PDF en cours.`);
      
      // Auto-generate PDF after 2 seconds
      setTimeout(async () => {
        await generatePDF(data.title, data.content);
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      setAiResponse(`Erreur: ${error.message}. Vérifiez que le serveur est démarré.`);
      speak('Erreur lors de la génération du contenu');
      setIsProcessing(false);
    }
  };

  const generatePDF = async (title, content) => {
    setIsProcessing(true);
    setAiResponse('Création du PDF en cours...');
    speak('Création du PDF en cours');

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || pdfTitle || 'Document sans titre',
          content: content || pdfContent,
          uploadedBy: 'Mohamed Aziz Awadhi'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAiResponse(`PDF créé avec succès : "${result.name}"`);
        speak(`PDF créé avec succès`);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setPdfTitle('');
          setPdfContent('');
          setTranscript('');
        }, 3000);
      } else {
        setAiResponse('Erreur lors de la création du PDF.');
        speak('Erreur lors de la création du PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Erreur de connexion au serveur.');
      speak('Erreur de connexion au serveur');
    }

    setIsProcessing(false);
  };

  return (
    <div className="voice-ai-container">
      <div className="voice-ai-header">
        <h2>🎤 Assistant Vocal IA</h2>
        <p>Dites simplement le sujet - L'IA génère tout !</p>
      </div>

      <div className="voice-controls">
        {!isListening ? (
          <button className="btn-start-voice" onClick={startListening}>
            <span className="mic-icon">🎤</span>
            Commencer à parler
          </button>
        ) : (
          <button className="btn-stop-voice" onClick={stopListening}>
            <span className="stop-icon">⏹️</span>
            Arrêter
          </button>
        )}
      </div>

      {isListening && (
        <div className="listening-indicator">
          <div className="pulse-ring"></div>
          <span>En écoute...</span>
        </div>
      )}

      {transcript && (
        <div className="transcript-box">
          <h3>Vous avez dit :</h3>
          <p>{transcript}</p>
        </div>
      )}

      {aiResponse && (
        <div className="ai-response-box">
          <h3>Assistant IA :</h3>
          <p>{aiResponse}</p>
        </div>
      )}

      {(pdfTitle || pdfContent) && (
        <div className="pdf-preview">
          <h3>Aperçu du PDF</h3>
          {pdfTitle && <h4>Titre : {pdfTitle}</h4>}
          {pdfContent && (
            <div className="content-preview">
              <strong>Contenu :</strong>
              <p>{pdfContent}</p>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <span>Traitement en cours...</span>
        </div>
      )}

      <div className="voice-commands-help">
        <h3>Utilisation ultra-simple :</h3>
        <ul>
          <li>Cliquez sur "Commencer à parler"</li>
          <li>Dites juste le sujet : "Rapport sur les ventes"</li>
          <li>L'IA génère TOUT automatiquement !</li>
        </ul>
        <div style={{marginTop: '15px', padding: '15px', background: '#e5e7eb', borderRadius: '8px'}}>
          <strong>✨ Exemples de sujets :</strong>
          <p style={{margin: '8px 0', fontSize: '14px'}}>• "Rapport sur les ventes de février"</p>
          <p style={{margin: '8px 0', fontSize: '14px'}}>• "Lettre de motivation ingénieur"</p>
          <p style={{margin: '8px 0', fontSize: '14px'}}>• "Guide accessibilité numérique"</p>
          <p style={{margin: '8px 0', fontSize: '14px'}}>• "Formation des employés"</p>
        </div>
        <p style={{marginTop: '15px', fontSize: '13px', color: '#6b7280'}}>
          💡 Astuce : Dites "Effacer" pour recommencer
        </p>
      </div>
    </div>
  );
};

export default VoiceAIAssistant;
