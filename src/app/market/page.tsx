'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, PieChart } from 'lucide-react';
import DefaultLayout from '@/layouts/DefaultLayout';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketData {
  indices: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  topMovers: {
    gainers: Array<{
      symbol: string;
      price: number;
      change: number;
      changePercent: number;
      volume: number;
    }>;
    losers: Array<{
      symbol: string;
      price: number;
      change: number;
      changePercent: number;
      volume: number;
    }>;
  };
  sectorPerformance: Array<{
    name: string;
    change: number;
    changePercent: number;
  }>;
  marketSentiment: {
    score: number;
    sentiment: string;
    fearGreedIndex: number;
    vixLevel: number;
    putCallRatio: number;
  };
  economicIndicators: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
    fedFundsRate: number;
    tenYearYield: number;
    dollarIndex: number;
  };
  lastUpdated: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/market?type=overview');
      const result = await response.json();

      if (result.success) {
        setMarketData(result.data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!marketData) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to load market data
            </h1>
            <button
              onClick={fetchMarketData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Market Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time market data and analysis • Last updated: {new Date(marketData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['1D', '5D', '1M', '3M', '1Y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketData.indices.map((index) => (
            <div key={index.symbol} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{index.symbol}</h3>
                <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {index.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(index.price)}
                </span>
              </div>
              <div className={`flex items-center text-sm ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span className="font-medium">
                  {index.change >= 0 ? '+' : ''}{formatCurrency(index.change)}
                </span>
                <span className="ml-2">
                  ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{index.name}</p>
            </div>
          ))}
        </div>

        {/* Market Sentiment */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Market Sentiment</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getSentimentColor(marketData.marketSentiment.sentiment)}`}>
                  {marketData.marketSentiment.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
                <div className={`text-xs font-medium mt-1 ${getSentimentColor(marketData.marketSentiment.sentiment)}`}>
                  {marketData.marketSentiment.sentiment.toUpperCase()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.marketSentiment.fearGreedIndex}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fear & Greed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.marketSentiment.vixLevel}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">VIX Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.marketSentiment.putCallRatio}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Put/Call Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.fedFundsRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fed Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Gainers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              Top Gainers
            </h2>
            <div className="space-y-3">
              {marketData.topMovers.gainers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vol: {formatVolume(stock.volume)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(stock.price)}</div>
                    <div className="text-sm text-green-500">
                      +{formatCurrency(stock.change)} (+{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
              Top Losers
            </h2>
            <div className="space-y-3">
              {marketData.topMovers.losers.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vol: {formatVolume(stock.volume)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(stock.price)}</div>
                    <div className="text-sm text-red-500">
                      {formatCurrency(stock.change)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sector Performance */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 text-blue-500 mr-2" />
              Sector Performance
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData.sectorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="changePercent" 
                    fill={(entry: any) => entry.changePercent >= 0 ? '#10B981' : '#EF4444'}
                  >
                    {marketData.sectorPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.changePercent >= 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Economic Indicators */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
              Economic Indicators
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">GDP Growth</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.gdpGrowth}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Inflation Rate</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.inflationRate}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Unemployment</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.unemploymentRate}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">10Y Treasury</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.tenYearYield}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Dollar Index</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.dollarIndex}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Fed Funds Rate</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {marketData.economicIndicators.fedFundsRate}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
