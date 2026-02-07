# Troubleshooting Jitsi Meeting in Calendar App

If you cannot see the "Join" button or the meeting does not start:

1. **Install Dependencies**:
   Ensure you have installed the Jitsi SDK. Open your terminal in `c:\Users\Dell\Desktop\MoxieMaraTech\frontend` and run:
   ```bash
   npm install @jitsi/react-sdk
   ```

2. **Open Existing Event**:
   The "Join" button only appears when you **open an existing event**.
   - Create a meeting.
   - Click "Créer la réunion". The modal will close.
   - Click the event bubble on the calendar to open it again.
   - Look for the **Green "Join" button** at the bottom.

3. **Check Browser Console**:
   If the meeting screen is white or broken, check the browser console (F12) for errors like "Module not found". This confirms you need to run `npm install`.
