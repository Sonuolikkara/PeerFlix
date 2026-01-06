# P2P Video Streaming API Documentation

## Base URL
```
http://localhost:3000/api/videos
```

## Overview

This API provides endpoints for uploading, managing, and streaming videos using P2P (peer-to-peer) technology with WebTorrent. The backend acts as an initial seeder for all uploaded videos.

---

## Endpoints

### 1. Upload Video

Upload a video file to the server. The video will be automatically seeded via WebTorrent.

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| video | File | Yes | Video file (max 500MB) |

**Allowed File Types:**
- `.mp4`
- `.avi`
- `.mov`
- `.mkv`
- `.webm`

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "videoId": "6dca31f3-34a2-4841-84bc-a963a7d8128d",
    "filename": "original.mp4",
    "originalFilename": "my-video.mp4",
    "fileSize": 145771,
    "mimeType": "video/mp4",
    "filePath": "/home/user/videos/6dca31f3-34a2-4841-84bc-a963a7d8128d/original.mp4",
    "magnetURI": "magnet:?xt=urn:btih:3ecd3a9e431d44ecfe18a3891aa075230e2fc205&dn=original.mp4&tr=...",
    "infoHash": "3ecd3a9e431d44ecfe18a3891aa075230e2fc205",
    "uploadedAt": "2025-12-15T17:08:39.337Z"
  }
}
```

**Error Responses:**

*400 Bad Request - No file uploaded:*
```json
{
  "success": false,
  "error": "No video file uploaded"
}
```

*400 Bad Request - Invalid file type:*
```json
{
  "success": false,
  "error": "Invalid file type. Allowed types: .mp4, .avi, .mov, .mkv, .webm"
}
```

*400 Bad Request - File too large:*
```json
{
  "success": false,
  "error": "File too large",
  "details": "Maximum file size is 500MB"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/videos/upload \
  -F "video=@/path/to/video.mp4"
```

---

### 2. List All Videos

Retrieve a list of all uploaded videos, sorted by upload date (newest first).

**Endpoint:** `GET /`

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69403f4d98ad5cd78f35bcf0",
      "videoId": "31c80614-2d28-42a0-8e8c-20f3456bcd38",
      "filename": "original.mp4",
      "originalFilename": "my-video.mp4",
      "filePath": "/home/user/videos/31c80614-2d28-42a0-8e8c-20f3456bcd38/original.mp4",
      "fileSize": 5433373,
      "mimeType": "video/mp4",
      "magnetURI": "magnet:?xt=urn:btih:52a576c1315273856c46237a68a75d539ebd4bfd&dn=original.mp4&tr=...",
      "uploadedAt": "2025-12-15T17:03:09.774Z"
    },
    {
      "_id": "6940386d3a83a136ac3f5f1e",
      "videoId": "f9e04449-3a71-4cae-a780-f969e13669dd",
      "filename": "original.mp4",
      "originalFilename": "another-video.mp4",
      "filePath": "/home/user/videos/f9e04449-3a71-4cae-a780-f969e13669dd/original.mp4",
      "fileSize": 322793,
      "mimeType": "video/mp4",
      "magnetURI": "magnet:?xt=urn:btih:c88ad8c19b28afcf3e91fe4703a7f6e1a512e362&dn=original.mp4&tr=...",
      "uploadedAt": "2025-12-15T16:33:49.823Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/videos
```

---

### 3. Get Video by ID

Retrieve complete metadata for a specific video.

**Endpoint:** `GET /:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String (UUID) | Unique video identifier |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6940386d3a83a136ac3f5f1e",
    "videoId": "f9e04449-3a71-4cae-a780-f969e13669dd",
    "filename": "original.mp4",
    "originalFilename": "my-video.mp4",
    "filePath": "/home/user/videos/f9e04449-3a71-4cae-a780-f969e13669dd/original.mp4",
    "fileSize": 322793,
    "mimeType": "video/mp4",
    "magnetURI": "magnet:?xt=urn:btih:c88ad8c19b28afcf3e91fe4703a7f6e1a512e362&dn=original.mp4&tr=...",
    "uploadedAt": "2025-12-15T16:33:49.823Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Video not found"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/videos/f9e04449-3a71-4cae-a780-f969e13669dd
```

---

### 4. Get Magnet URI

Retrieve only the magnet URI for a specific video (useful for P2P streaming clients).

**Endpoint:** `GET /:id/magnet`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | String (UUID) | Unique video identifier |

**Success Response (200 OK):**
```json
{
  "success": true,
  "magnetURI": "magnet:?xt=urn:btih:c88ad8c19b28afcf3e91fe4703a7f6e1a512e362&dn=original.mp4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.dev"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Video not found"
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/videos/f9e04449-3a71-4cae-a780-f969e13669dd/magnet
```

---

### 5. Get Seeding Statistics

Retrieve real-time statistics about active torrents being seeded by the backend.

**Endpoint:** `GET /stats`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activeTorrents": 3,
    "totalPeers": 5,
    "totalUploaded": 1048576,
    "uploadSpeed": 102400,
    "torrents": [
      {
        "name": "original.mp4",
        "infoHash": "3ecd3a9e431d44ecfe18a3891aa075230e2fc205",
        "peers": 2,
        "uploaded": 524288,
        "uploadSpeed": 51200,
        "progress": 1
      },
      {
        "name": "original.mp4",
        "infoHash": "c88ad8c19b28afcf3e91fe4703a7f6e1a512e362",
        "peers": 3,
        "uploaded": 524288,
        "uploadSpeed": 51200,
        "progress": 1
      }
    ]
  }
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| activeTorrents | Number | Total number of torrents being seeded |
| totalPeers | Number | Total number of connected peers across all torrents |
| totalUploaded | Number | Total bytes uploaded across all torrents |
| uploadSpeed | Number | Current upload speed in bytes/second |
| torrents | Array | Detailed information for each torrent |

