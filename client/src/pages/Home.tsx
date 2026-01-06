import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoGridSkeleton } from '@/components/video/VideoCardSkeleton';
import { UploadModal } from '@/components/video/UploadModal';
import { P2PStatusIndicator } from '@/components/video/P2PStatusIndicator';
import { useAppStore } from '@/stores/useAppStore';
import { videos as mockVideos, categories } from '@/lib/mockData';
import { fetchVideos, VideoFromAPI, formatFileSize, formatDate } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Sparkles, Upload, Plus, Wifi } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Video } from '@/lib/types';
import { useState } from 'react';

// Transform API video to frontend Video format
function transformApiVideo(apiVideo: VideoFromAPI): Video {
  return {
    id: apiVideo.videoId,
    title: apiVideo.originalFilename.replace(/\.[^/.]+$/, ''), // Remove extension
    description: `File size: ${formatFileSize(apiVideo.fileSize)}`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    videoUrl: apiVideo.magnetURI, // Use magnet URI for P2P playback
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

export default function Home() {
  const { activeCategory, setActiveCategory } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch videos from backend API
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 30000, // 30 seconds
  });

  // Use API videos if available, otherwise use mock data
  const apiVideos = apiResponse?.data?.map(transformApiVideo) || [];
  const allVideos = apiVideos.length > 0 ? apiVideos : mockVideos;

  const filteredVideos = activeCategory === 'All' 
    ? allVideos 
    : allVideos.filter(v => v.categoryId === activeCategory);

  // For demo, duplicate videos if we have less than 4
  const displayVideos = filteredVideos.length < 4 
    ? [...filteredVideos, ...filteredVideos, ...filteredVideos].slice(0, 12)
    : filteredVideos;

  const handleUploadSuccess = () => {
    // Refresh the video list
    queryClient.invalidateQueries({ queryKey: ['videos'] });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground flex flex-col">
      <Header />
      <Sidebar />
      
      {/* P2P Status Indicator */}
      <P2PStatusIndicator />
      
      {/* Upload Modal */}
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
      
      {/* Floating Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className={cn(
          "fixed bottom-8 right-8 z-40 flex items-center gap-2 px-6 py-4 rounded-full",
          "bg-primary text-white font-bold uppercase tracking-wide",
          "border-2 border-black dark:border-white",
          "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]",
          "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]",
          "transition-all"
        )}
      >
        <Plus size={20} strokeWidth={3} />
        <span className="hidden sm:inline">Upload</span>
      </button>
      
      {/* Simple centered container, no sidebar offset */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto pt-[4.5rem] px-4 md:px-8 pb-12">
        
        {/* Featured Hero Section (Mock) */}
        <div className="mt-6 mb-12 rounded-xl border-2 border-black dark:border-white bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
              <Sparkles size={12} /> Featured Drop
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase leading-none mb-6 tracking-tighter">
              The Future of <br/>Streaming
            </h1>
            <p className="text-xl opacity-90 font-mono mb-8 max-w-lg">
              Experience content like never before with our high-fidelity playback engine.
            </p>
            <button className="neo-button bg-white text-black border-white hover:bg-white/90 text-lg px-8 py-3">
              Start Watching
            </button>
          </div>
        </div>

        {/* Categories Bar - Simple Wrap */}
        <div className="mb-10 flex flex-wrap gap-3 justify-center">
           {categories.map((category) => (
             <button
               key={category}
               onClick={() => setActiveCategory(category)}
               className={cn(
                 "px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide border-2 transition-all whitespace-nowrap",
                 activeCategory === category 
                   ? "bg-primary text-white border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]" 
                   : "bg-background border-border hover:border-primary hover:text-primary hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
               )}
             >
               {category}
             </button>
           ))}
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <VideoGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-10 mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg border-2 border-yellow-500/30 mb-4">
              <Wifi size={18} />
              <span className="font-bold">Backend not connected</span>
            </div>
            <p className="text-sm text-muted-foreground">Showing demo videos. Start the backend for P2P streaming.</p>
          </div>
        ) : null}
        
        {apiVideos.length === 0 && !isLoading && !error && (
          <div className="text-center py-8 mb-6 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">No P2P Videos Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Upload your first video to start P2P streaming!</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="neo-button bg-primary text-white"
            >
              <Plus size={18} className="mr-2" />
              Upload Video
            </button>
          </div>
        )}

        {/* P2P Videos Section */}
        {apiVideos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Wifi size={14} />
                P2P Videos
              </div>
              <span className="text-sm text-muted-foreground font-mono">{apiVideos.length} streaming</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
              {apiVideos.map((video, idx) => (
                <VideoCard key={`p2p-${video.id}-${idx}`} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Demo Videos Section */}
        {mockVideos.length > 0 && (
          <div>
            {apiVideos.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold uppercase tracking-wide text-muted-foreground">Demo Videos</h3>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
              {(activeCategory === 'All' ? mockVideos : mockVideos.filter(v => v.categoryId === activeCategory)).map((video, idx) => (
                <VideoCard key={`demo-${video.id}-${idx}`} video={video} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
