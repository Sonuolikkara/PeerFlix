import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Flame, Music2, Gamepad2, Trophy, Settings, HelpCircle, Flag, Radio, X } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { playlists } from '@/lib/mockData';

const mainLinks = [
  { icon: Home, label: "Feed", href: "/" },
  { icon: Compass, label: "Discover", href: "/shorts" },
  { icon: Radio, label: "Live", href: "/subscriptions" },
];

const libraryLinks = [
  { icon: History, label: "Rewind", href: "/history" },
  { icon: Clock, label: "Saved", href: "/playlist?list=WL" },
  { icon: ThumbsUp, label: "Liked", href: "/playlist?list=LL" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [location] = useLocation();

  const SidebarItem = ({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive?: boolean }) => (
    <Link href={href} className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-md border-2 border-transparent transition-all duration-200 group font-display tracking-wide uppercase text-sm",
      isActive 
        ? "bg-accent text-accent-foreground border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-bold translate-x-[-2px] translate-y-[-2px]" 
        : "hover:bg-muted hover:border-black/10 dark:hover:border-white/10"
    )}>
      <Icon size={20} strokeWidth={2.5} className={cn(isActive ? "text-black" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="truncate">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar - Always a slide-out drawer now */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-80 bg-background z-[60] p-6 shadow-[10px_0px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_0px_0px_0px_rgba(255,255,255,0.2)] border-r-4 border-black dark:border-white transition-transform duration-300 ease-in-out overflow-y-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-black uppercase font-display tracking-tighter">Menu</h2>
           <button onClick={toggleSidebar} className="p-2 hover:bg-accent rounded-md border-2 border-transparent hover:border-black dark:hover:border-white transition-all">
             <X size={24} />
           </button>
        </div>

        <div className="space-y-2 mb-8">
          {mainLinks.map((link) => (
            <SidebarItem 
              key={link.label} 
              {...link} 
              isActive={location === link.href} 
            />
          ))}
        </div>

        <div className="space-y-2 mb-8">
          <h3 className="px-4 text-xs font-black uppercase text-muted-foreground mb-2 tracking-widest">Library</h3>
          {libraryLinks.map((link) => (
            <SidebarItem key={link.label} {...link} isActive={location === link.href} />
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="px-4 text-xs font-black uppercase text-muted-foreground mb-2 tracking-widest">Playlists</h3>
          {playlists.map((playlist) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="block px-4 py-2 text-sm font-mono hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
              #{playlist.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 px-4 py-4 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg bg-secondary/10">
          <p className="text-[10px] font-mono text-center opacity-70">
            STREAM PUNK © 2025
            <br />
            NO RIGHTS RESERVED
          </p>
        </div>
      </aside>
    </>
  );
}
