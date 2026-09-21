# Global Terminal 📈

> **Professional Worldwide Finance Terminal & Bangladesh Hub**  
> An institutional-grade financial workstation inspired by Bloomberg and FactSet, featuring live global market quotes, commodities, forex, crypto, and a dedicated Bangladesh macro and DSE financial suite with cross-economy comparative benchmarking.

---

## 🌟 Key Features

### 1. Global Markets Telemetry
- **Indices**: Real-time tracking of S&P 500, NASDAQ, FTSE 100, DAX, Nikkei 225, NIFTY 50, and DSEX Bangladesh.
- **Commodities & Energy**: Live spot quotes for Brent Crude, WTI Crude, Henry Hub Natural Gas, Gold Spot (XAU), and Silver Spot (XAG) with sparklines and import sensitivity analysis.
- **Crypto & Forex**: Live Bitcoin (BTC/USD), Ethereum (ETH/USD), EUR/USD, and real-time USD/BDT crawling peg corridor.

### 2. Dedicated Bangladesh DSE & Macroeconomic Hub
- **Dhaka Stock Exchange (DSE)**: DSEX Broad Index, DSE30 Blue Chip, daily turnover in Crore BDT, total trades, and market breadth.
- **DSE Stock Screener**: Filterable tabs for *Top Gainers*, *Top Losers*, *Turnover Leaders*, and *Blue Chips* (Grameenphone, Square Pharma, Beximco, BRAC Bank, Walton, BATBC, etc.).
- **Macroeconomic Scorecard**:
  - Point-to-point Headline Inflation (BBS official)
  - Bangladesh Bank Policy Repo Rate (Contractionary stance)
  - Foreign Exchange Reserves (IMF BPM6 & Gross standard)
  - Monthly Remittance Inflow
- **Official Fuel Tariffs**: BPC formula-adjusted domestic retail prices for Octane 95, Petrol, Diesel, and Kerosene.
- **Currency Corridor**: Central Bank Crawling Peg Mid-Rate vs Commercial Banks vs Kerb Open Market spread.

### 3. "Global Markets vs Bangladesh" Comparative Matrix
- Benchmarking Bangladesh directly against **USA, China, India, Japan, and the UK**.
- **Interactive Multi-Country Trend Chart**: 5-year historical comparison for CPI Inflation, Real GDP Growth, and Central Bank Policy Rates.
- **Comprehensive Cross-Economy Matrix**: Real interest rate spreads, sovereign debt-to-GDP, FX reserves, retail fuel cost in USD/BDT, and 1-year currency depreciation.
- **Strategic Macro Divergence**: Institutional insights into policy divergence, monetary easing vs tightening cycles, and fiscal buffers.

### 4. Interactive Financial Charting
- High-performance HTML5 Canvas charting engine.
- Candlestick and glowing Area/Line chart options.
- Technical overlays: **SMA 20**, **SMA 50**, **RSI (14)** sub-chart, and volume histogram.
- Timeframes: `1D`, `5D`, `1M`, `6M`, `1Y`, `5Y`.
- Hover crosshairs with full OHLCV and indicator inspection.

### 5. Bloomberg Terminal Workstation UX
- Multi-timezone financial world clocks: **Dhaka (BST)** with live `DSE OPEN/CLOSED` badge, **New York (EST)**, **London (GMT)**, and **Tokyo (JST)**.
- Continuous streaming ticker tape with spark bars and bullish/bearish color flashes.
- Interactive Bloomberg command bar prompt (`DSEX <GO>`, `BRENT <GO>`, `COMPARE <GO>`).
- Keyboard shortcuts (`F1` Workstation, `F2` Bangladesh Hub, `F3` Comparator).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Custom Bloomberg obsidian/emerald/crimson palette)
- **Icons**: Lucide React
- **Data Pipeline**: Real-time server-side API aggregation (Yahoo Finance, Open Exchange Rates, Central Banks) with automated tick simulation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Eftyqhar/Global-Terminal.git

# Navigate to project directory
cd Global-Terminal

# Install dependencies
npm install

# Start the development terminal
npm run dev
```

The terminal will launch at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License
