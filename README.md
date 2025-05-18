# KonKon Web Application

This repository contains a minimal prototype of **KonKon**, a kiosk-mode web application enabling therapists to create secure video call links for patients. The system is designed around a Node.js/Express backend using WebSocket (via Socket.IO) for signaling and a lightweight React frontend.

## Structure

- **server/** – Express backend with a Socket.IO server.
- **client/** – Simple React application served as static files.
- **recorder/** – CLI utility for capturing webcam/audio and uploading
  transcripts.

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

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.

## recorder/ Tool

The repository also includes a CLI recorder under `recorder/`. The tool writes
video files to a USB drive and uploads metadata to Kitsu9.

Set the following environment variables before running it:

- `USB_PATH` – mount path of the writable USB drive
- `DURATION` – recording duration in seconds
- `KITSU9_URL` – URL of the Kitsu9 instance

Example usage:

```bash
USB_PATH=/media/usb1 DURATION=60 KITSU9_URL=http://localhost:9009 \
  node recorder/index.js
```

Metadata files describing the session are written alongside each recorded
media file.
