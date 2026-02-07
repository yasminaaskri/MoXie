import React, { useState, useEffect } from 'react';
import './DocumentsPage.css';
import TextToSpeech from './TextToSpeech';
import './TextToSpeech.css';

const DocumentsPage = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('rapports');
  const [fileName, setFileName] = useState('');
  const [showListenModal, setShowListenModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentText, setDocumentText] = useState('');

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

  const handleDelete = async (doc) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${doc.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/documents/${doc._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadDocuments();
        
        // Annonce vocale pour les lecteurs d'écran
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `Le document ${doc.name} a été supprimé avec succès`;
        document.body.appendChild(announcement);
        
        const successMsg = document.createElement('div');
        successMsg.className = 'success-notification';
        successMsg.setAttribute('role', 'alert');
        successMsg.textContent = '✓ Document supprimé avec succès';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          successMsg.remove();
          announcement.remove();
        }, 3000);
      } else {
        alert('Erreur lors de la suppression du document');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du document');
    }
  };

  const handleListen = async (doc) => {
    setCurrentDocument(doc);
    setShowListenModal(true);
    setDocumentText('Chargement du contenu du document...');
    
    try {
      const response = await fetch(`${API_URL}/documents/${doc._id}/text`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.text) {
          setDocumentText(data.text);
        } else if (data.fallback) {
          setDocumentText(data.fallback);
        }
      } else {
        setDocumentText(`Impossible d'extraire le texte du document ${doc.name}. ${data.error || ''}`);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du texte:', error);
      setDocumentText(`Erreur lors du chargement du contenu du document ${doc.name}. Veuillez réessayer.`);
    }
  };

  return (
    <div className="documents-page" role="main" aria-label="Page de gestion des documents">
      {/* Header Mobile avec bouton menu */}
      <div className="mobile-header" role="banner">
        <button 
          className="menu-toggle" 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Ouvrir le menu de navigation"
          aria-expanded={mobileMenuOpen}
        >
          ☰
        </button>
        <h1>TILI</h1>
        <div style={{width: '40px'}} aria-hidden="true"></div>
      </div>

      <div className="page-header" role="region" aria-label="En-tête de la page">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Centralisez et organisez toute votre documentation</p>
        </div>
      </div>

      <div className="documents-container" role="region" aria-label="Liste des documents">
        <div className="section-header">
          <h2 className="section-title" id="documents-heading">Bibliothèque Documentaire</h2>
          <button 
            className="btn-new-document" 
            onClick={() => setShowUploadModal(true)}
            aria-label="Ajouter un nouveau document"
          >
            <span className="btn-icon" aria-hidden="true">📄</span>
            <span>NOUVEAU DOCUMENT</span>
          </button>
        </div>

        <div className="documents-list" aria-live="polite" aria-atomic="true">
          {isLoading ? (
            <div className="loading-state" role="status" aria-label="Chargement des documents en cours">
              Chargement...
            </div>
          ) : documents.length === 0 ? (
            <div className="empty-state" role="status">Aucun document disponible</div>
          ) : (
            <>
              {/* Tableau pour desktop */}
              <table className="documents-table" aria-labelledby="documents-heading">
                <caption className="sr-only">
                  Liste de {documents.length} documents avec leurs informations et actions disponibles
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Nom du document</th>
                    <th scope="col">Type</th>
                    <th scope="col">Taille</th>
                    <th scope="col">Date d'ajout</th>
                    <th scope="col">Déposé par</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={doc._id}>
                      <th scope="row">{doc.name}</th>
                      <td>
                        <span className={`badge badge-${doc.type}`} role="text">
                          {doc.type}
                        </span>
                      </td>
                      <td>{doc.size}</td>
                      <td>
                        <time dateTime={doc.uploadDate}>{doc.uploadDate}</time>
                      </td>
                      <td>{doc.uploadedBy}</td>
                      <td className="actions">
                        <button 
                          className="btn btn-sm btn-listen" 
                          onClick={() => handleListen(doc)}
                          aria-label={`Écouter le document ${doc.name}`}
                        >
                          <span aria-hidden="true">🔊</span>
                          <span className="sr-only">Écouter</span>
                        </button>
                        <button 
                          className="btn btn-sm btn-info" 
                          onClick={() => handleView(doc)} 
                          aria-label={`Voir le document ${doc.name}`}
                        >
                          <span aria-hidden="true">👁️</span>
                          <span className="sr-only">Voir</span>
                        </button>
                        <button 
                          className="btn btn-sm btn-success" 
                          onClick={() => handleDownload(doc)}
                          aria-label={`Télécharger le document ${doc.name}`}
                        >
                          <span aria-hidden="true">📥</span>
                          <span className="sr-only">Télécharger</span>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(doc)}
                          aria-label={`Supprimer le document ${doc.name}`}
                        >
                          <span aria-hidden="true">🗑️</span>
                          <span className="sr-only">Supprimer</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cartes pour mobile */}
              <div className="documents-cards" role="list" aria-label="Liste des documents">
                {documents.map(doc => (
                  <article 
                    key={doc._id} 
                    className="document-card-mobile"
                    role="listitem"
                    aria-label={`Document: ${doc.name}`}
                  >
                    <h3>{doc.name}</h3>
                    <div className="meta" role="group" aria-label="Informations du document">
                      <div><strong>Type:</strong> {doc.type}</div>
                      <div><strong>Taille:</strong> {doc.size}</div>
                      <div><strong>Date:</strong> <time dateTime={doc.uploadDate}>{doc.uploadDate}</time></div>
                      <div><strong>Par:</strong> {doc.uploadedBy}</div>
                    </div>
                    <div className="actions" role="group" aria-label="Actions disponibles">
                      <button 
                        className="btn-listen" 
                        onClick={() => handleListen(doc)}
                        aria-label={`Écouter le document ${doc.name}`}
                      >
                        <span aria-hidden="true">🔊</span> Écouter
                      </button>
                      <button 
                        className="btn-view" 
                        onClick={() => handleView(doc)}
                        aria-label={`Voir le document ${doc.name}`}
                      >
                        <span aria-hidden="true">👁️</span> Voir
                      </button>
                      <button 
                        className="btn-download" 
                        onClick={() => handleDownload(doc)}
                        aria-label={`Télécharger le document ${doc.name}`}
                      >
                        <span aria-hidden="true">📥</span> Télécharger
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(doc)}
                        aria-label={`Supprimer le document ${doc.name}`}
                      >
                        <span aria-hidden="true">🗑️</span> Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowUploadModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 id="modal-title">
                  <span>📄</span>
                  Nouveau document
                </h2>
                <div className="accessibility-info">
                  <span>♿</span>
                  Formulaire accessible - Compatible lecteur d'écran
                </div>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="modal-close"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleUpload} aria-label="Formulaire d'ajout de document">
                <div className="form-group">
                  <label htmlFor="document-type">
                    <span>📋</span>
                    Type de document
                    <span className="required">*</span>
                  </label>
                  <select 
                    id="document-type"
                    value={uploadType} 
                    onChange={(e) => setUploadType(e.target.value)}
                    className="form-input"
                    aria-required="true"
                  >
                    <option value="rapports">📊 Rapport</option>
                    <option value="comptes_rendus">📝 Compte rendu</option>
                    <option value="documents_administratifs">📋 Document administratif</option>
                    <option value="projets">🚀 Projet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="document-file">
                    <span>📎</span>
                    Fichier
                    <span className="required">*</span>
                  </label>
                  <input 
                    id="document-file"
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    className="form-input"
                    aria-required="true"
                    aria-describedby="file-help"
                  />
                  <span id="file-help" className="sr-only">
                    Formats acceptés: PDF, Word, Excel, PowerPoint
                  </span>
                  {fileName && (
                    <p className="file-name" role="status" aria-live="polite">
                      {fileName}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowUploadModal(false)}
                aria-label="Annuler l'ajout de document"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                onClick={handleUpload}
                aria-label="Confirmer l'ajout du document"
              >
                Ajouter le document
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal d'écoute */}
      {showListenModal && currentDocument && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowListenModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="listen-modal-title"
        >
          <div className="modal-content modal-listen" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="listen-modal-title">🔊 Écouter le document</h2>
              <button 
                onClick={() => setShowListenModal(false)}
                className="modal-close"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <TextToSpeech 
              text={documentText}
              documentName={currentDocument.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
