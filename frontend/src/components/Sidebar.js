import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar(){
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <NavLink 
            to="/" 
            end
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white/10 shadow-[inset_6px_0_0_rgba(255,255,255,0.2)]' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-xl">🏠</span>
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/users"
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white/10 shadow-[inset_6px_0_0_rgba(255,255,255,0.2)]' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-xl">👥</span>
            <span>Utilisateurs</span>
          </NavLink>
          <button 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all w-full text-left mt-2 pt-4 border-t border-white/10"
          >
            <span className="text-xl">🚪</span>
            <span>Déconnexion</span>
          </button>
        </>
      ) : (
        <>
          <NavLink 
            to="/login"
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white/10 shadow-[inset_6px_0_0_rgba(255,255,255,0.2)]' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-xl">🔐</span>
            <span>Login</span>
          </NavLink>
          <NavLink 
            to="/register"
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white/10 shadow-[inset_6px_0_0_rgba(255,255,255,0.2)]' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-xl">📝</span>
            <span>Sign Up</span>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-brown to-brand-brown-dark text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-2xl font-serif tracking-wider">TILI</div>
          <div className="text-xs opacity-90">Gestion Interne</div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[60px]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        lg:hidden fixed top-[60px] left-0 bottom-0 w-64 z-40
        bg-gradient-to-b from-brand-brown to-brand-brown-dark text-white
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLinks />
        </nav>
        
        {user && (
          <div className="p-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center text-brand-brown font-bold">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs opacity-85 truncate">
                {user.role === 'responsable' ? 'Responsable' :
                 user.role === 'chef' ? 'Chef de projet' : 'Consultant'}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-brand-brown to-brand-brown-dark text-white min-h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="text-4xl font-serif tracking-wider">TILI</div>
          <div className="text-xs opacity-90 mt-1">Plateforme de Gestion Interne</div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLinks />
        </nav>

        {user && (
          <div className="p-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-rose-200 flex items-center justify-center text-brand-brown font-bold text-lg">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs opacity-85 truncate">
                {user.role === 'responsable' ? 'Responsable' :
                 user.role === 'chef' ? 'Chef de projet' : 'Consultant'}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
