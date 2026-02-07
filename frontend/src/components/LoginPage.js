import React, { useState, useEffect } from 'react';
import { FiMic, FiLock, FiMail, FiUser, FiInfo } from 'react-icons/fi';

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Simulation of voice input (Alt+V)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'v') {
        toggleVoiceInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setEmail('admin@tili.tn');
        setPassword('password123');
        setIsListening(false);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: 'Mohamed Aziz', role: 'Responsable', email: email });
  };

  return (
    <div className="min-h-screen bg-[#4a5568] flex items-center justify-center lg:pl-64 p-4 font-sans">
      {/* Sidebar for Auth Pages (matching RegisterPage) */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#3d4654] border-r border-[#4e5a6b] hidden lg:block">
        <div className="p-8">
          <h1 className="text-white text-2xl font-bold tracking-widest font-serif">TILI</h1>
          <p className="text-gray-400 text-xs mt-1">Plateforme de Gestion</p>
        </div>
        <nav className="mt-10 px-4 space-y-2">
          <button
            className="w-full text-left px-4 py-3 rounded-lg bg-white text-gray-800 shadow-lg text-sm font-bold"
          >
            Connexion
          </button>
          <button
            onClick={onNavigateToRegister}
            className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-[#4e5a6b] hover:text-white transition-colors text-sm font-medium"
          >
            Inscription
          </button>
        </nav>

        {/* Floating Assistant Card */}
        <div className="absolute bottom-10 left-4 right-4 bg-white rounded-xl p-4 shadow-2xl">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
              <FiInfo className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-800">Assistant Vocal</h4>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">Cliquez pour démarrer une conversation guidée par la voix</p>
              <button type="button" className="mt-2 w-full bg-[#10b981] text-white text-[10px] py-2 rounded-lg font-bold hover:bg-[#059669] transition-colors">
                🎙️ Tester la voix
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
          <p className="text-sm text-gray-500 mt-2">Bienvenue sur la plateforme TILI</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Adresse Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-10 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-700"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-10 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-700"
                placeholder="********"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e293b] text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4"
          >
            Se connecter
          </button>

          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`w-full flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-sm font-bold transition-all ${isListening
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FiMic className={isListening ? 'text-red-500' : 'text-gray-400'} />
            {isListening ? 'Écoute en cours...' : 'Saisie vocale (Alt+V)'}
          </button>

          <div className="text-center text-sm pt-2">
            <span className="text-gray-500">Pas encore de compte ? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-blue-600 hover:text-blue-700 outline-none"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>

      {/* Floating Design Elements (matching RegisterPage) */}
      <button type="button" className="fixed top-8 right-8 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg">
        <span className="text-lg">♫</span>
      </button>
    </div>
  );
};

export default LoginPage;
