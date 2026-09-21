export type AssetCategory = 'index' | 'commodity' | 'forex' | 'crypto' | 'bd_stock' | 'global_stock';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number | string;
  currency: string;
  region: string;
  sparkline: number[];
  marketStatus?: 'open' | 'closed' | 'pre-market' | 'after-hours';
}

export interface Candle {
  timestamp: number;
  timeStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  rsi?: number;
}

export interface DSEStock {
  symbol: string;
  name: string;
  ltp: number; // Last Traded Price in BDT
  change: number;
  changePercent: number;
  volume: number;
  turnoverCrore: number;
  pe: number;
  high52w: number;
  low52w: number;
  sector: string;
  category: 'A' | 'B' | 'N' | 'Z';
  sparkline: number[];
}

export interface BangladeshMacro {
  inflation: {
    general: number;
    food: number;
    nonFood: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  policyRate: {
    repoRate: number;
    reverseRepo: number;
    standingLendingFacility: number;
    effectiveDate: string;
  };
  fxReserves: {
    grossReservesBillion: number;
    bpm6ReservesBillion: number;
    importCoverMonths: number;
    period: string;
  };
  remittance: {
    monthlyBillionUSD: number;
    yoyGrowthPercent: number;
    period: string;
  };
  fuelPricesBDT: {
    octane: number;
    petrol: number;
    diesel: number;
    kerosene: number;
    lastRevision: string;
  };
  currencyCorridor: {
    crawlingPegMidRate: number;
    bankSellingRate: number;
    bankBuyingRate: number;
    kerbOpenMarketRate: number;
    spread: number;
  };
  gdpGrowthFY24: number;
  debtToGDP: number;
}

export interface EconomyData {
  id: string;
  country: string;
  flag: string;
  currencyCode: string;
  gdpGrowth: number; // %
  inflationCPI: number; // %
  centralBankRate: number; // %
  debtToGDP: number; // %
  fxReservesUSD_B: number; // USD Billions
  fuelOctaneUSD: number; // USD per liter
  currencyDeprec1Y: number; // % against USD over 1 yr (negative = depreciated)
  creditRating: string;
  notes: string;
  historicalInflation: { year: string; value: number }[];
  historicalGDP: { year: string; value: number }[];
  historicalRates: { year: string; value: number }[];
}

export type ActiveTab = 'workstation' | 'bangladesh' | 'compare';
export type ChartTimeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
export type ChartType = 'candlestick' | 'area' | 'line';
