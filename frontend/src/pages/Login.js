import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import VoiceInput from '../components/VoiceInput';
import { t } from '../utils/translations';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('ar-TN'); // Langue par défaut
  const { login } = useContext(AuthContext);
  const { speak } = useSpeechSynthesis();
  const nav = useNavigate();

  // Annoncer la page au chargement
  React.useEffect(() => {
    const announcement = t('voice_instructions.page_login', currentLanguage);
    speak(announcement, { lang: currentLanguage });
  }, [speak, currentLanguage]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const progressMessage = t('voice_instructions.login_progress', currentLanguage);
    speak(progressMessage, { lang: currentLanguage });
    
    try { 
      await login(email, password); 
      const successMessage = t('voice_instructions.login_success', currentLanguage);
      speak(successMessage, { lang: currentLanguage });
      nav('/'); 
    }
    catch (err) { 
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      speak(`خطأ: ${errorMessage}`, { lang: currentLanguage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-brown via-brand-brown-dark to-gray-900">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl font-serif text-white mb-2 tracking-wider">
            TILI
          </div>
          <p className="text-white/80 text-sm">Plateforme de Gestion Interne</p>
          
          {/* Sélecteur de langue */}
          <div className="mt-4 flex justify-center">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="ar-TN" className="text-black">🇹🇳 تونسي</option>
              <option value="fr-FR" className="text-black">🇫🇷 Français</option>
              <option value="ar" className="text-black">🇸🇦 عربي</option>
            </select>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Se connecter
          </h1>
          
          <form onSubmit={submit} className="space-y-4">
            <VoiceInput
              label={t('email', currentLanguage)}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoFocus
              language={currentLanguage}
            />
            
            <VoiceInput
              label={t('password', currentLanguage)}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              language={currentLanguage}
            />

            {error && (
              <div 
                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-describedby="login-status"
            >
              {loading ? t('voice_instructions.login_progress', currentLanguage) : t('login', currentLanguage)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Instructions vocales */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              Instructions vocales
            </h2>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Cliquez sur un champ ou appuyez sur <kbd className="px-1 py-0.5 bg-blue-100 rounded">Tab</kbd></li>
              <li>• Appuyez sur <kbd className="px-1 py-0.5 bg-blue-100 rounded">Alt + V</kbd> pour la saisie vocale</li>
              <li>• Parlez clairement après le signal sonore</li>
              <li>• Appuyez sur <kbd className="px-1 py-0.5 bg-blue-100 rounded">Échap</kbd> pour arrêter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
