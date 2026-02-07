import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioFeedback } from './useAudioFeedback';

export const useConversationalAssistant = ({ onLogin, onRegister, onLogout, user }) => {
  const navigate = useNavigate();
  const audioFeedback = useAudioFeedback();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState('idle'); // idle, greeting, menu, register, login, navigate
  const [userData, setUserData] = useState({});
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  // États de conversation
  const conversationStates = {
    idle: 'idle',
    greeting: 'greeting',
    mainMenu: 'mainMenu',
    register: 'register',
    registerName: 'registerName',
    registerEmail: 'registerEmail',
    registerPassword: 'registerPassword',
    registerRole: 'registerRole',
    registerConfirm: 'registerConfirm',
    login: 'login',
    loginEmail: 'loginEmail',
    loginPassword: 'loginPassword',
    loginConfirm: 'loginConfirm',
    navigate: 'navigate',
    help: 'help',
    userMenu: 'userMenu',
    // Nouveaux états pour gestion complète
    usersList: 'usersList',
    userDetails: 'userDetails',
    createUser: 'createUser',
    createUserName: 'createUserName',
    createUserEmail: 'createUserEmail',
    createUserPassword: 'createUserPassword',
    createUserRole: 'createUserRole',
    createUserConfirm: 'createUserConfirm',
    editUser: 'editUser',
    editUserField: 'editUserField',
    editUserValue: 'editUserValue',
    editUserConfirm: 'editUserConfirm',
    deleteUser: 'deleteUser',
    deleteUserConfirm: 'deleteUserConfirm',
    dashboardExplore: 'dashboardExplore',
    statsDetails: 'statsDetails'
  };

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      audioFeedback.playSound('focus');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('🎤 Utilisateur a dit:', transcript);
      handleUserResponse(transcript);
    };

    recognition.onerror = (event) => {
      console.error('❌ Erreur reconnaissance:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        speak("Je n'ai rien entendu. Pouvez-vous répéter ?");
        setTimeout(() => startListening(), 1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Parler et ajouter à la conversation
  const speak = useCallback((text, options = {}) => {
    console.log('🔊 Assistant dit:', text);
    setConversation(prev => [...prev, { type: 'assistant', text, timestamp: Date.now() }]);
    
    // Utiliser directement window.speechSynthesis au lieu de audioFeedback
    if (window.speechSynthesis) {
      // Annuler toute parole en cours
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'fr-FR';
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      utterance.onstart = () => {
        console.log('🗣️ Parole démarrée');
      };
      
      utterance.onend = () => {
        console.log('✅ Parole terminée');
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Erreur synthèse vocale:', event);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('❌ Synthèse vocale non supportée');
    }
  }, []);

  // Démarrer l'écoute
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Erreur démarrage écoute:', error);
    }
  }, [isSupported]);

  // Gérer la réponse de l'utilisateur
  const handleUserResponse = useCallback((transcript) => {
    setConversation(prev => [...prev, { type: 'user', text: transcript, timestamp: Date.now() }]);

    // Commandes globales
    if (transcript.includes('aide') || transcript.includes('help')) {
      provideHelp();
      return;
    }

    if (transcript.includes('annuler') || transcript.includes('stop') || transcript.includes('arrêter')) {
      cancelCurrentAction();
      return;
    }

    if (transcript.includes('répéter') || transcript.includes('répète')) {
      repeatLastMessage();
      return;
    }

    // Traiter selon l'état actuel
    switch (currentStep) {
      case conversationStates.idle:
      case conversationStates.greeting:
        handleGreetingResponse(transcript);
        break;
      
      case conversationStates.mainMenu:
        handleMainMenuResponse(transcript);
        break;
      
      case conversationStates.registerName:
        handleRegisterName(transcript);
        break;
      
      case conversationStates.registerEmail:
        handleRegisterEmail(transcript);
        break;
      
      case conversationStates.registerPassword:
        handleRegisterPassword(transcript);
        break;
      
      case conversationStates.registerRole:
        handleRegisterRole(transcript);
        break;
      
      case conversationStates.registerConfirm:
        handleRegisterConfirm(transcript);
        break;
      
      case conversationStates.loginEmail:
        handleLoginEmail(transcript);
        break;
      
      case conversationStates.loginPassword:
        handleLoginPassword(transcript);
        break;
      
      case conversationStates.userMenu:
        handleUserMenuResponse(transcript);
        break;
      
      case conversationStates.usersList:
        handleUsersListResponse(transcript);
        break;
      
      case conversationStates.userDetails:
        handleUserDetailsResponse(transcript);
        break;
      
      case conversationStates.createUserName:
        handleCreateUserName(transcript);
        break;
      
      case conversationStates.createUserEmail:
        handleCreateUserEmail(transcript);
        break;
      
      case conversationStates.createUserPassword:
        handleCreateUserPassword(transcript);
        break;
      
      case conversationStates.createUserRole:
        handleCreateUserRole(transcript);
        break;
      
      case conversationStates.createUserConfirm:
        handleCreateUserConfirm(transcript);
        break;
      
      case conversationStates.dashboardExplore:
        handleDashboardExplore(transcript);
        break;
      
      default:
        speak("Je n'ai pas compris. Dites 'aide' pour obtenir de l'assistance.");
        setTimeout(() => startListening(), 2000);
    }
  }, [currentStep, userData, user]);

  // Menu principal (fonction manquante)
  const handleMainMenuResponse = (transcript) => {
    handleGreetingResponse(transcript);
  };

  // Gérer le menu principal (non connecté)
  const handleGreetingResponse = (transcript) => {
    if (transcript.includes('inscription') || transcript.includes('inscrire') || transcript.includes('créer') || transcript.includes('nouveau compte')) {
      startRegistration();
    } else if (transcript.includes('connexion') || transcript.includes('connecter') || transcript.includes('login')) {
      startLogin();
    } else {
      speak("Je n'ai pas compris. Dites 'inscription' pour créer un compte, ou 'connexion' pour vous connecter.");
      setTimeout(() => startListening(), 2500);
    }
  };

  // Démarrer la conversation
  const startConversation = useCallback(() => {
    setIsActive(true);
    audioFeedback.playSound('success');
    
    if (user) {
      // Utilisateur connecté
      speak(`Bonjour ${user.name}. Bienvenue sur TILI. Que souhaitez-vous faire ? Dites "menu" pour les options, "tableau de bord" pour l'accueil, "utilisateurs" pour la gestion, ou "déconnexion" pour vous déconnecter.`);
      setCurrentStep(conversationStates.userMenu);
    } else {
      // Utilisateur non connecté
      speak("Bonjour et bienvenue sur TILI, votre plateforme de gestion. Je suis votre assistant vocal. Pour commencer, souhaitez-vous vous connecter ou créer un nouveau compte ? Dites 'connexion' ou 'inscription'.");
      setCurrentStep(conversationStates.greeting);
    }
    
    setTimeout(() => startListening(), 4000);
  }, [user, audioFeedback, speak, startListening]);

  // Arrêter la conversation
  const stopConversation = useCallback(() => {
    setIsActive(false);
    setIsListening(false);
    setCurrentStep(conversationStates.idle);
    speak("Assistant vocal désactivé. À bientôt !");
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [speak]);

  // Démarrer l'inscription
  const startRegistration = () => {
    audioFeedback.playSound('navigation');
    speak("Parfait ! Je vais vous guider pour créer votre compte. Commençons par votre nom complet. Quel est votre nom et prénom ?");
    setCurrentStep(conversationStates.registerName);
    setUserData({});
    setTimeout(() => startListening(), 3000);
  };

  // Gérer le nom
  const handleRegisterName = (transcript) => {
    setUserData(prev => ({ ...prev, name: transcript }));
    speak(`Très bien, ${transcript}. Maintenant, quelle est votre adresse email ?`);
    setCurrentStep(conversationStates.registerEmail);
    setTimeout(() => startListening(), 2500);
  };

  // Gérer l'email
  const handleRegisterEmail = (transcript) => {
    // Nettoyer l'email (remplacer "arobase" par "@", etc.)
    let email = transcript
      .replace(/arobase|arrobas|at/gi, '@')
      .replace(/point/gi, '.')
      .replace(/\s+/g, '');
    
    setUserData(prev => ({ ...prev, email }));
    speak(`Email enregistré: ${email}. Maintenant, choisissez un mot de passe. Pour des raisons de sécurité, je ne le répéterai pas. Dictez votre mot de passe.`);
    setCurrentStep(conversationStates.registerPassword);
    setTimeout(() => startListening(), 4000);
  };

  // Gérer le mot de passe
  const handleRegisterPassword = (transcript) => {
    const password = transcript.replace(/\s+/g, '');
    setUserData(prev => ({ ...prev, password }));
    speak("Mot de passe enregistré. Maintenant, choisissez votre rôle. Dites 'consultant' pour un accès limité, 'chef de projet' pour gérer les utilisateurs, ou 'responsable' pour un accès complet.");
    setCurrentStep(conversationStates.registerRole);
    setTimeout(() => startListening(), 4500);
  };

  // Gérer le rôle
  const handleRegisterRole = (transcript) => {
    let role = 'consultant';
    
    if (transcript.includes('responsable')) {
      role = 'responsable';
    } else if (transcript.includes('chef')) {
      role = 'chef';
    }
    
    const roleLabels = {
      consultant: 'Consultant avec accès limité',
      chef: 'Chef de projet pouvant gérer les utilisateurs',
      responsable: 'Responsable avec accès complet'
    };
    
    setUserData(prev => ({ ...prev, role }));
    speak(`Rôle sélectionné: ${roleLabels[role]}. Récapitulatif: Nom: ${userData.name}, Email: ${userData.email}, Rôle: ${roleLabels[role]}. Confirmez-vous ces informations ? Dites 'oui' pour créer le compte, ou 'non' pour recommencer.`);
    setCurrentStep(conversationStates.registerConfirm);
    setTimeout(() => startListening(), 7000);
  };

  // Confirmer l'inscription
  const handleRegisterConfirm = async (transcript) => {
    if (transcript.includes('oui') || transcript.includes('confirme') || transcript.includes('valide')) {
      speak("Création de votre compte en cours...");
      audioFeedback.playSound('click');
      
      try {
        await onRegister({ ...userData });
        audioFeedback.playSound('success');
        speak(`Félicitations ! Votre compte a été créé avec succès. Vous êtes maintenant connecté. Bienvenue ${userData.name} ! Que souhaitez-vous faire ? Dites "menu" pour les options.`);
        setCurrentStep(conversationStates.userMenu);
        setTimeout(() => startListening(), 5000);
      } catch (error) {
        audioFeedback.playSound('error');
        speak(`Erreur lors de la création du compte: ${error.response?.data?.message || 'Erreur inconnue'}. Voulez-vous réessayer ? Dites 'oui' ou 'non'.`);
        setTimeout(() => startListening(), 4000);
      }
    } else {
      speak("D'accord, recommençons. Quel est votre nom complet ?");
      setCurrentStep(conversationStates.registerName);
      setUserData({});
      setTimeout(() => startListening(), 2000);
    }
  };

  // Démarrer la connexion
  const startLogin = () => {
    audioFeedback.playSound('navigation');
    speak("Très bien, connectons-nous. Quelle est votre adresse email ?");
    setCurrentStep(conversationStates.loginEmail);
    setUserData({});
    setTimeout(() => startListening(), 2500);
  };

  // Gérer l'email de connexion
  const handleLoginEmail = (transcript) => {
    let email = transcript
      .replace(/arobase|arrobas|at/gi, '@')
      .replace(/point/gi, '.')
      .replace(/\s+/g, '');
    
    setUserData(prev => ({ ...prev, email }));
    speak(`Email: ${email}. Maintenant, dictez votre mot de passe.`);
    setCurrentStep(conversationStates.loginPassword);
    setTimeout(() => startListening(), 2500);
  };

  // Gérer le mot de passe de connexion
  const handleLoginPassword = (transcript) => {
    const password = transcript.replace(/\s+/g, '');
    setUserData(prev => ({ ...prev, password }));
    speak("Mot de passe reçu. Connexion en cours...");
    setCurrentStep(conversationStates.loginConfirm);
    setTimeout(() => attemptLogin(), 1500);
  };

  // Tenter la connexion
  const attemptLogin = async () => {
    try {
      await onLogin(userData.email, userData.password);
      audioFeedback.playSound('success');
      speak("Connexion réussie ! Bienvenue. Que souhaitez-vous faire ? Dites 'menu' pour les options, 'tableau de bord' pour l'accueil, ou 'utilisateurs' pour la gestion.");
      setCurrentStep(conversationStates.userMenu);
      setTimeout(() => startListening(), 5000);
    } catch (error) {
      audioFeedback.playSound('error');
      speak(`Erreur de connexion: ${error.response?.data?.message || 'Email ou mot de passe incorrect'}. Voulez-vous réessayer ? Dites 'oui' pour réessayer, ou 'inscription' pour créer un compte.`);
      setCurrentStep(conversationStates.greeting);
      setTimeout(() => startListening(), 5000);
    }
  };

  // Menu utilisateur connecté
  const handleUserMenuResponse = (transcript) => {
    if (transcript.includes('menu') || transcript.includes('option')) {
      speak("Options disponibles: Dites 'tableau de bord' pour l'accueil, 'utilisateurs' pour la gestion des utilisateurs, 'déconnexion' pour vous déconnecter, ou 'aide' pour l'assistance.");
      setTimeout(() => startListening(), 5000);
    } else if (transcript.includes('tableau de bord') || transcript.includes('accueil') || transcript.includes('home')) {
      navigate('/');
      audioFeedback.playSound('navigation');
      speak("Navigation vers le tableau de bord. Vous y trouverez 4 statistiques principales. Dites 'explorer' pour entendre les détails, ou 'menu' pour revenir aux options.");
      setCurrentStep(conversationStates.dashboardExplore);
      setTimeout(() => startListening(), 5000);
    } else if (transcript.includes('utilisateur')) {
      navigate('/users');
      audioFeedback.playSound('navigation');
      exploreUsersList();
    } else if (transcript.includes('déconnexion') || transcript.includes('déconnecter')) {
      onLogout();
      audioFeedback.playSound('success');
      speak("Vous avez été déconnecté. Au revoir !");
      setCurrentStep(conversationStates.greeting);
      setTimeout(() => {
        speak("Souhaitez-vous vous reconnecter ou créer un nouveau compte ? Dites 'connexion' ou 'inscription'.");
        setTimeout(() => startListening(), 3000);
      }, 2000);
    } else {
      speak("Je n'ai pas compris. Dites 'menu' pour les options disponibles.");
      setTimeout(() => startListening(), 2500);
    }
  };

  // Explorer le tableau de bord
  const handleDashboardExplore = (transcript) => {
    if (transcript.includes('explorer') || transcript.includes('détail') || transcript.includes('statistique')) {
      speak("Statistiques actuelles: 24 utilisateurs actifs, 8 projets en cours, 156 tâches complétées, et 32 rapports générés. Dites 'utilisateurs' pour gérer les comptes, ou 'menu' pour les options.");
      setTimeout(() => startListening(), 6000);
    } else if (transcript.includes('utilisateur')) {
      navigate('/users');
      audioFeedback.playSound('navigation');
      exploreUsersList();
    } else if (transcript.includes('menu')) {
      speak("Que souhaitez-vous faire ? Tableau de bord, utilisateurs, ou déconnexion ?");
      setCurrentStep(conversationStates.userMenu);
      setTimeout(() => startListening(), 3000);
    } else {
      speak("Dites 'explorer' pour les statistiques, 'utilisateurs' pour la gestion, ou 'menu' pour les options.");
      setTimeout(() => startListening(), 3000);
    }
  };

  // Explorer la liste des utilisateurs
  const exploreUsersList = async () => {
    try {
      // Simuler la récupération des utilisateurs (vous devrez adapter selon votre API)
      speak("Page de gestion des utilisateurs. Chargement de la liste... Que souhaitez-vous faire ? Dites 'créer' pour ajouter un utilisateur, 'lister' pour entendre la liste, ou 'menu' pour revenir.");
      setCurrentStep(conversationStates.usersList);
      setTimeout(() => startListening(), 5000);
    } catch (error) {
      audioFeedback.playSound('error');
      speak("Erreur lors du chargement des utilisateurs. Dites 'menu' pour revenir.");
      setTimeout(() => startListening(), 3000);
    }
  };

  // Gérer les actions sur la liste des utilisateurs
  const handleUsersListResponse = (transcript) => {
    if (transcript.includes('créer') || transcript.includes('ajouter') || transcript.includes('nouveau')) {
      startUserCreation();
    } else if (transcript.includes('lister') || transcript.includes('liste') || transcript.includes('voir')) {
      // Ici vous devriez récupérer la vraie liste depuis votre API
      speak("Liste des utilisateurs: Utilisateur 1: nassir, email nassir@esprit.tn, rôle Chef de projet. Utilisateur 2: fediHmida, email fedi@esprit.tn, rôle Consultant. Utilisateur 3: adem, email adem@esprit.tn, rôle Responsable. Dites 'créer' pour ajouter un utilisateur, ou 'menu' pour revenir.");
      setTimeout(() => startListening(), 10000);
    } else if (transcript.includes('menu') || transcript.includes('retour')) {
      speak("Retour au menu principal. Que souhaitez-vous faire ?");
      setCurrentStep(conversationStates.userMenu);
      setTimeout(() => startListening(), 2500);
    } else {
      speak("Dites 'créer' pour ajouter un utilisateur, 'lister' pour entendre la liste, ou 'menu' pour revenir.");
      setTimeout(() => startListening(), 3500);
    }
  };

  // Démarrer la création d'utilisateur
  const startUserCreation = () => {
    audioFeedback.playSound('navigation');
    speak("Création d'un nouvel utilisateur. Quel est le nom complet de l'utilisateur ?");
    setCurrentStep(conversationStates.createUserName);
    setUserData({});
    setTimeout(() => startListening(), 3000);
  };

  // Gérer le nom du nouvel utilisateur
  const handleCreateUserName = (transcript) => {
    setUserData(prev => ({ ...prev, name: transcript }));
    speak(`Nom: ${transcript}. Quelle est l'adresse email de cet utilisateur ?`);
    setCurrentStep(conversationStates.createUserEmail);
    setTimeout(() => startListening(), 2500);
  };

  // Gérer l'email du nouvel utilisateur
  const handleCreateUserEmail = (transcript) => {
    let email = transcript
      .replace(/arobase|arrobas|at/gi, '@')
      .replace(/point/gi, '.')
      .replace(/\s+/g, '');
    
    setUserData(prev => ({ ...prev, email }));
    speak(`Email: ${email}. Choisissez un mot de passe pour cet utilisateur.`);
    setCurrentStep(conversationStates.createUserPassword);
    setTimeout(() => startListening(), 3000);
  };

  // Gérer le mot de passe du nouvel utilisateur
  const handleCreateUserPassword = (transcript) => {
    const password = transcript.replace(/\s+/g, '');
    setUserData(prev => ({ ...prev, password }));
    speak("Mot de passe enregistré. Quel est le rôle de cet utilisateur ? Consultant, chef de projet, ou responsable ?");
    setCurrentStep(conversationStates.createUserRole);
    setTimeout(() => startListening(), 4000);
  };

  // Gérer le rôle du nouvel utilisateur
  const handleCreateUserRole = (transcript) => {
    let role = 'consultant';
    
    if (transcript.includes('responsable')) {
      role = 'responsable';
    } else if (transcript.includes('chef')) {
      role = 'chef';
    }
    
    const roleLabels = {
      consultant: 'Consultant',
      chef: 'Chef de projet',
      responsable: 'Responsable'
    };
    
    setUserData(prev => ({ ...prev, role }));
    speak(`Récapitulatif du nouvel utilisateur: Nom: ${userData.name}, Email: ${userData.email}, Rôle: ${roleLabels[role]}. Confirmez-vous la création ? Dites 'oui' ou 'non'.`);
    setCurrentStep(conversationStates.createUserConfirm);
    setTimeout(() => startListening(), 6000);
  };

  // Confirmer la création d'utilisateur
  const handleCreateUserConfirm = async (transcript) => {
    if (transcript.includes('oui') || transcript.includes('confirme') || transcript.includes('valide')) {
      speak("Création de l'utilisateur en cours...");
      audioFeedback.playSound('click');
      
      try {
        // Ici vous devriez appeler votre API pour créer l'utilisateur
        // await api.post('/users', userData);
        
        audioFeedback.playSound('success');
        speak(`Utilisateur ${userData.name} créé avec succès ! Que souhaitez-vous faire ? Dites 'créer' pour ajouter un autre utilisateur, 'lister' pour voir la liste, ou 'menu' pour revenir.`);
        setCurrentStep(conversationStates.usersList);
        setTimeout(() => startListening(), 6000);
      } catch (error) {
        audioFeedback.playSound('error');
        speak(`Erreur lors de la création: ${error.response?.data?.message || 'Erreur inconnue'}. Voulez-vous réessayer ? Dites 'oui' ou 'non'.`);
        setTimeout(() => startListening(), 4000);
      }
    } else {
      speak("Création annulée. Retour à la liste des utilisateurs. Que souhaitez-vous faire ?");
      setCurrentStep(conversationStates.usersList);
      setTimeout(() => startListening(), 3000);
    }
  };

  // Gérer les détails d'un utilisateur
  const handleUserDetailsResponse = (transcript) => {
    // À implémenter selon vos besoins
    speak("Fonctionnalité en cours de développement.");
    setTimeout(() => startListening(), 2000);
  };

  // Aide
  const provideHelp = () => {
    const helpMessages = {
      [conversationStates.greeting]: "Vous pouvez dire 'connexion' pour vous connecter, ou 'inscription' pour créer un compte.",
      [conversationStates.userMenu]: "Vous pouvez dire 'tableau de bord', 'utilisateurs', 'déconnexion', ou 'menu' pour les options.",
      [conversationStates.usersList]: "Vous pouvez dire 'créer' pour ajouter un utilisateur, 'lister' pour entendre la liste, ou 'menu' pour revenir.",
      [conversationStates.dashboardExplore]: "Dites 'explorer' pour les statistiques, 'utilisateurs' pour la gestion, ou 'menu' pour les options.",
      [conversationStates.createUserName]: "Dictez le nom complet de l'utilisateur, ou dites 'annuler' pour arrêter.",
      [conversationStates.createUserEmail]: "Dictez l'email en disant 'arobase' pour @ et 'point' pour ., ou dites 'annuler'.",
      [conversationStates.createUserPassword]: "Dictez le mot de passe, ou dites 'annuler' pour arrêter.",
      [conversationStates.createUserRole]: "Dites 'consultant', 'chef de projet', ou 'responsable'.",
    };
    
    const message = helpMessages[currentStep] || "Dites 'annuler' pour arrêter, ou 'répéter' pour réentendre le dernier message.";
    speak(message);
    setTimeout(() => startListening(), 4000);
  };

  // Annuler l'action en cours
  const cancelCurrentAction = () => {
    audioFeedback.playSound('warning');
    
    if (user) {
      speak("Action annulée. Retour au menu principal. Que souhaitez-vous faire ?");
      setCurrentStep(conversationStates.userMenu);
    } else {
      speak("Action annulée. Souhaitez-vous vous connecter ou créer un compte ?");
      setCurrentStep(conversationStates.greeting);
    }
    
    setUserData({});
    setTimeout(() => startListening(), 3000);
  };

  // Répéter le dernier message
  const repeatLastMessage = () => {
    const lastAssistantMessage = [...conversation].reverse().find(msg => msg.type === 'assistant');
    if (lastAssistantMessage) {
      speak(lastAssistantMessage.text);
      setTimeout(() => startListening(), (lastAssistantMessage.text.length / 15) * 1000);
    }
  };

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
