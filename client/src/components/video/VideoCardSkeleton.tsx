import { cn } from '@/lib/utils';

interface VideoCardSkeletonProps {
  layout?: 'grid' | 'row';
}

export function VideoCardSkeleton({ layout = 'grid' }: VideoCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col", layout === 'row' ? "md:flex-row gap-4" : "gap-3")}>
      {/* Thumbnail Skeleton */}
      <div className={cn(
        "relative overflow-hidden border-2 border-black/20 dark:border-white/20 bg-muted rounded-lg animate-pulse",
        layout === 'row' ? "w-full md:w-64 aspect-video flex-shrink-0" : "w-full aspect-video",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
      </div>
      
      {/* Info Skeleton */}
      <div className="flex gap-3 items-start flex-1 min-w-0 pr-2 mt-2">
        {layout === 'grid' && (
          <div className="w-10 h-10 rounded-md border-2 border-black/20 dark:border-white/20 bg-muted animate-pulse" />
        )}
        
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Title */}
          <div className="h-5 bg-muted rounded animate-pulse w-full" />
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          
          {/* Channel */}
          <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-1" />
          
          {/* Stats */}
          <div className="flex gap-3 mt-1">
            <div className="h-4 bg-muted rounded animate-pulse w-16" />
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
