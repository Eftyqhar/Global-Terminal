import { Flame, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';
import type { Asset } from '../types/finance';

interface CommoditiesPanelProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId?: string;
}

export const CommoditiesPanel: React.FC<CommoditiesPanelProps> = ({
  assets,
  onSelectAsset,
  selectedAssetId,
}) => {
  const commodityAssets = assets.filter((a) => a.category === 'commodity');

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const pathD = points
      .map((pt, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((pt - min) / range) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#00e676' : '#ff334b';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="bg-[#0c121e] border border-[#1b263b] rounded-md p-3 flex flex-col shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#1b263b]">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>COMMODITIES & ENERGY HUB</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
          <span>SPOT & FUTURES</span>
        </div>
      </div>

      {/* Grid of Commodity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1">
        {commodityAssets.map((asset) => {
          const isPos = asset.changePercent >= 0;
          const isSelected = selectedAssetId === asset.id;

          // Bangladesh macro sensitivity annotation
          let bdImpactNote = '';
          if (asset.symbol === 'BRENT' || asset.symbol === 'WTI') {
            bdImpactNote = 'BPC Import Bill & FX Reserves Pressure';
          } else if (asset.symbol === 'NATGAS') {
            bdImpactNote = 'RLNG Import Cost & Power Tariff Subsidies';
          } else if (asset.symbol.includes('GOLD')) {
            bdImpactNote = 'Local Jewelry & Smuggling Arbitrage Benchmark';
          } else if (asset.symbol.includes('SILVER')) {
            bdImpactNote = 'Industrial & Electronics Demand';
          }

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`bg-[#101726] border rounded p-2.5 transition-all cursor-pointer hover:border-amber-500/50 hover:bg-[#141e33] ${
                isSelected ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-[#1e293b]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-zinc-100">{asset.symbol}</span>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[140px]">{asset.name}</div>
                </div>

                {/* Sparkline */}
                <div className="shrink-0">{renderSparkline(asset.sparkline, isPos)}</div>
              </div>

              <div className="mt-2.5 flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-base font-bold text-white tracking-tight">
                    {typeof asset.price === 'number'
                      ? asset.price >= 1000
                        ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : asset.price.toFixed(2)
                      : asset.price}
                  </span>
                  <span className="text-[10px] text-zinc-400 ml-1">{asset.currency}</span>
                </div>

                <span
                  className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
                    isPos ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Bangladesh Impact Annotation */}
              {bdImpactNote && (
                <div className="mt-2 pt-1.5 border-t border-[#182338] flex items-center gap-1 text-[9px] text-amber-400/90 font-mono truncate">
                  <ShieldAlert className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{bdImpactNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
