

import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

export default function UserEventModal() {
  const { setShowEventModal, selectedEvent } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (selectedEvent && selectedEvent.meetingUrl) {
      // If it's our internal meeting URL, navigate to it
      if (selectedEvent.meetingUrl.startsWith('/meeting/')) {
        navigate(selectedEvent.meetingUrl);
      } else {
        // If it's an external URL, open in new tab
        window.open(selectedEvent.meetingUrl, '_blank');
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <Draggable handle=".drag-handle">
        <div className="bg-white rounded-lg shadow-2xl w-64 md:w-1/2 lg:w-1/4">
          <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="material-icons-outlined text-gray-400 drag-handle cursor-move">
              drag_handle
            </span>
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400 hover:text-gray-600">
                close
              </span>
            </button>
          </header>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              {selectedEvent?.title}
            </h2>
            
            {selectedEvent?.description && (
              <p className="text-gray-600 mb-3">{selectedEvent.description}</p>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <span className="material-icons-outlined text-sm mr-2">schedule</span>
                <span className="text-sm">
                  {formatTime(selectedEvent?.startTime)} - {formatTime(selectedEvent?.endTime)}
                </span>
              </div>
              
              {selectedEvent?.label && (
                <div className="flex items-center">
                  <span className="material-icons-outlined text-sm mr-2 text-gray-600">
                    bookmark_border
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs bg-${selectedEvent.label}-200 text-${selectedEvent.label}-800`}>
                    {selectedEvent.label}
                  </span>
                </div>
              )}
            </div>

            {/* Meeting Join Button */}
            {selectedEvent?.meetingUrl && (
              <div className="border-t pt-4">
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-icons-outlined text-sm">videocam</span>
                  Join Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
}

