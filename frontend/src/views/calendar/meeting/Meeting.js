import React, { useContext, useState, useRef } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';
import GlobalContext from "../context/GlobalContext";
import { FiLogOut } from "react-icons/fi";

import { updateEvent } from "../service/ApiEvents";

const Meeting = ({ roomName }) => {
  const { setActiveMeeting, savedEvents, dispatchCalEvent } = useContext(GlobalContext);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  React.useEffect(() => {
    let recognition = null;
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR'; // Default to French

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.error("Failed to start recognition:", e);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleLeave = async () => {
    if (transcript.trim().length > 0) {
      // 1. Create and download transcript file (Backup)
      const element = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = new Blob([transcript], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Transcript-${roomName}-${timestamp}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // 2. Save to Database
      console.log("Looking for event with meetingUrl:", roomName);
      console.log("Available savedEvents:", savedEvents);
      const meetingEvent = savedEvents.find(evt => evt.meetingUrl === roomName);
      console.log("Found meetingEvent:", meetingEvent);

      if (meetingEvent) {
        try {
          const updatedEvent = {
            ...meetingEvent,
            transcript: (meetingEvent.transcript ? meetingEvent.transcript + "\n\n" : "") +
              `[${new Date().toLocaleString()}] New Session:\n${transcript}`
          };
          const response = await updateEvent(meetingEvent._id, updatedEvent);
          dispatchCalEvent({ type: "update", payload: response.data });
          console.log("Transcript saved to event:", response.data);
        } catch (error) {
          console.error("Failed to save transcript to DB:", error);
          alert("Transcript downloaded locally, but failed to save to database.");
        }
      }
    }
    setActiveMeeting(null);
  };

  const SpinnerView = () => {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/80 text-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>

          {/* Text */}
          <p className="text-lg font-medium tracking-wide">
            Joining the meeting…
          </p>
        </div>
      </div>
    );
  };


  const handleApiReady = (externalApi) => {
    // Callback when the Jitsi Meet External API is ready
    console.log('Jitsi Meet API is ready:', externalApi);
    // You can use the externalApi object to interact with the meeting

    // Remove auto-close listeners to allow "I am the host" login flow
    // externalApi.addEventListeners({
    //   videoConferenceLeft: () => setActiveMeeting(null),
    //   readyToClose: () => setActiveMeeting(null)
    // });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <button
        onClick={handleLeave}
        className="absolute top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg font-medium transition-colors"
      >
        <FiLogOut />
        Leave & Save Transcript
      </button>
      {transcript && (
        <div className="absolute top-4 right-4 z-50 bg-black/70 text-white p-3 rounded-lg max-w-xs text-xs backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1 text-green-400 font-bold uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Recording
          </div>
          <div className="line-clamp-3 opacity-90 font-mono">
            {transcript.substring(transcript.length - 100)}
          </div>
        </div>
      )}
      <JitsiMeeting
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false, // REQUIRED for local speech recognition
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: 'User'
        }}
        spinner={SpinnerView}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
};


export default Meeting;
