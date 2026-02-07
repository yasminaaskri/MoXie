import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserList from './pages/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AudioControl from './components/AudioControl';
import PageDescriptor from './components/PageDescriptor';
import VoiceAssistant from './components/VoiceAssistant';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import voiceManager from './utils/voiceManager';
import './App.css';

function App(){
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <div className="container">
                <Routes>
                  <Route path="/login" element={<PublicLayout><Login/></PublicLayout>} />
                  <Route path="/register" element={<PublicLayout><Register/></PublicLayout>} />
                  <Route path="/users" element={<AdminLayout><ProtectedRoute roles={["responsable","chef"]}><UserList/></ProtectedRoute></AdminLayout>} />
                  <Route path="/" element={<AdminLayout><ProtectedRoute><Home/></ProtectedRoute></AdminLayout>} />
                </Routes>
              </div>
            </main>
            {/* Contrôles audio pour accessibilité */}
            <PageDescriptor />
            <VoiceAssistant />
          </div>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
