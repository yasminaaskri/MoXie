import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentsPage from './components/DocumentsPage';
import VoiceAIAssistant from './components/VoiceAIAssistant';

import './views/calendar/index.css'; // Import calendar styles
import UserCalendar from './views/calendar/App';
import ContextWrapper from './views/calendar/context/ContextWrapper';

function App() {
  const [activeMenu, setActiveMenu] = useState('documents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // <div className="App">
    //   <Sidebar 
    //     activeMenu={activeMenu} 
    //     setActiveMenu={setActiveMenu}
    //     mobileOpen={mobileMenuOpen}
    //     setMobileOpen={setMobileMenuOpen}
    //   />
    //   {activeMenu === 'documents' && (
    //     <DocumentsPage 
    //       mobileMenuOpen={mobileMenuOpen}
    //       setMobileMenuOpen={setMobileMenuOpen}
    //     />
    //   )}
    //   {activeMenu === 'voice-ai' && (
    //     <div style={{marginLeft: '250px', padding: '40px', background: '#f8f9fa', minHeight: '100vh'}}>
    //       <VoiceAIAssistant />
    //     </div>
    //   )}
    // </div>
    <ContextWrapper>
      <UserCalendar />
    </ContextWrapper>
  );
}

export default App;
