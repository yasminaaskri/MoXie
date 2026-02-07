import React, { useState } from 'react';
import { FiUsers, FiFileText, FiCalendar, FiActivity, FiLogOut, FiCheckCircle, FiBriefcase } from 'react-icons/fi';

const Dashboard = ({ user, onLogout }) => {
  // Fallsback if user is not provided
  const currentUser = user || { name: 'Utilisateur', role: 'Visiteur', email: 'user@tili.tn' };

  // Mock Data based on user request
  const stats = [
    { id: 1, name: 'Utilisateurs actifs', value: '24', icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, name: 'Projets en cours', value: '8', icon: FiBriefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 3, name: 'Tâches complétées', value: '156', icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 4, name: 'Rapports générés', value: '32', icon: FiFileText, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentActivity = [
    { id: 1, text: 'Nouvel utilisateur créé', time: 'Il y a 2 heures', color: 'bg-blue-500' },
    { id: 2, text: 'Rapport "Q3 Performance" généré', time: 'Il y a 4 heures', color: 'bg-green-500' },
    { id: 3, text: 'Paramètres du système mis à jour', time: 'Hier', color: 'bg-purple-500' },
    { id: 4, text: 'Maintenance programmée', time: 'Il y a 2 jours', color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-2">
      {/* Greetings & Logout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">
            Bonjour, {currentUser.name}
          </h1>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === 'Responsable' ? 'bg-purple-100 text-purple-800' :
                currentUser.role === 'Chef de projet' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
              {currentUser.role}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-500">{currentUser.email}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <FiLogOut /> Déconnexion
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <dt>
              <div className={`absolute rounded-md ${item.bg} p-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FiActivity className="text-slate-500" />
              Activité Récente
            </h3>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Tout voir</a>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-600">
                            {activity.text}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-400">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions / Info Card */}
        <div className="bg-slate-800 text-white shadow-lg rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Besoin d'aide ?</h3>
            <p className="text-slate-300 text-sm mb-6">Consultez la documentation ou contactez le support technique TILI.</p>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center gap-2">
                📚 Documentation
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center gap-2">
                📞 Support Technique
              </button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">Version 1.2.0 • TILI Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
