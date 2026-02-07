import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import voiceManager from '../utils/voiceManager';

export const useVoiceAssistant = ({ onLogin, onRegister, onLogout, user }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Reconnaissance vocale non supportée');
      setIsSupported(false);
      return;
    }

    console.log('✅ Reconnaissance vocale supportée');
    setIsSupported(true);
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log('🎤 ÉCOUTE DÉMARRÉE');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('👤 UTILISATEUR A DIT:', transcript);
      handleUserResponse(transcript);
    };

    recognition.onerror = (event) => {
      console.error('❌ ERREUR RECONNAISSANCE:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        speak("Je n'ai rien entendu. Pouvez-vous répéter ?").then(() => {
          setTimeout(() => startListening(), 1000);
        });
      }
    };

    recognition.onend = () => {
      console.log('🛑 ÉCOUTE TERMINÉE');
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Parler et ajouter à la conversation
  const speak = useCallback(async (text) => {
    console.log('💬 ASSISTANT:', text);
    setConversation(prev => [...prev, { type: 'assistant', text, timestamp: Date.now() }]);
    await voiceManager.speak(text);
  }, []);

  // Validation email
  const validateEmail = useCallback((email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  // Extraction du rôle
  const extractRole = useCallback((text) => {
    const lower = text.toLowerCase();
    if (lower.includes('utilisateur') || lower.includes('user')) return 'user';
    if (lower.includes('responsable')) return 'responsable';
    if (lower.includes('chef')) return 'chef';
    return null;
  }, []);

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      console.error('❌ Impossible de démarrer l\'écoute');
      return;
    }
    
    try {
      console.log('🎤 DÉMARRAGE ÉCOUTE...');
      recognitionRef.current.start();
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
    }
  }, [isSupported]);

  // Gérer la réponse de l'utilisateur
  const handleUserResponse = useCallback((transcript) => {
    console.log('👤 USER:', transcript);
    setConversation(prev => [...prev, { type: 'user', text: transcript, timestamp: Date.now() }]);

    // Commande annuler (prioritaire)
    if (transcript.includes('annuler') || transcript.includes('stop')) {
      speak("Action annulée. Que souhaitez-vous faire ?").then(() => {
        setCurrentStep('idle');
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setTimeout(() => startListening(), 2000);
      });
      return;
    }

    // FLUX DE CRÉATION DE COMPTE
    if (currentStep === 'idle' && (transcript.includes('créer') || transcript.includes('compte') || transcript.includes('inscription'))) {
      navigate('/register');
      setCurrentStep('askName');
      speak("D'accord, je vais vous guider pour créer un compte. Quel est votre nom ?").then(() => {
        setTimeout(() => startListening(), 3000);
      });
      return;
    }

    // Étape 1 : Demander le nom
    if (currentStep === 'askName') {
      setFormData(prev => ({ ...prev, name: transcript }));
      setCurrentStep('askEmail');
      speak(`Parfait, ${transcript}. Quel est votre adresse email ?`).then(() => {
        setTimeout(() => startListening(), 3000);
      });
      return;
    }

    // Étape 2 : Demander l'email
    if (currentStep === 'askEmail') {
      if (validateEmail(transcript)) {
        setFormData(prev => ({ ...prev, email: transcript }));
        setCurrentStep('askPassword');
        speak("Merci. Maintenant, choisissez un mot de passe. Il doit contenir au moins 6 caractères.").then(() => {
          setTimeout(() => startListening(), 4000);
        });
      } else {
        speak("Cet email ne semble pas valide. Pouvez-vous répéter l'email ?").then(() => {
          setTimeout(() => startListening(), 2000);
        });
      }
      return;
    }

    // Étape 3 : Demander le mot de passe
    if (currentStep === 'askPassword') {
      if (transcript.length >= 6) {
        setFormData(prev => ({ ...prev, password: transcript }));
        setCurrentStep('askRole');
        speak("Mot de passe enregistré. Quel est votre rôle ? Vous pouvez choisir : utilisateur, responsable, ou chef.").then(() => {
          setTimeout(() => startListening(), 5000);
        });
      } else {
        speak("Le mot de passe doit contenir au moins 6 caractères. Réessayez.").then(() => {
          setTimeout(() => startListening(), 3000);
        });
      }
      return;
    }

    // Étape 4 : Demander le rôle
    if (currentStep === 'askRole') {
      const role = extractRole(transcript);
      if (role) {
        setFormData(prev => ({ ...prev, role }));
        setCurrentStep('confirm');
        const roleText = role === 'user' ? 'Utilisateur' : role === 'responsable' ? 'Responsable' : 'Chef';
        speak(`Parfait. Récapitulatif : Nom ${formData.name}, Email ${formData.email}, Rôle ${roleText}. Voulez-vous confirmer la création ? Dites oui ou non.`).then(() => {
          setTimeout(() => startListening(), 7000);
        });
      } else {
        speak("Je n'ai pas compris le rôle. Dites utilisateur, responsable, ou chef.").then(() => {
          setTimeout(() => startListening(), 3000);
        });
      }
      return;
    }

    // Étape 5 : Confirmation
    if (currentStep === 'confirm') {
      if (transcript.includes('oui')) {
        setCurrentStep('creating');
        speak("Création du compte en cours...").then(async () => {
          try {
            await onRegister(formData);
            setCurrentStep('success');
            await speak("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
            setCurrentStep('idle');
            setFormData({ name: '', email: '', password: '', role: 'user' });
            navigate('/login');
          } catch (error) {
            setCurrentStep('error');
            const errorMsg = error.response?.data?.message || error.message || "Une erreur est survenue";
            await speak(`Erreur lors de la création : ${errorMsg}. Voulez-vous réessayer ?`);
            setCurrentStep('idle');
            setTimeout(() => startListening(), 3000);
          }
        });
      } else if (transcript.includes('non')) {
        setCurrentStep('idle');
        setFormData({ name: '', email: '', password: '', role: 'user' });
        speak("Création annulée. Que souhaitez-vous faire ?").then(() => {
          setTimeout(() => startListening(), 2000);
        });
      } else {
        speak("Je n'ai pas compris. Dites oui pour confirmer ou non pour annuler.").then(() => {
          setTimeout(() => startListening(), 3000);
        });
      }
      return;
    }

    // COMMANDES GÉNÉRALES (quand idle)
    if (currentStep === 'idle') {
      // Aide
      if (transcript.includes('aide')) {
        speak("Vous pouvez dire : créer un compte, menu, utilisateurs, tableau de bord, ou déconnexion.").then(() => {
          setTimeout(() => startListening(), 4000);
        });
        return;
      }

      // Menu
      if (transcript.includes('menu')) {
        speak("Options disponibles : tableau de bord, utilisateurs, créer un compte, ou déconnexion.").then(() => {
          setTimeout(() => startListening(), 4000);
        });
        return;
      }

      // Navigation
      if (transcript.includes('tableau de bord') || transcript.includes('accueil')) {
        navigate('/');
        speak("Navigation vers le tableau de bord.").then(() => {
          setTimeout(() => startListening(), 2000);
        });
        return;
      }

      if (transcript.includes('utilisateur')) {
        navigate('/users');
        speak("Page de gestion des utilisateurs. Que souhaitez-vous faire ?").then(() => {
          setTimeout(() => startListening(), 3000);
        });
        return;
      }

      // Déconnexion
      if (transcript.includes('déconnexion') || transcript.includes('déconnecter')) {
        onLogout();
        speak("Vous avez été déconnecté. Au revoir !").then(() => {
          setIsActive(false);
        });
        return;
      }

      // Par défaut
      speak("Je n'ai pas compris. Dites 'aide' pour voir les commandes disponibles.").then(() => {
        setTimeout(() => startListening(), 3000);
      });
    }
  }, [currentStep, formData, navigate, onLogout, onRegister, speak, startListening, validateEmail, extractRole]);

  // Démarrer la conversation
  const startConversation = useCallback(async () => {
    console.log('🚀 DÉMARRAGE CONVERSATION');
    setIsActive(true);
    
    if (user) {
      await speak(`Bonjour ${user.name}. Bienvenue sur TILI. Que souhaitez-vous faire ? Vous pouvez dire : créer un compte, menu, utilisateurs, ou aide.`);
      setCurrentStep('idle');
      setTimeout(() => startListening(), 5000);
    } else {
      await speak("Bonjour et bienvenue sur TILI. Vous pouvez créer un compte en disant : je veux créer un compte.");
      setCurrentStep('idle');
      setTimeout(() => startListening(), 4000);
    }
  }, [user, speak, startListening]);

  // Arrêter la conversation
  const stopConversation = useCallback(async () => {
    console.log('🛑 ARRÊT CONVERSATION');
    setIsActive(false);
    setIsListening(false);
    await speak("Assistant vocal désactivé. À bientôt !");
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [speak]);

  return {
    isActive,
    isListening,
    isSupported,
    conversation,
    currentStep,
    startConversation,
    stopConversation,
    startListening
  };
};
