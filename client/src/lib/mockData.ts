import { Video, Channel, PlaylistItem } from './types';

export const currentUser = {
  name: "Demo User",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=peerflix&backgroundColor=3b82f6",
  email: "demo@peerflix.io"
};

export const categories = [
  "All", "Gaming", "Music", "Live", "Mixes", "Computers", "Programming", "Podcasts", "News", "Sports", "Learning", "Fashion"
];

const channels: Record<string, Channel> = {
  "c1": {
    id: "c1",
    name: "Tech Hunters",
    avatarUrl: "https://images.unsplash.com/photo-1531297461136-8204b255658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    subscribers: "1.2M",
    verified: true
  },
  "c2": {
    id: "c2",
    name: "Nature Life",
    avatarUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    subscribers: "450K"
  },
  "c3": {
    id: "c3",
    name: "Code Daily",
    avatarUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    subscribers: "89K",
    verified: true
  },
  "c4": {
    id: "c4",
    name: "Music Vibe",
    avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    subscribers: "2.5M",
    verified: true
  }
};

export const videos: Video[] = [
  {
    id: "v1",
    title: "Building a YouTube Clone in 1 Hour",
    description: "In this video we will build a modern YouTube clone using React, Tailwind CSS and Zustand.",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k", // Use actual youtube ID for ReactPlayer if needed, or sample mp4
    duration: "12:45",
    channel: channels["c3"],
    views: "120K",
    likes: "5.2K",
    uploadDate: "2 days ago",
    categoryId: "Programming"
  },
  {
    id: "v2",
    title: "Top 10 Gadgets of 2025",
    description: "Here are the top 10 gadgets you must have in 2025. From smart glasses to AI pins.",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "8:30",
    channel: channels["c1"],
    views: "540K",
    likes: "22K",
    uploadDate: "1 week ago",
    categoryId: "Gaming"
  },
  {
    id: "v3",
    title: "Relaxing Rain Sounds for Sleep",
    description: "Peaceful rain sounds to help you sleep and relax.",
    thumbnailUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "10:00:00",
    channel: channels["c2"],
    views: "1.2M",
    likes: "15K",
    uploadDate: "3 months ago",
    categoryId: "Music"
  },
  {
    id: "v4",
    title: "Lo-Fi Beats to Code To",
    description: "The best lo-fi beats for coding and studying.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "1:00:00",
    channel: channels["c4"],
    views: "890K",
    likes: "34K",
    uploadDate: "1 month ago",
    categoryId: "Music"
  },
  {
    id: "v5",
    title: "How to Center a Div",
    description: "The ultimate guide to centering a div in CSS.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "5:20",
    channel: channels["c3"],
    views: "2.1M",
    likes: "120K",
    uploadDate: "1 year ago",
    categoryId: "Programming"
  },
  {
    id: "v6",
    title: "Amazing Mountain Views 4K",
    description: "Stunning 4K footage of mountains.",
    thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "15:10",
    channel: channels["c2"],
    views: "10K",
    likes: "500",
    uploadDate: "5 hours ago",
    categoryId: "Nature"
  },
    {
    id: "v7",
    title: "Cyberpunk City Ambience",
    description: "Futuristic city ambience for focus.",
    thumbnailUrl: "https://images.unsplash.com/photo-1515630278258-407f66498911?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "3:00:00",
    channel: channels["c4"],
    views: "45K",
    likes: "1.2K",
    uploadDate: "2 weeks ago",
    categoryId: "Music"
  },
  {
    id: "v8",
    title: "Setup Tour 2025",
    description: "My new desk setup tour.",
    thumbnailUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_g_k",
    duration: "18:45",
    channel: channels["c1"],
    views: "125K",
    likes: "8K",
    uploadDate: "3 days ago",
    categoryId: "Gaming"
  }
];

export const playlists: PlaylistItem[] = [
  { id: "p1", name: "Watch Later", count: 12 },
  { id: "p2", name: "Favorites", count: 8 },
  { id: "p3", name: "React Tutorials", count: 24 },
  { id: "p4", name: "Music Mix", count: 50 },
];
