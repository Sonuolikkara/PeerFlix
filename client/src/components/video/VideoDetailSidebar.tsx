import { Video } from '@/lib/types';
import { X, Play, Star, Clock, Eye, Heart, Share2, Download, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface VideoDetailSidebarProps {
  video: Video | null;
  onClose: () => void;
}

export function VideoDetailSidebar({ video, onClose }: VideoDetailSidebarProps) {
  if (!video) return null;

  const platforms = ['P2P', 'WebRTC', 'Torrent', 'Stream'];

  return (
    <div className="w-[380px] flex-shrink-0 bg-[#0d0d1a]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      {/* Header with Close */}
      <div className="relative">
        {/* Video Preview */}
        <div className="relative aspect-video">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
          
          {/* Play Button */}
          <Link 
            href={`/watch/${video.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-110 transition-transform">
              <Play fill="white" className="text-white ml-1" size={28} />
            </div>
          </Link>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">{video.title}</h2>
        
        {/* Platform Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {platforms.map((platform, i) => (
            <span 
              key={platform}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full",
                i === 0 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                "bg-white/5 text-gray-400 border border-white/10"
              )}
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-gray-500 line-through text-sm">₹999</span>
          <span className="text-2xl font-bold text-white">₹{video.views === '0' ? 'Free' : '799'}</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">
          {video.description || 'Experience seamless P2P streaming with this content. Share bandwidth with other viewers for faster, decentralized playback.'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star size={14} fill="currentColor" />
              <span className="font-semibold">4.8</span>
            </div>
            <span className="text-xs text-gray-500">Rating</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white mb-1">
              <Eye size={14} />
              <span className="font-semibold">{video.views || '10K'}</span>
            </div>
            <span className="text-xs text-gray-500">Views</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-pink-500 mb-1">
              <Heart size={14} fill="currentColor" />
              <span className="font-semibold">{video.likes || '2.8K'}</span>
            </div>
            <span className="text-xs text-gray-500">Likes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href={`/watch/${video.id}`}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <Play size={18} fill="white" />
            Watch Now
          </Link>
          
          <button className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all">
            <Heart size={18} />
            Add to Favorites
          </button>
        </div>

        {/* Share Row */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/5">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Download size={18} />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
