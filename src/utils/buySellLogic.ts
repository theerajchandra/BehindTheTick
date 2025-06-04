import { Trade, Recommendation, PricePoint } from '@/types';

export function getRecommendation(
  trades: Trade[], 
  priceHistory: PricePoint[]
): Recommendation {
  // TODO: Replace with real ML model or Manus AI call
  // For now: if the majority of last 5 trades were buys, return Buy with confidence = 0.6
  
  if (trades.length === 0) {
    return {
      action: 'Hold',
      ticker: 'N/A',
      confidence: 0.5,
      reasoning: 'Insufficient data for recommendation',
    };
  }

  const lastFive = trades.slice(-5);
  const mostTradedTicker = getMostTradedTicker(trades);
  const buys = lastFive.filter(t => t.type === 'Buy').length;
  
  let action: 'Buy' | 'Hold' | 'Sell';
  let confidence: number;
  let reasoning: string;

  if (buys >= 3) {
    action = 'Buy';
    confidence = 0.6 + (buys - 3) * 0.1;
    reasoning = `Recent buying activity suggests positive sentiment. ${buys} of last 5 trades were purchases.`;
  } else if (buys <= 1) {
    action = 'Sell';
    confidence = 0.6 + (2 - buys) * 0.1;
    reasoning = `Recent selling activity suggests negative sentiment. Only ${buys} of last 5 trades were purchases.`;
  } else {
    action = 'Hold';
    confidence = 0.5;
    reasoning = 'Mixed trading activity suggests neutral sentiment.';
  }

  return {
    action,
    ticker: mostTradedTicker,
    confidence: Math.min(confidence, 0.9),
    reasoning,
    timeHorizon: '1-3 months',
  };
}

function getMostTradedTicker(trades: Trade[]): string {
  const tickerCounts = trades.reduce((acc, trade) => {
    acc[trade.ticker] = (acc[trade.ticker] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tickerCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
}

export function calculatePortfolioMetrics(trades: Trade[]) {
  const totalTrades = trades.length;
  const buyTrades = trades.filter(t => t.type === 'Buy');
  const sellTrades = trades.filter(t => t.type === 'Sell');
  
  const totalBuyValue = buyTrades.reduce((sum, t) => sum + (t.shares * t.price), 0);
  const totalSellValue = sellTrades.reduce((sum, t) => sum + (t.shares * t.price), 0);
  
  const netProfitLoss = totalSellValue - totalBuyValue;
  const winRate = sellTrades.length > 0 ? 
    (sellTrades.filter(t => t.price > (buyTrades.find(b => b.ticker === t.ticker)?.price || 0)).length / sellTrades.length) * 100 : 0;

  return {
    totalTrades,
    netProfitLoss,
    winRate,
    totalBuyValue,
    totalSellValue,
  };
}
