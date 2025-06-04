'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertTriangle, Bell, Star } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalProfiles: number;
  totalTrades: number;
  totalVolume: number;
  avgWinRate: number;
  topPerformer: {
    name: string;
    change: number;
  };
  recentAlerts: number;
}

interface ActivityData {
  date: string;
  trades: number;
  volume: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'trades' | 'volume'>('trades');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch profiles data for statistics
        const profilesResponse = await fetch('/api/profiles');
        const profilesResult = await profilesResponse.json();

        if (profilesResult.success) {
          const profiles = profilesResult.data;
          
          // Calculate statistics
          const totalTrades = profiles.reduce((sum: number, p: any) => sum + p.stats.totalTrades, 0);
          const totalVolume = profiles.reduce((sum: number, p: any) => sum + Math.abs(p.stats.netProfitLoss), 0);
          const avgWinRate = profiles.reduce((sum: number, p: any) => sum + p.stats.winRate, 0) / profiles.length;
          
          // Find top performer
          const topPerformer = profiles.reduce((top: any, current: any) => 
            current.stats.netProfitLoss > top.stats.netProfitLoss ? current : top
          );

          setStats({
            totalProfiles: profiles.length,
            totalTrades,
            totalVolume,
            avgWinRate: Math.round(avgWinRate * 10) / 10,
            topPerformer: {
              name: topPerformer.name,
              change: topPerformer.stats.netProfitLoss
            },
            recentAlerts: Math.floor(Math.random() * 15) + 5
          });

          // Generate activity data for the chart
          const activityData = generateActivityData();
          setActivityData(activityData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const generateActivityData = (): ActivityData[] => {
    const data = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        trades: Math.floor(Math.random() * 50) + 20,
        volume: Math.floor(Math.random() * 5000000) + 1000000
      });
    }
    
    return data;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to load dashboard data
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profiles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProfiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrades}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalVolume)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgWinRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trading Activity (30 Days)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('trades')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedMetric === 'trades'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Trades
              </button>
              <button
                onClick={() => setSelectedMetric('volume')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedMetric === 'volume'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Volume
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers & Alerts */}
        <div className="space-y-6">
          {/* Top Performer */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performer</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best Performance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.topPerformer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Net P&L</p>
                <p className={`text-xl font-bold ${stats.topPerformer.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.topPerformer.change >= 0 ? '+' : ''}{formatCurrency(stats.topPerformer.change)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
              </div>
              <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium px-2 py-1 rounded-full">
                {stats.recentAlerts} New
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Large Sell Order Detected</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Nancy Pelosi - NVDA - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Unusual Options Activity</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Warren Buffett - AAPL - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New Position Opened</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Michael Burry - TSLA - 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
