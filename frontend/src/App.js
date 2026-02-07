import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserList from './pages/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 lg:ml-0 pt-[60px] lg:pt-0">
            <Routes>
              <Route path="/login" element={<PublicLayout><Login/></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><Register/></PublicLayout>} />
              <Route path="/" element={<AdminLayout><ProtectedRoute><Home/></ProtectedRoute></AdminLayout>} />
              <Route path="/users" element={<AdminLayout><ProtectedRoute roles={["responsable","chef"]}><UserList/></ProtectedRoute></AdminLayout>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
