import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [user] = useState({
    name: 'nassir',
    email: 'nassir@esprit.tn',
    avatar: 'N'
  });

  const [stats] = useState([
    { label: 'Utilisateurs actifs', value: 24, color: '#3b82f6', icon: '👥' },
    { label: 'Projets en cours', value: 8, color: '#10b981', icon: '📊' },
    { label: 'Tâches complétées', value: 156, color: '#8b5cf6', icon: '✓' },
    { label: 'Rapports générés', value: 32, color: '#f97316', icon: '📄' }
  ]);

  const [quickActions] = useState([
    { 
      title: 'Gestion des utilisateurs', 
      description: 'Gérer les comptes et permissions',
      icon: '👥',
      color: '#3b82f6'
    },
    { 
      title: 'Rapports', 
      description: 'Générer des analyses',
      icon: '📊',
      color: '#10b981'
    },
    { 
      title: 'Paramètres', 
      description: 'Configuration du système',
      icon: '⚙️',
      color: '#8b5cf6'
    },
    { 
      title: 'Analytics', 
      description: 'Données et métriques',
      icon: '📈',
      color: '#f97316'
    }
  ]);

  const [recentActivity] = useState([
    { text: 'Nouvel utilisateur créé', time: 'Il y a 2 heures', color: '#3b82f6' },
    { text: 'Rapport généré', time: 'Il y a 4 heures', color: '#10b981' },
    { text: 'Paramètres mis à jour', time: 'Hier', color: '#8b5cf6' },
    { text: 'Maintenance programmée', time: 'Il y a 2 jours', color: '#f97316' }
  ]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="subtitle">Vue d'ensemble de votre plateforme</p>
        </div>
        <button className="btn-primary">
          <span>⚙️</span>
          Chef de projet
        </button>
      </div>

      {/* User Welcome Card */}
      <div className="welcome-card">
        <div className="user-info">
          <div className="user-avatar">{user.avatar}</div>
          <div>
            <h2>Bonjour, {user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-indicator" style={{ backgroundColor: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Quick Actions */}
        <div className="section">
          <h3>Actions rapides</h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="action-card">
                <div className="action-icon" style={{ backgroundColor: action.color + '20', color: action.color }}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <div className="section-header">
            <h3>Activité récente</h3>
            <a href="#" className="view-all">Voir toute l'activité →</a>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot" style={{ backgroundColor: activity.color }}></div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
