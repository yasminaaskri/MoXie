import React from 'react';

const DesktopSidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de Bord' },
    { id: 'users', icon: '👥', label: 'Utilisateurs' },
    { id: 'documents', icon: '📄', label: 'Documents' }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-gradient-to-b from-primary-600 via-primary-700 to-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-4xl font-bold tracking-wider mb-3">TILI</h1>
        <p className="text-sm text-white/80 italic leading-relaxed">
          Plateforme de Gestion Interne
        </p>
        <p className="text-xs text-white/60 mt-3 pt-3 border-t border-white/10">
          Tunisia Inclusive Labor Institute
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-l-4 ${
              activeMenu === item.id
                ? 'bg-white/15 border-white font-semibold'
                : 'border-transparent hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-600 border-2 border-white/30 flex items-center justify-center font-bold text-lg">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Mohamed Aziz Awadhi</p>
            <p className="text-xs text-white/70">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
