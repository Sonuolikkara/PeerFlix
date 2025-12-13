import { Video } from '@/lib/types';
import { Link } from 'wouter';
import { MoreVertical, Play, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'row';
}

export function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  return (
    <div className={cn("group flex flex-col relative", layout === 'row' ? "md:flex-row gap-4" : "gap-3")}>
      <Link href={`/watch/${video.id}`} className={cn(
        "relative overflow-hidden border-2 border-black dark:border-white bg-black rounded-lg transition-all duration-200",
        layout === 'row' ? "w-full md:w-64 aspect-video flex-shrink-0" : "w-full aspect-video",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
      )}>
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Play fill="currentColor" className="ml-1" size={20} />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {video.duration}
        </div>
      </Link>
      
      <div className="flex gap-3 items-start flex-1 min-w-0 pr-2 mt-2">
        {layout === 'grid' && (
          <Link href={`/channel/${video.channel.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-md border-2 border-black dark:border-white overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <img 
                src={video.channel.avatarUrl} 
                alt={video.channel.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        )}
        
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <Link href={`/watch/${video.id}`}>
            <h3 className="text-lg font-bold leading-tight font-display uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2">
              {video.title}
            </h3>
          </Link>
          
          <div className="flex flex-col gap-1">
            <Link href={`/channel/${video.channel.id}`} className="text-sm font-medium hover:underline decoration-2 underline-offset-2 w-fit">
              {video.channel.name}
            </Link>
            
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1 bg-muted px-1 rounded border border-black/10 dark:border-white/10">
                <Eye size={10} /> {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {video.uploadDate}
              </span>
            </div>
          </div>

          {layout === 'row' && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 hidden md:block font-mono">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
