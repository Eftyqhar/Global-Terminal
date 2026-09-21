import type { Asset, BangladeshMacro, EconomyData } from '../types/finance';

export interface LiveMarketPayload {
  status: string;
  timestamp: string;
  quotes: Record<string, {
    price: number;
    change: number;
    changePercent: number;
    high?: number;
    low?: number;
    sparkline?: number[];
  }>;
  bangladesh?: {
    dsex?: {
      price: number;
      change: number;
      changePercent: number;
      turnoverCrore: number;
      date: string;
    };
    macro?: {
      inflationCPI: number;
      policyRepoRate: number;
      fxReservesBPM6: number;
      remittanceUSD_B: number;
      fuelOctaneBDT: number;
      fuelPetrolBDT: number;
      fuelDieselBDT: number;
      fuelKeroseneBDT: number;
      usdKerbRate: number;
    };
  };
}

export async function fetchLiveMarketData(): Promise<LiveMarketPayload | null> {
  try {
    const res = await fetch('/api/live-data', {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data: LiveMarketPayload = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Vite proxy /api/live-data not reachable, attempting direct fallback', err);
  }

  // Fallback: direct browser fetch for exchange rates
  try {
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (fxRes.ok) {
      const fxData = await fxRes.json();
      if (fxData && fxData.rates) {
        return {
          status: 'partial',
          timestamp: new Date().toISOString(),
          quotes: {
            usd_bdt: {
              price: +(fxData.rates.BDT || 123.32).toFixed(2),
              change: 0.25,
              changePercent: 0.20,
            },
            eur_usd: {
              price: +(1 / (fxData.rates.EUR || 0.87)).toFixed(4),
              change: -0.0012,
              changePercent: -0.10,
            }
          }
        };
      }
    }
  } catch {
    //
  }

  return null;
}

export function mergeLiveQuotesIntoAssets(
  currentAssets: Asset[],
  quotes: Record<string, any>
): Asset[] {
  return currentAssets.map((asset) => {
    const live = quotes[asset.id];
    if (live && typeof live.price === 'number') {
      return {
        ...asset,
        price: live.price,
        change: live.change !== undefined ? live.change : asset.change,
        changePercent: live.changePercent !== undefined ? live.changePercent : asset.changePercent,
        high: live.high !== undefined ? live.high : Math.max(asset.high, live.price),
        low: live.low !== undefined ? live.low : Math.min(asset.low, live.price),
        sparkline: live.sparkline && live.sparkline.length >= 2 ? live.sparkline : asset.sparkline,
      };
    }
    return asset;
  });
}

export function updateMacroFromLive(
  currentMacro: BangladeshMacro,
  liveMacro: any
): BangladeshMacro {
  if (!liveMacro) return currentMacro;
  return {
    ...currentMacro,
    inflation: {
      ...currentMacro.inflation,
      general: liveMacro.inflationCPI || currentMacro.inflation.general,
    },
    policyRate: {
      ...currentMacro.policyRate,
      repoRate: liveMacro.policyRepoRate || currentMacro.policyRate.repoRate,
    },
    fuelPricesBDT: {
      octane: liveMacro.fuelOctaneBDT || currentMacro.fuelPricesBDT.octane,
      petrol: liveMacro.fuelPetrolBDT || currentMacro.fuelPricesBDT.petrol,
      diesel: liveMacro.fuelDieselBDT || currentMacro.fuelPricesBDT.diesel,
      kerosene: liveMacro.fuelKeroseneBDT || currentMacro.fuelPricesBDT.kerosene,
      lastRevision: 'BPC Latest Tariff Revision',
    },
    currencyCorridor: {
      ...currentMacro.currencyCorridor,
      kerbOpenMarketRate: liveMacro.usdKerbRate || currentMacro.currencyCorridor.kerbOpenMarketRate,
    },
  };
}

export function updateEconomiesFromLive(
  economies: EconomyData[],
  liveQuotes: Record<string, any>,
  liveMacro: any
): EconomyData[] {
  return economies.map((econ) => {
    if (econ.id === 'bd' && liveMacro) {
      return {
        ...econ,
        inflationCPI: liveMacro.inflationCPI || econ.inflationCPI,
        centralBankRate: liveMacro.policyRepoRate || econ.centralBankRate,
        fuelOctaneUSD: liveMacro.fuelOctaneBDT
          ? +(liveMacro.fuelOctaneBDT / (liveQuotes['usd_bdt']?.price || 123.32)).toFixed(2)
          : econ.fuelOctaneUSD,
      };
    }
    return econ;
  });
}
