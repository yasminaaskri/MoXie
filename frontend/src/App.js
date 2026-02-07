import React from 'react';
import './App.css';
import './views/calendar/index.css'; // Import calendar styles
import UserCalendar from './views/calendar/App';
import ContextWrapper from './views/calendar/context/ContextWrapper';

function App() {
  return (
    <ContextWrapper>
      <UserCalendar />
    </ContextWrapper>
  );
}

export default App;
