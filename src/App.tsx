import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { InteractiveChart } from './components/InteractiveChart';
import { GlobalHeatmap } from './components/GlobalHeatmap';
import { CommoditiesPanel } from './components/CommoditiesPanel';
import { BangladeshHub } from './components/BangladeshHub';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { StatusBar } from './components/StatusBar';
import { 
  GLOBAL_ASSETS, 
  DSE_STOCKS, 
  BANGLADESH_MACRO, 
  COMPARISON_ECONOMIES 
} from './data/mockData';
import { 
  fetchLiveMarketData, 
  mergeLiveQuotesIntoAssets, 
  updateMacroFromLive, 
  updateEconomiesFromLive 
} from './services/marketDataService';
import type { Asset, DSEStock, ActiveTab, BangladeshMacro, EconomyData } from './types/finance';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workstation');
  const [assets, setAssets] = useState<Asset[]>(GLOBAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(GLOBAL_ASSETS[0]);
  const [dseStocks, setDseStocks] = useState<DSEStock[]>(DSE_STOCKS);
  const [selectedStock, setSelectedStock] = useState<DSEStock>(DSE_STOCKS[0]);
  const [macro, setMacro] = useState<BangladeshMacro>(BANGLADESH_MACRO);
  const [economies, setEconomies] = useState<EconomyData[]>(COMPARISON_ECONOMIES);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [tickCount, setTickCount] = useState<number>(14820);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Function to fetch and merge live market data from backend/API
  const syncLiveData = useCallback(async () => {
    try {
      const payload = await fetchLiveMarketData();
      if (payload && payload.quotes) {
        setIsLiveConnected(true);
        setLastUpdated(new Date());

        // Update assets with real market prices
        setAssets((prev) => mergeLiveQuotesIntoAssets(prev, payload.quotes));

        // Update DSEX if available
        if (payload.bangladesh?.dsex) {
          const dsexData = payload.bangladesh.dsex;
          setAssets((prev) =>
            prev.map((a) => {
              if (a.id === 'dsex') {
                return {
                  ...a,
                  price: dsexData.price,
                  change: dsexData.change,
                  changePercent: dsexData.changePercent,
                };
              }
              return a;
            })
          );
        }

        // Update Bangladesh Macro
        if (payload.bangladesh?.macro) {
          setMacro((prev) => updateMacroFromLive(prev, payload.bangladesh!.macro));
          setEconomies((prev) => updateEconomiesFromLive(prev, payload.quotes, payload.bangladesh!.macro));
        }
      }
    } catch (err) {
      console.error('Failed to sync live data:', err);
    }
  }, []);

  // Fetch live market data on initial load
  useEffect(() => {
    syncLiveData();
  }, [syncLiveData]);

  // Periodic polling for fresh real quotes every 15s
  useEffect(() => {
    const pollTimer = setInterval(() => {
      syncLiveData();
    }, 15000);
    return () => clearInterval(pollTimer);
  }, [syncLiveData]);

  // Micro-tick Simulation Engine for active terminal feel in between poll cycles
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setTickCount((prev) => prev + 1);

      // Pick 2-3 random global assets to simulate realistic micro-ticks (spread fluctuations)
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          if (Math.random() > 0.55) {
            const deltaPercent = (Math.random() - 0.49) * 0.0008; // subtle 0.04% micro fluctuation
            const newPrice = +(asset.price * (1 + deltaPercent)).toFixed(
              asset.price < 10 ? 3 : 2
            );
            const newChange = +(asset.change + (newPrice - asset.price)).toFixed(2);
            const newChangePercent = +(
              asset.changePercent +
              deltaPercent * 100
            ).toFixed(2);
            const newSpark = [...asset.sparkline.slice(1), newPrice];

            return {
              ...asset,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              sparkline: newSpark,
            };
          }
          return asset;
        })
      );

      // Pick 1-2 random DSE stocks for micro-moves
      setDseStocks((prevStocks) =>
        prevStocks.map((stock) => {
          if (Math.random() > 0.7) {
            const delta = (Math.random() - 0.48) * 0.4;
            const newLtp = +(Math.max(1, stock.ltp + delta)).toFixed(2);
            const newChange = +(stock.change + delta).toFixed(2);
            const newPct = +((newChange / (newLtp - newChange)) * 100).toFixed(2);
            return {
              ...stock,
              ltp: newLtp,
              change: newChange,
              changePercent: newPct,
              volume: stock.volume + Math.floor(Math.random() * 200),
            };
          }
          return stock;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Keep selectedAsset synced with latest price
  useEffect(() => {
    const updated = assets.find((a) => a.id === selectedAsset.id);
    if (updated && updated.price !== selectedAsset.price) {
      setSelectedAsset(updated);
    }
  }, [assets, selectedAsset.id]);

  // Handle selecting an asset from ticker or heatmap
  const handleSelectAsset = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  // Handle selecting a DSE stock from Bangladesh Hub -> convert to chartable Asset
  const handleSelectStock = useCallback((stock: DSEStock) => {
    setSelectedStock(stock);

    const stockAsset: Asset = {
      id: `dse_${stock.symbol.toLowerCase()}`,
      symbol: stock.symbol,
      name: stock.name,
      category: 'bd_stock',
      price: stock.ltp,
      change: stock.change,
      changePercent: stock.changePercent,
      high: stock.high52w,
      low: stock.low52w,
      volume: `${(stock.volume / 1000).toFixed(0)}K`,
      currency: 'BDT',
      region: 'Bangladesh',
      sparkline: stock.sparkline,
      marketStatus: 'open',
    };

    setSelectedAsset(stockAsset);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'F1' || (e.altKey && e.key === '1')) {
        e.preventDefault();
        setActiveTab('workstation');
      } else if (e.key === 'F2' || (e.altKey && e.key === '2')) {
        e.preventDefault();
        setActiveTab('bangladesh');
      } else if (e.key === 'F3' || (e.altKey && e.key === '3')) {
        e.preventDefault();
        setActiveTab('compare');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleManualRefresh = () => {
    syncLiveData();
    setTickCount((prev) => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Bloomberg Top Header with Clocks & Live Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        onRefresh={handleManualRefresh}
        lastUpdated={lastUpdated}
      />

      {/* Live Data Synchronized Banner */}
      <div className="bg-[#091120] border-b border-[#1b263b] px-3 py-1 text-[11px] font-mono flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-bold text-zinc-200">
            {isLiveConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING TO DATA STREAM...'}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 text-[10px]">
            Sources: Yahoo Finance Real-time, BBS Inflation (8.26%), BB Repo Rate (9.50%), BPC Retail Fuel (Octane ৳165/L), Open Exchange
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-emerald-400">
          <span>USD/BDT: ৳{assets.find(a => a.id === 'usd_bdt')?.price.toFixed(2)}</span>
          <span className="text-zinc-600">|</span>
          <span>BRENT: ${assets.find(a => a.id === 'brent_crude')?.price.toFixed(2)}</span>
          <span className="text-zinc-600">|</span>
          <span>GOLD: ${assets.find(a => a.id === 'gold')?.price.toFixed(2)}</span>
        </div>
      </div>

      {/* 2. Scrolling Real-Time Ticker Tape */}
      <TickerTape
        assets={assets}
        onSelectAsset={handleSelectAsset}
        selectedAssetId={selectedAsset.id}
      />

      {/* 3. Main Dynamic Workspace */}
      <main className="flex-1 p-2 sm:p-3 overflow-y-auto">
        {/* VIEW 1: TERMINAL WORKSTATION (Concept 1 Multi-window layout) */}
        {activeTab === 'workstation' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
            {/* Left Main Column: Interactive Chart + Heatmap + Commodities */}
            <div className="xl:col-span-7 flex flex-col gap-3">
              {/* Financial Candlestick / Line Chart */}
              <div className="h-[430px]">
                <InteractiveChart
                  selectedAsset={selectedAsset}
                  onSelectAsset={handleSelectAsset}
                  availableAssets={assets}
                />
              </div>

              {/* Global Heatmap & Commodities Panel Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <GlobalHeatmap
                  assets={assets}
                  onSelectAsset={handleSelectAsset}
                  selectedAssetId={selectedAsset.id}
                />
                <CommoditiesPanel
                  assets={assets}
                  onSelectAsset={handleSelectAsset}
                  selectedAssetId={selectedAsset.id}
                />
              </div>
            </div>

            {/* Right Column: Dedicated Bangladesh Hub */}
            <div className="xl:col-span-5 flex flex-col">
              <BangladeshHub
                stocks={dseStocks}
                macro={macro}
                onSelectStock={handleSelectStock}
                selectedStockSymbol={selectedStock.symbol}
                isCompact={true}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: BANGLADESH DEEP-DIVE (Full screen focus on DSE & Macro) */}
        {activeTab === 'bangladesh' && (
          <div className="flex flex-col gap-3 max-w-7xl mx-auto">
            {/* Top split: Stock chart + Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-8 h-[420px]">
                <InteractiveChart
                  selectedAsset={selectedAsset}
                  onSelectAsset={handleSelectAsset}
                  availableAssets={assets}
                />
              </div>

              <div className="lg:col-span-4 bg-[#0b101c] border border-[#1b263b] rounded-md p-3 font-mono text-xs flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1a2538] pb-2 mb-2">
                    <span className="font-bold text-emerald-400">ACTIVE ASSET SUMMARY</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {selectedAsset.symbol}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">Security Name:</span>
                      <span className="text-white font-semibold text-right max-w-[180px] truncate">
                        {selectedAsset.name}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">Last Traded Price:</span>
                      <span className="text-white font-bold">
                        {selectedAsset.currency === 'USD' ? '$' : '৳'}
                        {typeof selectedAsset.price === 'number' ? selectedAsset.price.toFixed(2) : selectedAsset.price}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">Net Day Change:</span>
                      <span className={selectedAsset.changePercent >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%)
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">52-Week High:</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedAsset.currency === 'USD' ? '$' : '৳'}{selectedAsset.high.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">52-Week Low:</span>
                      <span className="text-rose-400 font-bold">
                        {selectedAsset.currency === 'USD' ? '$' : '৳'}{selectedAsset.low.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#152033]">
                      <span className="text-zinc-400">Reported Volume:</span>
                      <span className="text-zinc-200">{selectedAsset.volume}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#101726] border border-[#1b273d] p-2.5 rounded mt-3 text-[11px] text-zinc-300">
                  <div className="text-amber-400 font-bold mb-1">DSE REGULATORY NOTICE:</div>
                  Circuit breaker rules apply (±10% price band). Bangladesh Bank crawling peg corridor rate active at ৳123.32/USD.
                </div>
              </div>
            </div>

            {/* Comprehensive Bangladesh Hub with All Stocks */}
            <BangladeshHub
              stocks={dseStocks}
              macro={macro}
              onSelectStock={handleSelectStock}
              selectedStockSymbol={selectedStock.symbol}
              isCompact={false}
            />
          </div>
        )}

        {/* VIEW 3: GLOBAL vs BD COMPARATIVE MATRIX */}
        {activeTab === 'compare' && (
          <div className="max-w-7xl mx-auto">
            <ComparisonMatrix economies={economies} />
          </div>
        )}
      </main>

      {/* 4. Bloomberg Command Bar & System Telemetry */}
      <StatusBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableAssets={assets}
        onSelectAsset={handleSelectAsset}
        tickCount={tickCount}
      />
    </div>
  );
}

export default App;
