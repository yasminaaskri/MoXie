import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAccessibility } from './AccessibilityProvider';

export default function Sidebar(){
  const { user, logout } = useContext(AuthContext);
  
  // Safe accessibility hook usage with fallback
  let announce = () => {};
  try {
    const accessibility = useAccessibility();
    announce = accessibility.announce;
  } catch (error) {
    console.warn('AccessibilityProvider not found, using fallback');
  }
  
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    announce('Vous avez été déconnecté');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    announce(mobileMenuOpen ? 'Menu fermé' : 'Menu ouvert');
  };

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <NavLink 
            to="/" 
            end
            className={({isActive}) => `block px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-brown ${
              isActive 
                ? 'bg-white text-brand-brown shadow-sm' 
                : 'text-white/90 hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={({isActive}) => isActive ? 'page' : undefined}
          >
            Tableau de bord
          </NavLink>
          <NavLink 
            to="/users"
            className={({isActive}) => `block px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-brown ${
              isActive 
                ? 'bg-white text-brand-brown shadow-sm' 
                : 'text-white/90 hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={({isActive}) => isActive ? 'page' : undefined}
          >
            Utilisateurs
          </NavLink>
          
          <div className="mt-8 pt-4 border-t border-white/20">
            <button 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-brown"
              aria-label="Se déconnecter de l'application"
            >
              Déconnexion
            </button>
          </div>
        </>
      ) : (
        <>
          <NavLink 
            to="/login"
            className={({isActive}) => `block px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-brown ${
              isActive 
                ? 'bg-white text-brand-brown shadow-sm' 
                : 'text-white/90 hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={({isActive}) => isActive ? 'page' : undefined}
          >
            Connexion
          </NavLink>
          <NavLink 
            to="/register"
            className={({isActive}) => `block px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-brown ${
              isActive 
                ? 'bg-white text-brand-brown shadow-sm' 
                : 'text-white/90 hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={({isActive}) => isActive ? 'page' : undefined}
          >
            Inscription
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center" aria-hidden="true">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">TILI</h1>
            <span className="sr-only">Plateforme de Gestion Interne</span>
          </div>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[72px]"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <nav 
        id="mobile-navigation"
        className={`
          lg:hidden fixed top-[72px] left-0 bottom-0 w-64 z-40
          bg-brand-brown text-white
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shadow-xl
        `}
        role="navigation"
        aria-label="Navigation principale mobile"
      >
        <div className="flex-1 px-4 py-6 space-y-1">
          <NavLinks />
        </div>
        
        {user && (
          <div className="p-4 border-t border-white/20" role="contentinfo">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-semibold"
                aria-hidden="true"
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-white/70 truncate">
                  {user.role === 'responsable' ? 'Responsable' :
                   user.role === 'chef' ? 'Chef de projet' : 'Consultant'}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <nav 
        id="navigation"
        className="hidden lg:flex lg:flex-col lg:w-64 bg-brand-brown text-white min-h-screen shadow-xl"
        role="navigation"
        aria-label="Navigation principale"
      >
        <header className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">TILI</h1>
              <p className="text-xs text-white/70">Plateforme de Gestion</p>
            </div>
          </div>
        </header>
        
        <div className="flex-1 px-4 py-6 space-y-1">
          <NavLinks />
        </div>

        {user && (
          <div className="p-4 border-t border-white/20" role="contentinfo">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                aria-hidden="true"
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-white/70 truncate">{user.email}</div>
                <div className="text-xs text-white/70 truncate mt-1">
                  {user.role === 'responsable' ? 'Responsable' :
                   user.role === 'chef' ? 'Chef de projet' : 'Consultant'}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}