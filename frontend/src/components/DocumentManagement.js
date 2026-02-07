import React, { useState, useEffect } from 'react';
import './DocumentManagement.css';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState('tous');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('rapports');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState({ total: 0, byType: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [fileName, setFileName] = useState('');

  const documentTypes = [
    { value: 'rapports', label: 'Rapports', icon: '📊' },
    { value: 'comptes_rendus', label: 'Comptes rendus', icon: '📝' },
    { value: 'documents_administratifs', label: 'Documents admin', icon: '📋' },
    { value: 'projets', label: 'Projets', icon: '🚀' }
  ];

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents`);
      const data = await response.json();
      setDocuments(data);
      
      // Calculer les statistiques
      const statsData = {
        total: data.length,
        byType: {
          rapports: data.filter(d => d.type === 'rapports').length,
          comptes_rendus: data.filter(d => d.type === 'comptes_rendus').length,
          documents_administratifs: data.filter(d => d.type === 'documents_administratifs').length,
          projets: data.filter(d => d.type === 'projets').length
        }
      };
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
    setFileName(file ? file.name : '');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('type', uploadType);
    formData.append('uploadedBy', 'Utilisateur actuel');

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newDocument = await response.json();
        setDocuments([...documents, newDocument]);
        setUploadFile(null);
        setFileName('');
        e.target.reset();
        loadDocuments(); // Recharger pour mettre à jour les stats
        
        // Animation de succès
        const successMsg = document.createElement('div');
        successMsg.className = 'success-toast';
        successMsg.textContent = '✅ Document déposé avec succès !';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } else {
        alert('Erreur lors du dépôt du document');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du dépôt du document');
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(`${API_URL}/documents/${doc.id}/download?user=Utilisateur actuel`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Recharger les documents pour mettre à jour l'historique
      loadDocuments();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const handleView = async (doc) => {
    try {
      // Enregistrer la consultation dans l'historique
      await fetch(`${API_URL}/documents/${doc.id}?user=Utilisateur actuel`);
      
      // Ouvrir le document dans un nouvel onglet
      window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank');
      
      // Recharger les documents pour mettre à jour l'historique
      setTimeout(() => loadDocuments(), 500);
    } catch (error) {
      console.error('Erreur lors de la consultation:', error);
      // Ouvrir quand même le document même si l'historique échoue
      window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType === 'tous' || doc.type === selectedType;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeLabel = (type) => {
    const typeObj = documentTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  return (
    <div className="document-management">
      <h1>📚 Gestion Documentaire</h1>

      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Documents</p>
        </div>
        <div className="stat-card">
          <h3>{stats.byType.rapports || 0}</h3>
          <p>📊 Rapports</p>
        </div>
        <div className="stat-card">
          <h3>{stats.byType.comptes_rendus || 0}</h3>
          <p>📝 Comptes rendus</p>
        </div>
        <div className="stat-card">
          <h3>{stats.byType.documents_administratifs || 0}</h3>
          <p>📋 Docs Admin</p>
        </div>
        <div className="stat-card">
          <h3>{stats.byType.projets || 0}</h3>
          <p>🚀 Projets</p>
        </div>
      </div>

      {/* Section de dépôt */}
      <div className="upload-section">
        <h2>📤 Dépôt de documents</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Type de document :</label>
            <select 
              value={uploadType} 
              onChange={(e) => setUploadType(e.target.value)}
              className="form-control"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fichier :</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                id="file-input"
              />
              <label htmlFor="file-input" className="file-input-label">
                {fileName || 'Choisir un fichier'}
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            ⬆️ Déposer le document
          </button>
        </form>
      </div>

      {/* Section de consultation */}
      <div className="consultation-section">
        <h2>📂 Consultation des documents</h2>
        
        <div className="filters">
          <div className="filter-group">
            <label>🔍 Filtrer par type :</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-control"
            >
              <option value="tous">📁 Tous les documents</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>🔎 Rechercher :</label>
            <input 
              type="text" 
              placeholder="Nom du document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="documents-list">
          {isLoading ? (
            <div className="loading"></div>
          ) : filteredDocuments.length === 0 ? (
            <p className="no-documents">Aucun document trouvé</p>
          ) : (
            <table className="documents-table">
              <thead>
                <tr>
                  <th>📄 Nom</th>
                  <th>🏷️ Type</th>
                  <th>💾 Taille</th>
                  <th>📅 Date de dépôt</th>
                  <th>👤 Déposé par</th>
                  <th>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>
                      <span className={`badge badge-${doc.type}`}>
                        {getTypeLabel(doc.type)}
                      </span>
                    </td>
                    <td>{doc.size}</td>
                    <td>{doc.uploadDate}</td>
                    <td>{doc.uploadedBy}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleView(doc)}
                        className="btn btn-sm btn-info"
                        title="Consulter"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="btn btn-sm btn-success"
                        title="Télécharger"
                      >
                        ⬇️
                      </button>
                      <button 
                        onClick={() => setShowHistory(doc.id)}
                        className="btn btn-sm btn-secondary"
                        title="Historique"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal d'historique */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Historique du document</h3>
            {documents.find(d => d.id === showHistory)?.history.map((entry, index) => (
              <div key={index} className="history-entry">
                <span className="history-date">📅 {entry.date}</span>
                <span className="history-action">{entry.action}</span>
                <span className="history-user">{entry.user}</span>
              </div>
            ))}
            <button 
              onClick={() => setShowHistory(false)}
              className="btn btn-secondary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
