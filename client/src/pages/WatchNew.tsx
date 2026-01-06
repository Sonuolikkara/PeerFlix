import { useState, useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Copy,
  Check,
  Users,
  Wifi,
  WifiOff,
  Clock,
  Eye,
  ChevronRight,
  Settings,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { fetchVideoById, fetchStats, fetchVideos, type VideoFromAPI, type StatsResponse } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export default function WatchNew() {
  const [, params] = useRoute('/watch/:id');
  const videoId = params?.id;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  // Fetch video
  const { data: videoData, isLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => fetchVideoById(videoId!),
    enabled: !!videoId,
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['p2p-stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });

  // Fetch related videos
  const { data: relatedVideos } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  const video = videoData?.data;
  const stats: StatsResponse | undefined = statsData;
  const related = relatedVideos?.data?.filter(v => v._id !== videoId).slice(0, 5) || [];

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const player = playerRef.current;
    player?.addEventListener('mousemove', handleMouseMove);
    return () => {
      player?.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Video event handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        playerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleCopyMagnet = async () => {
    if (video?.magnetURI) {
      await navigator.clipboard.writeText(video.magnetURI);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!video) {
    return <NotFoundState />;
  }

  const videoUrl = video.magnetURI 
    ? `http://localhost:3000${video.videoUrl}` 
    : video.videoUrl;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-400" />
              </button>
            </Link>
            <Link href="/">
              <Logo size="sm" variant="light" />
            </Link>
          </div>

          {/* P2P Status */}
          <div className="flex items-center gap-4">
            {stats && (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <Wifi size={14} />
                  P2P Active
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Users size={14} />
                  {stats.activePeers} peers
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 xl:gap-6 p-4 xl:p-6">
            
            {/* Video Player Section */}
            <div className="xl:col-span-2 space-y-4">
              {/* Video Player */}
              <div
                ref={playerRef}
                className="relative bg-black rounded-2xl overflow-hidden group aspect-video"
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={handlePlayPause}
                />

                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button
                      onClick={handlePlayPause}
                      className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
                    >
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </button>
                  </div>
                )}

                {/* Controls */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity",
                    showControls ? "opacity-100" : "opacity-0"
                  )}
                >
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-blue-500
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:shadow-lg"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isPlaying ? (
                          <Pause size={20} className="text-white" />
                        ) : (
                          <Play size={20} className="text-white fill-white" />
                        )}
                      </button>

                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <SkipBack size={18} className="text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <SkipForward size={18} className="text-white" />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2 group/vol">
                        <button
                          onClick={toggleMute}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={20} className="text-white" />
                          ) : (
                            <Volume2 size={20} className="text-white" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer opacity-0 group-hover/vol:opacity-100 transition-opacity
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-3
                            [&::-webkit-slider-thumb]:h-3
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>

                      {/* Time */}
                      <span className="text-sm text-gray-300">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Settings size={18} className="text-white" />
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize size={18} className="text-white" />
                        ) : (
                          <Maximize size={18} className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="bg-[#12121f]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
                <h1 className="text-2xl font-bold text-white mb-3">{video.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {video.views || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  {video.magnetURI && (
                    <span className="flex items-center gap-1 text-green-400">
                      <Wifi size={16} />
                      P2P Enabled
                    </span>
                  )}
                </div>

                <p className="text-gray-400 mb-5">
                  {video.description || 'High-quality video streaming powered by P2P technology.'}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all",
                      liked
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                    )}
                  >
                    <Heart size={18} className={liked ? "fill-pink-400" : ""} />
                    {liked ? 'Liked' : 'Like'}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium border border-white/5 transition-all">
                    <Share2 size={18} />
                    Share
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium border border-white/5 transition-all">
                    <Download size={18} />
                    Download
                  </button>

                  {video.magnetURI && (
                    <button
                      onClick={handleCopyMagnet}
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl font-medium border border-green-500/20 transition-all"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy Magnet'}
                    </button>
                  )}
                </div>
              </div>

              {/* P2P Info Card */}
              {video.magnetURI && stats && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Wifi size={20} className="text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">P2P Network Stats</h3>
                      <p className="text-xs text-gray-500">Real-time peer information</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-white">{stats.activePeers}</p>
                      <p className="text-xs text-gray-500">Active Peers</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-white">{stats.totalTorrents}</p>
                      <p className="text-xs text-gray-500">Total Torrents</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-green-400">{(stats.downloadSpeed / 1024).toFixed(1)} KB/s</p>
                      <p className="text-xs text-gray-500">Download</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-blue-400">{(stats.uploadSpeed / 1024).toFixed(1)} KB/s</p>
                      <p className="text-xs text-gray-500">Upload</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Related Videos Sidebar */}
            <div className="mt-6 xl:mt-0">
              <div className="bg-[#12121f]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  Related Videos
                  <ChevronRight size={18} className="text-gray-500" />
                </h2>

                <div className="space-y-3">
                  {related.length > 0 ? (
                    related.map((vid) => (
                      <Link key={vid._id} href={`/watch/${vid._id}`}>
                        <div className="flex gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                          <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={vid.thumbnail || `https://picsum.photos/seed/${vid._id}/200/112`}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={16} className="text-white fill-white" />
                            </div>
                            {vid.magnetURI && (
                              <div className="absolute top-1 right-1">
                                <span className="px-1.5 py-0.5 bg-green-500/80 text-white text-[8px] font-bold rounded">
                                  P2P
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                              {vid.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {vid.views || 0} views
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-6">
                      No related videos yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white pt-20 px-6">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
        <div className="bg-[#12121f] rounded-2xl p-5 space-y-3">
          <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Not Found State
function NotFoundState() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
          <WifiOff size={32} className="text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Video Not Found</h2>
        <p className="text-gray-500 mb-6">This video doesn't exist or has been removed</p>
        <Link href="/">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
