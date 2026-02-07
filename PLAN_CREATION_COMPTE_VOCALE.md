# 🎤 PLAN : CRÉATION DE COMPTE VOCALE COMPLÈTE

## 🎯 OBJECTIF

Permettre à un utilisateur **aveugle** de créer un compte **uniquement par la voix**, sans jamais toucher le clavier ou la souris.

## 📋 SCÉNARIO CIBLE

```
USER: "Je veux créer un compte"

ASSISTANT: "D'accord, je vais vous guider pour créer un compte. 
            Quel est votre nom ?"

USER: "Wiem"

ASSISTANT: "Parfait, Wiem. Quel est votre adresse email ?"

USER: "wiem@example.com"

ASSISTANT: "Merci. Maintenant, choisissez un mot de passe. 
            Il doit contenir au moins 6 caractères."

USER: "MonMotDePasse123"

ASSISTANT: "Mot de passe enregistré. Quel est votre rôle ? 
            Vous pouvez choisir : utilisateur, responsable, ou chef."

USER: "Utilisateur"

ASSISTANT: "Parfait. Récapitulatif :
            - Nom : Wiem
            - Email : wiem@example.com
            - Rôle : Utilisateur
            Voulez-vous confirmer la création ? Dites oui ou non."

USER: "Oui"

ASSISTANT: "Création du compte en cours... 
            [pause]
            Compte créé avec succès ! Vous pouvez maintenant vous connecter."
```

## 🏗️ ARCHITECTURE

### 1. États de conversation

```javascript
const STEPS = {
  IDLE: 'idle',
  ASK_NAME: 'askName',
  ASK_EMAIL: 'askEmail',
  ASK_PASSWORD: 'askPassword',
  ASK_ROLE: 'askRole',
  CONFIRM: 'confirm',
  CREATING: 'creating',
  SUCCESS: 'success',
  ERROR: 'error'
};
```

### 2. Données du formulaire

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  role: 'user'
});
```

### 3. Flux de dialogue

```javascript
const handleUserResponse = (transcript) => {
  switch (currentStep) {
    case STEPS.ASK_NAME:
      setFormData(prev => ({ ...prev, name: transcript }));
      setCurrentStep(STEPS.ASK_EMAIL);
      speak(`Parfait, ${transcript}. Quel est votre adresse email ?`);
      break;
      
    case STEPS.ASK_EMAIL:
      if (isValidEmail(transcript)) {
        setFormData(prev => ({ ...prev, email: transcript }));
        setCurrentStep(STEPS.ASK_PASSWORD);
        speak("Merci. Maintenant, choisissez un mot de passe...");
      } else {
        speak("Cet email ne semble pas valide. Pouvez-vous répéter ?");
      }
      break;
      
    // ... autres étapes
  }
};
```

## 💻 IMPLÉMENTATION

### Étape 1 : Modifier `useVoiceAssistant.js`

Ajouter la gestion de création de compte :

```javascript
// Dans handleUserResponse()
if (transcript.includes('créer un compte') || transcript.includes('créer compte')) {
  navigate('/register');
  setCurrentStep('askName');
  await speak("D'accord, je vais vous guider pour créer un compte. Quel est votre nom ?");
  setTimeout(() => startListening(), 3000);
  return;
}

