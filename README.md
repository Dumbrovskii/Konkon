# KonKon Web Application

This repository contains a minimal prototype of **KonKon**, a kiosk-mode web application enabling therapists to create secure video call links for patients. The system is designed around a Node.js/Express backend using WebSocket (via Socket.IO) for signaling and a lightweight React frontend.

## Structure

- **server/** – Express backend with a Socket.IO server.
- **client/** – Simple React application served as static files.
- **recorder/** – Utility for capturing video/audio and uploading chunks.

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
3. Start the client:
   ```bash
   cd client && npm start
   ```
4. Open `client/index.html` in Firefox kiosk mode to access the UI.

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.

## Recorder Utility

The `recorder/` directory contains a helper for capturing webcam and microphone input on Puppy Linux and uploading short audio fragments for speech to text.

### Environment variables

- `USB_PATH` – path to the mounted USB stick (default `/mnt/usb`).
- `RECORD_DURATION` – length of the recording in seconds.
- `KITSU9_URL` – URL of the speech-to-text service.

### Usage

```bash
cd recorder && npm start
```

The utility records a video, extracts audio, detects silent pauses, chops the audio into random groups of 3–5 words, uploads each chunk to `KITSU9_URL`, and saves metadata with `{id, index, startTime, endTime}` next to the recording on the USB drive.
