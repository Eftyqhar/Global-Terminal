import React from 'react';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';
import type { Asset } from '../types/finance';

interface GlobalHeatmapProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId?: string;
}

export const GlobalHeatmap: React.FC<GlobalHeatmapProps> = ({
  assets,
  onSelectAsset,
  selectedAssetId,
}) => {
  // Filter for indices, key commodities, and benchmark assets
  const heatmapAssets = assets.filter(
    (a) => a.category === 'index' || a.symbol === 'BRENT' || a.symbol === 'GOLD (XAU)'
  );

  const getColorClass = (changePercent: number) => {
    if (changePercent >= 1.5) return 'bg-emerald-600/90 text-white border-emerald-400';
    if (changePercent >= 0.5) return 'bg-emerald-700/70 text-emerald-100 border-emerald-500/60';
    if (changePercent > 0) return 'bg-emerald-900/60 text-emerald-200 border-emerald-600/40';
    if (changePercent === 0) return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (changePercent > -0.5) return 'bg-rose-950/60 text-rose-200 border-rose-600/40';
    if (changePercent > -1.5) return 'bg-rose-900/70 text-rose-100 border-rose-500/60';
    return 'bg-rose-600/90 text-white border-rose-400';
  };

  return (
    <div className="bg-[#0c121e] border border-[#1b263b] rounded-md p-3 flex flex-col shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#1b263b]">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-200">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLOBAL INDICES HEAT MAP</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">Market Cap Weighted %</span>
      </div>

      {/* Grid of tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 flex-1">
        {heatmapAssets.map((asset) => {
          const isSelected = selectedAssetId === asset.id;
          const isPos = asset.changePercent >= 0;
          const colorClass = getColorClass(asset.changePercent);

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`p-2.5 rounded border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.02] hover:shadow-lg ${colorClass} ${
                isSelected ? 'ring-2 ring-cyan-400 shadow-cyan-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs tracking-wider">{asset.symbol}</span>
                <span className="text-[9px] font-mono opacity-80 uppercase px-1 py-0.2 rounded bg-black/20">
                  {asset.region}
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-xs font-semibold">
                  {typeof asset.price === 'number'
                    ? asset.price >= 1000
                      ? asset.price.toLocaleString('en-US', { maximumFractionDigits: 1 })
                      : asset.price.toFixed(2)
                    : asset.price}
                </span>

                <span className="flex items-center text-[11px] font-bold">
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
