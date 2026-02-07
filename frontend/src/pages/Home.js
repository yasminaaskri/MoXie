import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useAudioFeedback } from '../hooks/useAudioFeedback';

export default function Home() {
  const { user } = useContext(AuthContext);
  const audioFeedback = useAudioFeedback();

  const roleColors = {
    responsable: 'bg-red-600',
    chef: 'bg-blue-600',
    consultant: 'bg-green-600'
  };

  const roleLabels = {
    responsable: 'Responsable',
    chef: 'Chef de projet',
    consultant: 'Consultant'
  };

  const stats = [
    { label: 'Utilisateurs actifs', value: '24', color: 'bg-blue-600', description: '24 utilisateurs actifs sur la plateforme' },
    { label: 'Projets en cours', value: '8', color: 'bg-green-600', description: '8 projets actuellement en cours' },
    { label: 'Tâches complétées', value: '156', color: 'bg-purple-600', description: '156 tâches ont été complétées' },
    { label: 'Rapports générés', value: '32', color: 'bg-orange-600', description: '32 rapports ont été générés' }
  ];

  // Fonction pour lire une statistique
  const readStat = (stat) => {
    audioFeedback.playSound('click');
    audioFeedback.speak(stat.description);
  };

  // Fonction pour lire une action
  const readAction = (title, description) => {
    audioFeedback.playSound('focus');
    audioFeedback.speak(`${title}. ${description}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Welcome */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-lg">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Bonjour, {user?.name || 'Utilisateur'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${roleColors[user?.role] || 'bg-gray-600'}`}>
                {roleLabels[user?.role] || 'Utilisateur'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => readStat(stat)}
              onFocus={() => audioFeedback.playSound('focus')}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label={stat.description}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-3 h-12 rounded-full ${stat.color}`} aria-hidden="true"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/users" 
                  onClick={() => audioFeedback.playSound('navigation')}
                  onFocus={() => readAction('Gestion des utilisateurs', 'Gérer les comptes et permissions')}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label="Gestion des utilisateurs - Gérer les comptes et permissions"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Gestion des utilisateurs</h4>
                  <p className="text-sm text-gray-600">Gérer les comptes et permissions</p>
                </Link>

                <button
                  onClick={() => audioFeedback.announceWarning('Fonctionnalité Rapports en cours de développement')}
                  onFocus={() => readAction('Rapports', 'Générer des analyses')}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-green-300"
                  aria-label="Rapports - Générer des analyses"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Rapports</h4>
                  <p className="text-sm text-gray-600">Générer des analyses</p>
                </button>

                <button
                  onClick={() => audioFeedback.announceWarning('Fonctionnalité Paramètres en cours de développement')}
                  onFocus={() => readAction('Paramètres', 'Configuration du système')}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-purple-300"
                  aria-label="Paramètres - Configuration du système"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Paramètres</h4>
                  <p className="text-sm text-gray-600">Configuration du système</p>
                </button>

                <button
                  onClick={() => audioFeedback.announceWarning('Fonctionnalité Analytics en cours de développement')}
                  onFocus={() => readAction('Analytics', 'Données et métriques')}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-orange-300"
                  aria-label="Analytics - Données et métriques"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Analytics</h4>
                  <p className="text-sm text-gray-600">Données et métriques</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité récente</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nouvel utilisateur créé</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Rapport généré</p>
                  <p className="text-xs text-gray-500">Il y a 4 heures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Paramètres mis à jour</p>
                  <p className="text-xs text-gray-500">Hier</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance programmée</p>
                  <p className="text-xs text-gray-500">Il y a 2 jours</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors">
              Voir toute l'activité
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">État du système</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-gray-900">Serveur</h4>
                <p className="text-sm text-gray-600">Opérationnel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-gray-900">Base de données</h4>
                <p className="text-sm text-gray-600">Connectée</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h4 className="font-medium text-gray-900">Maintenance</h4>
                <p className="text-sm text-gray-600">Programmée</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
