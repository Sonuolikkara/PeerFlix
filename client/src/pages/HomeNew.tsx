import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Play, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Users, 
  Wifi, 
  WifiOff,
  ChevronDown,
  Gamepad2,
  Trophy,
  Zap,
  Star,
  Plus,
  Upload
} from 'lucide-react';
import { HeaderNew } from '@/components/layout/HeaderNew';
import { SidebarNew } from '@/components/layout/SidebarNew';
import { fetchVideos, fetchStats, type VideoFromAPI, type StatsResponse } from '@/lib/api';
import { UploadModalNew } from '@/components/video/UploadModalNew';
import { cn } from '@/lib/utils';

// Category badges
const categories = [
  { name: 'All Games', icon: Gamepad2 },
  { name: 'Action', icon: Zap },
  { name: 'Adventure', icon: Trophy },
  { name: 'Racing', icon: Star },
  { name: 'Sports', icon: Users },
];

export default function HomeNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFromAPI | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Games');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch videos
  const { data: videosData, isLoading: videosLoading, refetch } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    refetchInterval: 30000,
  });

  // Fetch P2P stats
  const { data: statsData } = useQuery({
    queryKey: ['p2p-stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });

  const videos = videosData?.data || [];
  const featuredVideo = videos[0];
  const trendingVideos = videos.slice(1);
  const stats: StatsResponse | undefined = statsData;

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-hidden">
      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <HeaderNew 
        onMenuClick={() => setSidebarOpen(true)} 
        onUploadClick={() => setUploadOpen(true)} 
      />

      {/* Sidebar */}
      <SidebarNew isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="relative pt-20 px-4 lg:px-8 pb-8">
        <div className="max-w-[1800px] mx-auto">
          {/* P2P Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                isOnline 
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              )}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                {isOnline ? 'P2P Network Online' : 'Offline'}
              </div>
              
              {stats && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} className="text-blue-400" />
                    {stats.activePeers} peers
                  </span>
                  <span>{stats.totalTorrents} torrents</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              <Upload size={18} />
              Upload Video
            </button>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === cat.name
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                )}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl text-sm font-medium border border-white/5 transition-all">
              More
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Video */}
              {videosLoading ? (
                <FeaturedSkeleton />
              ) : featuredVideo ? (
                <div 
                  className="relative group rounded-2xl overflow-hidden cursor-pointer bg-[#12121f] border border-white/5"
                  onClick={() => setSelectedVideo(featuredVideo)}
                >
                  <div className="aspect-[16/9] relative">
                    <img
                      src={featuredVideo.thumbnail || `https://picsum.photos/seed/${featuredVideo._id}/800/450`}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full">
                        FEATURED
                      </span>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {featuredVideo.title}
                      </h2>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                        {featuredVideo.description || 'High-quality P2P streaming experience with peer-to-peer technology'}
                      </p>
                      <div className="flex items-center gap-4">
                        <a
                          href={`/watch/${featuredVideo._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                        >
                          <Play size={18} className="fill-white" />
                          Watch Now
                        </a>
                        <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/10 transition-all">
                          <Heart size={20} className="text-white" />
                        </button>
                        <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/10 transition-all">
                          <Plus size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState onUpload={() => setUploadOpen(true)} />
              )}

              {/* Trending Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-yellow-500" size={20} />
                    Trending Videos
                  </h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All →
                  </button>
                </div>

                {videosLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <VideoCardSkeleton key={i} />
                    ))}
                  </div>
                ) : trendingVideos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trendingVideos.map((video) => (
                      <VideoCard
                        key={video._id}
                        video={video}
                        isSelected={selectedVideo?._id === video._id}
                        onClick={() => setSelectedVideo(video)}
                        formatViews={formatViews}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right Sidebar - Selected Video Details */}
            <div className="hidden lg:block">
              <VideoDetailPanel 
                video={selectedVideo} 
                stats={stats}
                onClose={() => setSelectedVideo(null)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModalNew 
        isOpen={uploadOpen} 
        onClose={() => setUploadOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

// Video Card Component
function VideoCard({ 
  video, 
  isSelected, 
  onClick,
  formatViews 
}: { 
  video: VideoFromAPI; 
  isSelected: boolean;
  onClick: () => void;
  formatViews: (views: number) => string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "bg-[#12121f] border hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10",
        isSelected ? "border-blue-500 ring-2 ring-blue-500/50" : "border-white/5"
      )}
    >
      <div className="aspect-[16/9] relative">
        <img
          src={video.thumbnail || `https://picsum.photos/seed/${video._id}/400/225`}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* P2P Badge */}
        {video.magnetURI && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-green-500/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <Wifi size={10} />
              P2P
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-1 mb-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {formatViews(video.views || 0)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {formatViews(video.likes || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Video Detail Panel Component
function VideoDetailPanel({ 
  video, 
  stats,
  onClose 
}: { 
  video: VideoFromAPI | null;
  stats?: StatsResponse;
  onClose: () => void;
}) {
  if (!video) {
    return (
      <div className="sticky top-24 bg-[#12121f]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Play size={24} className="text-gray-600" />
          </div>
          <h3 className="text-gray-400 font-medium mb-2">No Video Selected</h3>
          <p className="text-gray-600 text-sm">Click on a video to see details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-[#12121f]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      {/* Video Preview */}
      <div className="aspect-video relative">
        <img
          src={video.thumbnail || `https://picsum.photos/seed/${video._id}/400/225`}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121f] via-transparent to-transparent" />
      </div>

      <div className="p-5 space-y-4">
        <h3 className="text-lg font-bold text-white">{video.title}</h3>
        
        <p className="text-gray-400 text-sm line-clamp-3">
          {video.description || 'Experience high-quality video streaming powered by P2P technology.'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 py-3 border-y border-white/5">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{video.views || 0}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{video.likes || 0}</p>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          {video.magnetURI && stats && (
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">{stats.activePeers}</p>
              <p className="text-xs text-gray-500">Peers</p>
            </div>
          )}
        </div>

        {/* P2P Info */}
        {video.magnetURI && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
              <Wifi size={14} />
              P2P Enabled
            </div>
            <p className="text-xs text-gray-500">
              This video is available via peer-to-peer streaming
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <a
            href={`/watch/${video._id}`}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Play size={18} className="fill-white" />
            Watch Now
          </a>
          
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 border border-white/5 transition-all">
              <Heart size={16} />
              Like
            </button>
            <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 border border-white/5 transition-all">
              <ShoppingCart size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Components
function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#12121f] border border-white/5">
      <div className="aspect-[16/9] bg-white/5 animate-pulse" />
    </div>
  );
}

function VideoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#12121f] border border-white/5">
      <div className="aspect-[16/9] bg-white/5 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/5 rounded animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="rounded-2xl bg-[#12121f] border border-white/5 p-12 text-center">
      <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Play size={32} className="text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Videos Yet</h3>
      <p className="text-gray-500 mb-6">Be the first to upload and share via P2P!</p>
      <button
        onClick={onUpload}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/20 transition-all"
      >
        <Upload size={18} />
        Upload Video
      </button>
    </div>
  );
}
