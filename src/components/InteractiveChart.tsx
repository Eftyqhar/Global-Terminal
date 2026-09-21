import { useState, useEffect, useRef } from 'react';
import type { 
  Candle, 
  ChartType, 
  ChartTimeframe, 
  Asset 
} from '../types/finance';
import { generateCandles } from '../data/mockData';
import { 
  CandlestickChart as CandleIcon, 
  LineChart as LineIcon
} from 'lucide-react';

interface InteractiveChartProps {
  selectedAsset: Asset;
  onSelectAsset?: (asset: Asset) => void;
  availableAssets: Asset[];
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  selectedAsset,
  onSelectAsset,
  availableAssets,
}) => {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1M');
  const [showSMA20, setShowSMA20] = useState<boolean>(true);
  const [showSMA50, setShowSMA50] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  // Generate or update candles whenever selectedAsset or timeframe changes
  useEffect(() => {
    const countMap: Record<ChartTimeframe, number> = {
      '1D': 24,
      '5D': 35,
      '1M': 45,
      '6M': 60,
      '1Y': 75,
      '5Y': 90,
      'ALL': 100,
    };
    const count = countMap[timeframe] || 45;
    const volMap: Record<string, number> = {
      crypto: 0.03,
      commodity: 0.015,
      forex: 0.004,
      index: 0.008,
      bd_stock: 0.018,
      global_stock: 0.015,
    };
    const vol = volMap[selectedAsset.category] || 0.012;
    const data = generateCandles(selectedAsset.price, count, vol);
    setCandles(data);
    setHoveredCandle(null);
  }, [selectedAsset.id, selectedAsset.price, timeframe]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.fillStyle = '#0b101c';
    ctx.fillRect(0, 0, width, height);

    // Layout configuration
    const paddingLeft = 10;
    const paddingRight = 60; // For price scale
    const paddingTop = 30;
    const rsiHeight = showRSI ? 85 : 0;
    const volumeHeight = showVolume ? 55 : 0;
    const paddingBottom = 25 + rsiHeight;
    const chartHeight = height - paddingTop - paddingBottom;
    const chartWidth = width - paddingLeft - paddingRight;

    // Calculate price extremes
    let minPrice = Math.min(...candles.map(c => c.low));
    let maxPrice = Math.max(...candles.map(c => c.high));

    if (showSMA20) {
      candles.forEach(c => {
        if (c.sma20) {
          minPrice = Math.min(minPrice, c.sma20);
          maxPrice = Math.max(maxPrice, c.sma20);
        }
      });
    }

    const priceMargin = (maxPrice - minPrice) * 0.05 || 1;
    minPrice -= priceMargin;
    maxPrice += priceMargin;
    const priceRange = maxPrice - minPrice || 1;

    const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

    // Grid lines (horizontal price lines)
    const gridRows = 5;
    ctx.strokeStyle = '#172236';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';

    for (let i = 0; i <= gridRows; i++) {
      const y = paddingTop + (chartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const priceVal = maxPrice - (priceRange / gridRows) * i;
      ctx.fillText(
        priceVal >= 1000
          ? priceVal.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
          : priceVal.toFixed(2),
        width - paddingRight + 6,
        y + 3
      );
    }

    const candleWidth = Math.max(2, (chartWidth / candles.length) * 0.65);
    const stepX = chartWidth / candles.length;

    // Draw Volume Bars
    if (showVolume) {
      const volBaseY = paddingTop + chartHeight;
      candles.forEach((c, idx) => {
        const x = paddingLeft + idx * stepX + stepX / 2;
        const vH = (c.volume / maxVolume) * volumeHeight;
        const isUp = c.close >= c.open;
        ctx.fillStyle = isUp ? 'rgba(0, 230, 118, 0.22)' : 'rgba(255, 51, 75, 0.22)';
        ctx.fillRect(x - candleWidth / 2, volBaseY - vH, candleWidth, vH);
      });
    }

    // Render Candlestick or Line Chart
    if (chartType === 'candlestick') {
      candles.forEach((c, idx) => {
        const x = paddingLeft + idx * stepX + stepX / 2;
        const openY = paddingTop + ((maxPrice - c.open) / priceRange) * chartHeight;
        const closeY = paddingTop + ((maxPrice - c.close) / priceRange) * chartHeight;
        const highY = paddingTop + ((maxPrice - c.high) / priceRange) * chartHeight;
        const lowY = paddingTop + ((maxPrice - c.low) / priceRange) * chartHeight;
        const isUp = c.close >= c.open;

        const color = isUp ? '#00e676' : '#ff334b';

        // Draw Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else {
      // Area / Line Chart
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = paddingLeft + idx * stepX + stepX / 2;
        const y = paddingTop + ((maxPrice - c.close) / priceRange) * chartHeight;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (chartType === 'area') {
        const lastX = paddingLeft + (candles.length - 1) * stepX + stepX / 2;
        const firstX = paddingLeft + stepX / 2;
        ctx.lineTo(lastX, paddingTop + chartHeight);
        ctx.lineTo(firstX, paddingTop + chartHeight);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Moving Averages: SMA 20 (Cyan) & SMA 50 (Amber)
    if (showSMA20) {
      ctx.beginPath();
      let started = false;
      candles.forEach((c, idx) => {
        if (c.sma20) {
          const x = paddingLeft + idx * stepX + stepX / 2;
          const y = paddingTop + ((maxPrice - c.sma20) / priceRange) * chartHeight;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    if (showSMA50) {
      ctx.beginPath();
      let started = false;
      candles.forEach((c, idx) => {
        if (c.sma50) {
          const x = paddingLeft + idx * stepX + stepX / 2;
          const y = paddingTop + ((maxPrice - c.sma50) / priceRange) * chartHeight;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // RSI Sub-chart
    if (showRSI) {
      const rsiTop = height - rsiHeight + 10;
      const rsiInnerH = rsiHeight - 25;

      // Divider line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, rsiTop - 8);
      ctx.lineTo(width - paddingRight, rsiTop - 8);
      ctx.stroke();

      // RSI Boundaries (70 and 30)
      const y70 = rsiTop + rsiInnerH * 0.3;
      const y30 = rsiTop + rsiInnerH * 0.7;

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y70);
      ctx.lineTo(width - paddingRight, y70);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y30);
      ctx.lineTo(width - paddingRight, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.fillText('70', width - paddingRight + 6, y70 + 3);
      ctx.fillText('30', width - paddingRight + 6, y30 + 3);
      ctx.fillText('RSI (14)', paddingLeft + 4, rsiTop + 8);

      // Plot RSI line
      ctx.beginPath();
      let rsiStarted = false;
      candles.forEach((c, idx) => {
        if (c.rsi !== undefined) {
          const x = paddingLeft + idx * stepX + stepX / 2;
          const y = rsiTop + ((100 - c.rsi) / 100) * rsiInnerH;
          if (!rsiStarted) {
            ctx.moveTo(x, y);
            rsiStarted = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // X-axis time marks
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    const timeInterval = Math.max(1, Math.floor(candles.length / 5));
    candles.forEach((c, idx) => {
      if (idx % timeInterval === 0) {
        const x = paddingLeft + idx * stepX + stepX / 2;
        ctx.fillText(c.timeStr, x, paddingTop + chartHeight + 16);
      }
    });

  }, [candles, chartType, showSMA20, showSMA50, showRSI, showVolume]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 10;
    const chartWidth = rect.width - 70;
    const stepX = chartWidth / candles.length;
    const index = Math.floor(x / stepX);
    if (index >= 0 && index < candles.length) {
      setHoveredCandle(candles[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
  };

  const displayCandle = hoveredCandle || candles[candles.length - 1];
  const isUp = displayCandle ? displayCandle.close >= displayCandle.open : true;

  return (
    <div className="bg-[#0b101c] border border-[#1b263b] rounded-md flex flex-col h-full overflow-hidden shadow-lg">
      {/* Chart Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#1b263b] bg-[#0e1424] gap-2">
        {/* Left: Asset Switcher and Main Quote */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedAsset.id}
              onChange={(e) => {
                const target = availableAssets.find(a => a.id === e.target.value);
                if (target && onSelectAsset) onSelectAsset(target);
              }}
              className="bg-[#141d30] text-zinc-100 font-mono font-bold text-sm px-2.5 py-1 rounded border border-zinc-700 hover:border-cyan-500 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <optgroup label="Global Benchmark Assets">
                <option value="sp500">S&P 500 (USA)</option>
                <option value="nasdaq">NASDAQ (USA)</option>
                <option value="brent_crude">Brent Crude Oil</option>
                <option value="gold">Gold Spot (XAU)</option>
                <option value="btc_usd">Bitcoin (BTC/USD)</option>
                <option value="usd_bdt">USD / BDT</option>
                <option value="nifty50">NIFTY 50 (India)</option>
              </optgroup>
              <optgroup label="Bangladesh Market (DSE)">
                <option value="dsex">DSEX Broad Index</option>
                <option value="dse30">DSE 30 Blue Chips</option>
              </optgroup>
            </select>
          </div>

          {/* Asset Badge */}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
            {selectedAsset.category} • {selectedAsset.region}
          </span>

          {/* Price & Change Display */}
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-lg font-bold text-white tracking-tight">
              {typeof selectedAsset.price === 'number'
                ? selectedAsset.price >= 1000
                  ? selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : selectedAsset.price.toFixed(2)
                : selectedAsset.price}
              <span className="text-xs text-zinc-400 font-normal ml-1">{selectedAsset.currency}</span>
            </span>

            <span
              className={`flex items-center text-xs font-semibold ${
                selectedAsset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {selectedAsset.changePercent >= 0 ? '+' : ''}
              {selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent >= 0 ? '+' : ''}
              {selectedAsset.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Right Toolbar: Timeframes & Technical Overlays */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {/* Timeframe Chips */}
          <div className="flex items-center bg-[#141d30] p-0.5 rounded border border-zinc-800">
            {(['1D', '5D', '1M', '6M', '1Y', '5Y'] as ChartTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggles */}
          <div className="flex items-center bg-[#141d30] p-0.5 rounded border border-zinc-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`p-1 rounded ${
                chartType === 'candlestick' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Candlestick Chart"
            >
              <CandleIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1 rounded ${
                chartType === 'area' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Area Chart"
            >
              <LineIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Technical Indicator Toggles */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                showSMA20
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                showSMA50
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                showRSI
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/50'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                showVolume
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              VOL
            </button>
          </div>
        </div>
      </div>

      {/* Crosshair / Candle Data Info Bar */}
      {displayCandle && (
        <div className="flex flex-wrap items-center justify-between px-3 py-1 bg-[#090d17] border-b border-[#162033] text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="text-zinc-300">{displayCandle.timeStr}</span>
            <span>
              O: <strong className="text-zinc-200">{displayCandle.open}</strong>
            </span>
            <span>
              H: <strong className="text-emerald-400">{displayCandle.high}</strong>
            </span>
            <span>
              L: <strong className="text-rose-400">{displayCandle.low}</strong>
            </span>
            <span>
              C:{' '}
              <strong className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
                {displayCandle.close}
              </strong>
            </span>
            <span>
              Vol: <strong className="text-zinc-200">{(displayCandle.volume / 1000).toFixed(1)}k</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {showSMA20 && displayCandle.sma20 && (
              <span className="text-cyan-400">SMA20: {displayCandle.sma20}</span>
            )}
            {showSMA50 && displayCandle.sma50 && (
              <span className="text-amber-400">SMA50: {displayCandle.sma50}</span>
            )}
            {showRSI && displayCandle.rsi && (
              <span className="text-purple-400">RSI: {displayCandle.rsi}</span>
            )}
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="relative flex-1 min-h-[380px] w-full bg-[#0b101c]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair block"
        />
      </div>
    </div>
  );
};
