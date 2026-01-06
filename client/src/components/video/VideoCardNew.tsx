import { Video } from '@/lib/types';
import { Link } from 'wouter';
import { Play, Eye, Heart, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  onSelect?: (video: Video) => void;
  isSelected?: boolean;
}

export function VideoCardNew({ video, onSelect, isSelected }: VideoCardProps) {
  return (
    <div 
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300 cursor-pointer",
        isSelected && "ring-2 ring-blue-500 border-blue-500/50"
      )}
      onClick={() => onSelect?.(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="white" className="text-white ml-1" size={24} />
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
          {video.duration}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">
            {video.title}
          </h3>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 pt-2">
        {/* View Details Link */}
        <Link 
          href={`/watch/${video.id}`}
          className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          View details →
        </Link>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <Heart size={12} className="text-pink-500" />
            {video.likes || '2.8K'}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {video.views}
          </span>
        </div>
      </div>
    </div>
  );
}
