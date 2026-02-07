import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de connexion
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar gauche - cachée sur mobile */}
      <div className="hidden lg:flex lg:w-64 bg-gradient-to-b from-primary-600 via-primary-700 to-gray-900 text-white flex-col p-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-wider mb-3">TILI</h1>
          <p className="text-sm text-white/80">Plateforme de Gestion Interne</p>
        </div>
        
        <nav className="space-y-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isLogin ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span className="text-xl">🔐</span>
            <span>Login</span>
          </button>
          
          <button
            onClick={() => setIsLogin(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              !isLogin ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span className="text-xl">📝</span>
            <span>Sign Up</span>
          </button>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900">
        {/* Header mobile */}
        <div className="lg:hidden absolute top-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl font-bold tracking-wider">TILI</h1>
          <p className="text-sm text-white/80 mt-1">Plateforme de Gestion Interne</p>
        </div>

        {/* Carte de connexion */}
        <div className="w-full max-w-md">
          {/* Logo centré - visible sur mobile */}
          <div className="text-center mb-8 lg:mb-12 mt-20 lg:mt-0">
            <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-wider mb-2">
              TILI
            </h1>
            <p className="text-white/90 text-sm lg:text-base">
              Plateforme de Gestion Interne
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 lg:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 lg:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-base"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl active:scale-98 min-h-[48px]"
              >
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          </div>

          {/* Boutons mobile en bas */}
          <div className="lg:hidden flex gap-3 mt-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? 'bg-white text-primary-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🔐 Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? 'bg-white text-primary-700'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📝 Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