// Gestion des étapes
switch (currentStep) {
  case 'askName':
    setUserData(prev => ({ ...prev, name: transcript }));
    setCurrentStep('askEmail');
    await speak(`Parfait, ${transcript}. Quel est votre adresse email ?`);
    setTimeout(() => startListening(), 3000);
    break;
    
  case 'askEmail':
    if (validateEmail(transcript)) {
      setUserData(prev => ({ ...prev, email: transcript }));
      setCurrentStep('askPassword');
      await speak("Merci. Maintenant, choisissez un mot de passe. Il doit contenir au moins 6 caractères.");
      setTimeout(() => startListening(), 4000);
    } else {
      await speak("Cet email ne semble pas valide. Pouvez-vous répéter ?");
      setTimeout(() => startListening(), 2000);
    }
    break;
    
  case 'askPassword':
    if (transcript.length >= 6) {
      setUserData(prev => ({ ...prev, password: transcript }));
      setCurrentStep('askRole');
      await speak("Mot de passe enregistré. Quel est votre rôle ? Vous pouvez choisir : utilisateur, responsable, ou chef.");
      setTimeout(() => startListening(), 5000);
    } else {
      await speak("Le mot de passe doit contenir au moins 6 caractères. Réessayez.");
      setTimeout(() => startListening(), 3000);
    }
    break;
    
  case 'askRole':
    const role = extractRole(transcript);
    if (role) {
      setUserData(prev => ({ ...prev, role }));
      setCurrentStep('confirm');
      await speak(`Parfait. Récapitulatif : Nom ${userData.name}, Email ${userData.email}, Rôle ${role}. Voulez-vous confirmer la création ? Dites oui ou non.`);
      setTimeout(() => startListening(), 6000);
    } else {
      await speak("Je n'ai pas compris le rôle. Dites utilisateur, responsable, ou chef.");
      setTimeout(() => startListening(), 3000);
    }
    break;
    
  case 'confirm':
    if (transcript.includes('oui')) {
      setCurrentStep('creating');
      await speak("Création du compte en cours...");
      
      try {
        await onRegister(userData);
        setCurrentStep('success');
        await speak("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setCurrentStep('idle');
      } catch (error) {
        setCurrentStep('error');
        await speak(`Erreur lors de la création : ${error.message}. Voulez-vous réessayer ?`);
        setTimeout(() => startListening(), 3000);
      }
    } else if (transcript.includes('non')) {
      setCurrentStep('idle');
      setUserData({});
      await speak("Création annulée. Que souhaitez-vous faire ?");
      setTimeout(() => startListening(), 2000);
    } else {
      await speak("Je n'ai pas compris. Dites oui pour confirmer ou non pour annuler.");
      setTimeout(() => startListening(), 3000);
    }
    break;
}
```

### Étape 2 : Fonctions utilitaires

```javascript
// Validation email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Extraction du rôle
const extractRole = (transcript) => {
  const lower = transcript.toLowerCase();
  if (lower.includes('utilisateur') || lower.includes('user')) return 'user';
  if (lower.includes('responsable')) return 'responsable';
  if (lower.includes('chef')) return 'chef';
  return null;
};

// Normalisation du texte (pour l'arabe tunisien)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, '');
};
```

### Étape 3 : Remplir automatiquement le formulaire

```javascript
// Dans Register.js, ajouter un effet pour écouter les données vocales
useEffect(() => {
  if (voiceData.name) setName(voiceData.name);
  if (voiceData.email) setEmail(voiceData.email);
  if (voiceData.password) setPassword(voiceData.password);
  if (voiceData.role) setRole(voiceData.role);
}, [voiceData]);
```

## 🎨 AMÉLIORATIONS AVANCÉES

### 1. Commandes naturelles avec extraction

**Exemple :** "Je veux créer un compte avec le nom Wiem et l'email wiem@example.com"

```javascript
const parseNaturalCommand = (transcript) => {
  const data = {};
  
  // Extraire le nom
  const nameMatch = transcript.match(/nom\s+(\w+)/i);
  if (nameMatch) data.name = nameMatch[1];
  
  // Extraire l'email
  const emailMatch = transcript.match(/email\s+([\w.@]+)/i);
  if (emailMatch) data.email = emailMatch[1];
  
  // Extraire le rôle
  const roleMatch = transcript.match(/rôle\s+(\w+)/i);
  if (roleMatch) data.role = extractRole(roleMatch[1]);
  
  return data;
};
```

### 2. Intégration OpenAI GPT-4

```javascript
const analyzeIntent = async (transcript) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant vocal pour TILI. 
                    Extrais les informations de création de compte.
                    Réponds en JSON : { "action": "create_account", "name": "...", "email": "...", "role": "..." }`
        },
        {
          role: 'user',
          content: transcript
        }
      ]
    })
  });
  
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};
```

### 3. Support multilingue (Français + Arabe)

