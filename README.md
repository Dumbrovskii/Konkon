# KonKon Web Application

This repository contains a minimal prototype of **KonKon**, a kiosk-mode web application enabling therapists to create secure video call links for patients. The system is designed around a Node.js/Express backend using WebSocket (via Socket.IO) for signaling and a lightweight React frontend.

## Structure

- **server/** – Express backend with a Socket.IO server.
- **client/** – Simple React application served as static files.
- **recorder/** – Node.js utility for capturing video/audio and uploading
  audio fragments to Kitsu9.

## Running

1. Install dependencies (requires npm):
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Start the backend server:
   ```bash
   node src/server.js
   ```
3. Open `client/index.html` in Firefox kiosk mode to access the UI.

### Recording kiosk sessions

The `recorder` tool captures webcam video and microphone audio to a mounted USB
drive and uploads the audio fragments for speech recognition. To run it:

```bash
cd recorder && npm install
USB_PATH=/mnt/usb node index.js
```

Set `USB_PATH` to the mount point of your USB storage and optionally
`RECORD_DURATION` to control the length of the recording in seconds.

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.
