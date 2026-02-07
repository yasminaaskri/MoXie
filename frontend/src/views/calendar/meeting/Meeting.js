import React, { useContext } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';
import GlobalContext from "../context/GlobalContext";
import { FiLogOut } from "react-icons/fi";

const Meeting = ({ roomName }) => {
  const { setActiveMeeting } = useContext(GlobalContext);

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
        onClick={() => setActiveMeeting(null)}
        className="absolute top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg font-medium transition-colors"
      >
        <FiLogOut />
        Leave Meeting
      </button>
      <JitsiMeeting
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
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
