import { useState } from 'react';
import { Menu, Search, Video, Bell, User, X, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Link } from 'wouter';
import { currentUser } from '@/lib/mockData';

export function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery, toggleTheme } = useAppStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-18 bg-background z-50 flex items-center justify-between px-6 border-b-2 border-black dark:border-white">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-accent rounded-md border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 bg-primary border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
             <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter font-display uppercase italic">Stream<span className="text-primary">Punk</span></span>
        </Link>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-[600px] mx-8">
        <form onSubmit={handleSearch} className="flex flex-1 items-center relative group">
          <input
            type="text"
            placeholder="FIND SOMETHING RAD..."
            className="neo-input h-12 rounded-none rounded-l-lg border-r-0 font-mono text-sm placeholder:text-muted-foreground/70"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button 
              type="button"
              onClick={() => setLocalSearch('')}
              className="absolute right-16 p-1 hover:bg-muted rounded-full"
            >
              <X size={16} />
            </button>
          )}
          <button 
            type="submit"
            className="h-12 px-6 bg-primary text-white border-2 border-black dark:border-white border-l-2 rounded-r-lg hover:bg-primary/90 flex items-center justify-center transition-colors font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none"
          >
            <Search size={20} strokeWidth={3} className="mr-2" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="hidden sm:flex p-2 neo-button bg-white dark:bg-black text-foreground hover:bg-muted aspect-square items-center justify-center rounded-full"
          onClick={toggleTheme}
        >
          <div className="w-4 h-4 rounded-full bg-current" />
        </button>
        
        <button className="neo-button p-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white relative">
          <Bell size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black text-[10px] font-bold flex items-center justify-center rounded-sm border border-black">
            3
          </span>
        </button>
        
        <button className="w-10 h-10 rounded-lg overflow-hidden border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
          <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
        </button>
      </div>
    </header>
  );
}
