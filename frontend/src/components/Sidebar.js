import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeMenu, setActiveMenu, mobileOpen, setMobileOpen }) => {
  const menuItems = [
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
          <div className="user-profile">
            <div className="user-avatar" aria-hidden="true">M</div>
            <div className="user-info">
              <div className="user-name">Mohamed Aziz Awadhi</div>
              <div className="user-role">Administrateur</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
