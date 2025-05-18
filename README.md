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

This prototype implements the core API endpoint `/api/create-call` which generates a unique room identifier. Clients connect via Socket.IO to exchange signaling messages for WebRTC connections.

## Директория `recorder/`

В каталоге `recorder/` содержится утилита для записи аудио и видео. Скрипт `index.js` сохраняет файлы на подключённый USB-носитель и при наличии сети может передавать их на сервер Kitsu9.

### Параметры

- `USB_PATH` — путь к смонтированному носителю.
- `RECORD_DURATION` — длительность записи в секундах.
- `KITSU9_URL` — адрес API для загрузки файла.

### Пример запуска в Puppy Linux

```bash
USB_PATH=/mnt/sdb1 RECORD_DURATION=30 KITSU9_URL=https://kitsu9.example \
node recorder/index.js
```

После завершения на носителе появляются `record.wav` и `record.mp3`: первая — оригинальная запись, вторая — сжатая копия.

### Установка зависимостей

Требуемые пакеты (например, `ffmpeg-static`) устанавливаются отдельно после подключения к сети:

```bash
cd recorder && npm install
```
