import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VideoCard } from '@/components/video/VideoCard';
import { useAppStore } from '@/stores/useAppStore';
import { videos, categories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { sidebarOpen, activeCategory, setActiveCategory } = useAppStore();

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.categoryId === activeCategory);

  // Duplicate videos to fill the grid for demo
  const displayVideos = [...filteredVideos, ...filteredVideos, ...filteredVideos];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-24 px-4 pb-12 transition-all duration-300 min-h-screen",
        sidebarOpen ? "md:pl-72" : "pl-4"
      )}>
        {/* Featured Hero Section (Mock) */}
        <div className="mb-10 rounded-xl border-2 border-black dark:border-white bg-gradient-to-br from-primary to-secondary p-8 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
              <Sparkles size={12} /> Featured Drop
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display uppercase leading-none mb-4 tracking-tighter">
              The Future of <br/>Streaming is Here
            </h1>
            <p className="text-lg opacity-90 font-mono mb-6 max-w-lg">
              Experience content like never before with our high-fidelity playback engine and community-driven curation.
            </p>
            <button className="neo-button bg-white text-black border-white hover:bg-white/90">
              Start Watching
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-8 overflow-x-auto pb-4 pt-1 flex items-center gap-3 no-scrollbar mask-gradient">
           {categories.map((category) => (
             <button
               key={category}
               onClick={() => setActiveCategory(category)}
               className={cn(
                 "px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide border-2 transition-all whitespace-nowrap",
                 activeCategory === category 
                   ? "bg-primary text-white border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]" 
                   : "bg-background border-border hover:border-primary hover:text-primary"
               )}
             >
               {category}
             </button>
           ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
          {displayVideos.map((video, idx) => (
            <VideoCard key={`${video.id}-${idx}`} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}
