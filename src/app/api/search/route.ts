import { NextRequest, NextResponse } from 'next/server';
import { sampleProfiles } from '@/utils/sampleData';

// Stock symbols data for search
const stockSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: 3000000000000 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', marketCap: 2800000000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', marketCap: 1700000000000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', marketCap: 1600000000000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', marketCap: 800000000000 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', marketCap: 750000000000 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', marketCap: 1100000000000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', marketCap: 200000000000 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', marketCap: 900000000000 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', marketCap: 500000000000 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', marketCap: 450000000000 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 420000000000 },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', marketCap: 400000000000 },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', marketCap: 380000000000 },
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', marketCap: 350000000000 },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', marketCap: 340000000000 },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', marketCap: 320000000000 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', marketCap: 300000000000 },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', marketCap: 250000000000 },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', marketCap: 240000000000 },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', marketCap: 230000000000 },
  { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples', marketCap: 220000000000 },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 210000000000 },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', marketCap: 200000000000 },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services', marketCap: 190000000000 },
  { symbol: 'BABA', name: 'Alibaba Group Holding Ltd.', sector: 'Consumer Discretionary', marketCap: 180000000000 },
  { symbol: 'ZOOM', name: 'Zoom Video Communications Inc.', sector: 'Technology', marketCap: 20000000000 },
  { symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', marketCap: 50000000000 },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology', marketCap: 40000000000 },
  { symbol: 'GME', name: 'GameStop Corp.', sector: 'Consumer Discretionary', marketCap: 5000000000 },
  { symbol: 'AMC', name: 'AMC Entertainment Holdings Inc.', sector: 'Communication Services', marketCap: 2000000000 },
  { symbol: 'BB', name: 'BlackBerry Ltd.', sector: 'Technology', marketCap: 3000000000 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', sector: 'ETF', marketCap: 400000000000 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF', marketCap: 200000000000 },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', sector: 'ETF', marketCap: 30000000000 },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', sector: 'ETF', marketCap: 60000000000 },
];

function handleSymbolSearch(query: string, limit: number, offset: number) {
  if (!query || query.length < 1) {
    return NextResponse.json({
      success: true,
      data: stockSymbols.slice(0, 20), // Return top 20 symbols when no query
      pagination: {
        total: stockSymbols.length,
        limit,
        offset,
        hasMore: limit < stockSymbols.length
      }
    });
  }

  // Search by symbol or company name
  const filteredSymbols = stockSymbols.filter(stock =>
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase()) ||
    stock.sector.toLowerCase().includes(query.toLowerCase())
  );

  // Sort by relevance (exact symbol match first, then name matches, then market cap)
  filteredSymbols.sort((a, b) => {
    const queryLower = query.toLowerCase();
    
    // Exact symbol match gets highest priority
    if (a.symbol.toLowerCase() === queryLower) return -1;
    if (b.symbol.toLowerCase() === queryLower) return 1;
    
    // Symbol starts with query gets second priority
    if (a.symbol.toLowerCase().startsWith(queryLower) && !b.symbol.toLowerCase().startsWith(queryLower)) return -1;
    if (b.symbol.toLowerCase().startsWith(queryLower) && !a.symbol.toLowerCase().startsWith(queryLower)) return 1;
    
    // Name starts with query gets third priority
    if (a.name.toLowerCase().startsWith(queryLower) && !b.name.toLowerCase().startsWith(queryLower)) return -1;
    if (b.name.toLowerCase().startsWith(queryLower) && !a.name.toLowerCase().startsWith(queryLower)) return 1;
    
    // Sort by market cap (larger first)
    return b.marketCap - a.marketCap;
  });

  const total = filteredSymbols.length;
  const paginatedSymbols = filteredSymbols.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: paginatedSymbols,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    },
    suggestions: generateSymbolSuggestions(query, filteredSymbols)
  });
}

