import React, { useState } from 'react';
import { 
  Scale, 
  CheckSquare, 
  Square, 
  BarChart3, 
  Fuel, 
  Percent, 
  Landmark 
} from 'lucide-react';
import type { EconomyData } from '../types/finance';

interface ComparisonMatrixProps {
  economies: EconomyData[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ economies }) => {
  const [selectedMetric, setSelectedMetric] = useState<'inflation' | 'gdp' | 'rates'>('inflation');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'bd',
    'usa',
    'china',
    'india',
    'japan',
    'uk',
  ]);

  const toggleCountry = (id: string) => {
    if (selectedCountries.includes(id)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter((c) => c !== id));
      }
    } else {
      setSelectedCountries([...selectedCountries, id]);
    }
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'inflation':
        return 'Headline Inflation Rate (CPI % YoY)';
      case 'gdp':
        return 'Annual Real GDP Growth Rate (%)';
      case 'rates':
        return 'Central Bank Benchmark Policy Rate (%)';
    }
  };

  const activeEconomies = economies.filter((e) => selectedCountries.includes(e.id));

  // Colors for multi-line comparison
  const countryColors: Record<string, { stroke: string; bg: string; text: string }> = {
    bd: { stroke: '#00e676', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    usa: { stroke: '#38bdf8', bg: 'bg-sky-500/20', text: 'text-sky-400' },
    china: { stroke: '#f43f5e', bg: 'bg-rose-500/20', text: 'text-rose-400' },
    india: { stroke: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-400' },
    japan: { stroke: '#c084fc', bg: 'bg-purple-500/20', text: 'text-purple-400' },
    uk: { stroke: '#a3e635', bg: 'bg-lime-500/20', text: 'text-lime-400' },
  };

  // Prepare chart series points
  const years = ['2021', '2022', '2023', '2024', '2025'];
  let maxChartVal = 12;
  let minChartVal = -2;

  activeEconomies.forEach((econ) => {
    const list =
      selectedMetric === 'inflation'
        ? econ.historicalInflation
        : selectedMetric === 'gdp'
        ? econ.historicalGDP
        : econ.historicalRates;
    list.forEach((pt) => {
      if (pt.value > maxChartVal) maxChartVal = Math.ceil(pt.value + 1);
      if (pt.value < minChartVal) minChartVal = Math.floor(pt.value - 1);
    });
  });

  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 25;
  const usableW = chartWidth - paddingX * 2;
  const usableH = chartHeight - paddingY * 2;
  const valRange = maxChartVal - minChartVal || 1;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minChartVal) / valRange) * usableH;
  };

  const getX = (idx: number) => {
    return paddingX + (idx / (years.length - 1)) * usableW;
  };

  return (
    <div className="bg-[#0b101c] border border-[#1b263b] rounded-md p-4 flex flex-col gap-4 shadow-xl text-zinc-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1b263b] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="font-mono font-bold text-base text-white tracking-wide">
              GLOBAL MARKETS vs BANGLADESH COMPARATIVE SUITE
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Cross-Economy Benchmarking: Bangladesh vs USA, China, India, Japan, UK
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-[#101726] p-1 rounded border border-zinc-800 font-mono text-xs">
          <button
            onClick={() => setSelectedMetric('inflation')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedMetric === 'inflation'
                ? 'bg-rose-950/80 text-rose-300 font-bold border border-rose-500/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            INFLATION (CPI)
          </button>
          <button
            onClick={() => setSelectedMetric('gdp')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedMetric === 'gdp'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            GDP GROWTH
          </button>
          <button
            onClick={() => setSelectedMetric('rates')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedMetric === 'rates'
                ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/50'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            POLICY INTEREST RATES
          </button>
        </div>
      </div>

      {/* Country Filter Badges */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0e1422] p-2 rounded border border-[#1a2538] font-mono text-xs">
        <span className="text-zinc-400 text-[11px] font-semibold mr-1">ACTIVE ECONOMIES:</span>
        {economies.map((econ) => {
          const isChecked = selectedCountries.includes(econ.id);
          const colorObj = countryColors[econ.id];

          return (
            <button
              key={econ.id}
              onClick={() => toggleCountry(econ.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all ${
                isChecked
                  ? `${colorObj.bg} ${colorObj.text} border-current font-bold shadow-sm`
                  : 'bg-zinc-900/50 text-zinc-500 border-zinc-800'
              }`}
            >
              <span>{econ.flag}</span>
              <span>{econ.country}</span>
              {isChecked ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Multi-Line Historical Comparison SVG Chart */}
      <div className="bg-[#0e1524] border border-[#1b273d] rounded p-3 relative">
        <div className="flex items-center justify-between mb-2 font-mono text-xs text-zinc-300">
          <span className="font-bold flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{getMetricTitle()} (5-Year Historical Trajectory)</span>
          </span>
          <span className="text-[10px] text-zinc-400">Source: IMF / World Bank / Central Bank MPCs</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-[260px] block select-none font-mono"
          >
            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const val = minChartVal + ratio * valRange;
              const y = getY(val);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#1c273d"
                    strokeDasharray="4,4"
                  />
                  <text x={paddingX - 6} y={y + 3} fill="#64748b" fontSize="10" textAnchor="end">
                    {val.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Zero line if visible */}
            {minChartVal < 0 && maxChartVal > 0 && (
              <line
                x1={paddingX}
                y1={getY(0)}
                x2={chartWidth - paddingX}
                y2={getY(0)}
                stroke="#475569"
                strokeWidth="1.2"
              />
            )}

            {/* X-axis year ticks */}
            {years.map((yr, idx) => {
              const x = getX(idx);
              return (
                <text
                  key={yr}
                  x={x}
                  y={chartHeight - 6}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {yr}
                </text>
              );
            })}

            {/* Economy trendlines */}
            {activeEconomies.map((econ) => {
              const color = countryColors[econ.id].stroke;
              const list =
                selectedMetric === 'inflation'
                  ? econ.historicalInflation
                  : selectedMetric === 'gdp'
                  ? econ.historicalGDP
                  : econ.historicalRates;

              const pathD = list
                .map((pt, idx) => {
                  const x = getX(idx);
                  const y = getY(pt.value);
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ');

              const isBD = econ.id === 'bd';

              return (
                <g key={econ.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={isBD ? 3.5 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                  {/* Point circles */}
                  {list.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={getX(idx)}
                      cy={getY(pt.value)}
                      r={isBD ? 4 : 2.5}
                      fill={color}
                      stroke="#0e1524"
                      strokeWidth={1.5}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Comprehensive Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto border border-[#1b263b] rounded">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#121a2c] text-zinc-400 border-b border-[#1b263b] text-[11px]">
              <th className="py-2.5 px-3 font-semibold">ECONOMY</th>
              <th className="py-2.5 px-3 font-semibold text-right">CPI INFLATION</th>
              <th className="py-2.5 px-3 font-semibold text-right">POLICY RATE</th>
              <th className="py-2.5 px-3 font-semibold text-right">REAL RATE SPREAD</th>
              <th className="py-2.5 px-3 font-semibold text-right">GDP GROWTH</th>
              <th className="py-2.5 px-3 font-semibold text-right">DEBT / GDP</th>
              <th className="py-2.5 px-3 font-semibold text-right">FX RESERVES</th>
              <th className="py-2.5 px-3 font-semibold text-right">OCTANE ($/L)</th>
              <th className="py-2.5 px-3 font-semibold text-right">1Y FX CHG</th>
              <th className="py-2.5 px-3 font-semibold text-center">SOVEREIGN RATING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172236]">
            {economies.map((econ) => {
              const isBD = econ.id === 'bd';
              const realRate = +(econ.centralBankRate - econ.inflationCPI).toFixed(2);
              const isPositiveRealRate = realRate >= 0;

              return (
                <tr
                  key={econ.id}
                  className={`transition-colors ${
                    isBD
                      ? 'bg-emerald-950/40 font-bold border-l-4 border-l-emerald-500'
                      : 'bg-[#0d1320] hover:bg-[#121b2c]'
                  }`}
                >
                  <td className="py-2.5 px-3 flex items-center gap-2">
                    <span className="text-base">{econ.flag}</span>
                    <div>
                      <div className={isBD ? 'text-emerald-400 text-sm' : 'text-zinc-200'}>
                        {econ.country}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-normal">{econ.currencyCode}</div>
                    </div>
                  </td>

                  {/* Inflation */}
                  <td className="py-2.5 px-3 text-right">
                    <span className={econ.inflationCPI > 6 ? 'text-rose-400 font-bold' : 'text-zinc-200'}>
                      {econ.inflationCPI.toFixed(2)}%
                    </span>
                  </td>

                  {/* Policy Rate */}
                  <td className="py-2.5 px-3 text-right font-bold text-amber-300">
                    {econ.centralBankRate.toFixed(2)}%
                  </td>

                  {/* Real Interest Rate (Policy Rate - CPI) */}
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isPositiveRealRate
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isPositiveRealRate ? '+' : ''}
                      {realRate.toFixed(2)}%
                    </span>
                  </td>

                  {/* GDP Growth */}
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-emerald-400 font-bold">
                      {econ.gdpGrowth >= 0 ? '+' : ''}
                      {econ.gdpGrowth.toFixed(2)}%
                    </span>
                  </td>

                  {/* Debt to GDP */}
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {econ.debtToGDP.toFixed(1)}%
                  </td>

                  {/* FX Reserves */}
                  <td className="py-2.5 px-3 text-right text-cyan-300">
                    ${econ.fxReservesUSD_B.toLocaleString('en-US', { minimumFractionDigits: 1 })}B
                  </td>

                  {/* Fuel Price in USD */}
                  <td className="py-2.5 px-3 text-right text-zinc-200">
                    ${econ.fuelOctaneUSD.toFixed(2)}
                    <span className="text-[10px] text-zinc-400 block">
                      (৳{(econ.fuelOctaneUSD * 120.45).toFixed(0)})
                    </span>
                  </td>

                  {/* 1Y FX Depreciation vs USD */}
                  <td
                    className={`py-2.5 px-3 text-right font-semibold ${
                      econ.currencyDeprec1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {econ.currencyDeprec1Y >= 0 ? '+' : ''}
                    {econ.currencyDeprec1Y.toFixed(1)}%
                  </td>

                  {/* Credit Rating */}
                  <td className="py-2.5 px-3 text-center text-zinc-300 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                      {econ.creditRating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Macro Takeaways & Strategic Divergence Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-[#101726] border border-[#1b263b] p-3 rounded">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5">
            <Percent className="w-3.5 h-3.5" />
            <span>MONETARY STANCE DIVERGENCE</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            While the <strong>US Federal Reserve (4.75%)</strong> and <strong>Bank of England (5.0%)</strong> are cutting rates into an easing cycle, <strong>Bangladesh Bank (10.0%)</strong> maintains an ultra-tight contractionary policy to rein in stubborn food inflation and stabilize the BDT exchange rate.
          </p>
        </div>

        <div className="bg-[#101726] border border-[#1b263b] p-3 rounded">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
            <Landmark className="w-3.5 h-3.5" />
            <span>SOVEREIGN DEBT LEVERAGE</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Bangladesh holds a comparatively prudent <strong>Debt-to-GDP ratio of 38.5%</strong>, significantly below the <strong>USA (122.3%)</strong>, <strong>UK (100.0%)</strong>, and <strong>Japan (260%)</strong>, providing fiscal buffer once revenue mobilization reforms gain traction.
          </p>
        </div>

        <div className="bg-[#101726] border border-[#1b263b] p-3 rounded">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5">
            <Fuel className="w-3.5 h-3.5" />
            <span>FUEL SUBSIDY PASS-THROUGH</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            At <strong>$1.04/Liter (৳125/L)</strong> for 95 RON Octane, Bangladesh domestic fuel is market-formula aligned via BPC, cheaper than <strong>UK ($1.74)</strong> and <strong>China ($1.15)</strong>, yet directly sensitive to global Brent crude shifts ($74.82/bbl).
          </p>
        </div>
      </div>
    </div>
  );
};
