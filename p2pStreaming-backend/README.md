# P2P Video Streaming Backend

A Node.js backend for peer-to-peer video streaming using WebTorrent. Upload videos and stream them using P2P technology with automatic seeding.

## Features

- 🎥 **Video Upload** - Upload videos up to 500MB
- 🌐 **P2P Streaming** - Stream videos using WebTorrent/BitTorrent protocol
- 🌱 **Automatic Seeding** - Backend acts as initial seeder for all videos
- 📊 **Seeding Statistics** - Real-time stats on active torrents and peers
- 🗄️ **MongoDB Storage** - Video metadata stored in MongoDB
- 🔒 **File Validation** - Type and size validation for uploads
- 📁 **Organized Storage** - Each video in its own UUID-based directory

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **P2P:** WebTorrent
- **File Upload:** Multer
- **Environment:** dotenv

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd p2pStreaming
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   CONNECTION_STRING=mongodb://localhost:27017/p2pstreaming
   ```

4. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Video Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/videos/upload` | Upload a video file |
| GET | `/api/videos` | List all videos |
| GET | `/api/videos/:id` | Get video metadata by ID |
| GET | `/api/videos/:id/magnet` | Get magnet URI for a video |
| GET | `/api/videos/stats` | Get seeding statistics |

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Quick Start

### Upload a Video

```bash
curl -X POST http://localhost:3000/api/videos/upload \
  -F "video=@/path/to/your/video.mp4"
```

### List All Videos

```bash
curl http://localhost:3000/api/videos
```

### Get Magnet URI

```bash
curl http://localhost:3000/api/videos/{videoId}/magnet
```

### Stream with WebTorrent

```javascript
const WebTorrent = require('webtorrent');
const client = new WebTorrent();

// Get magnet URI from API
const magnetURI = 'magnet:?xt=urn:btih:...';

client.add(magnetURI, (torrent) => {
  const file = torrent.files[0];
  file.appendTo('body'); // Append video to DOM
});
```

## Project Structure

```
p2pStreaming/
├── config/
│   ├── dbConnection.js      # MongoDB connection
│   └── multerConfig.js      # File upload configuration
├── controllers/
│   └── videoController.js   # Video route handlers
├── models/
│   └── videoModel.js        # Video schema
├── router/
│   └── videoManagementRouter.js  # API routes
├── utils/
│   └── torrent.js           # WebTorrent utilities
├── videos/                  # Uploaded videos storage
├── index.js                 # Main application entry
├── package.json
└── .env                     # Environment variables
```

## Configuration

### File Upload Limits

- **Max file size:** 500MB
- **Allowed formats:** MP4, AVI, MOV, MKV, WebM

To change these limits, edit `config/multerConfig.js`:

```javascript
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
```

### Storage Location

Videos are stored in `/videos/{videoId}/original.{ext}`

To change the storage location, modify the `destination` function in `config/multerConfig.js`.

## Seeding Behavior

- **Automatic Seeding:** All uploaded videos are automatically seeded
- **Startup Seeding:** Existing videos are seeded when server starts
- **Persistent Seeding:** Videos remain seeded until server shutdown
- **Graceful Shutdown:** Clean torrent cleanup on SIGINT/SIGTERM

## Development

### Run in Development Mode

```bash
npm start
```

The server uses `--watch` flag to automatically restart on file changes.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| CONNECTION_STRING | MongoDB connection string | Required |

## API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details"
}
```

## Monitoring

### Check Seeding Statistics

```bash
curl http://localhost:3000/api/videos/stats
```

Response includes:
- Active torrents count
- Total connected peers
- Total uploaded bytes
- Current upload speed
- Per-torrent statistics

## Troubleshooting

### MongoDB Connection Issues

Ensure MongoDB is running and the connection string in `.env` is correct:
```bash
mongod --dbpath /path/to/data
```

### Port Already in Use

Change the port in `.env`:
```env
PORT=3001
```

### Upload Fails

Check:
- File size is under 500MB
- File format is supported
- Disk space is available

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue in the repository.
