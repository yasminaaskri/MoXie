import React, { useState, useEffect } from 'react';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('rapports');
  const [fileName, setFileName] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Test de connexion au backend
    fetch(`${API_URL}/documents`)
      .then(response => {
        console.log('Backend accessible:', response.ok);
        return response.json();
      })
      .then(data => {
        console.log('Documents chargés:', data.length);
      })
      .catch(error => {
        console.error('Erreur de connexion backend:', error);
      });
    
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents`);
      const data = await response.json();
      setDocuments(data);
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

    console.log('Début de l\'upload:', uploadFile.name);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('type', uploadType);
    formData.append('uploadedBy', 'Mohamed Aziz Awadhi');

    try {
      console.log('Envoi de la requête...');
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      console.log('Réponse reçue:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Document ajouté:', result);
        
        setUploadFile(null);
        setFileName('');
        setShowUploadModal(false);
        await loadDocuments();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'success-notification';
        successMsg.textContent = '✓ Document ajouté avec succès';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } else {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        alert(`Erreur: ${errorData.error || 'Erreur lors de l\'ajout du document'}`);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(`${API_URL}/documents/${doc._id}/download?user=Mohamed Aziz Awadhi`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      loadDocuments();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleView = async (doc) => {
    try {
      await fetch(`${API_URL}/documents/${doc._id}?user=Mohamed Aziz Awadhi`);
      window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank');
      setTimeout(() => loadDocuments(), 500);
    } catch (error) {
      console.error('Erreur lors de la consultation:', error);
      window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank');
    }
  };

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Centralisez et organisez toute votre documentation</p>
        </div>
      </div>

      <div className="documents-container">
        <div className="section-header">
          <h2 className="section-title">Bibliothèque Documentaire</h2>
          <button className="btn-new-document" onClick={() => setShowUploadModal(true)}>
            <span className="btn-icon">📄</span>
            NOUVEAU DOCUMENT
          </button>
        </div>

        <div className="documents-list">
          {isLoading ? (
            <div className="loading-state">Chargement...</div>
          ) : documents.length === 0 ? (
            <div className="empty-state">Aucun document disponible</div>
          ) : (
            documents.map(doc => (
              <div key={doc._id} className="document-card">
                <div className="document-icon">📄</div>
                <div className="document-info">
                  <h3 className="document-title">{doc.name}</h3>
                  <p className="document-meta">
                    Rapport • Ajouté le {doc.uploadDate} par {doc.uploadedBy}
                  </p>
                </div>
                <div className="document-actions">
                  <button className="btn-action btn-view" onClick={() => handleView(doc)}>
                    <span className="action-icon">👁</span>
                    VOIR
                  </button>
                  <button className="btn-action btn-download" onClick={() => handleDownload(doc)}>
                    <span className="action-icon">📥</span>
                    TÉLÉCHARGER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Nouveau Document</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Type de document</label>
                <select 
                  value={uploadType} 
                  onChange={(e) => setUploadType(e.target.value)}
                  className="form-input"
                >
                  <option value="rapports">Rapport</option>
                  <option value="comptes_rendus">Compte rendu</option>
                  <option value="documents_administratifs">Document administratif</option>
                  <option value="projets">Projet</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fichier</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="form-input"
                />
                {fileName && <p className="file-name">{fileName}</p>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowUploadModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
