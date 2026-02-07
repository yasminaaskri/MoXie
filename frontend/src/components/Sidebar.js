import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeMenu, setActiveMenu, mobileOpen, setMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de Bord' },
    { id: 'users', icon: '👥', label: 'Utilisateurs' },
    { id: 'documents', icon: '📄', label: 'Documents' }
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
      ></div>
      
      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">TILI</h1>
          <p className="sidebar-subtitle">Plateforme de Gestion Interne</p>
          <p className="sidebar-org">Tunisia Inclusive Labor Institute</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">M</div>
            <div className="user-info">
              <div className="user-name">Mohamed Aziz Awadhi</div>
              <div className="user-role">Administrateur</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
