import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoCard } from '@/components/video/VideoCard';
import { useAppStore } from '@/stores/useAppStore';
import { videos, categories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { activeCategory, setActiveCategory } = useAppStore();

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.categoryId === activeCategory);

  // Duplicate videos to fill the grid for demo
  const displayVideos = [...filteredVideos, ...filteredVideos, ...filteredVideos];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground flex flex-col">
      <Header />
      <Sidebar />
      
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
          {displayVideos.map((video, idx) => (
            <VideoCard key={`${video.id}-${idx}`} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}
