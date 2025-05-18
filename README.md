# KonKon Web Application

This repository contains a minimal prototype of **KonKon**, a kiosk-mode web application enabling therapists to create secure video call links for patients. The system is designed around a Node.js/Express backend using WebSocket (via Socket.IO) for signaling and a lightweight React frontend.

## Structure

- **server/** – Express backend with a Socket.IO server.
- **client/** – Simple React application served as static files.

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

## Recording utility

The `recorder/` directory contains a Node.js script that captures webcam video
and microphone audio on systems like Puppy Linux. Recording output is stored on
a mounted USB drive. After recording, the audio is analyzed for periods of
silence. Groups of 3--5 consecutive speech segments are uploaded to the Kitsu9
server for speech recognition. Metadata describing each uploaded chunk is saved
in a JSON file next to the recording.

Environment variables:

- `USB_PATH` &ndash; mount point of the USB drive (default: `/mnt/usb`)
- `RECORD_DURATION` &ndash; recording length in seconds (default: `30`)
- `KITSU9_URL` &ndash; endpoint for speech-to-text uploads

Example run:

```bash
cd recorder && npm install   # once online
USB_PATH=/mnt/usb RECORD_DURATION=60 node index.js
```

This creates `session-<timestamp>.mp4`, `session-<timestamp>.wav` and
`session-<timestamp>.json` on the USB drive.

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.
