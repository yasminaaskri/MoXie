import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useContext(AuthContext);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-2">
          Bienvenue sur TILI
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Plateforme de Gestion Interne
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-2xl md:text-3xl font-bold mb-2">Gestion</div>
          <div className="text-sm md:text-base opacity-90">
            Créez et gérez les comptes avec leurs rôles
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-3">🔐</div>
          <div className="text-2xl md:text-3xl font-bold mb-2">Sécurité</div>
          <div className="text-sm md:text-base opacity-90">
            Authentification et droits différenciés
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-3">⚙️</div>
          <div className="text-2xl md:text-3xl font-bold mb-2">Rôles</div>
          <div className="text-sm md:text-base opacity-90">
            Responsable, Chef de projet, Consultant
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Votre profil</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-brown to-brand-brown-dark flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {user?.name || 'Utilisateur'}
              </h3>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              <span className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold ${roleColors[user?.role] || 'bg-gray-600'}`}>
                {roleLabels[user?.role] || 'Utilisateur'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Accès rapide</h2>
          <Link 
            to="/users" 
            className="block bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                👥
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Utilisateurs
                </div>
                <div className="text-sm text-gray-600">
                  Gérer les comptes utilisateurs
                </div>
              </div>
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
