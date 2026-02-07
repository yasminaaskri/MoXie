import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserList from './pages/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AccessibilityToolbar from './components/AccessibilityToolbar';

function App(){
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Skip Links pour navigation clavier */}
          <a href="#main-content" className="skip-link">
            Aller au contenu principal
          </a>
          <a href="#navigation" className="skip-link">
            Aller à la navigation
          </a>
          
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main 
              id="main-content"
              role="main"
              className="flex-1 lg:ml-0 pt-[72px] lg:pt-0"
              aria-label="Contenu principal"
            >
              <Routes>
                <Route path="/login" element={<PublicLayout><Login/></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><Register/></PublicLayout>} />
                <Route path="/" element={<AdminLayout><ProtectedRoute><Home/></ProtectedRoute></AdminLayout>} />
                <Route path="/users" element={<AdminLayout><ProtectedRoute roles={["responsable","chef"]}><UserList/></ProtectedRoute></AdminLayout>} />
              </Routes>
            </main>
          </div>
          
          {/* Toolbar d'accessibilité */}
          <AccessibilityToolbar />
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
