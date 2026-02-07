import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ activeMenu, setActiveMenu, mobileOpen, setMobileOpen, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'users', icon: '👥', label: 'Utilisateurs' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'calendar', icon: '📅', label: 'Calendrier' },
    { id: 'voice-ai', icon: '🎤', label: 'Assistant Vocal IA' }
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const currentUser = user || { name: 'Mohamed Aziz', role: 'Administrateur' };

  return (
    <>
      {/* Overlay pour fermer le menu sur mobile */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen && setMobileOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="sidebar-header" role="banner">
          <h1 className="sidebar-logo">TILI</h1>
          <p className="sidebar-subtitle">Plateforme de Gestion Interne</p>
          <p className="sidebar-org">Tunisia Inclusive Labor Institute</p>
        </div>

        <nav className="sidebar-nav" role="menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
              role="menuitem"
              aria-current={activeMenu === item.id ? 'page' : undefined}
              aria-label={item.label}
            >
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" role="contentinfo">
          <div className="user-profile mb-4">
            <div className="user-avatar" aria-hidden="true">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-300 hover:text-white hover:bg-red-900/40 rounded-lg transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
