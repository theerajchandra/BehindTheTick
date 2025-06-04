'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import DefaultLayout from '@/layouts/DefaultLayout';
import ProfileCard from '@/components/ProfileCard';
import { Profile } from '@/types';

interface SearchFilters {
  query: string;
  type: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  minTrades: number;
  maxTrades: number;
  profitableOnly: boolean;
}

interface SearchStats {
  totalProfiles: number;
  averageTrades: number;
  totalVolume: number;
  averageWinRate: number;
  profitableCount: number;
}

export default function SearchPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    sortBy: 'name',
    sortOrder: 'asc',
    minTrades: 0,
    maxTrades: 999,
    profitableOnly: false
  });

  const searchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.type) params.set('type', filters.type);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      if (filters.minTrades > 0) params.set('minTrades', filters.minTrades.toString());
      if (filters.maxTrades < 999) params.set('maxTrades', filters.maxTrades.toString());
      if (filters.profitableOnly) params.set('profitableOnly', 'true');
      
      const response = await fetch(`/api/search?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setProfiles(result.data);
        setStats(result.stats);
        setSuggestions(result.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProfiles();
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      type: '',
      sortBy: 'name',
      sortOrder: 'asc',
      minTrades: 0,
      maxTrades: 999,
      profitableOnly: false
    });
  };

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find politicians, traders, and investors based on their trading activity
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, title, or biography..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && filters.query && (
            <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange('query', suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="politician">Politicians</option>
                  <option value="trader">Traders</option>
                  <option value="investor">Investors</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="name">Name</option>
                  <option value="totalTrades">Total Trades</option>
                  <option value="netProfitLoss">Net P&L</option>
                  <option value="winRate">Win Rate</option>
                  <option value="lastTradeDate">Last Trade</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Min Trades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Trades
                </label>
                <input
                  type="number"
                  value={filters.minTrades}
                  onChange={(e) => handleFilterChange('minTrades', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Max Trades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Trades
                </label>
                <input
                  type="number"
                  value={filters.maxTrades}
                  onChange={(e) => handleFilterChange('maxTrades', parseInt(e.target.value) || 999)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Profitable Only */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="profitableOnly"
                  checked={filters.profitableOnly}
                  onChange={(e) => handleFilterChange('profitableOnly', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="profitableOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Profitable Only
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Search Stats */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalProfiles}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Trades</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.averageTrades}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${(stats.totalVolume / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Win Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.averageWinRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profitable</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.profitableCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
