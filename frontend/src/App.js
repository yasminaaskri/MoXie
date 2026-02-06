import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentsPage from './components/DocumentsPage';

function App() {
  const [activeMenu, setActiveMenu] = useState('documents');

  return (
    <div className="App">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      {activeMenu === 'documents' && <DocumentsPage />}
      {activeMenu === 'dashboard' && <div style={{marginLeft: '250px', padding: '40px'}}>Tableau de Bord - En construction</div>}
      {activeMenu === 'users' && <div style={{marginLeft: '250px', padding: '40px'}}>Utilisateurs - En construction</div>}
    </div>
  );
}

export default App;
