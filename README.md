# PeerFlix 🎬

A peer-to-peer video streaming platform built with modern web technologies. Stream and share videos directly between peers using WebTorrent technology.

![PeerFlix](https://img.shields.io/badge/PeerFlix-P2P%20Streaming-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)

## ✨ Features

- **P2P Video Streaming** - Stream videos directly between peers using WebTorrent
- **Video Upload** - Upload videos that automatically get seeded to the P2P network
- **Real-time P2P Stats** - Monitor active peers, download/upload speeds
- **Dark Gaming UI** - Modern dark theme with glassmorphism effects
- **Responsive Design** - Works on desktop and mobile devices
- **Magnet URI Support** - Share videos via magnet links

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- TanStack Query (data fetching)
- Wouter (routing)
- Zustand (state management)

### Backend
- Node.js + Express
- MongoDB (database)
- WebTorrent (P2P streaming)
- Multer (file uploads)

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (running locally or connection string)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sonuolikkara/PeerFlix.git
   cd PeerFlix
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd p2pStreaming-backend
   npm install
   ```

4. **Configure environment**
   
   Create `.env` file in `p2pStreaming-backend/`:
   ```env
   MONGO_URI=mongodb://localhost:27017/p2pStreaming
   PORT=3000
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the backend**
   ```bash
   cd p2pStreaming-backend
   node index.js
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

8. **Open in browser**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3000

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos |
| GET | `/api/videos/:id` | Get video by ID |
| POST | `/api/videos/upload` | Upload a new video |
| GET | `/api/stats` | Get P2P network stats |

## 🔧 How P2P Streaming Works

1. **Upload** - When you upload a video, WebTorrent creates a torrent and starts seeding
2. **Magnet URI** - Each video gets a unique magnet URI for P2P sharing
3. **Peers** - Other users can connect as peers to download/stream the video
4. **Trackers** - Public WebTorrent trackers help peers discover each other

## 📁 Project Structure

```
PeerFlix/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities & API
│   │   └── stores/         # Zustand stores
│   └── public/             # Static assets
├── p2pStreaming-backend/   # Backend Express server
│   ├── config/             # DB & Multer config
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── router/             # API routes
│   └── utils/              # WebTorrent utilities
└── server/                 # Vite dev server
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sonu Olikkara Sabu**
- GitHub: [@Sonuolikkara](https://github.com/Sonuolikkara)

---

<p align="center">
  Made with ❤️ using React, Node.js & WebTorrent
</p>
