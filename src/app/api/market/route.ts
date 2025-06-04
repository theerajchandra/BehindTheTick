import { NextRequest, NextResponse } from 'next/server';

// Mock market data generator
function generateMarketData() {
  const indices = [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 445.32, change: 2.15, changePercent: 0.48 },
    { symbol: 'QQQ', name: 'Nasdaq ETF', price: 387.45, change: -1.23, changePercent: -0.32 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 356.78, change: 0.89, changePercent: 0.25 },
    { symbol: 'IWM', name: 'Russell 2000 ETF', price: 198.34, change: -0.45, changePercent: -0.23 }
  ];
  
  const topMovers = generateTopMovers();
  const sectorPerformance = generateSectorPerformance();
  const marketSentiment = generateMarketSentiment();
  const economicIndicators = generateEconomicIndicators();
  
  return {
    indices,
    topMovers,
    sectorPerformance,
    marketSentiment,
    economicIndicators,
    lastUpdated: new Date().toISOString()
  };
}

function generateTopMovers() {
  const stocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'BABA', 'CRM', 'ZOOM', 'SNOW', 'PLTR', 'GME', 'AMC', 'BB'
  ];
  
  const gainers = [];
  const losers = [];
  
  for (let i = 0; i < 5; i++) {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const price = Math.random() * 300 + 50;
    const change = Math.random() * 20 + 5;
    const changePercent = (change / price) * 100;
    
    gainers.push({
      symbol: stock,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  for (let i = 0; i < 5; i++) {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const price = Math.random() * 300 + 50;
    const change = -(Math.random() * 15 + 2);
    const changePercent = (change / price) * 100;
    
    losers.push({
      symbol: stock,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 8000000) + 500000
    });
  }
  
  return { gainers, losers };
}

function generateSectorPerformance() {
  const sectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'Consumer Discretionary',
    'Energy',
    'Industrials',
    'Real Estate',
    'Materials',
    'Utilities',
    'Consumer Staples',
    'Communication Services'
  ];
  
  return sectors.map(sector => ({
    name: sector,
    change: Math.round((Math.random() - 0.5) * 6 * 100) / 100,
    changePercent: Math.round((Math.random() - 0.5) * 4 * 100) / 100
  }));
}

function generateMarketSentiment() {
  const sentimentScore = Math.random() * 100;
  let sentiment = 'neutral';
  
  if (sentimentScore > 65) sentiment = 'bullish';
  else if (sentimentScore < 35) sentiment = 'bearish';
  
  return {
    score: Math.round(sentimentScore),
    sentiment,
    fearGreedIndex: Math.floor(Math.random() * 100),
    vixLevel: Math.round((Math.random() * 30 + 10) * 100) / 100,
    putCallRatio: Math.round((Math.random() * 1.5 + 0.5) * 100) / 100
  };
}

function generateEconomicIndicators() {
  return {
    gdpGrowth: Math.round((Math.random() * 4 + 1) * 100) / 100,
    inflationRate: Math.round((Math.random() * 3 + 2) * 100) / 100,
    unemploymentRate: Math.round((Math.random() * 2 + 3) * 100) / 100,
    fedFundsRate: Math.round((Math.random() * 3 + 4) * 100) / 100,
    tenYearYield: Math.round((Math.random() * 2 + 3) * 100) / 100,
    dollarIndex: Math.round((Math.random() * 10 + 100) * 100) / 100
  };
}

function generateHistoricalData(symbol: string, days: number = 30) {
  const data = [];
  const basePrice = Math.random() * 300 + 50;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    currentPrice *= (1 + change);
    
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round((currentPrice * 0.995) * 100) / 100,
      high: Math.round((currentPrice * 1.02) * 100) / 100,
      low: Math.round((currentPrice * 0.98) * 100) / 100,
      close: Math.round(currentPrice * 100) / 100,
      volume
    });
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const symbol = searchParams.get('symbol');
    const days = parseInt(searchParams.get('days') || '30');
    
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: generateMarketData()
        });
        
      case 'historical':
        if (!symbol) {
          return NextResponse.json(
            { success: false, error: 'Symbol parameter required for historical data' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          data: {
            symbol,
            data: generateHistoricalData(symbol, days)
          }
        });
        
      case 'sectors':
        return NextResponse.json({
          success: true,
          data: generateSectorPerformance()
        });
        
      case 'sentiment':
        return NextResponse.json({
          success: true,
          data: generateMarketSentiment()
        });
        
      case 'movers':
        return NextResponse.json({
          success: true,
          data: generateTopMovers()
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
