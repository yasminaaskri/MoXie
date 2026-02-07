import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import './App.css';
import './views/calendar/index.css'; // Import calendar styles
import UserCalendar from './views/calendar/App';
import ContextWrapper from './views/calendar/context/ContextWrapper';
import Sidebar from './components/Sidebar';
import DocumentsPage from './components/DocumentsPage';
import VoiceAIAssistant from './components/VoiceAIAssistant';
import Dashboard from './components/Dashboard';
import UsersPage from './components/UsersPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Auth state
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveMenu('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  const handleRegister = (userData) => {
    setUser({ ...userData, name: userData.name || 'Nouvel Utilisateur' });
    setActiveMenu('dashboard');
  };

  // If not logged in, show Auth screens
  if (!user) {
    return authView === 'login' ? (
      <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64 h-full min-h-screen transition-all duration-300 overflow-hidden">

        {/* Mobile Header (Only visible on small screens) */}
        <header className="bg-white border-b border-gray-200 lg:hidden px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-label="Open sidebar"
          >
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="font-bold text-gray-800 text-lg tracking-tight">TILI</span>
          <div className="w-8" aria-hidden="true" />
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="h-full p-4 sm:p-6 lg:p-8">
            {activeMenu === 'dashboard' && (
              <Dashboard user={user} onLogout={handleLogout} />
            )}
            {activeMenu === 'users' && (
              <UsersPage />
            )}
            {activeMenu === 'calendar' && (
              <div className="min-h-full bg-white rounded-xl shadow-sm border border-gray-100 p-0">
                <ContextWrapper>
                  <UserCalendar />
                </ContextWrapper>
              </div>
            )}
            {activeMenu === 'documents' && (
              <DocumentsPage
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            )}
            {activeMenu === 'voice-ai' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                <VoiceAIAssistant />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
