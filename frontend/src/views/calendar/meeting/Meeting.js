
import { JaaSMeeting } from '@jitsi/react-sdk';

const Meeting = ({ roomName = "onlineClassRoom" }) => {
  const YOUR_APP_ID = 'vpaas-magic-cookie-7e7c9b78743e4ecd98829d308b506e1e'; // Replace with your actual app ID

  const SpinnerView = () => <div>Loading...</div>; // Optional: Custom spinner component

  const handleApiReady = (externalApi) => {
    // Callback when the Jitsi Meet External API is ready
    console.log('Jitsi Meet API is ready:', externalApi);
    // You can use the externalApi object to interact with the meeting
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <JaaSMeeting
        appId={YOUR_APP_ID}
        roomName={roomName}
        configOverwrite={{
          disableThirdPartyRequests: true,
          disableLocalVideoFlip: true,
          backgroundAlpha: 0.5,
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: 'nocrop',
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
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