function generateSymbolSuggestions(query: string, symbols: any[]) {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  
  symbols.forEach(symbol => {
    // Add symbol suggestions
    if (symbol.symbol.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(symbol.symbol);
    }
    
    // Add company name word suggestions
    const nameWords = symbol.name.toLowerCase().split(' ');
    nameWords.forEach((word: string) => {
      if (word.includes(query.toLowerCase()) && word.length > 2) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || ''; // politician, trader, investor, symbols
    const sortBy = searchParams.get('sortBy') || 'name'; // name, totalTrades, netProfitLoss, winRate
    const sortOrder = searchParams.get('sortOrder') || 'asc'; // asc, desc
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const minTrades = parseInt(searchParams.get('minTrades') || '0');
    const maxTrades = parseInt(searchParams.get('maxTrades') || '999999');
    const profitableOnly = searchParams.get('profitableOnly') === 'true';

    // Handle symbol search
    if (type === 'symbols') {
      return handleSymbolSearch(query, limit, offset);
    }
    
    let filteredProfiles = [...sampleProfiles];
    
    // Text search filter
    if (query) {
      filteredProfiles = filteredProfiles.filter(profile =>
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.title.toLowerCase().includes(query.toLowerCase()) ||
        profile.biography.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Type filter
    if (type) {
      filteredProfiles = filteredProfiles.filter(profile => profile.type === type);
    }
    
    // Trade count filter
    filteredProfiles = filteredProfiles.filter(profile =>
      profile.stats.totalTrades >= minTrades && profile.stats.totalTrades <= maxTrades
    );
    
    // Profitable only filter
    if (profitableOnly) {
      filteredProfiles = filteredProfiles.filter(profile => profile.stats.netProfitLoss > 0);
    }
    
    // Sorting
    filteredProfiles.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'totalTrades':
          aValue = a.stats.totalTrades;
          bValue = b.stats.totalTrades;
          break;
        case 'netProfitLoss':
          aValue = a.stats.netProfitLoss;
          bValue = b.stats.netProfitLoss;
          break;
        case 'winRate':
          aValue = a.stats.winRate;
          bValue = b.stats.winRate;
          break;
        case 'lastTradeDate':
          aValue = new Date(a.stats.lastTradeDate).getTime();
          bValue = new Date(b.stats.lastTradeDate).getTime();
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Pagination
    const total = filteredProfiles.length;
    const paginatedProfiles = filteredProfiles.slice(offset, offset + limit);
    
    // Generate search suggestions
    const suggestions = generateSearchSuggestions(query, filteredProfiles);
    
    // Calculate aggregated stats
    const stats = calculateAggregatedStats(filteredProfiles);
    
    return NextResponse.json({
      success: true,
      data: paginatedProfiles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      filters: {
        types: ['politician', 'trader', 'investor'],
        sortOptions: [
          { value: 'name', label: 'Name' },
          { value: 'totalTrades', label: 'Total Trades' },
          { value: 'netProfitLoss', label: 'Net P&L' },
          { value: 'winRate', label: 'Win Rate' },
          { value: 'lastTradeDate', label: 'Last Trade' }
        ]
      },
      suggestions,
      stats
    });
  } catch (error) {
    console.error('Error searching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search profiles' },
      { status: 500 }
    );
  }
}

function generateSearchSuggestions(query: string, profiles: any[]) {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  
  profiles.forEach(profile => {
    // Add name suggestions
    if (profile.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(profile.name);
    }
    
    // Add title suggestions
    const titleWords = profile.title.toLowerCase().split(' ');
    titleWords.forEach((word: string) => {
      if (word.includes(query.toLowerCase()) && word.length > 2) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}

function calculateAggregatedStats(profiles: any[]) {
  if (profiles.length === 0) {
    return {
      totalProfiles: 0,
      averageTrades: 0,
      totalVolume: 0,
      averageWinRate: 0,
      profitableCount: 0
    };
  }
  
  const totalTrades = profiles.reduce((sum, p) => sum + p.stats.totalTrades, 0);
  const totalProfitLoss = profiles.reduce((sum, p) => sum + p.stats.netProfitLoss, 0);
  const totalWinRate = profiles.reduce((sum, p) => sum + p.stats.winRate, 0);
  const profitableCount = profiles.filter(p => p.stats.netProfitLoss > 0).length;
  
  return {
    totalProfiles: profiles.length,
    averageTrades: Math.round(totalTrades / profiles.length),
    totalVolume: totalProfitLoss,
    averageWinRate: Math.round((totalWinRate / profiles.length) * 10) / 10,
    profitableCount
  };
}
