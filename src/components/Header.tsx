import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Terminal,
  BarChart3,
  Scale
} from 'lucide-react';
import type { ActiveTab } from '../types/finance';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  onRefresh: () => void;
  lastUpdated: Date;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  onRefresh,
  lastUpdated,
}) => {
  const [time, setTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Time formatters
  const formatTimezone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(time);
    } catch {
      return time.toLocaleTimeString();
    }
  };

  const getDhakaMarketStatus = () => {
    try {
      const dhakaHour = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', hour12: false }).format(time)
      );
      const dhakaMin = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', minute: 'numeric' }).format(time)
      );
      const currentMin = dhakaHour * 60 + dhakaMin;
      // DSE trading hours: 10:00 to 14:30 (600 to 870)
      if (currentMin >= 600 && currentMin <= 870) {
        return { label: 'OPEN', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50' };
      }
      return { label: 'CLOSED', color: 'text-zinc-400 bg-zinc-900 border-zinc-700' };
    } catch {
      return { label: 'CLOSED', color: 'text-zinc-400 bg-zinc-900 border-zinc-700' };
    }
  };

  const dseStatus = getDhakaMarketStatus();

  return (
    <header className="bg-[#0b0f19] border-b border-[#1f293d] sticky top-0 z-50 text-xs select-none">
      {/* Top Bar: Brand, Session Clocks, Controls */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 gap-2 border-b border-[#162032]">
        {/* Left: Terminal Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono font-bold tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>GLOBAL.TERMINAL</span>
            <span className="text-[10px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded">v2.4 PRO</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`} />
              <span className="text-[11px] font-semibold">{isStreaming ? 'LIVE FEED' : 'FEED PAUSED'}</span>
            </div>
            <span className="text-zinc-500 text-[10px]">|</span>
            <span className="text-zinc-400 font-mono text-[10px]">
              UPDATED: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Center: Financial World Clocks */}
        <div className="hidden lg:flex items-center gap-4 text-zinc-300 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101726] border border-zinc-800">
            <span className="text-zinc-400 font-medium">DHAKA (BST):</span>
            <span className="text-white font-bold">{formatTimezone('Asia/Dhaka')}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${dseStatus.color}`}>
              DSE {dseStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101726] border border-zinc-800">
            <span className="text-zinc-400 font-medium">NEW YORK (EST):</span>
            <span className="text-white font-bold">{formatTimezone('America/New_York')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101726] border border-zinc-800">
            <span className="text-zinc-400 font-medium">LONDON (GMT):</span>
            <span className="text-white font-bold">{formatTimezone('Europe/London')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101726] border border-zinc-800">
            <span className="text-zinc-400 font-medium">TOKYO (JST):</span>
            <span className="text-white font-bold">{formatTimezone('Asia/Tokyo')}</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
              isStreaming
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/40 hover:bg-emerald-900/50'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
            title="Toggle Live Real-time Simulation"
          >
            <Activity className="w-3 h-3" />
            <span>{isStreaming ? 'STREAMING' : 'RESUME'}</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-1 rounded bg-[#131b2e] border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Refresh Quotes"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1 rounded border transition-colors ${
              soundEnabled ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-[#131b2e] border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Tick Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1 rounded bg-[#131b2e] border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#090d16] text-[12px]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workstation')}
            className={`px-3 py-1.5 rounded font-mono font-medium flex items-center gap-2 border transition-all ${
              activeTab === 'workstation'
                ? 'bg-[#1e293b] text-cyan-400 border-cyan-500/50 shadow-sm shadow-cyan-900/30'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>TERMINAL WORKSTATION</span>
            <span className="text-[10px] text-zinc-500 font-normal">F1</span>
          </button>

          <button
            onClick={() => setActiveTab('bangladesh')}
            className={`px-3 py-1.5 rounded font-mono font-medium flex items-center gap-2 border transition-all ${
              activeTab === 'bangladesh'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 shadow-sm shadow-emerald-900/30'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span className="text-base leading-none">🇧🇩</span>
            <span className="font-semibold">BANGLADESH DSE & MACRO HUB</span>
            <span className="text-[10px] text-zinc-500 font-normal">F2</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded font-mono font-medium flex items-center gap-2 border transition-all ${
              activeTab === 'compare'
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-900/30'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>GLOBAL vs BD COMPARATIVE MATRIX</span>
            <span className="text-[10px] text-zinc-500 font-normal">F3</span>
          </button>
        </div>

        {/* Quick Quick Market Stats Mini-Badge */}
        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-zinc-400">
          <div>
            <span className="text-zinc-500">USD/BDT: </span>
            <span className="text-emerald-400 font-semibold">120.45</span>
            <span className="text-[10px] text-emerald-500 ml-1">(+0.12%)</span>
          </div>
          <div>
            <span className="text-zinc-500">DSEX: </span>
            <span className="text-emerald-400 font-semibold">5,742.18</span>
            <span className="text-[10px] text-emerald-500 ml-1">(+0.68%)</span>
          </div>
          <div>
            <span className="text-zinc-500">BRENT: </span>
            <span className="text-red-400 font-semibold">$74.82</span>
            <span className="text-[10px] text-red-500 ml-1">(-0.64%)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