**cURL Example:**
```bash
curl http://localhost:3000/api/videos/stats
```

---

## Data Models

### Video Model

```javascript
{
  videoId: String (UUID v4, unique),
  filename: String,
  originalFilename: String,
  filePath: String,
  fileSize: Number (bytes),
  mimeType: String,
  magnetURI: String,
  uploadedAt: Date (ISO 8601)
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (validation error, missing fields, etc.)
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate ID)
- `500 Internal Server Error` - Server error

---

## P2P Streaming

### Using Magnet URIs

The magnet URIs returned by this API can be used with WebTorrent-compatible clients:

**Browser (WebTorrent):**
```javascript
const WebTorrent = require('webtorrent');
const client = new WebTorrent();

client.add(magnetURI, (torrent) => {
  const file = torrent.files[0];
  file.appendTo('body'); // Append video to DOM
});
```

**Node.js:**
```javascript
const WebTorrent = require('webtorrent');
const client = new WebTorrent();

client.add(magnetURI, (torrent) => {
  torrent.files[0].getBuffer((err, buffer) => {
    // Use buffer
  });
});
```

**Desktop Clients:**
- WebTorrent Desktop
- qBittorrent
- Transmission
- Any BitTorrent client supporting magnet links

---

## Rate Limits

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

---

## File Storage

Videos are stored in the following directory structure:
```
/videos/{videoId}/original.{ext}
```

Example:
```
/videos/f9e04449-3a71-4cae-a780-f969e13669dd/original.mp4
```

---

## Seeding Behavior

- **Automatic Seeding:** All uploaded videos are automatically seeded by the backend
- **Startup Seeding:** On server startup, all existing videos are seeded
- **Persistent Seeding:** Videos continue to be seeded until server shutdown
- **Graceful Shutdown:** Torrents are cleanly destroyed on server shutdown (SIGINT/SIGTERM)

---

## Example Workflows

### Upload and Stream Workflow

1. **Upload video:**
   ```bash
   curl -X POST http://localhost:3000/api/videos/upload \
     -F "video=@my-video.mp4"
   ```

2. **Get magnet URI from response:**
   ```json
   {
     "data": {
       "videoId": "abc-123",
       "magnetURI": "magnet:?xt=urn:btih:..."
     }
   }
   ```

3. **Stream using WebTorrent client:**
   ```javascript
   client.add(magnetURI, (torrent) => {
     torrent.files[0].renderTo('video');
   });
   ```

### List and Retrieve Workflow

1. **List all videos:**
   ```bash
   curl http://localhost:3000/api/videos
   ```

2. **Get specific video:**
   ```bash
   curl http://localhost:3000/api/videos/{videoId}
   ```

3. **Get magnet URI only:**
   ```bash
   curl http://localhost:3000/api/videos/{videoId}/magnet
   ```

---

## Notes

- Maximum file size: **500MB**
- Supported video formats: **MP4, AVI, MOV, MKV, WebM**
- Video IDs are **UUID v4** format
- All timestamps are in **ISO 8601** format
- Backend acts as **initial seeder** for all videos
- Magnet URIs include **multiple trackers** for better peer discovery

---

## Support

For issues or questions, please refer to the project repository or contact the development team.
