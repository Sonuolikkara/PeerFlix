import { useParams } from "wouter";
import ReactPlayer from 'react-player';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoCard } from '@/components/video/VideoCard';
import { P2PStatusIndicator } from '@/components/video/P2PStatusIndicator';
import { videos } from '@/lib/mockData';
import { fetchVideoById, fetchVideos, VideoFromAPI, formatFileSize, formatDate } from '@/lib/api';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Download, MessageSquare, Heart, Sparkles, Wifi, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { Video } from '@/lib/types';

// Transform API video to frontend Video format
function transformApiVideo(apiVideo: VideoFromAPI): Video {
  return {
    id: apiVideo.videoId,
    title: apiVideo.originalFilename.replace(/\.[^/.]+$/, ''),
    description: `File size: ${formatFileSize(apiVideo.fileSize)}\n\nThis video is being streamed via P2P (WebTorrent). The more people watch, the faster it loads!`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    videoUrl: apiVideo.magnetURI,
    duration: 'P2P',
    views: '0',
    likes: '0',
    uploadDate: formatDate(apiVideo.uploadedAt),
    categoryId: 'All',
    channel: {
      id: 'p2p',
      name: 'P2P Upload',
      avatarUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      subscribers: '0',
    },
  };
}

export default function Watch() {
  const { id } = useParams();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [magnetCopied, setMagnetCopied] = useState(false);
  const { sidebarOpen } = useAppStore();

  // Try to fetch video from API first
  const { data: apiVideo, isLoading: apiLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideoById(id || ''),
    enabled: !!id,
    retry: false,
  });

  // Fetch all videos for suggestions
  const { data: apiVideosResponse } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  // Determine video source
  const isP2PVideo = !!apiVideo?.data;
  const video = isP2PVideo 
    ? transformApiVideo(apiVideo.data)
    : videos.find(v => v.id === id) || videos[0];

  // Get magnet URI for P2P videos
  const magnetUri = isP2PVideo ? apiVideo.data.magnetURI : null;

  // Copy magnet URI to clipboard
  const copyMagnetUri = () => {
    if (magnetUri) {
      navigator.clipboard.writeText(magnetUri);
      setMagnetCopied(true);
      setTimeout(() => setMagnetCopied(false), 2000);
    }
  };

  // Filter out current video from suggestions
  const apiVideos = apiVideosResponse?.data?.map(transformApiVideo) || [];
  const allVideos = apiVideos.length > 0 ? [...apiVideos, ...videos] : videos;
  const suggestions = allVideos.filter(v => v.id !== video.id);
  const displaySuggestions = suggestions.slice(0, 10);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Header />
      <Sidebar />
      <P2PStatusIndicator />
      
      {/* Simple centered container, no sidebar offset */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto pt-[4.5rem] px-4 md:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Primary Column - Video Player & Info */}
          <div className="flex-1 min-w-0">
            {/* P2P Badge */}
            {isP2PVideo && (
              <div className="mb-4 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-black">
                  <Wifi size={14} />
                  P2P Streaming
                </div>
                <button
                  onClick={copyMagnetUri}
                  className="inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-xs font-mono border-2 border-black/20 hover:border-black dark:border-white/20 dark:hover:border-white transition-colors"
                >
                  {magnetCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {magnetCopied ? 'Copied!' : 'Copy Magnet'}
                </button>
              </div>
            )}

            {/* Player Container - TV Frame Style */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] mb-6 relative z-10">
               {/* @ts-ignore - ReactPlayer types are sometimes tricky */}
               <ReactPlayer 
                 url={video.videoUrl} 
                 width="100%" 
                 height="100%" 
                 controls
                 playing
                 light={video.thumbnailUrl} // Use thumbnail as placeholder
                 playIcon={
                   <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                 }
               />
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl md:text-4xl font-black font-display uppercase tracking-tight leading-none">{video.title}</h1>

              {/* Action Bar */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b-2 border-black/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <a href={`/channel/${video.channel.id}`} className="flex-shrink-0 group">
                    <div className="w-14 h-14 rounded-md border-2 border-black dark:border-white overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
                      <img src={video.channel.avatarUrl} alt={video.channel.name} className="w-full h-full object-cover" />
                    </div>
                  </a>
                  <div className="flex flex-col mr-4">
                    <a href={`/channel/${video.channel.id}`} className="font-bold text-lg hover:text-primary transition-colors">{video.channel.name}</a>
                    <span className="text-xs font-mono text-muted-foreground">{video.channel.subscribers} subs</span>
                  </div>
                  <button className="neo-button bg-black text-white dark:bg-white dark:text-black border-transparent hover:opacity-80">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  <div className="flex items-center border-2 border-black dark:border-white rounded-md overflow-hidden bg-background shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-accent transition-colors border-r-2 border-black dark:border-white">
                      <ThumbsUp size={18} strokeWidth={2.5} />
                      <span className="text-sm font-bold">{video.likes}</span>
                    </button>
                    <button className="px-4 py-2 hover:bg-destructive hover:text-white transition-colors">
                      <ThumbsDown size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                  
                  <button className="neo-button bg-secondary text-white border-black dark:border-white flex items-center gap-2">
                    <Share2 size={18} strokeWidth={2.5} /> Share
                  </button>
                  
                  <button className="p-2 border-2 border-black dark:border-white rounded-md hover:bg-accent shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              {/* Description Box */}
              <div className="neo-box bg-accent/20 p-6 relative">
                <div className="font-mono text-sm font-bold mb-4 flex gap-4 border-b-2 border-black/10 dark:border-white/10 pb-2">
                  <span>{video.views} views</span>
                  <span>{video.uploadDate}</span>
                  <span className="text-primary">#{video.categoryId}</span>
                </div>
                <p className={cn("font-sans leading-relaxed text-lg", descriptionExpanded ? "" : "line-clamp-2")}>
                  {video.description}
                  <br /><br />
                  <span className="font-bold">Music in this video:</span><br/>
                  Song: Cyber Chase<br/>
                  Artist: Synthwave Boy<br/>
                  License: Creative Commons
                </p>
                <button 
                  className="mt-4 text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-primary"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  {descriptionExpanded ? "Show less" : "Read more"}
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-black uppercase font-display">Comments</h3>
                  <span className="text-muted-foreground font-mono text-base border-2 border-muted-foreground px-2 rounded-sm">482</span>
                </div>
                
                {/* Add comment input */}
                <div className="flex gap-6 mb-10">
                   <div className="w-14 h-14 rounded-md border-2 border-black dark:border-white overflow-hidden flex-shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                     <input type="text" placeholder="Add a public comment..." className="neo-input bg-transparent focus:bg-background transition-colors h-14 text-lg" />
                     <div className="flex justify-end gap-3 mt-3">
                        <button className="px-6 py-2 font-bold text-sm uppercase hover:bg-accent/50 rounded-md">Cancel</button>
                        <button className="neo-button py-2 px-6 text-sm">Comment</button>
                     </div>
                   </div>
                </div>
                
                {/* Mock Comments */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-6 mb-8 group">
                    <div className="w-12 h-12 rounded-md bg-muted border-2 border-black/20 dark:border-white/20 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-xs mb-2">
                        <span className="font-bold bg-black text-white px-2 py-0.5 rounded-sm dark:bg-white dark:text-black uppercase tracking-wider">User {i}</span>
                        <span className="text-muted-foreground font-mono">2 days ago</span>
                      </div>
                      <p className="text-base mb-3 border-l-4 border-accent pl-4 py-1 leading-relaxed">This is a great video! Really helped me understand the concepts. The visual style is amazing.</p>
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors uppercase tracking-wide">
                           <Heart size={16} /> 12
                        </button>
                        <button className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors uppercase tracking-wide">
                           <MessageSquare size={16} /> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Column - Recommendations */}
          <div className="lg:w-[450px] xl:w-[500px] flex-shrink-0">
             <h3 className="font-black uppercase font-display text-xl mb-6 flex items-center gap-2 border-b-2 border-black dark:border-white pb-2">
               <Sparkles size={20} className="text-primary" /> Up Next
             </h3>
             <div className="flex flex-col gap-6">
               {displaySuggestions.map((v, idx) => (
                 <VideoCard key={`${v.id}-sug-${idx}`} video={v} layout="row" />
               ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