```javascript
const speak = async (text, lang = 'fr') => {
  // Détecter la langue du texte
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const ttsLang = hasArabic ? 'ar' : 'fr';
  
  await voiceManager.speak(text, { lang: ttsLang });
};
```

### 4. Gestion des erreurs intelligente

```javascript
const handleError = async (error, context) => {
  const errorMessages = {
    'email_exists': "Cet email est déjà utilisé. Voulez-vous vous connecter à la place ?",
    'invalid_email': "L'email n'est pas valide. Pouvez-vous le répéter ?",
    'weak_password': "Le mot de passe est trop faible. Choisissez-en un plus fort.",
    'network_error': "Problème de connexion. Voulez-vous réessayer ?"
  };
  
  const message = errorMessages[error.code] || "Une erreur est survenue. Voulez-vous réessayer ?";
  await speak(message);
  
  // Proposer des actions
  if (error.code === 'email_exists') {
    setCurrentStep('askLoginInstead');
  } else {
    setCurrentStep(context.previousStep);
  }
  
  setTimeout(() => startListening(), 3000);
};
```

## 📊 FLUX COMPLET

```
┌─────────────────────────────────────────────────────────────┐
│                    USER: "Créer un compte"                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Quel est votre nom ?"                          │
│  STATE: askName                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  USER: "Wiem"                                                │
│  SAVE: formData.name = "Wiem"                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Quel est votre email ?"                        │
│  STATE: askEmail                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  USER: "wiem@example.com"                                    │
│  VALIDATE: isValidEmail() → ✅                              │
│  SAVE: formData.email = "wiem@example.com"                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Choisissez un mot de passe"                    │
│  STATE: askPassword                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  USER: "MonMotDePasse123"                                    │
│  VALIDATE: length >= 6 → ✅                                 │
│  SAVE: formData.password = "MonMotDePasse123"               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Quel est votre rôle ?"                         │
│  STATE: askRole                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  USER: "Utilisateur"                                         │
│  EXTRACT: extractRole() → "user"                            │
│  SAVE: formData.role = "user"                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Récapitulatif... Confirmer ?"                  │
│  STATE: confirm                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  USER: "Oui"                                                 │
│  ACTION: onRegister(formData)                               │
│  STATE: creating                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  API: POST /api/auth/register                               │
│  RESPONSE: { success: true, user: {...} }                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ASSISTANT: "Compte créé avec succès !"                     │
│  STATE: success → idle                                       │
│  CLEAR: formData = {}                                        │
└─────────────────────────────────────────────────────────────┘
```

## ✅ CHECKLIST D'IMPLÉMENTATION

### Phase 1 : Base (1-2 heures)
- [ ] Ajouter les états de conversation dans `useVoiceAssistant`
- [ ] Implémenter `handleUserResponse` avec switch/case
- [ ] Ajouter les fonctions de validation (email, password)
- [ ] Tester le flux complet manuellement

### Phase 2 : Intégration (1 heure)
- [ ] Connecter avec le formulaire Register.js
- [ ] Remplir automatiquement les champs
- [ ] Soumettre le formulaire par programmation
- [ ] Gérer les erreurs API

### Phase 3 : Améliorations (2-3 heures)
- [ ] Ajouter la reconnaissance de commandes naturelles
- [ ] Implémenter l'extraction d'entités (nom, email, etc.)
- [ ] Ajouter le support multilingue (FR + AR)
- [ ] Améliorer la gestion des erreurs

### Phase 4 : IA (optionnel, 2-4 heures)
- [ ] Intégrer OpenAI GPT-4
- [ ] Créer le prompt système
- [ ] Parser les réponses JSON
- [ ] Tester avec des phrases complexes

## 🎯 RÉSULTAT ATTENDU

Un utilisateur **complètement aveugle** peut :
1. ✅ Dire "Je veux créer un compte"
2. ✅ Répondre aux questions vocalement
3. ✅ Créer son compte sans toucher le clavier
4. ✅ Recevoir une confirmation vocale
5. ✅ Se connecter ensuite de la même manière

**Temps total d'implémentation estimé : 4-8 heures**

---

**Voulez-vous que je commence l'implémentation maintenant ?**
