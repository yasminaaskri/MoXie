import React, { useState } from 'react';

const MobileNav = ({ activeMenu, setActiveMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de Bord' },
    { id: 'users', icon: '👥', label: 'Utilisateurs' },
    { id: 'documents', icon: '📄', label: 'Documents' }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">TILI</h1>
            <p className="text-xs text-gray-500">Gestion Interne</p>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <nav className="border-t border-gray-200 bg-white">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Bottom Navigation (Alternative for mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                activeMenu === item.id
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
