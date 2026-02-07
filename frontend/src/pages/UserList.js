import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import VoiceInput from '../components/VoiceInput';

export default function UserList(){
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'consultant' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useContext(AuthContext);
  const { speak } = useSpeechSynthesis();

  const roleLabels = {
    responsable: 'Responsable',
    chef: 'Chef de projet',
    consultant: 'Consultant'
  };

  const roleColors = {
    responsable: 'bg-red-600',
    chef: 'bg-blue-600',
    consultant: 'bg-green-600'
  };

  useEffect(()=>{
    loadUsers();
    // Annoncer la page au chargement
    speak('Page de gestion des utilisateurs. Consultez la liste des utilisateurs et gérez leurs comptes.');
  },[speak]);

  const loadUsers = async () => {
    try{ 
      const res = await api.get('/users'); 
      setUsers(res.data); 
    }
    catch(err){ 
      console.error(err);
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  const openCreateModal = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', password: '', role: 'consultant' });
    setError('');
    setShowModal(true);
    // Annoncer l'ouverture du modal de création
    setTimeout(() => {
      speak('Formulaire de création d\'utilisateur ouvert. Remplissez les informations requises.');
    }, 500);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setError('');
    setShowModal(true);
    // Annoncer l'ouverture du modal de modification
    setTimeout(() => {
      speak(`Modification de l'utilisateur ${user.name}. Modifiez les informations nécessaires.`);
    }, 500);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setFormData({ name: '', email: '', password: '', role: 'consultant' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    speak(editUser ? 'Mise à jour en cours...' : 'Création de l\'utilisateur en cours...');

    try {
      if (editUser) {
        const updates = { name: formData.name, role: formData.role };
        await api.put(`/users/${editUser._id}`, updates);
        speak('Utilisateur mis à jour avec succès.');
      } else {
        await api.post('/auth/register', formData);
        speak('Nouvel utilisateur créé avec succès.');
      }
      await loadUsers();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue';
      setError(errorMessage);
      speak(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    speak('Suppression de l\'utilisateur en cours...');
    
    try {
      await api.delete(`/users/${userId}`);
      await loadUsers();
      speak('Utilisateur supprimé avec succès.');
    } catch (err) {
      speak('Erreur lors de la suppression de l\'utilisateur.');
      alert('Erreur lors de la suppression');
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData({...formData, role: selectedRole});
    
    const roleDescriptions = {
      consultant: 'Consultant sélectionné. Accès limité en lecture.',
      chef: 'Chef de projet sélectionné. Peut gérer les utilisateurs.',
      responsable: 'Responsable sélectionné. Accès complet à toutes les fonctionnalités.'
    };
    
    speak(roleDescriptions[selectedRole]);
  };

  const canDelete = currentUser?.role === 'responsable';
  const canEdit = currentUser?.role === 'responsable' || currentUser?.role === 'chef';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-2">
              Gestion des utilisateurs
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Créez et gérez les comptes utilisateurs avec leurs rôles et droits d'accès
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={openCreateModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <span className="text-xl">+</span>
              <span>Nouvel utilisateur</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-md">
            <div className="text-2xl md:text-3xl font-bold">{users.length}</div>
            <div className="text-xs md:text-sm opacity-90">Total</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white shadow-md">
            <div className="text-2xl md:text-3xl font-bold">{users.filter(u => u.role === 'responsable').length}</div>
            <div className="text-xs md:text-sm opacity-90">Responsables</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white shadow-md">
            <div className="text-2xl md:text-3xl font-bold">{users.filter(u => u.role === 'chef').length}</div>
            <div className="text-xs md:text-sm opacity-90">Chefs</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-md">
            <div className="text-2xl md:text-3xl font-bold">{users.filter(u => u.role === 'consultant').length}</div>
            <div className="text-xs md:text-sm opacity-90">Consultants</div>
          </div>
        </div>
      </div>

      {/* Mobile: Cards View */}
      <div className="lg:hidden space-y-3">
        {users.map(u => (
          <div key={u._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-brown to-brand-brown-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {(u.name||'?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{u.name}</div>
                <div className="text-sm text-gray-600 truncate">{u.email}</div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-xs font-semibold ${roleColors[u.role]}`}>
                  {roleLabels[u.role]}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {new Date(u.createdAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex gap-2">
                {canEdit && (
                  <button 
                    onClick={() => openEditModal(u)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 active:scale-95 transition-all"
                  >
                    Modifier
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => handleDelete(u._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 active:scale-95 transition-all"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-brown to-brand-brown-dark flex items-center justify-center text-white font-bold">
                        {(u.name||'?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${roleColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {canEdit && (
                        <button 
                          onClick={() => openEditModal(u)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                          aria-label={`Modifier ${u.name}`}
                        >
                          Modifier
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                          aria-label={`Supprimer ${u.name}`}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </h2>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <VoiceInput
                label="Nom complet"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nom et prénom de l'utilisateur"
                required
                autoFocus
              />
              
              <VoiceInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="adresse@email.com"
                required
                className={editUser ? 'bg-gray-100' : ''}
                disabled={!!editUser}
              />
              
              {!editUser && (
                <VoiceInput
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Mot de passe sécurisé"
                  required
                />
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle
                  <span className="text-red-500 ml-1" aria-label="obligatoire">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.role}
                  onChange={handleRoleChange}
                  onFocus={() => speak('Sélectionnez le rôle de l\'utilisateur dans l\'organisation')}
                  required
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
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {loading ? 'Enregistrement...' : (editUser ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>

              {/* Instructions vocales */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Instructions vocales
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Naviguez avec <kbd className="px-1 py-0.5 bg-blue-100 rounded">Tab</kbd> entre les champs</li>
                  <li>• Appuyez sur <kbd className="px-1 py-0.5 bg-blue-100 rounded">Alt + V</kbd> pour la saisie vocale</li>
                  <li>• Parlez clairement après le signal sonore</li>
                  <li>• Le système vous guide pour chaque champ</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
