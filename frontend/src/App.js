import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentsPage from './components/DocumentsPage';

function App() {
  const [activeMenu, setActiveMenu] = useState('documents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="App">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      {activeMenu === 'documents' && (
        <DocumentsPage 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      {activeMenu === 'dashboard' && (
        <div style={{marginLeft: '250px', padding: '40px'}}>
          <h1>Tableau de Bord - En construction</h1>
        </div>
      )}
      {activeMenu === 'users' && (
        <div style={{marginLeft: '250px', padding: '40px'}}>
          <h1>Utilisateurs - En construction</h1>
        </div>
      )}
    </div>
  );
}

export default App;
