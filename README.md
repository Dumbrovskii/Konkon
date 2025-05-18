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
   cd ../server # return to server directory
   ```
2. Start the backend server from inside `server/`:
   ```bash
   npm start
   ```
3. Open `client/index.html` in Firefox kiosk mode to access the UI.

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.
