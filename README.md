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
3. Serve the frontend:
   ```bash
   cd client && npm start
   ```
   Then navigate to the printed URL (default http://localhost:3000) in your browser.

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.
