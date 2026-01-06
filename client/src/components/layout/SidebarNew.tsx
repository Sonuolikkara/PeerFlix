import { Home, Compass, Download, Clock, Heart, Settings, HelpCircle, LogOut, X, Gamepad2, Film, Music, Radio, Wifi } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const mainLinks = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Discover", href: "/discover" },
  { icon: Film, label: "Videos", href: "/videos" },
  { icon: Wifi, label: "P2P Network", href: "/network" },
  { icon: Gamepad2, label: "Games", href: "/games" },
  { icon: Radio, label: "Live", href: "/live" },
];

const libraryLinks = [
  { icon: Download, label: "Downloads", href: "/downloads" },
  { icon: Clock, label: "Watch Later", href: "/watch-later" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
];

const settingsLinks = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

interface SidebarNewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNew({ isOpen, onClose }: SidebarNewProps) {
  const [location] = useLocation();

  const SidebarItem = ({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive?: boolean }) => (
    <Link 
      href={href} 
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={20} className={cn(isActive ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400")} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-72 bg-[#0d0d1a]/95 backdrop-blur-xl z-[60] p-6 border-r border-white/5 transition-transform duration-300 ease-out overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          {mainLinks.map((link) => (
            <SidebarItem 
              key={link.label} 
              {...link} 
              isActive={location === link.href} 
            />
          ))}
        </div>

        {/* Library Section */}
        <div className="mb-8">
          <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Library</h3>
          <div className="space-y-1">
            {libraryLinks.map((link) => (
              <SidebarItem key={link.label} {...link} isActive={location === link.href} />
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="pt-4 border-t border-white/5">
          <div className="space-y-1">
            {settingsLinks.map((link) => (
              <SidebarItem key={link.label} {...link} isActive={location === link.href} />
            ))}
          </div>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-400 hover:bg-red-500/10 mt-2">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

