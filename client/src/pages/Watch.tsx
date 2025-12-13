import { useParams } from "wouter";
import ReactPlayer from 'react-player';
import { Header } from '@/components/layout/Header';
import { VideoCard } from '@/components/video/VideoCard';
import { videos } from '@/lib/mockData';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Download, MessageSquare, Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';

export default function Watch() {
  const { id } = useParams();
  const video = videos.find(v => v.id === id) || videos[0];
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const { sidebarOpen } = useAppStore();

  // Filter out current video from suggestions
  const suggestions = videos.filter(v => v.id !== video.id);
  const displaySuggestions = [...suggestions, ...suggestions];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      
      <main className={cn(
        "pt-24 flex flex-col lg:flex-row gap-8 px-4 lg:px-8 pb-12 transition-all duration-300 max-w-[1920px] mx-auto",
      )}>
        {/* Primary Column - Video Player & Info */}
        <div className="flex-1 min-w-0">
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
            <h1 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight leading-none">{video.title}</h1>

            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b-2 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-4">
                <a href={`/channel/${video.channel.id}`} className="flex-shrink-0 group">
                  <div className="w-12 h-12 rounded-md border-2 border-black dark:border-white overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
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
            <div className="neo-box bg-accent/20 p-4 relative">
              <div className="font-mono text-sm font-bold mb-2 flex gap-4">
                <span>{video.views} views</span>
                <span>{video.uploadDate}</span>
                <span className="text-primary">#{video.categoryId}</span>
              </div>
              <p className={cn("font-sans leading-relaxed", descriptionExpanded ? "" : "line-clamp-2")}>
                {video.description}
                <br /><br />
                <span className="font-bold">Music in this video:</span><br/>
                Song: Cyber Chase<br/>
                Artist: Synthwave Boy<br/>
                License: Creative Commons
              </p>
              <button 
                className="mt-2 text-sm font-bold uppercase underline decoration-2 underline-offset-4 hover:text-primary"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              >
                {descriptionExpanded ? "Show less" : "Read more"}
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-black uppercase font-display">Comments</h3>
                <span className="text-muted-foreground font-mono text-sm">482</span>
              </div>
              
              {/* Add comment input */}
              <div className="flex gap-4 mb-8">
                 <div className="w-12 h-12 rounded-md border-2 border-black dark:border-white overflow-hidden flex-shrink-0">
                   <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Me" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                   <input type="text" placeholder="Add a public comment..." className="neo-input bg-transparent focus:bg-background transition-colors" />
                   <div className="flex justify-end gap-2 mt-2">
                      <button className="px-4 py-2 font-bold text-sm uppercase hover:bg-accent/50 rounded-md">Cancel</button>
                      <button className="neo-button py-1 px-4 text-xs">Comment</button>
                   </div>
                 </div>
              </div>
              
              {/* Mock Comments */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 mb-6 group">
                  <div className="w-10 h-10 rounded-md bg-muted border-2 border-black/20 dark:border-white/20 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-bold bg-black text-white px-1 rounded-sm dark:bg-white dark:text-black">User {i}</span>
                      <span className="text-muted-foreground font-mono">2 days ago</span>
                    </div>
                    <p className="text-sm mb-2 border-l-2 border-accent pl-3 py-1">This is a great video! Really helped me understand the concepts. The visual style is amazing.</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors">
                         <Heart size={14} /> 12
                      </button>
                      <button className="flex items-center gap-1 text-xs font-bold hover:text-primary transition-colors">
                         <MessageSquare size={14} /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Column - Recommendations */}
        <div className="lg:w-[400px] xl:w-[450px] flex-shrink-0">
           <h3 className="font-black uppercase font-display text-lg mb-4 flex items-center gap-2">
             <Sparkles size={18} className="text-primary" /> Up Next
           </h3>
           <div className="flex flex-col gap-4">
             {displaySuggestions.map((v, idx) => (
               <VideoCard key={`${v.id}-sug-${idx}`} video={v} layout="row" />
             ))}
           </div>
        </div>
      </main>
    </div>
  );
}
