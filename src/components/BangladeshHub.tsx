import React, { useState } from 'react';
import { 
  TrendingUp, 
  Building2, 
  Fuel, 
  Percent, 
  Landmark, 
  DollarSign, 
  Coins 
} from 'lucide-react';
import type { DSEStock, BangladeshMacro } from '../types/finance';

interface BangladeshHubProps {
  stocks: DSEStock[];
  macro: BangladeshMacro;
  onSelectStock: (stock: DSEStock) => void;
  selectedStockSymbol?: string;
  isCompact?: boolean;
}

export const BangladeshHub: React.FC<BangladeshHubProps> = ({
  stocks,
  macro,
  onSelectStock,
  selectedStockSymbol,
  isCompact = false,
}) => {
  const [stockTab, setStockTab] = useState<'gainers' | 'losers' | 'turnover' | 'all'>('gainers');

  // Filter stocks
  const sortedStocks = [...stocks].sort((a, b) => {
    if (stockTab === 'gainers') return b.changePercent - a.changePercent;
    if (stockTab === 'losers') return a.changePercent - b.changePercent;
    if (stockTab === 'turnover') return b.turnoverCrore - a.turnoverCrore;
    return a.symbol.localeCompare(b.symbol);
  });

  const displayStocks = isCompact ? sortedStocks.slice(0, 6) : sortedStocks;

  return (
    <div className="bg-[#0b101c] border border-[#1b263b] rounded-md p-3 flex flex-col gap-3 shadow-lg">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1b263b]">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇧🇩</span>
          <div>
            <h2 className="font-mono font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <span>BANGLADESH DSE & MACRO HUB</span>
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono">
              Dhaka Stock Exchange & Central Bank Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
          <span>DSEX: 5,742.18</span>
          <span className="font-bold">(+0.68%)</span>
        </div>
      </div>

      {/* DSE Indices & Market Breadth Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
        <div className="bg-[#101726] border border-[#1a2538] p-2 rounded">
          <div className="text-[10px] text-zinc-400">DSEX BROAD</div>
          <div className="text-sm font-bold text-emerald-400">5,742.18</div>
          <div className="text-[9px] text-emerald-500 flex items-center">
            <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +38.64 (+0.68%)
          </div>
        </div>

        <div className="bg-[#101726] border border-[#1a2538] p-2 rounded">
          <div className="text-[10px] text-zinc-400">DSE30 BLUE CHIP</div>
          <div className="text-sm font-bold text-emerald-400">2,095.34</div>
          <div className="text-[9px] text-emerald-500 flex items-center">
            <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +14.12 (+0.68%)
          </div>
        </div>

        <div className="bg-[#101726] border border-[#1a2538] p-2 rounded">
          <div className="text-[10px] text-zinc-400">DAILY TURNOVER</div>
          <div className="text-sm font-bold text-amber-300">৳682.40 Cr</div>
          <div className="text-[9px] text-zinc-400">Total Trades: 184,520</div>
        </div>

        <div className="bg-[#101726] border border-[#1a2538] p-2 rounded">
          <div className="text-[10px] text-zinc-400">USD/BDT CORRIDOR</div>
          <div className="text-sm font-bold text-cyan-300">৳120.45</div>
          <div className="text-[9px] text-zinc-400">Kerb: ৳122.80 | Spread ৳2.55</div>
        </div>
      </div>

      {/* Macro Indicators Grid */}
      <div>
        <div className="flex items-center justify-between mb-1.5 font-mono text-xs text-zinc-300">
          <span className="font-bold flex items-center gap-1">
            <Landmark className="w-3 h-3 text-cyan-400" />
            <span>MACROECONOMIC & POLICY METRICS</span>
          </span>
          <span className="text-[10px] text-zinc-400">Official Releases</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
          {/* Inflation */}
          <div className="bg-[#121929] border border-[#1c273c] p-2.5 rounded">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-rose-400" />
                <span>INFLATION (CPI)</span>
              </span>
              <span className="text-rose-400 font-bold">{macro.inflation.general}%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
              <span>Food: <strong className="text-zinc-200">{macro.inflation.food}%</strong></span>
              <span>Non-Food: <strong className="text-zinc-200">{macro.inflation.nonFood}%</strong></span>
            </div>
            <div className="text-[9px] text-zinc-400 mt-1 truncate">{macro.inflation.period}</div>
          </div>

          {/* Bangladesh Bank Policy Rate */}
          <div className="bg-[#121929] border border-[#1c273c] p-2.5 rounded">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>BB REPO RATE</span>
              </span>
              <span className="text-amber-400 font-bold">{macro.policyRate.repoRate}%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
              <span>SLF: <strong className="text-zinc-200">{macro.policyRate.standingLendingFacility}%</strong></span>
              <span>SDF: <strong className="text-zinc-200">{macro.policyRate.reverseRepo}%</strong></span>
            </div>
            <div className="text-[9px] text-zinc-400 mt-1 truncate">Contractionary Policy Stance</div>
          </div>

          {/* FX Reserves */}
          <div className="bg-[#121929] border border-[#1c273c] p-2.5 rounded">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>FX RESERVES (BPM6)</span>
              </span>
              <span className="text-emerald-400 font-bold">${macro.fxReserves.bpm6ReservesBillion}B</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
              <span>Gross: <strong className="text-zinc-200">${macro.fxReserves.grossReservesBillion}B</strong></span>
              <span>Import Cover: <strong className="text-zinc-200">{macro.fxReserves.importCoverMonths} Mo</strong></span>
            </div>
            <div className="text-[9px] text-zinc-400 mt-1 truncate">IMF Benchmark Standard</div>
          </div>

          {/* Remittance */}
          <div className="bg-[#121929] border border-[#1c273c] p-2.5 rounded">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-cyan-400" />
                <span>MONTHLY REMITTANCE</span>
              </span>
              <span className="text-cyan-400 font-bold">${macro.remittance.monthlyBillionUSD}B</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
              <span>YoY Surge: <strong className="text-emerald-400">+{macro.remittance.yoyGrowthPercent}%</strong></span>
              <span>GDP: <strong className="text-zinc-200">{macro.gdpGrowthFY24}%</strong></span>
            </div>
            <div className="text-[9px] text-zinc-400 mt-1 truncate">Historic High Inflow</div>
          </div>
        </div>
      </div>

      {/* Fuel Prices in Bangladesh (BPC Formulated) */}
      <div className="bg-[#101624] border border-[#1a2538] p-2.5 rounded">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
            <Fuel className="w-3.5 h-3.5" />
            <span>OFFICIAL DOMESTIC FUEL PRICES (BANGLADESH)</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">{macro.fuelPricesBDT.lastRevision}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <div className="bg-[#141c2c] border border-[#1f2b40] p-2 rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">OCTANE (95 RON)</div>
              <div className="text-base font-bold text-white">৳{macro.fuelPricesBDT.octane.toFixed(2)}</div>
            </div>
            <span className="text-[10px] text-zinc-400">BDT/L</span>
          </div>

          <div className="bg-[#141c2c] border border-[#1f2b40] p-2 rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">PETROL</div>
              <div className="text-base font-bold text-white">৳{macro.fuelPricesBDT.petrol.toFixed(2)}</div>
            </div>
            <span className="text-[10px] text-zinc-400">BDT/L</span>
          </div>

          <div className="bg-[#141c2c] border border-[#1f2b40] p-2 rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">DIESEL</div>
              <div className="text-base font-bold text-white">৳{macro.fuelPricesBDT.diesel.toFixed(2)}</div>
            </div>
            <span className="text-[10px] text-zinc-400">BDT/L</span>
          </div>

          <div className="bg-[#141c2c] border border-[#1f2b40] p-2 rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">KEROSENE</div>
              <div className="text-base font-bold text-white">৳{macro.fuelPricesBDT.kerosene.toFixed(2)}</div>
            </div>
            <span className="text-[10px] text-zinc-400">BDT/L</span>
          </div>
        </div>
      </div>

      {/* DSE Stock Screener & Market Movers Table */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setStockTab('gainers')}
              className={`px-2 py-1 rounded transition-colors ${
                stockTab === 'gainers'
                  ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              TOP GAINERS
            </button>
            <button
              onClick={() => setStockTab('losers')}
              className={`px-2 py-1 rounded transition-colors ${
                stockTab === 'losers'
                  ? 'bg-rose-950/60 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              TOP LOSERS
            </button>
            <button
              onClick={() => setStockTab('turnover')}
              className={`px-2 py-1 rounded transition-colors ${
                stockTab === 'turnover'
                  ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              TURNOVER LEADERS
            </button>
            <button
              onClick={() => setStockTab('all')}
              className={`px-2 py-1 rounded transition-colors ${
                stockTab === 'all'
                  ? 'bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ALL BLUE CHIPS
            </button>
          </div>

          <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
            Click row to view interactive chart
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#1b263b] rounded">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-[#0f1726] text-zinc-400 border-b border-[#1b263b] text-[11px]">
                <th className="py-2 px-2.5 font-semibold">TICKER</th>
                <th className="py-2 px-2.5 font-semibold">COMPANY</th>
                <th className="py-2 px-2.5 font-semibold text-right">LTP (৳)</th>
                <th className="py-2 px-2.5 font-semibold text-right">CHANGE</th>
                <th className="py-2 px-2.5 font-semibold text-right">% CHG</th>
                <th className="py-2 px-2.5 font-semibold text-right hidden md:table-cell">TURNOVER (CR)</th>
                <th className="py-2 px-2.5 font-semibold text-right hidden sm:table-cell">P/E</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172236]">
              {displayStocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                const isSelected = selectedStockSymbol === stock.symbol;

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`cursor-pointer transition-colors hover:bg-[#141e30] ${
                      isSelected ? 'bg-[#18243b] ring-1 ring-emerald-500/50' : 'bg-[#0d1320]'
                    }`}
                  >
                    <td className="py-2 px-2.5 font-bold text-white flex items-center gap-1.5">
                      <span className="px-1 py-0.2 rounded bg-zinc-800 text-[9px] text-zinc-400">
                        {stock.category}
                      </span>
                      <span>{stock.symbol}</span>
                    </td>
                    <td className="py-2 px-2.5 text-zinc-300 max-w-[150px] truncate text-[11px]">
                      {stock.name}
                    </td>
                    <td className="py-2 px-2.5 text-right font-bold text-zinc-100">
                      ৳{stock.ltp.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-2.5 text-right font-semibold ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {stock.change.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-2.5 text-right font-bold ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-2 px-2.5 text-right text-zinc-400 hidden md:table-cell">
                      ৳{stock.turnoverCrore.toFixed(2)}
                    </td>
                    <td className="py-2 px-2.5 text-right text-zinc-400 hidden sm:table-cell">
                      {stock.pe.toFixed(1)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
