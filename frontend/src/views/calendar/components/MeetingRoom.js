import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Meeting from '../meeting/Meeting';

const MeetingRoom = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();

  const handleLeaveMeeting = () => {
    navigate('/calendar');
  };

  return (
    <div className="h-screen w-full relative">
      {/* Leave Meeting Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleLeaveMeeting}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <span className="material-icons-outlined text-sm">exit_to_app</span>
          Leave Meeting
        </button>
      </div>
      
      {/* Meeting Component */}
      <Meeting roomName={roomName} />
    </div>
  );
};

export default MeetingRoom;