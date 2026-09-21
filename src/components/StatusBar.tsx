import React, { useState } from 'react';
import { Terminal, Wifi, ShieldCheck, Zap, CornerDownLeft } from 'lucide-react';
import type { ActiveTab, Asset } from '../types/finance';

interface StatusBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  availableAssets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  tickCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeTab,
  setActiveTab,
  availableAssets,
  onSelectAsset,
  tickCount,
}) => {
  const [command, setCommand] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toUpperCase();

    if (cmd === 'COMPARE' || cmd === 'F3' || cmd === 'MATRIX') {
      setActiveTab('compare');
    } else if (cmd === 'BD' || cmd === 'BANGLADESH' || cmd === 'DSE' || cmd === 'F2') {
      setActiveTab('bangladesh');
    } else if (cmd === 'WORK' || cmd === 'TERMINAL' || cmd === 'F1') {
      setActiveTab('workstation');
    } else {
      // Find asset by symbol or name
      const target = availableAssets.find(
        (a) => a.symbol.toUpperCase().includes(cmd) || a.name.toUpperCase().includes(cmd)
      );
      if (target) {
        onSelectAsset(target);
        setActiveTab('workstation');
      }
    }
    setCommand('');
  };

  return (
    <footer className="bg-[#090d16] border-t border-[#1a2538] px-3 py-1.5 text-xs font-mono select-none sticky bottom-0 z-40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Interactive Bloomberg Command Line Box */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
          <div className="flex items-center bg-[#101726] border border-amber-500/40 rounded px-2 py-0.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50">
            <span className="text-amber-400 font-bold mr-1.5 flex items-center gap-1 text-[11px]">
              <Terminal className="w-3 h-3" />
              <span>CMD:</span>
            </span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g. DSEX <GO>, BRENT, COMPARE"
              className="bg-transparent text-white text-[11px] placeholder:text-zinc-500 focus:outline-none w-48 sm:w-60 uppercase"
            />
            <button
              type="submit"
              className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 flex items-center gap-0.5"
            >
              <span>&lt;GO&gt;</span>
              <CornerDownLeft className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Quick Command Chips */}
          <div className="hidden xl:flex items-center gap-1 text-[10px] text-zinc-400">
            <span className="text-zinc-600">Shortcuts:</span>
            <button
              type="button"
              onClick={() => {
                const asset = availableAssets.find((a) => a.symbol === 'DSEX');
                if (asset) onSelectAsset(asset);
                setActiveTab('workstation');
              }}
              className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              DSEX &lt;GO&gt;
            </button>
            <button
              type="button"
              onClick={() => {
                const asset = availableAssets.find((a) => a.symbol === 'BRENT');
                if (asset) onSelectAsset(asset);
                setActiveTab('workstation');
              }}
              className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              BRENT &lt;GO&gt;
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className="px-1.5 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-600/30"
            >
              COMPARE &lt;GO&gt;
            </button>
          </div>
        </form>

        {/* Right: Network telemetry & Status badges */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <div className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 uppercase">
            VIEW: {activeTab}
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>TICKS: {tickCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-3 h-3" />
            <span>LATENCY: 11ms</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-zinc-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SECURE FEED (TLS 1.3)</span>
          </div>

          <span className="text-zinc-600">|</span>
          <span className="text-amber-400/90 font-bold">BLOOMBERG TERMINAL CLONE</span>
        </div>
      </div>
    </footer>
  );
};
