import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAudioFeedback } from '../hooks/useAudioFeedback';

// Descriptions détaillées pour chaque page
const pageDescriptions = {
  '/': {
    title: 'Tableau de bord',
    description: 'Page d\'accueil avec vue d\'ensemble. Vous trouverez 4 cartes de statistiques en haut: utilisateurs actifs, projets en cours, tâches complétées, et rapports générés. En dessous, une section d\'actions rapides avec des liens vers la gestion des utilisateurs, les rapports, les paramètres et les analytics. Sur la droite, l\'activité récente affiche les dernières actions du système. En bas de page, l\'état du système montre le statut du serveur, de la base de données et de la maintenance.',
    elements: [
      'En-tête avec titre Tableau de bord',
      '4 cartes de statistiques avec valeurs numériques',
      'Section Actions rapides avec 4 boutons',
      'Panneau Activité récente sur la droite',
      'État du système en bas de page'
    ]
  },
  '/users': {
    title: 'Gestion des utilisateurs',
    description: 'Page de gestion des utilisateurs. En haut, un bouton pour créer un nouvel utilisateur. Le tableau principal liste tous les utilisateurs avec leurs informations: nom complet, email, rôle (Responsable, Chef de projet, ou Consultant), et actions disponibles (modifier ou supprimer). Vous pouvez filtrer et rechercher des utilisateurs.',
    elements: [
      'Bouton Créer un nouvel utilisateur en haut',
      'Tableau avec colonnes: Nom, Email, Rôle, Actions',
      'Boutons d\'action pour chaque utilisateur',
      'Barre de recherche et filtres'
    ]
  },
  '/login': {
    title: 'Connexion',
    description: 'Page de connexion à l\'application. Formulaire avec deux champs: email et mot de passe. Chaque champ dispose d\'une entrée vocale. Un bouton Se connecter permet de valider. Un lien vers la page d\'inscription est disponible en bas.',
    elements: [
      'Champ Email avec saisie vocale',
      'Champ Mot de passe avec saisie vocale',
      'Bouton Se connecter',
      'Lien vers l\'inscription'
    ]
  },
  '/register': {
    title: 'Inscription',
    description: 'Page d\'inscription pour créer un nouveau compte. Formulaire avec 4 champs: nom complet, email, mot de passe, et rôle. Chaque champ texte dispose d\'une entrée vocale. Le sélecteur de rôle propose 3 options: Consultant (accès limité), Chef de projet (gestion des utilisateurs), et Responsable (accès complet). Un bouton Créer permet de valider l\'inscription.',
    elements: [
      'Champ Nom complet avec saisie vocale',
      'Champ Email avec saisie vocale',
      'Champ Mot de passe avec saisie vocale',
      'Sélecteur de rôle avec 3 options',
      'Descriptions des rôles',
      'Bouton Créer'
    ]
  }
};

export default function PageDescriptor() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const audioFeedback = useAudioFeedback();

  useEffect(() => {
    // Attendre un peu que la page se charge
    const timer = setTimeout(() => {
      const currentPath = location.pathname;
      const pageInfo = pageDescriptions[currentPath];

      if (pageInfo) {
        // Annoncer le changement de page
        audioFeedback.announceNavigation(pageInfo.title);

        // Attendre que l'annonce de navigation se termine
        setTimeout(() => {
          // Lire la description complète
          audioFeedback.describeElement(pageInfo.description);
        }, 2000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Bouton pour relire la description
  const handleReadDescription = () => {
    const currentPath = location.pathname;
    const pageInfo = pageDescriptions[currentPath];

    if (pageInfo) {
      audioFeedback.stopSpeaking();
      audioFeedback.playSound('click');
      
      // Lire le titre
      audioFeedback.speak(`Page ${pageInfo.title}.`);
      
      setTimeout(() => {
        // Lire la description
        audioFeedback.speak(pageInfo.description);
        
        setTimeout(() => {
          // Lire les éléments
          audioFeedback.speak(`Éléments de la page: ${pageInfo.elements.join('. ')}`);
        }, (pageInfo.description.length / 15) * 1000); // Estimation du temps de lecture
      }, 2000);
    }
  };

  const currentPath = location.pathname;
  const pageInfo = pageDescriptions[currentPath];

  if (!pageInfo) return null;

  return (
    <div className="fixed top-20 right-4 z-40">
      <button
        onClick={handleReadDescription}
        className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label="Lire la description de la page"
        title="Lire la description de la page (Alt + D)"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </button>
    </div>
  );
}
