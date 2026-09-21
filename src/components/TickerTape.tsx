import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Asset } from '../types/finance';

interface TickerTapeProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId?: string;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ assets, onSelectAsset, selectedAssetId }) => {
  // Duplicate array to enable seamless marquee looping
  const tapeItems = [...assets, ...assets];

  return (
    <div className="bg-[#080c14] border-b border-[#1b2436] overflow-hidden py-1 select-none flex items-center relative z-20">
      {/* Ticker label */}
      <div className="bg-[#121927] px-2 py-1 text-[10px] font-mono font-bold text-amber-400 border-r border-[#1b2436] flex items-center gap-1 shrink-0 z-10 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>MARKETS TICKER</span>
      </div>

      <div className="overflow-hidden flex flex-1 whitespace-nowrap mask-gradient">
        <div className="animate-ticker flex items-center gap-6 text-xs font-mono">
          {tapeItems.map((asset, idx) => {
            const isPos = asset.changePercent >= 0;
            const isSelected = selectedAssetId === asset.id;

            return (
              <div
                key={`${asset.id}-${idx}`}
                onClick={() => onSelectAsset(asset)}
                className={`flex items-center gap-2 cursor-pointer px-2 py-0.5 rounded transition-all hover:bg-[#162032] ${
                  isSelected ? 'bg-[#1b263b] ring-1 ring-cyan-500/50' : ''
                }`}
                title={`Click to inspect ${asset.name}`}
              >
                <span className="font-bold text-zinc-200">{asset.symbol}</span>
                <span className="text-zinc-400">
                  {typeof asset.price === 'number'
                    ? asset.price >= 1000
                      ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : asset.price.toFixed(2)
                    : asset.price}
                </span>

                <span
                  className={`flex items-center text-[11px] font-semibold ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
                <span className="text-zinc-700 text-[10px]">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
