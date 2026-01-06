import { useState } from 'react';
import { Menu, Search, ShoppingCart, Bell, Upload } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { Link } from 'wouter';
import { currentUser } from '@/lib/mockData';
import { Logo } from '@/components/ui/Logo';

interface HeaderNewProps {
  onMenuClick: () => void;
  onUploadClick: () => void;
}

export function HeaderNew({ onMenuClick, onUploadClick }: HeaderNewProps) {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a14]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4 lg:px-6 border-b border-white/5">
      <div className="flex items-center gap-4 lg:gap-6">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>
        <Link href="/" className="flex items-center">
          <Logo size="sm" variant="light" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-[500px] mx-4 lg:mx-8">
        <form onSubmit={handleSearch} className="flex flex-1 items-center relative">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full h-11 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Upload Button - Desktop */}
        <button 
          onClick={onUploadClick}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <Upload size={16} />
          Upload
        </button>
        
        {/* Upload Button - Mobile */}
        <button 
          onClick={onUploadClick}
          className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
        >
          <Upload size={20} />
        </button>

        <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
          <ShoppingCart size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            2
          </span>
        </button>
        
        <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        <button className="ml-1 lg:ml-2 w-9 h-9 lg:w-10 lg:h-10 rounded-xl overflow-hidden ring-2 ring-white/10 hover:ring-blue-500/50 transition-all">
          <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}

