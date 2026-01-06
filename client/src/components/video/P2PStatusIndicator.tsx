import { useState, useEffect } from 'react';
import { Activity, Users, Upload, Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { fetchStats, StatsResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond: number): string {
  return formatBytes(bytesPerSecond) + '/s';
}

export function P2PStatusIndicator() {
  const [stats, setStats] = useState<StatsResponse['data'] | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const refreshStats = async () => {
    try {
      const response = await fetchStats();
      setStats(response.data);
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-40">
      {/* Collapsed View - Status Badge */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-full",
          "border-2 border-black dark:border-white",
          "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]",
          "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]",
          "transition-all font-bold uppercase tracking-wide text-sm",
          isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
        )}
      >
        {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
        <span className="hidden sm:inline">
          {loading ? 'Connecting...' : isOnline ? 'P2P Online' : 'P2P Offline'}
        </span>
        {isOnline && stats && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {stats.totalPeers} peers
          </span>
        )}
      </button>

      {/* Expanded View - Stats Panel */}
      {expanded && (
        <div className={cn(
          "absolute bottom-16 left-0 w-80 p-4 rounded-xl",
          "bg-background border-2 border-black dark:border-white",
          "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase tracking-tight">P2P Network Stats</h3>
            <button
              onClick={refreshStats}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {!isOnline ? (
            <div className="text-center py-4 text-muted-foreground">
              <WifiOff className="mx-auto mb-2" size={32} />
              <p className="text-sm">Backend not connected</p>
              <p className="text-xs mt-1">Make sure the server is running on port 3000</p>
            </div>
          ) : stats ? (
            <div className="space-y-3">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-3 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Activity size={12} />
                    Active Torrents
                  </div>
                  <p className="text-2xl font-black">{stats.activeTorrents}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Users size={12} />
                    Total Peers
                  </div>
                  <p className="text-2xl font-black">{stats.totalPeers}</p>
                </div>
              </div>

              {/* Upload/Download Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Upload size={14} className="text-green-500" />
                  <span className="font-mono">{formatBytes(stats.totalUploaded)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download size={14} className="text-blue-500" />
                  <span className="font-mono">{formatSpeed(stats.uploadSpeed || 0)}</span>
                </div>
              </div>

              {/* Active Torrents List */}
              {stats.torrents && stats.torrents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Seeding Files</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {stats.torrents.map((torrent, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-muted/30 p-2 rounded">
                        <span className="font-mono truncate flex-1 mr-2">{torrent.name}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users size={10} />
                          {torrent.peers}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <RefreshCw className="mx-auto mb-2 animate-spin" size={24} />
              <p className="text-sm text-muted-foreground">Loading stats...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
