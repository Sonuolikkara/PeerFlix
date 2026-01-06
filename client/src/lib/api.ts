// API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Types for API responses
export interface VideoFromAPI {
  _id: string;
  videoId: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  magnetURI: string;
  uploadedAt: string;
}

export interface VideosResponse {
  success: boolean;
  count: number;
  data: VideoFromAPI[];
}

export interface VideoResponse {
  success: boolean;
  data: VideoFromAPI;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    videoId: string;
    filename: string;
    originalFilename: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
    magnetURI: string;
    infoHash: string;
    uploadedAt: string;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    activeTorrents: number;
    totalUploaded: number;
    totalDownloaded: number;
    totalPeers: number;
    uploadSpeed: number;
    torrents: Array<{
      name: string;
      infoHash: string;
      uploaded: number;
      downloaded: number;
      numPeers: number;
      peers: number;
      progress: number;
      uploadSpeed: number;
      connectedPeers?: Array<{
        address: string;
        port: number;
        downloaded: number;
        uploaded: number;
        downloadSpeed: number;
        uploadSpeed: number;
        type: string;
      }>;
    }>;
  };
}

// API functions
export async function fetchVideos(): Promise<VideosResponse> {
  const response = await fetch(`${API_BASE_URL}/videos`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

export async function fetchVideoById(id: string): Promise<VideoResponse> {
  const response = await fetch(`${API_BASE_URL}/videos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch video');
  }
  return response.json();
}

export async function fetchMagnetUri(id: string): Promise<{ success: boolean; data: { magnetURI: string } }> {
  const response = await fetch(`${API_BASE_URL}/videos/${id}/magnet`);
  if (!response.ok) {
    throw new Error('Failed to fetch magnet URI');
  }
  return response.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/videos/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload video');
  }

  return response.json();
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
