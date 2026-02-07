import React, { useState, useEffect } from 'react';

const DocumentsPageMobile = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('rapports');
  const [fileName, setFileName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');

  const API_URL = 'http://localhost:5000/api';

  const documentTypes = [
    { value: 'rapports', label: 'Rapport', icon: '📊', color: 'bg-blue-100 text-blue-700' },
    { value: 'comptes_rendus', label: 'Compte rendu', icon: '📝', color: 'bg-green-100 text-green-700' },
    { value: 'documents_administratifs', label: 'Doc. admin', icon: '📋', color: 'bg-orange-100 text-orange-700' },
    { value: 'projets', label: 'Projet', icon: '🚀', color: 'bg-purple-100 text-purple-700' }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Erreur:', error);
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
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('type', uploadType);
    formData.append('uploadedBy', 'Mohamed Aziz Awadhi');

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadFile(null);
        setFileName('');
        setShowUploadModal(false);
        loadDocuments();
        
        // Success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-4 right-4 bg-accent-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-slide-down';
        notification.textContent = '✓ Document ajouté avec succès';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    } catch (error) {
      console.error('Erreur:', error);
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
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleView = async (doc) => {
    try {
      await fetch(`${API_URL}/documents/${doc._id}?user=Mohamed Aziz Awadhi`);
      window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'tous' || doc.type === filterType;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeInfo = (type) => {
    return documentTypes.find(t => t.value === type) || documentTypes[0];
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0 pt-16 lg:pt-0 lg:ml-64 bg-gradient-to-br from-gray-50 via-primary-50 to-gray-100">
      {/* Page Header */}
      <header className="bg-gradient-to-br from-gray-50 to-primary-50 px-4 py-6 lg:px-8 lg:py-10 border-b border-gray-200">
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Documents
        </h1>
        <p className="text-sm lg:text-base text-gray-600 italic">
          Centralisez et organisez toute votre documentation
        </p>
      </header>

      {/* Search and Filter */}
      <div className="sticky top-16 lg:top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none lg:w-auto"
          >
            <option value="tous">Tous les types</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 lg:px-8 lg:py-8">
        {/* Stats Cards - Mobile Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 -mx-4 px-4 lg:grid lg:grid-cols-5 lg:mx-0 lg:px-0 lg:overflow-visible">
          {[
            { label: 'Total', value: documents.length, icon: '📁', color: 'bg-gray-100 text-gray-700' },
            ...documentTypes.map(type => ({
              label: type.label,
              value: documents.filter(d => d.type === type.value).length,
              icon: type.icon,
              color: type.color
            }))
          ].map((stat, index) => (
            <div key={index} className="card flex-shrink-0 w-32 lg:w-auto p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Documents List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bibliothèque Documentaire
          </h2>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-touch bg-accent-600 text-white hover:bg-accent-700 active:scale-95 shadow-md flex items-center gap-2 text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nouveau Document</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-500">Aucun document trouvé</p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {filteredDocuments.map(doc => {
              const typeInfo = getTypeInfo(doc.type);
              return (
                <div key={doc._id} className="card p-4 lg:p-5 hover:shadow-lg transition-all border-l-4 border-primary-600">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="text-3xl lg:text-4xl flex-shrink-0">{typeInfo.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-base lg:text-lg">
                        {doc.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-3">
                        <span className={`px-2 py-1 rounded-lg font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span>•</span>
                        <span>Ajouté le {doc.uploadDate}</span>
                        <span>•</span>
                        <span>par {doc.uploadedBy}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="flex-1 btn-touch bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300 text-sm font-semibold"
                        >
                          👁 Voir
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex-1 btn-touch bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 text-sm font-semibold shadow-md"
                        >
                          📥 Télécharger
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Nouveau Document
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de document
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="input-base"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fichier
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="input-base"
                />
                {fileName && (
                  <p className="mt-2 text-sm text-gray-600 truncate">
                    📎 {fileName}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-touch bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-touch bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 active:scale-95 shadow-lg font-semibold"
                >
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

export default DocumentsPageMobile;
