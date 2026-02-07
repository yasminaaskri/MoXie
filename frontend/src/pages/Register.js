import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import VoiceInput from '../components/VoiceInput';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const { speak } = useSpeechSynthesis();
  const nav = useNavigate();

  // Annoncer la page au chargement
  React.useEffect(() => {
    speak('Page d\'inscription. Remplissez le formulaire pour créer votre compte TILI.');
  }, [speak]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    speak('Création du compte en cours...');
    
    try { 
      await register({ name, email, password, role }); 
      speak('Compte créé avec succès. Redirection vers le tableau de bord.');
      nav('/'); 
    }
    catch (err) { 
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      speak(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    
    const roleDescriptions = {
      consultant: 'Consultant sélectionné. Accès limité en lecture.',
      chef: 'Chef de projet sélectionné. Peut gérer les utilisateurs.',
      responsable: 'Responsable sélectionné. Accès complet à toutes les fonctionnalités.'
    };
    
    speak(roleDescriptions[selectedRole]);
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
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Créer un compte
          </h1>
          
          <form onSubmit={submit} className="space-y-4">
            <VoiceInput
              label="Nom complet"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
              required
              autoFocus
            />

            <VoiceInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            
            <VoiceInput
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rôle
                <span className="text-red-500 ml-1" aria-label="obligatoire">*</span>
              </label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={role} 
                onChange={handleRoleChange}
                onFocus={() => speak('Sélectionnez votre rôle dans l\'organisation')}
                aria-describedby="role-help"
              >
                <option value="consultant">Consultant</option>
                <option value="chef">Chef de projet</option>
                <option value="responsable">Responsable</option>
              </select>
              <div id="role-help" className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-gray-600 space-y-1">
                <div><strong>Consultant:</strong> Accès limité en lecture</div>
                <div><strong>Chef de projet:</strong> Peut gérer les utilisateurs</div>
                <div><strong>Responsable:</strong> Accès complet</div>
              </div>
            </div>

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
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Instructions vocales */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              Instructions vocales
            </h2>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Cliquez sur un champ ou naviguez avec <kbd className="px-1 py-0.5 bg-blue-100 rounded">Tab</kbd></li>
              <li>• Appuyez sur <kbd className="px-1 py-0.5 bg-blue-100 rounded">Alt + V</kbd> pour la saisie vocale</li>
              <li>• Parlez clairement votre nom, email ou mot de passe</li>
              <li>• Le système vous guidera pour chaque champ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
